# VS Agent set up

In this section we'll learn how to create our first VS Agent, and set it up to make it accessible by other agents.

### Get VS Agent

We can run it locally, by cloning the [GitHub repository](https://github.com/verana-labs/vs-agent). Or, more easily, or by using Docker, pulling the image from DockerHub:

```
docker pull veranalabs/vs-agent:latest
```

Running VS Agent is easy, but we will first need to understand how to set it up in order to make it usable.

### Making our VS accessible

VS Agent has two main interfaces: a **public** one (meant to be accessible by Hologram users and other Verifiable Services) and an **administrative** one (meant to be accessed by a **controller**, which is a backend on our side that will provide the main logic of our Verifiable Service), which we might want to keep private.

To let User Agents (such as Hologram) reach our VS, the first thing we will need is a public host where we can expose our VS Agent public API. 

:::tip
For testing purposes, we can use [ngrok](https://ngrok.com) or any other tool that allows exposing local servers to the internet. By default, public API uses 3001 port, so for instance with ngrok CLI tool we can do:

```
ngrok http 3001
```

This will create a tunnel with a temporary HTTP address.
:::

Once we get our public address, we will need to provide our VS Agent a public DID (decentralized identifier). This identifier is mandatory when it comes to issue credentials and to conform with Verifiable Trust network, so it is important to always set it up. Configuring our DID is as simple as defining `AGENT_PUBLIC_DID` environment variable. Currently, VS Agent supports [did:web](https://w3c-ccg.github.io/did-method-web/) and [did:webvh](https://identity.foundation/didwebvh/v1.0/), which is the one we'll use in the rest of the tutorial and we recommend for production, since it adds important security features and allows to update the related *DID Document* as needed. 

:::warning

The resulting operational DID has the form `did:webvh:[SCID]:[your-public-host]`, where SCID is a **Self-Certifying identifier** created at the first startup, you'll need to do an initial deployment of your Organization VS Agent to know what DID you'll need to provide on the onboarding process.

:::

This is enough for we to get a basic VS Agent app and running. So let's run it:

```bash
docker run -p 3001:3001 -p 3000:3000 \
  -e AGENT_PUBLIC_DID=did:webvh:myhost.ngrok-free.app \
  --name vs-agent veranalabs/vs-agent:latest
  -v ./vs-agent-data:/root/.afj
```

Note that we are exposing both ports 3000 and 3001, the default ports for VS Agent's admin and public API respectively.

We are also mounting a local directory to persist VS Agent data, which will be needed later. If you need to reset your agent, don't forget to remove it.

If everything goes OK, we'll see in our console:

```
VS Agent {version} running in port 3001. Admin interface at port 3000
```

We can retrieve our resulting DID, which is the one we'll need to share on the onboarding process and get our credentials, by doing a HTTP GET request to /v1/agent on the admin API:

```
 curl -X GET http://localhost:3000/v1/agent

{"label":"Test VS Agent","endpoints":["wss://myhost.ngrok-free.app"],"isInitialized":true,"publicDid":"did:webvh:Qmbqjd5ud1FjuGejL39tKsqjFTRLyrSoB5JXdwq3AYaYCw:myhost.ngrok-free.app"}
```

Here you can see that our full DID is `did:webvh:Qmbqjd5ud1FjuGejL39tKsqjFTRLyrSoB5JXdwq3AYaYCw:myhost.ngrok-free.app`. 

The resulting operational DID has the form `did:webvh:[SCID]:[your-public-host]`, where SCID is a **Self-Certifying identifier** created at the first startup.

:::note

When issuing credentials to your agent or defining permissions, you need to use the full DID (including the SCID). Since this SCID is generated at first Agent startup, you'll need to do an initial deployment of your Organization VS Agent to know what DID you'll need to provide on the onboarding process.

:::

### Deploying VS Agent

Note that, for educational purposes, the examples shown in this guide are intended for local execution, so we use a local database that will do its job in letting you learn and performing some transactions. If you want to deploy VS Agent in a production environment, we suggest you to take a look at the [Helm chart](https://github.com/verana-labs/vs-agent/tree/main/charts/vs-agent), which will orchestrate different containers, such as a production-grade PostgreSQL and Redis queue for you.

To deploy the VS Agent using the Helm chart from DockerHub, follow these steps:

1. Add the Verana Labs Helm repository:

   ```bash
   helm repo add veranalabs https://veranalabs.github.io/helm-charts
   ```

2. Update your Helm repositories to fetch the latest charts:

   ```bash
   helm repo update
   ```

3. Install the `vs-agent` Helm chart:

   ```bash
   helm install vs-agent veranalabs/vs-agent --namespace your-namespace --create-namespace \
     --set global.domain=your-public-host \
     --set name=your-vs-agent-name
     --set agent.adminPort=3000 \
     --set agent.didcommPort=3001 \
     --set redis.enabled=true \
     --set database.enabled=true
   ```

   Replace `your-namespace`, `your-public-host`, and `your-storage-class` with the appropriate values for your deployment environment.

4. Verify the deployment:

   ```bash
   kubectl get pods -n your-namespace
   ```

   Ensure that all the pods are running successfully.

   This will generate an Agent with a did:webvh DID taking into account the `your-public-host` you passed.


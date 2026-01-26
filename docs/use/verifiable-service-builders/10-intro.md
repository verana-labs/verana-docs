# Introduction

We learnt in the [learn section](../../learn/verifiable-trust/00-introduction.md) that verifiable service (VS) is a service, uniquely identified by a [DID](https://www.w3.org/TR/did-1.0/), that can authenticate itself to a peer by presenting [verifiable credentials](https://www.w3.org/TR/vc-data-model-2.0/) before any connection is initiated.

Building a VS is as easy as embedding the [VS Agent container](https://github.com/2060-io/vs-agent) in your service and setting it up, loading its credentials so it can present them to other agents.

### Get VS Agent

We can run it locally or by using Docker, pulling the image from DockerHub:

```
docker pull veranalabs/vs-agent:latest
```

Running VS Agent is easy, but we will first need to understand how to set it up in order to make it usable.


### Making our VS accessible 

VS Agent has two main interfaces: a public one (meant to be accessible by Hologram users and other Verifiable Services) and an administrative one (meant to be accessed by a **controller**, which is a backend on our side that will provide the main logic of our Verifiable Service), which we might want to keep private.

To let Hologram reach our VS, the first thing we will need is a public host where we can expose our VS Agent public API. 

:::tip
For testing purposes, we can use [ngrok](https://ngrok.com) or any other tool that allows exposing local servers to the internet. By default, public API uses 3001 port, so for instance with ngrok CLI tool we can do:

```
ngrok http 3001
```

This will create a tunnel with a temporary HTTP address.
:::

Once we get our public address, we will need to provide our VS Agent a public DID (decentralized identifier). This identifier is mandatory when it comes to issue credentials and to conform with Verifiable Trust network, so it is important to always set it up. 

But don't worry! Configuring our DID is as simple as defining `AGENT_PUBLIC_DID` environment variable. Currently, VS Agent supports [web DID Method](https://w3c-ccg.github.io/did-method-web/) and, so our DID will have the format: `did:web:[your-public-host]`.


VS Agent supports two methods: `did:web` and `did:webvh`. In both cases, since they are web-based, all you need to set it up is to expose your VS Agent to a public domain and specify it using the `AGENT_PUBLIC_DID` variable: e.g. `did:web:[your-public-host]` or `did:webvh:[your-public-host]`.

We widely recommend to use `did:webvh` in production use-cases, since it is more secure and allows to update the related *DID Document* as needed. However, since the resulting operational DID has the form `did:webvh:[SCID]:[your-public-host]`, where SCID is a Self-Ceritifying identifier created at the first startup, you'll need to do an initial deploy of your Organization VS Agent to know what DID you'll need to provide on the onboarding process.

This is enough for we to get a basic VS Agent app and running. So let's run it:

```bash
docker run -p 3001:3001 -p 3000:3000 \
  -e AGENT_PUBLIC_DID=did:webvh:myhost.ngrok-free.app \
  --name vs-agent veranalabs/vs-agent:latest
```

Note that we are exposing both ports 3000 and 3001, the default ports for VS Agent's admin and public API respectively.

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

## Organizations and Services

**Organizations** are owners of services. Therefore, they are usually given Issuer permission for schemas related to services, so they can issue VTCs for their services.

**Services** can be seen as the leaves of the permission tree and are applications users usually interact with their User Agents. They might also be given Issuer or Verifier permissions for certain schemas, as needed depending on the application. 

VS Agent can be used to run both organizations and services. In the simplest form, an organization that has a single service can be run by a single VS Agent that exposes both credentials: the Organization one (issued by the ecosystem or any other participant with permissions to issue Organization VTCs) and the Service one (issued by itself).

In the following examples, initially for the sake of simplicity we'll cover this simple use case, and then move to other more complex cases.

# Deploy your First Verifiable Service

This guide walks you through deploying a Verifiable Service (VS) Agent, obtaining ECS credentials, and making your service discoverable and trusted on the Verana network.

We cover three scenarios:

1. **Local development** — Docker + ngrok, for learning and testing.
2. **Production deployment** — Helm chart on Kubernetes.
3. **Automated deployment** — using the [verana-demos](https://github.com/verana-labs/verana-demos) repository.

## Prerequisites

Before you begin, make sure you have:

- **Docker** with `linux/amd64` platform support (required for Apple Silicon)
- **ngrok** — authenticated account ([ngrok.com](https://ngrok.com)) — for local testing only
- **veranad** — the Verana blockchain CLI ([GitHub](https://github.com/verana-labs/verana))
- **curl** and **jq** — for API calls and JSON processing
- A funded Verana account (use the [devnet faucet](https://faucet-vs.devnet.verana.network/invitation) on devnet, [testnet faucet](https://faucet-vs.testnet.verana.network/invitation) on testnet)

## Option A: Local Development (Docker + ngrok)

This is the quickest way to get a VS running for development and learning.

### Step 1: Start an ngrok tunnel

Your VS Agent needs a public URL so that other agents can reach it. For local development, ngrok provides a temporary HTTPS tunnel:

```bash
ngrok http 3001
```

Note the generated URL (e.g., `https://abc123.ngrok-free.app`). The domain part (`abc123.ngrok-free.app`) will be used for your DID.

### Step 2: Start the VS Agent container

```bash
# Create a directory for persistent data
mkdir -p vs-agent-data

# Pull and run the VS Agent
docker run --platform linux/amd64 -d \
  -p 3001:3001 \
  -p 3000:3000 \
  -v "$(pwd)/vs-agent-data:/root/.afj" \
  -e "AGENT_PUBLIC_DID=did:webvh:abc123.ngrok-free.app" \
  -e "AGENT_LABEL=My First VS" \
  -e "ENABLE_PUBLIC_API_SWAGGER=true" \
  --name vs-agent \
  veranalabs/vs-agent:latest
```

- **Port 3001** — public API (DIDComm, DID Document, credential endpoints)
- **Port 3000** — admin API (credential management, configuration)
- The `-v` flag persists agent data (keys, credentials) across restarts

### Step 3: Verify the agent is running

Wait about 30 seconds for initialization, then:

```bash
curl -s http://localhost:3000/v1/agent | jq .
```

Expected output:

```json
{
  "label": "My First VS",
  "endpoints": ["wss://abc123.ngrok-free.app"],
  "isInitialized": true,
  "publicDid": "did:webvh:Qm...:abc123.ngrok-free.app"
}
```

:::warning
The full DID includes a **Self-Certifying Identifier (SCID)** generated at first startup: `did:webvh:<SCID>:<your-host>`. You will need this full DID for all subsequent steps. If you reset your agent data, a new SCID will be generated.
:::

### Step 4: Set up your Verana account

You need a funded account on the Verana blockchain to create permissions:

```bash
# Create a new account (if you don't have one)
veranad keys add my-vs-account --keyring-backend test

# Get your address
veranad keys show my-vs-account -a --keyring-backend test
```

Fund the account via the faucet using Hologram:

- **Testnet**: https://faucet-vs.testnet.verana.network/invitation
- **Devnet**: https://faucet-vs.devnet.verana.network/invitation

Verify the balance:

```bash
veranad q bank balances $(veranad keys show my-vs-account -a --keyring-backend test) \
  --node https://rpc.testnet.verana.network --output json | jq .
```

### Step 5: Obtain your Organization credential

The ECS Trust Registry issues Organization credentials. On testnet, you can request one directly:

```bash
# Set your variables
AGENT_DID="did:webvh:Qm...:abc123.ngrok-free.app"  # from Step 3
ECS_TR_ADMIN="https://admin-ecs-trust-registry.testnet.verana.network"

# Discover the Organization VTJSC URL from the ECS TR DID Document
ECS_DID_DOC=$(curl -s https://ecs-trust-registry.testnet.verana.network/.well-known/did.json)
ORG_VP_URL=$(echo "$ECS_DID_DOC" | jq -r '.service[] | select(.type == "LinkedVerifiablePresentation") | select(.id | test("organization-jsc-vp")) | .serviceEndpoint')
ORG_VP=$(curl -s "$ORG_VP_URL")
ORG_JSC_URL=$(echo "$ORG_VP" | jq -r '.verifiableCredential[0].id')

# Download and base64-encode your logo
ORG_LOGO_B64=$(curl -sL "https://verana.io/logo.svg" | base64 | tr -d '\n')

# Request the Organization credential from the ECS TR
ORG_CRED=$(curl -s -X POST "${ECS_TR_ADMIN}/v1/vt/issue-credential" \
  -H 'Content-Type: application/json' \
  -d "{
    \"format\": \"jsonld\",
    \"did\": \"${AGENT_DID}\",
    \"jsonSchemaCredentialId\": \"${ORG_JSC_URL}\",
    \"claims\": {
      \"id\": \"${AGENT_DID}\",
      \"name\": \"My Organization\",
      \"logo\": \"${ORG_LOGO_B64}\",
      \"registryId\": \"CH-CHE-123.456.789\",
      \"address\": \"123 Main St, Zurich, Switzerland\",
      \"countryCode\": \"CH\"
    }
  }")

# Extract the signed credential
SIGNED_ORG_CRED=$(echo "$ORG_CRED" | jq '.credential // .')

# Link it to your VS Agent
curl -s -X POST "http://localhost:3000/v1/vt/linked-credentials" \
  -H 'Content-Type: application/json' \
  -d "{
    \"schemaBaseId\": \"organization\",
    \"credential\": ${SIGNED_ORG_CRED}
  }"
```

### Step 6: Create an ISSUER permission for the Service schema

The Service schema uses OPEN permission mode, so you can self-create an ISSUER permission:

```bash
# Discover the Service VTJSC URL and schema ID from the ECS TR DID Document
SERVICE_VP_URL=$(echo "$ECS_DID_DOC" | jq -r '.service[] | select(.type == "LinkedVerifiablePresentation") | select(.id | test("service-jsc-vp")) | .serviceEndpoint')
SERVICE_VP=$(curl -s "$SERVICE_VP_URL")
SERVICE_JSC_URL=$(echo "$SERVICE_VP" | jq -r '.verifiableCredential[0].id')
SERVICE_SCHEMA_REF=$(echo "$SERVICE_VP" | jq -r '.verifiableCredential[0].credentialSubject.jsonSchema."$ref"')
CS_SERVICE_ID=$(echo "$SERVICE_SCHEMA_REF" | grep -oE '[0-9]+$')

# Create the permission (effective 15 seconds from now)
EFFECTIVE_FROM=$(date -u -v+15S +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null \
  || date -u -d "+15 seconds" +"%Y-%m-%dT%H:%M:%SZ")

veranad tx perm create-perm "$CS_SERVICE_ID" issuer "$AGENT_DID" \
  --effective-from "$EFFECTIVE_FROM" \
  --from my-vs-account --chain-id vna-testnet-1 --keyring-backend test \
  --fees 600000uvna --gas auto --node https://rpc.testnet.verana.network \
  --output json -y

# Wait for the permission to become effective
sleep 21
```

### Step 7: Self-issue your Service credential

As an authorized issuer (with a valid ISSUER permission), you issue credentials directly against the **VTJSC presented by the Trust Registry's DID** — there is no need to create a local VTJSC. The `SERVICE_JSC_URL` discovered in Step 6 is used as the `jsonSchemaCredentialId`:

```bash
# Self-issue the Service credential using the ECS TR's VTJSC
SERVICE_CRED=$(curl -s -X POST "http://localhost:3000/v1/vt/issue-credential" \
  -H 'Content-Type: application/json' \
  -d "{
    \"format\": \"jsonld\",
    \"did\": \"${AGENT_DID}\",
    \"jsonSchemaCredentialId\": \"${SERVICE_JSC_URL}\",
    \"claims\": {
      \"id\": \"${AGENT_DID}\",
      \"name\": \"My First Service\",
      \"type\": \"IssuerService\",
      \"description\": \"My first Verifiable Service on Verana\",
      \"logo\": \"${ORG_LOGO_B64}\",
      \"minimumAgeRequired\": 0,
      \"termsAndConditions\": \"https://example.com/terms\",
      \"privacyPolicy\": \"https://example.com/privacy\"
    }
  }")

SIGNED_SVC_CRED=$(echo "$SERVICE_CRED" | jq '.credential // .')

# Link it to your agent as a Linked Verifiable Presentation
curl -s -X POST "http://localhost:3000/v1/vt/linked-credentials" \
  -H 'Content-Type: application/json' \
  -d "{
    \"schemaBaseId\": \"service\",
    \"credential\": ${SIGNED_SVC_CRED}
  }"
```

### Step 8: Verify your setup

Check your DID Document to confirm both credentials are linked:

```bash
curl -s http://localhost:3001/.well-known/did.json | jq '[.service[] | select(.type == "LinkedVerifiablePresentation")]'
```

You should see two `LinkedVerifiablePresentation` entries — one for Organization, one for Service.

Optionally, verify through the Trust Resolver:

```bash
curl -s "https://resolver.testnet.verana.network/v1/trust-resolve?did=${AGENT_DID}" | jq .
```

Your Verifiable Service is now live and trusted on the Verana network.

## Option B: Production Deployment (Helm)

For production, deploy the VS Agent using the official Helm chart on Kubernetes.

### Step 1: Add the Helm repository

```bash
helm repo add veranalabs https://veranalabs.github.io/helm-charts
helm repo update
```

### Step 2: Install the VS Agent

```bash
helm install my-vs-agent veranalabs/vs-agent \
  --namespace my-namespace --create-namespace \
  --set global.domain=my-service.example.com \
  --set name=my-vs-agent \
  --set agent.adminPort=3000 \
  --set agent.didcommPort=3001 \
  --set redis.enabled=true \
  --set database.enabled=true
```

This deploys:

- The VS Agent container
- A production-grade PostgreSQL database
- A Redis queue for message processing
- Ingress configuration for your public domain

### Step 3: Verify the deployment

```bash
kubectl get pods -n my-namespace
```

Ensure all pods are running. The agent will generate a `did:webvh` DID based on the domain you provided.

### Step 4: Obtain ECS credentials

Use `kubectl port-forward` to access the admin API, then follow the same credential obtention steps as in Option A (Steps 5–8):

```bash
kubectl port-forward -n my-namespace svc/my-vs-agent 3000:3000 &
# Now use http://localhost:3000 as the admin API
```

### Custom Helm Values

For more control, create a `values.yaml` file. See the [deployment.yaml](https://github.com/verana-labs/verana-demos/blob/main/vs/deployment.yaml) in the verana-demos repo for a complete example:

```yaml
chartSource: oci://registry-1.docker.io/veranalabs/vs-agent-chart
chartVersion: latest
chartNamespace: vna-testnet-1

global:
  domain: testnet.verana.network

name: my-service
replicas: 1
adminPort: 3000
didcommPort: 3001
publicDidMethod: "webvh"

resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi

ingress:
  host: "my-service.testnet.verana.network"
  tlsSecret: "my-service-cert"
  public:
    enableCors: true

storage:
  size: 1Gi
```

## Option C: Automated Deployment (verana-demos)

The [verana-demos](https://github.com/verana-labs/verana-demos) repository provides scripts that automate the entire process:

```bash
git clone https://github.com/verana-labs/verana-demos.git
cd verana-demos

# Edit configuration
vi vs/config.env

# Source configuration and run
source vs/config.env
chmod +x scripts/vs-demo/*.sh

# Part 1: Deploy VS Agent + obtain ECS credentials
./scripts/vs-demo/01-deploy-vs.sh

# Part 2 (optional): Create your own Trust Registry
./scripts/vs-demo/02-create-trust-registry.sh
```

The scripts handle everything: Docker deployment, ngrok tunneling, schema discovery, credential issuance, permission creation, and verification.

### Configuration

Edit `vs/config.env` to customize:

| Variable | Default | Description |
| --- | --- | --- |
| `NETWORK` | `testnet` | Target network (`devnet` or `testnet`) |
| `ORG_NAME` | `Verana Example Organization` | Organization name in the credential |
| `ORG_COUNTRY` | `CH` | ISO country code |
| `SERVICE_NAME` | `Example Verana Service` | Service name |
| `SERVICE_TYPE` | `IssuerService` | Service type |
| `ENABLE_ANONCREDS` | `false` | Enable AnonCreds credential support |

### CI/CD with GitHub Actions

The verana-demos repository also supports automated deployment via GitHub Actions:

1. Create a branch named `vs/<network>-<service-name>` (e.g., `vs/testnet-my-issuer`)
2. Edit `vs/config.env`, `vs/deployment.yaml`, and `vs/schema.json`
3. Push and run the workflow from the Actions tab, choosing from: `deploy`, `setup-part1`, `setup-part2`, or `all`

## Cleanup

### Local (Docker + ngrok)

```bash
docker rm -f vs-agent
pkill -f "ngrok http 3001"
rm -rf vs-agent-data
```

### Kubernetes

```bash
helm uninstall my-vs-agent -n my-namespace
```

## Next Steps

Your Verifiable Service is now deployed with ECS credentials. To go further:

- [**Join other ecosystems**](./53-join-ecosystems.md) — obtain permissions to issue and verify credentials from custom Trust Registries.

# ECS Trust Registries

## What are Essential Credential Schemas?

**Essential Credential Schemas (ECS)** are the foundational credential schemas that every Verifiable Service must use to identify itself within the Verana trust network. They answer fundamental questions that any connecting peer needs answered:

- **Who operates this service?** → Organization credential
- **What is this service?** → Service credential

Without ECS credentials, a Verifiable Service cannot be trusted by peers — user agents like [Hologram Messaging](https://hologram.zone) will refuse to connect, and other Verifiable Services will reject interactions.

## Why do we need ECS Trust Registries?

ECS credentials are not self-asserted — they are issued by **trusted entities** registered in an **ECS Trust Registry**. This Trust Registry is the **source of truth** for identifying services and their operators across the entire network.

The ECS Trust Registry:

- **Defines the credential schemas** for Organization, Service, Persona, and UserAgent credentials.
- **Controls who can issue** Organization credentials (through an ECOSYSTEM permission mode — only authorized issuers can grant them).
- **Allows open self-issuance** of Service credentials (OPEN permission mode — any entity with an ISSUER permission can issue Service credentials for their own child services).
- **Anchors trust** — when a peer resolves your DID and finds your credentials, the trust resolver traces them back to the ECS Trust Registry to verify legitimacy.

:::tip
Think of the ECS Trust Registry as the "root certificate authority" of the Verana trust network — but decentralized, on-chain, and governed by the [Verana Foundation](https://verana.foundation).
:::

## ECS Credential Types

The ECS Trust Registry defines four credential schemas:

| Schema | Permission Mode | Description |
| --- | --- | --- |
| **Organization** | ECOSYSTEM | Identifies a legal entity (company, government, NGO). Issued by authorized ECS issuers after a validation process. |
| **Service** | OPEN | Identifies a service. Any entity with an ISSUER permission can self-issue or issue to child services. |
| **Persona** | ECOSYSTEM | Identifies an individual. Issued by authorized ECS issuers after a validation process. |
| **UserAgent** | ECOSYSTEM | Identifies a Verifiable User Agent application. Issued by authorized ECS issuers. |

For Verifiable Service builders, the two most important schemas are **Organization** and **Service**.

### Organization Credential

The Organization credential contains information about the entity operating the service:

- **name** — Legal name of the organization
- **logo** — Organization logo (base64-encoded image)
- **registryId** — Official registry identifier (e.g., company registration number)
- **address** — Physical address
- **countryCode** — ISO country code
- **type** — Organization type (e.g., PRIVATE, PUBLIC, NGO)

This credential is issued by an authorized ECS issuer (the ECS Trust Registry itself on devnet/testnet) to the Organization's DID after a validation process.

### Service Credential

The Service credential describes the service itself:

- **name** — Service display name
- **logo** — Service logo (base64-encoded image)
- **type** — Service type (e.g., IssuerService, VerifierService, Information)
- **description** — Human-readable description
- **minimumAgeRequired** — Minimum age to access the service
- **termsAndConditions** — URL to terms of service
- **privacyPolicy** — URL to privacy policy

This credential is typically self-issued by the Organization's VS Agent (which has an ISSUER permission for the Service schema) and linked to the Service VS Agent's DID Document.

## Network Configuration

The ECS Trust Registry is deployed on every Verana network. The configuration is **identical** across devnet and testnet (same schema structure, same permission modes), and will follow the same pattern on mainnet.

### Devnet

| Resource | URL |
| --- | --- |
| ECS TR Public API | `https://ecs-trust-registry.devnet.verana.network` |
| ECS TR DID Document | `https://ecs-trust-registry.devnet.verana.network/.well-known/did.json` |
| Blockchain RPC | `https://rpc.devnet.verana.network` |
| Faucet | `https://faucet.devnet.verana.network` |
| Trust Resolver | `https://resolver.devnet.verana.network` |
| Indexer | `https://idx.devnet.verana.network` |
| Chain ID | `vna-devnet-1` |

### Testnet

| Resource | URL |
| --- | --- |
| ECS TR Public API | `https://ecs-trust-registry.testnet.verana.network` |
| ECS TR DID Document | `https://ecs-trust-registry.testnet.verana.network/.well-known/did.json` |
| Blockchain RPC | `https://rpc.testnet.verana.network` |
| Faucet | `https://faucet.testnet.verana.network` |
| Trust Resolver | `https://resolver.testnet.verana.network` |
| Indexer | `https://idx.testnet.verana.network` |
| Chain ID | `vna-testnet-1` |

### Mainnet

Mainnet configuration will be published when the network launches. The ECS Trust Registry will be governed by the [Verana Foundation](https://verana.foundation), with authorized issuers selected through a governance process defined in the Ecosystem Governance Framework (EGF).

## How to Join the ECS Ecosystem

Joining the ECS ecosystem means obtaining an **Organization credential** so your Verifiable Service can be identified and trusted. Here is the process:

### Step 1: Deploy your VS Agent

Before you can obtain credentials, you need a running VS Agent with a public DID. See [Deploy your first Verifiable Service](./52-deploy-first-vs.md) for detailed instructions.

### Step 2: Obtain your Organization Credential

On **devnet** and **testnet**, the ECS Trust Registry itself acts as the Organization credential issuer. You can request an Organization credential directly from its admin API:

```bash
# The ECS TR issues an Organization credential to your DID
curl -X POST "${ECS_TR_ADMIN_API}/v1/vt/issue-credential" \
  -H 'Content-Type: application/json' \
  -d '{
    "format": "jsonld",
    "did": "did:webvh:<SCID>:<your-host>",
    "jsonSchemaCredentialId": "<organization-vtjsc-url>",
    "claims": {
      "id": "did:webvh:<SCID>:<your-host>",
      "name": "Your Organization Name",
      "logo": "<base64-encoded-logo>",
      "registryId": "YOUR-REG-ID",
      "address": "Your Address",
      "countryCode": "US"
    }
  }'
```

The response contains the signed Organization credential, which you then link to your VS Agent.

:::note
On **mainnet**, obtaining an Organization credential will require contacting an authorized ECS issuer and going through a validation process that may include identity verification, legal entity checks, and compliance review — as defined in the ECS Ecosystem Governance Framework.
:::

### Step 3: Create an ISSUER Permission for the Service Schema

To issue Service credentials (for your own child services or for yourself in a combined setup), you need an ISSUER permission on the Service schema. Since the Service schema uses **OPEN** permission mode, you can self-create this permission:

```bash
veranad tx perm create-perm <service_schema_id> issuer "did:webvh:<SCID>:<your-host>" \
  --effective-from "<future-timestamp>" \
  --from <your-account> --chain-id <chain-id> --keyring-backend test \
  --fees 600000uvna --gas auto --node <rpc-url> \
  --output json -y
```

### Step 4: Issue and Link your Service Credential

Once your ISSUER permission is active, you can issue a Service credential to yourself (or to your child services) and link it as a Linked Verifiable Presentation in the DID Document.

:::tip
The [verana-demos](https://github.com/verana-labs/verana-demos) repository automates all these steps. See [Deploy your first Verifiable Service](./52-deploy-first-vs.md) for the complete walkthrough.
:::

## Discovering ECS Schemas

You do not need to hardcode ECS schema IDs. They can be **automatically discovered** by resolving the ECS Trust Registry's DID Document:

```bash
# Fetch the ECS TR DID Document
curl -s https://ecs-trust-registry.testnet.verana.network/.well-known/did.json | jq .
```

The DID Document contains `LinkedVerifiablePresentation` service entries for each schema. For example, the entry with an ID matching `organization-jsc-vp` contains the Organization schema's Verifiable Trust JSON Schema Credential (VTJSC), from which you can extract the VPR schema reference and the JSON Schema Credential URL needed for issuance.

This auto-discovery mechanism ensures your code stays compatible even if schema IDs change across network upgrades.

## Next Steps

- [**Deploy your first Verifiable Service**](./52-deploy-first-vs.md) — hands-on guide to get your VS running with ECS credentials.
- [**Join other ecosystems**](./53-join-ecosystems.md) — go beyond ECS and participate in custom trust ecosystems.

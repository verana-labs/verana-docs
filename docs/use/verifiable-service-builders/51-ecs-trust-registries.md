# ECS Trust Registries

## What are Essential Credential Schemas?

**Essential Credential Schemas (ECS)** are the foundational credential schemas that every Verifiable Service must use to identify itself within the Verana trust network. They answer the fundamental questions that any connecting peer needs answered:

- **What is this service?** → Service credential
- **Which organization operates it?** → Organization credential
- **Or which human-controlled persona operates it?** → Persona credential
- **Is the user agent connecting to me a genuine Verifiable User Agent?** → UserAgent credential
- **Who is the human operating that user agent, and whom do they represent?** → Badge credential

Without ECS credentials, a Verifiable Service cannot be trusted by peers — user agents like [Hologram Messaging](https://hologram.zone) will refuse to connect, and other Verifiable Services will reject interactions.

## Why do we need ECS Trust Registries?

ECS credentials are not self-asserted — they are issued by entities that hold an **ISSUER participant** in an **ECS Ecosystem** (the ECS Trust Registry). This Ecosystem is the **source of truth** for identifying services and their operators across the entire network.

The ECS Trust Registry:

- **Defines the five essential credential schemas** — Service, Organization, Persona, UserAgent, and Badge.
- **Controls who can issue each of them**, through the `issuer_onboarding_mode` of each schema: Organization, Persona and UserAgent credentials can only be issued by issuers onboarded by the ecosystem, while Service and Badge credentials can be issued by anyone who can self-create an ISSUER participant.
- **Anchors trust** — when a peer resolves your DID and finds your credentials, the trust resolver traces them back to the ECS Trust Registry to verify legitimacy.

:::tip
Think of the ECS Trust Registry as the "root certificate authority" of the Verana trust network — but decentralized, on-chain, and governed by the [Verana Council](https://veranacouncil.org).
:::

## ECS Credential Types

The ECS Trust Registry defines **five** credential schemas. Each `CredentialSchema` entry carries three independent onboarding modes:

- **`issuer_onboarding_mode`** — how a DID becomes an **ISSUER** of that schema (`OPEN`, `ECOSYSTEM_VALIDATION_PROCESS`, or `GRANTOR_VALIDATION_PROCESS`).
- **`verifier_onboarding_mode`** — how a DID becomes a **VERIFIER** of that schema (same three values).
- **`holder_onboarding_mode`** — whether the **holder** of a credential needs a `Participant` entry at all (`ISSUER_VALIDATION_PROCESS` or `PERMISSIONLESS`).

These are not interchangeable: `ISSUER_VALIDATION_PROCESS` is a **holder** mode (holders are onboarded by their issuer), it is *not* an issuer mode. Self-creating an ISSUER participant is only possible when the **issuer** mode is `OPEN`.

| Schema | `issuer_onboarding_mode` | `holder_onboarding_mode` | What that means for you |
| --- | --- | --- | --- |
| **Service** | `OPEN` | `ISSUER_VALIDATION_PROCESS` | Any corporation can self-create an ISSUER participant and issue Service credentials — to itself, or to its child services. |
| **Organization** | `ECOSYSTEM_VALIDATION_PROCESS` | `ISSUER_VALIDATION_PROCESS` | Only issuers onboarded by the ECS ecosystem can issue Organization credentials. You obtain one, you do not self-issue it. |
| **Persona** | `ECOSYSTEM_VALIDATION_PROCESS` | `ISSUER_VALIDATION_PROCESS` | Same as Organization, for human-controlled personas rather than legal entities. |
| **UserAgent** | `ECOSYSTEM_VALIDATION_PROCESS` | *(ecosystem-defined)* | Only onboarded issuers — user agent vendors — can issue UserAgent credentials, one issuer authorization per software product line. |
| **Badge** | `OPEN` | `PERMISSIONLESS` | Any service that qualifies as a Verifiable Service can self-create an ISSUER participant and issue Badges to the humans it stands behind. Badge holders need **no** `Participant` entry at all. |

The `holder_onboarding_mode` values above are normative: the Verifiable Trust specification requires `ISSUER_VALIDATION_PROCESS` for Service, Organization and Persona, and requires Badge to be `OPEN` / `PERMISSIONLESS`. On Verana's ECS Trust Registry, `verifier_onboarding_mode` is `OPEN` for all ECS schemas — anyone can self-create a VERIFIER participant and request presentation of ECS credentials.

You can check the modes of any schema on-chain:

```bash
veranad q cs get-schema <schema-id> --node https://rpc.testnet.verana.network --output json \
  | jq '.schema | {issuer_onboarding_mode, verifier_onboarding_mode, holder_onboarding_mode}'

# Or list every schema that lets you self-create an ISSUER participant
veranad q cs list-schemas --issuer-onboarding-mode open \
  --node https://rpc.testnet.verana.network --output json | jq .
```

For Verifiable Service builders, the two most important schemas are **Organization** and **Service**.

### Service Credential

Identifies the service itself, and declares the minimum trust and access requirements to interact with it:

- **id** — the DID of the service the credential is issued to
- **name** — service display name
- **type** — service type (e.g., `IssuerService`, `VerifierService`)
- **description** / **descriptionFormat** — human-readable description (`text/plain` or `text/markdown`)
- **logoUri** / **logoDigestSri** — URI of the service logo, and its Subresource Integrity digest
- **minimumAgeRequired** — minimum age (0–255) to connect to the service
- **termsAndConditionsUri** / **termsAndConditionsDigestSri** — terms of service, and its digest
- **privacyPolicyUri** / **privacyPolicyDigestSri** — privacy policy, and its digest

Because the Service schema is `OPEN` for issuers, this credential is typically **self-issued** by the Organization's VS Agent and linked as a Linked Verifiable Presentation in the Service's DID Document.

### Organization Credential

Identifies the legal entity operating the service:

- **id** — the DID of the organization
- **name** — legal name of the organization
- **logoUri** / **logoDigestSri** — organization logo URI, and its digest
- **registryId** / **registryUri** — identifier (and optional URI) of the organization in an external authoritative registry
- **address** — postal address
- **countryCode** — ISO 3166-1 alpha-2 country of legal registration
- **legalJurisdiction** *(optional)* — sub-national jurisdiction (e.g., `US-CA`)
- **organizationKind** *(optional)* — informational classification
- **lei** *(optional)* — Legal Entity Identifier

This credential is issued by an authorized ECS issuer (the ECS Trust Registry itself on devnet/testnet) to the Organization's DID after an onboarding process.

### Persona Credential

The alternative to an Organization credential when the operator is a human-controlled avatar rather than a legal entity: **id**, **name**, optional **description**/**descriptionFormat**, optional **avatarUri**/**avatarDigestSri**, mandatory **controllerCountryCode**, and optional **controllerJurisdiction**.

A Verifiable Service presents **exactly one** of Organization *or* Persona — either directly, or through the issuer of its Service credential.

### UserAgent Credential

Issued to user agent *instances* (e.g., a Hologram install) by the user agent's vendor, and presented to your service when a user connects. It carries only **version** (mandatory) and **build** (optional) — the issuer DID identifies the software product line. It is an AnonCreds credential and is **never** declared in a DID Document.

### Badge Credential

Identifies a **human** — for example an employee or member of the organization operating a Verifiable Service. A Badge is issued by a Verifiable Service to a human holder; the organization or persona behind that human is obtained by trust-resolving the **issuer** DID of the Badge.

- **badgeNumber** — issuer-scoped identifier of the holder, unique per issuer
- **name** — display name of the human
- **photo** — portrait embedded inline as a `data:image/png;base64,…` or `data:image/jpeg;base64,…` URI
- **title** / **department** *(optional)* — position and organizational unit
- **birthDate** *(optional)* — `YYYYMMDD` integer, enabling zero-knowledge predicate proofs (e.g. `age >= 18`)
- **biometricPattern** / **biometricPatternScheme** *(optional)* — protected biometric template for privacy-preserving matching

Badge attributes are informative facts only: a verifier MUST NOT read `title` or `department` as a role or authorization. Like the UserAgent credential, a Badge is an AnonCreds credential presented over DIDComm with selective disclosure, and is **never** declared in a DID Document.

## The ECS Ecosystem DID Document

An ecosystem that provides ECS trust resolution declares, in its DID Document, one `LinkedVerifiablePresentation` service entry per ECS — each pointing to a self-issued and presented **Verifiable Trust JSON Schema Credential (VTJSC)** — plus a `VerifiablePublicRegistry` entry identifying the VPR that holds the corresponding `CredentialSchema` entries.

The fragment names are fixed by the specification:

```json
"service": [
  {
    "id": "did:example:ecosystem#vpr-schemas-service-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-service-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-schemas-org-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-org-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-schemas-persona-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-persona-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-schemas-ua-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-ua-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-schemas-badge-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-badge-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-ecosystem-1",
    "type": "VerifiablePublicRegistry",
    "version": "1.0",
    "serviceEndpoint": ["vpr:verana:vna-testnet-1"]
  }
]
```

The `serviceEndpoint` of the `VerifiablePublicRegistry` entry uses the `vpr:` scheme — `vpr:verana:<chain-id>` — which peers resolve through their own list of known VPRs (their API, RPC and resolver endpoints). It is the same scheme used inside each schema's `$id` (`vpr:verana:<chain-id>:cs:<schema-id>`).

Your **service** DID Document is different: it presents *credentials*, not schemas, so it uses the `-vtc-vp` fragments (`#vpr-schemas-service-vtc-vp`, `#vpr-schemas-org-vtc-vp`, `#vpr-schemas-persona-vtc-vp`) — see [Deploy your first Verifiable Service](./52-deploy-first-vs.md#step-8-verify-your-setup).

## Network Configuration

The ECS Trust Registry is deployed on every Verana network. The configuration is **identical** across devnet and testnet (same schema structure, same onboarding modes), and will follow the same pattern on mainnet.

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

Mainnet configuration will be published when the network launches. The ECS Trust Registry will be governed by the [Verana Council](https://veranacouncil.org), with authorized issuers selected through a governance process defined in the Ecosystem Governance Framework (EGF).

## How to Join the ECS Ecosystem

Joining the ECS ecosystem means obtaining an **Organization credential** so your Verifiable Service can be identified and trusted. Here is the process:

### Step 1: Deploy your VS Agent

Before you can obtain credentials, you need a running VS Agent with a public DID. See [Deploy your first Verifiable Service](./52-deploy-first-vs.md) for detailed instructions.

### Step 2: Obtain your Organization Credential

The Organization schema is `ECOSYSTEM_VALIDATION_PROCESS` for issuers, so you cannot self-issue this one. On **devnet** and **testnet**, the ECS Trust Registry itself acts as the Organization credential issuer, and you can request a credential directly from its admin API:

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
On **mainnet**, obtaining an Organization credential will require contacting an authorized ECS issuer and going through an onboarding process that may include identity verification, legal entity checks, and compliance review — as defined in the ECS Ecosystem Governance Framework.
:::

### Step 3: Create an ISSUER Participant for the Service Schema

To issue Service credentials (for your own child services or for yourself in a combined setup), you need an ISSUER participant on the Service schema. Since the Service schema sets **`issuer_onboarding_mode` = `OPEN`**, you can self-create that participant — no onboarding process required:

```bash
veranad tx pp self-create-participant issuer <validator-participant-id> "did:webvh:<SCID>:<your-host>" \
  --corporation <corporation> \
  --effective-from "<future-timestamp>" \
  --from <your-account> --chain-id <chain-id> --keyring-backend test \
  --fees 600000uvna --gas auto --node <rpc-url> \
  --output json -y
```

The same applies to the Badge schema, which is also `OPEN` for issuers: once your service qualifies as a Verifiable Service, you can self-create an ISSUER participant and issue Badges to your employees or members.

### Step 4: Issue and Link your Service Credential

Once your ISSUER participant is active, you can issue a Service credential to yourself (or to your child services) and link it as a Linked Verifiable Presentation in the DID Document.

:::tip
The [verana-demos](https://github.com/verana-labs/verana-demos) repository automates all these steps. See [Deploy your first Verifiable Service](./52-deploy-first-vs.md) for the complete walkthrough.
:::

## Discovering ECS Schemas

You do not need to hardcode ECS schema IDs. They can be **automatically discovered** by resolving the ECS Trust Registry's DID Document:

```bash
# Fetch the ECS TR DID Document
curl -s https://ecs-trust-registry.testnet.verana.network/.well-known/did.json \
  | jq '[.service[] | select(.type == "LinkedVerifiablePresentation")]'
```

Each `LinkedVerifiablePresentation` entry holds one ECS Verifiable Trust JSON Schema Credential (VTJSC). Pick the entry whose fragment matches the schema you need — `#vpr-schemas-org-vtjsc-vp` for Organization, `#vpr-schemas-service-vtjsc-vp` for Service, and likewise for `persona`, `ua` and `badge` — then fetch its `serviceEndpoint` to obtain the VTJSC, from which you can extract the VPR schema reference (`credentialSubject.jsonSchema.$ref`) and the JSON Schema Credential URL needed for issuance.

This auto-discovery mechanism ensures your code stays compatible even if schema IDs change across network upgrades.

## Next Steps

- [**Deploy your first Verifiable Service**](./52-deploy-first-vs.md) — hands-on guide to get your VS running with ECS credentials.
- [**Join other ecosystems**](./53-join-ecosystems.md) — go beyond ECS and participate in custom trust ecosystems.

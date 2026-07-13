# Join Ecosystems and Work with Credentials

Once your Verifiable Service is deployed and registered with the ECS ecosystem, you can join **other ecosystems** to issue and verify credentials. This section explains why, how, and the different credential formats available.

## Why Join Other Ecosystems?

The ECS ecosystem provides the baseline trust layer — it proves **who you are** (Organization) and **what your service is** (Service). But to actually **do useful work** with credentials, you need to participate in domain-specific ecosystems:

- **Issue credentials** — e.g., a government issues citizen ID credentials, a university issues diplomas, a company issues employee badges.
- **Verify credentials** — e.g., a bank verifies customer identity, an employer verifies qualifications, an age-restricted service verifies the user is old enough.

Each ecosystem defines its own **Ecosystem** on-chain, **credential schemas**, and **rules for participation** (who can issue, who can verify, what fees apply). By joining an ecosystem, your VS gets the participants it needs to interact with credentials defined by that ecosystem.

## Credential Formats: W3C JSON-LD vs AnonCreds

Verana supports two credential formats, each suited for different use cases:

### W3C JSON-LD Credentials

W3C JSON-LD credentials follow the [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model-2.0/). They are:

- **Signed with Ed25519Signature2020** — standard cryptographic proof.
- **Tied to a subject DID** — the `credentialSubject.id` contains the DID of the entity the credential is about.
- **Publicly presentable** — designed to be exposed in DID Documents as [Linked Verifiable Presentations](https://www.w3.org/TR/vc-data-model-2.0/) (Linked VPs).
- **Verifiable by anyone** — anyone who resolves the DID can see and verify the credentials.

**Use cases for W3C JSON-LD:**

- The ECS credentials that identify entities: Service, Organization, Persona
- Verifiable Trust JSON Schema Credentials (VTJSCs) — the on-chain schema references
- Any credential that should be **publicly visible** in a DID Document
- Service-to-service credential exchange

**Example:** An Organization credential issued to `did:webvh:Qm...:my-service.com` is linked as a VP in that DID's Document, so anyone resolving the DID can see "This service is operated by Acme Corp."

### AnonCreds (Anonymous Credentials)

AnonCreds credentials follow the [AnonCreds specification](https://hyperledger.github.io/anoncreds-spec/). They are:

- **Privacy-preserving** — designed to prevent correlation between credential presentations.
- **Not tied to a subject DID** — issued over a [DIDComm](https://didcomm.org/) connection using blinded key material, so the issuer cannot track where the credential is presented.
- **Selectively disclosable** — the holder can reveal only specific attributes (e.g., prove "over 18" without revealing the birth date).
- **Revocable** — issuers can revoke credentials, and verifiers can check revocation status.
- **Exchanged over DIDComm** — not publicly visible; shared only in private peer-to-peer interactions.

**Use cases for AnonCreds:**

- The ECS credentials issued to people and software instances: **UserAgent** (issued to a user agent instance) and **Badge** (issued to a human, e.g. an employee of the organization behind a service). Both are presented over DIDComm and are **never** declared in a DID Document.
- Citizen ID credentials (privacy-preserving identity)
- Age verification
- Membership credentials
- Any credential where **user privacy** is important

### When to Use Which?

| Aspect | W3C JSON-LD | AnonCreds |
| --- | --- | --- |
| Visibility | Public (DID Document) | Private (DIDComm only) |
| Subject DID | Required | Not used |
| Privacy | Credential is public | Zero-knowledge proofs |
| Selective disclosure | No (all-or-nothing) | Yes (per-attribute) |
| Correlation resistance | No | Yes |
| Revocation | By expiration date | Cryptographic revocation |
| Best for | Entity identity, public metadata | End-user credentials, privacy |

:::tip
Many ecosystems use **both formats**: W3C JSON-LD for entity identification (who is the issuer, what is the service) and AnonCreds for end-user credentials (citizen ID, diplomas, health records).
:::

## How to Join an Ecosystem

The process for joining an ecosystem depends on how the ecosystem configured the schema you want to work with. Each `CredentialSchema` carries an **`issuer_onboarding_mode`** and a **`verifier_onboarding_mode`** — these are what determine how you get an ISSUER or VERIFIER participant, and each has three possible values: `OPEN`, `ECOSYSTEM_VALIDATION_PROCESS`, `GRANTOR_VALIDATION_PROCESS`.

Check them before you start:

```bash
veranad q cs get-schema <schema-id> --node <rpc-url> --output json \
  | jq '.schema | {issuer_onboarding_mode, verifier_onboarding_mode, holder_onboarding_mode}'
```

:::note
A schema's third mode, **`holder_onboarding_mode`** (`ISSUER_VALIDATION_PROCESS` or `PERMISSIONLESS`), is about the **holders** of the credential, not about you as issuer or verifier. `ISSUER_VALIDATION_PROCESS` means holders get their `Participant` entry through their issuer (which is what lets an issuer track revocation); `PERMISSIONLESS` means holders need no `Participant` entry at all. It never grants issuer or verifier rights.
:::

### Mode 1: `OPEN`

Anyone can self-create an ISSUER or VERIFIER participant — no onboarding process needed.

```bash
# Self-create an ISSUER participant for a schema whose issuer_onboarding_mode is OPEN
veranad tx pp self-create-participant issuer <validator-participant-id> "<your-did>" \
  --corporation <corporation> \
  --effective-from "<future-timestamp>" \
  --from <your-account> --chain-id <chain-id> --keyring-backend test \
  --fees 600000uvna --gas auto --node <rpc-url> \
  --output json -y
```

This is how the **Service** and **Badge** schemas work in the ECS ecosystem. After creating the participant and waiting for it to become effective, you can immediately start issuing credentials.

To find every schema you can join this way:

```bash
veranad q cs list-schemas --issuer-onboarding-mode open --node <rpc-url> --output json | jq .
```

### Mode 2: `ECOSYSTEM_VALIDATION_PROCESS`

The Ecosystem's Corporation directly validates applicants. This is how the **Organization**, **Persona** and **UserAgent** schemas work in the ECS ecosystem. You must:

1. **Start an onboarding process (OP):**

   ```bash
   veranad tx pp start-participant-op issuer <validator-participant-id> "<your-did>" \
     --from <your-account> --chain-id <chain-id> --keyring-backend test \
     --fees 600000uvna --gas auto --node <rpc-url> \
     --output json -y
   ```

2. **Complete off-chain validation** — connect to the validator's Verifiable Service via DIDComm, prove ownership of your account and DID, and provide any required documentation.

3. **Wait for validation** — the Ecosystem's Corporation reviews your application and sets the participant to VALIDATED:

   ```bash
   # Executed by the Ecosystem's Corporation
   veranad tx pp set-participant-op-validated <your-participant-id> \
     --from <operator-account> ...
   ```

4. Once validated, your participant becomes active and you can start issuing or verifying credentials.

### Mode 3: `GRANTOR_VALIDATION_PROCESS`

The ecosystem delegates validation to **Grantors** (intermediate authorities). The process is the same as `ECOSYSTEM_VALIDATION_PROCESS`, but you interact with a Grantor instead of the Ecosystem's Corporation directly:

1. Find an active ISSUER_GRANTOR or VERIFIER_GRANTOR participant for the schema.
2. Start an onboarding process targeting that Grantor's participant.
3. Complete the Grantor's validation requirements.
4. The Grantor validates your participant.

:::note
Grantors are often used when an ecosystem expects many participants and wants to delegate the onboarding process. For example, a government might delegate verifier onboarding to regional agencies.
:::

## Issue W3C JSON-LD Credentials

W3C JSON-LD credentials are used for entity identification and for creating Linked Verifiable Presentations in DID Documents.

### Issue a credential to another VS

Once you have an ISSUER participant for a schema, you can issue credentials to other entities:

```bash
# Issue a W3C JSON-LD credential to a target DID
curl -X POST "http://localhost:3000/v1/vt/issue-credential" \
  -H 'Content-Type: application/json' \
  -d '{
    "format": "jsonld",
    "did": "did:webvh:Qm...:target-service.example.com",
    "jsonSchemaCredentialId": "<vtjsc-url>",
    "claims": {
      "id": "did:webvh:Qm...:target-service.example.com",
      "name": "Target Service",
      "type": "VerifierService",
      "description": "A credential verification service",
      "logo": "<base64-encoded-logo>",
      "minimumAgeRequired": 0,
      "termsAndConditions": "https://example.com/terms",
      "privacyPolicy": "https://example.com/privacy"
    }
  }'
```

The response contains the signed credential JSON document.

### Import a credential in another VS Agent

The recipient VS Agent needs to **link** the received credential so it appears in its DID Document:

```bash
# On the recipient's VS Agent admin API
curl -X POST "http://localhost:3000/v1/vt/linked-credentials" \
  -H 'Content-Type: application/json' \
  -d '{
    "schemaBaseId": "service",
    "credential": { ... the signed credential JSON ... }
  }'
```

The `schemaBaseId` determines how the credential is referenced in the DID Document service entries (e.g., `organization`, `service`, or a custom schema base ID).

### Present credentials as Linked VPs in DID Documents

Once a credential is linked via `/v1/vt/linked-credentials`, the VS Agent automatically:

1. Wraps the credential in a **Verifiable Presentation** (VP).
2. Signs the VP with the agent's keys.
3. Exposes it as a `LinkedVerifiablePresentation` service entry in the DID Document.

You can verify this by checking the DID Document:

```bash
curl -s http://localhost:3001/.well-known/did.json | jq '.service[] | select(.type == "LinkedVerifiablePresentation")'
```

Each entry has a `serviceEndpoint` URL where the VP can be fetched and verified.

For the Essential Credentials, the fragment names are fixed by the Verifiable Trust spec — a Verifiable Service presents its Service credential at `#vpr-schemas-service-vtc-vp` and its Organization *or* Persona credential at `#vpr-schemas-org-vtc-vp` / `#vpr-schemas-persona-vtc-vp` (see [Deploy your first Verifiable Service](./52-deploy-first-vs.md#step-8-verify-your-setup)). Credentials from other ecosystems are presented as additional `LinkedVerifiablePresentation` entries alongside them.

### List and remove linked credentials

```bash
# List all linked credentials
curl -s http://localhost:3000/v1/vt/linked-credentials | jq .

# Remove a linked credential
curl -X DELETE http://localhost:3000/v1/vt/linked-credentials \
  -H 'Content-Type: application/json' \
  -d '{"credentialSchemaId": "<vtjsc-url>"}'
```

## Issue AnonCreds Credentials

AnonCreds credentials are used for end-user credential issuance over DIDComm, providing privacy-preserving features like selective disclosure.

### Step 1: Create a Credential Type

Before issuing AnonCreds credentials, you must create a **Credential Type** that links an AnonCreds Credential Definition to a VTJSC:

```bash
curl -X POST "http://localhost:3000/v1/credential-types" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "citizen-id",
    "version": "1.0",
    "relatedJsonSchemaCredentialId": "<vtjsc-credential-id>"
  }'
```

The response includes the **Credential Definition ID**, which is the identifier you (and verifiers) will use to reference this credential type:

```json
{
  "id": "did:webvh:Qm...:my-service.com/resources/zQm...",
  "name": "citizen-id",
  "version": "1.0",
  "attributes": ["firstName", "lastName", "birthDate", "photo", ...],
  "relatedJsonSchemaCredentialId": "<vtjsc-credential-id>"
}
```

:::note
The `relatedJsonSchemaCredentialId` is the URL of the VTJSC (Verifiable Trust JSON Schema Credential) that defines the schema. Your DID must have an active ISSUER participant for this schema, otherwise the Verifiable Trust check will fail during credential verification.
:::

### Step 2: Create a Credential Offer

A **Credential Offer** is a DIDComm invitation, typically rendered as a QR code, that users scan with a compatible user agent (e.g., [Hologram Messaging](https://hologram.zone)):

```bash
curl -X POST "http://localhost:3000/v1/invitation/credential-offer" \
  -H 'Content-Type: application/json' \
  -d '{
    "credentialDefinitionId": "<credential-definition-id>",
    "claims": [
      {"name": "firstName", "value": "Jane"},
      {"name": "lastName", "value": "Doe"},
      {"name": "birthDate", "value": "1990-01-15"},
      {"name": "photo", "value": "<base64-photo>"},
      {"name": "countryOfResidence", "value": "CH"}
    ]
  }'
```

Response:

```json
{
  "credentialExchangeId": "9235f80a-...",
  "url": "https://hologram.zone/?oob=eyJ...",
  "shortUrl": "https://my-service.com/s?id=2aff..."
}
```

Use `shortUrl` to generate a QR code. When the user scans it with Hologram, the credential is issued via the DIDComm protocol and stored securely in their wallet.

## Request Presentation of an AnonCreds Credential

To verify credentials held by users, create a **Presentation Request** — another DIDComm invitation:

### Create a Presentation Request

```bash
curl -X POST "http://localhost:3000/v1/invitation/presentation-request" \
  -H 'Content-Type: application/json' \
  -d '{
    "ref": "verification-1234",
    "callbackUrl": "http://my-backend:4000/verification-callback",
    "requestedCredentials": [
      {
        "credentialDefinitionId": "<credential-definition-id>",
        "attributes": ["firstName", "lastName"]
      }
    ]
  }'
```

- **`ref`** — your reference ID, echoed back in the callback so you can match it to your business logic.
- **`callbackUrl`** — your backend endpoint that receives the verification result.
- **`attributes`** — only the attributes you need (**selective disclosure** — the user reveals only these fields).

Response:

```json
{
  "proofExchangeId": "afedce07-...",
  "url": "https://hologram.zone/?oob=eyJ...",
  "shortUrl": "https://my-service.com/s?id=687e..."
}
```

### Receive the Verification Result

When the user accepts the presentation request in their user agent, VS Agent posts the result to your `callbackUrl`:

```json
{
  "ref": "verification-1234",
  "presentationRequestId": "afedce07-...",
  "status": "Verified",
  "claims": [
    {"name": "firstName", "value": "Jane"},
    {"name": "lastName", "value": "Doe"}
  ]
}
```

Your backend can then use this verified data for its business logic.

### Selective Disclosure

One of the key advantages of AnonCreds is **selective disclosure**: you only request the attributes you actually need:

```json
{
  "requestedCredentials": [
    {
      "credentialDefinitionId": "<cred-def-id>",
      "attributes": ["countryOfResidence"]
    }
  ]
}
```

In this example, the user reveals only their country of residence — not their name, birth date, or photo. The cryptographic proof still guarantees the credential was issued by a trusted issuer, without exposing unnecessary personal data.

## Putting It All Together

Here is a typical flow for a Verifiable Service that both issues and verifies credentials:

```text
1. Deploy VS Agent (Docker or Helm)
2. Obtain ECS credentials (Organization + Service)
        ↓
3. Join an ecosystem (get ISSUER and/or VERIFIER participants)
        ↓
4. Create VTJSCs for your schemas
        ↓
   ┌────────────────────────┬──────────────────────────┐
   │  W3C JSON-LD           │  AnonCreds               │
   │                        │                          │
   │  Issue credentials     │  Create Credential Type  │
   │  to other services     │  Create Credential Offer │
   │  Link as VPs in        │  (QR code for users)     │
   │  DID Documents         │                          │
   │                        │  Create Presentation     │
   │                        │  Request (QR code)        │
   │                        │  Receive verified claims  │
   └────────────────────────┴──────────────────────────┘
```

## Summary

| Task | Format | API Endpoint |
| --- | --- | --- |
| Issue entity credential | W3C JSON-LD | `POST /v1/vt/issue-credential` |
| Link credential as VP | W3C JSON-LD | `POST /v1/vt/linked-credentials` |
| Create AnonCreds type | AnonCreds | `POST /v1/credential-types` |
| Issue to user (QR) | AnonCreds | `POST /v1/invitation/credential-offer` |
| Verify user credential (QR) | AnonCreds | `POST /v1/invitation/presentation-request` |
| List linked credentials | W3C JSON-LD | `GET /v1/vt/linked-credentials` |
| Remove linked credential | W3C JSON-LD | `DELETE /v1/vt/linked-credentials` |

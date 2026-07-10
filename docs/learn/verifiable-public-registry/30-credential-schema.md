# Credential Schemas

Once a [Corporation](./corporations) controls an [Ecosystem](./ecosystems) in a VPR, it can create and manage that ecosystem's credential schemas.

Here is the process for publishing a given credential schema, and making it usable by ecosystem participants:

1. The ecosystem creates and configures a `Credential Schema` entry in the VPR, linked to its `Ecosystem`. The entry includes a **JSON schema**.
2. The ecosystem issues, with its ecosystem DID, a **verifiable trust JSON schema credential**, which is a [json schema credential](https://www.w3.org/TR/vc-json-schema/) linked to the **JSON schema** created in the VPR.
3. The ecosystem presents, in its DID document, the **verifiable trust JSON schema credential** as a [linked verifiable presentation](https://identity.foundation/linked-vp/), and declares the VPR in a "service" section.

Then, authorized issuers can issue **verifiable trust credentials** linked to the **verifiable trust JSON schema credential** issued by the ecosystem DID.

```plantuml

@startuml
scale max 800 width
object "Ecosystem (created in VPR)" as es {
  ecosystem did: did:example:ecosystem
}
object "CredentialSchema (in VPR)" as cs {
  id: 12345678
  json_schema: { "$id": ... "title": "ExampleCredential"}
}
object "Verifiable Trust Json Schema Credential" as jsc #3fbdb6 {
  id: https://ecosystem/shemas-example-jsc.json
  issuer: did:example:ecosystem
  jsonSchema: vpr:verana:mainnet/cs/v1/js/12345678
}

object "Verifiable Trust Credential" as vscred #3fbdb6 {
  issuer: did:example:authorized-issuer
  holder: did:example:holder
  jsonSchemaCredential: https://ecosystem/shemas-example-jsc.json
}

 jsc --> vscred: Authorized issuer issues a VTC based on JsonSchemaCredential issued by ecosystem DID
cs --> jsc : ecosystem DID issues a JsonSchemaCredential based on json_schema located in CredentialSchema in the VPR
es --> cs : creates a CredentialSchema (in VPR)

@enduml

```

## What a Credential Schema entry configures

Beyond the **JSON schema**, a `Credential Schema` entry carries the policy and business configuration that governs how participants join the schema and how fees are denominated:

- **Onboarding modes** — one per role, which determine how `Participant` entries are created:
  - `issuer_onboarding_mode` and `verifier_onboarding_mode`: `OPEN`, `ECOSYSTEM_VALIDATION_PROCESS`, or `GRANTOR_VALIDATION_PROCESS`.
  - `holder_onboarding_mode`: `ISSUER_VALIDATION_PROCESS` or `PERMISSIONLESS`.

  These are covered in detail in [Onboarding Participants](./onboarding-participants).
- **Per-role validity periods** — `issuer_grantor_validation_validity_period`, `verifier_grantor_validation_validity_period`, `issuer_validation_validity_period`, `verifier_validation_validity_period`, and `holder_validation_validity_period` (in days) — after which an onboarding process expires and must be renewed.
- **Pricing configuration** — `pricing_asset_type` and `pricing_asset` define the asset in which the schema's fees are expressed:
  - `TU` — [trust units](./exchange-rate), converted to native denom through the Exchange Rate oracle at transaction time;
  - `COIN` — a token available on the VPR chain (e.g. `uvna`);
  - `FIAT` — a fiat currency (e.g. `USD`), meaning the chain is used for settlement only and payment happens off-chain.

  Note that trust deposits are always handled in native denom regardless of `pricing_asset_type`.
- **`digest_algorithm`** — the algorithm used to compute the `digestSRI` for credentials issued under this schema.

(Spec: `CredentialSchema` data model; onboarding modes and pricing fields.)

### Schema Authorization Policies

In addition to the schema entry itself, an ecosystem can attach versioned **`SchemaAuthorizationPolicy`** entries to a credential schema. Each policy is scoped to a single role (`ISSUER` or `VERIFIER`) and published as a document (URL + `digest_sri`), with `effective_from` / `effective_until` validity and a `revoked` flag. This lets an ecosystem state, immutably and by version, the rules a corporation must satisfy to act as issuer or verifier of the schema.

(Spec: `SchemaAuthorizationPolicy` data model.)

:::note
Data stored in the VPR is not verified at the time of storage, nor does it need to be. Verification happens outside the scope of the VPR.

This is not a limitation, it’s a feature. For example, any DID method can be used, and the VPR will never attempt to resolve or validate DIDs itself.

The VPR provides registrations, not validations, leaving trust decisions and verification where they belong: **with the relying parties**.
:::

## 1. Creating the Credential Schema Entry

In a VPR, each created `Credential Schema` includes a **JSON schema** that defines the structure of its corresponding **verifiable credential**.

Here is an example of a JSON schema:

```json
{
  "$id": "vpr:verana:mainnet/cs/v1/js/12345678",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ExampleCredential",
  "description": "ExampleCredential using JsonSchema",
  "type": "object",
  "properties": {
    "credentialSubject": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uri"
        },
        "firstName": {
          "type": "string",
          "minLength": 0,
          "maxLength": 256
        },
        "lastName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 256
        },
        "expirationDate": {
          "type": "string",
          "format": "date"
        },
        "countryOfResidence": {
          "type": "string",
          "minLength": 2,
          "maxLength": 2
        }
      },
      "required": [
        "id",
        "lastName",
        "birthDate",
        "expirationDate",
        "countryOfResidence"
      ]
    }
  }
}
```

## 2. Creating the JSON Schema Credential

Ecosystem issues, with its ecosystem DID, a **verifiable trust JSON schema credential**, which is a [json schema credential](https://www.w3.org/TR/vc-json-schema/) linked to the **JSON schema** created in the VPR.

This credential serves as a verifiable proof of:

- control of the `Credential Schema` created in the VPR;
- control over the corresponding `Ecosystem` DID.

```json
{
  "@context": [
      "https://www.w3.org/ns/credentials/v2"
  ],
  "id": "https://ecosystem/shemas-example-jsc.json",
  "type": ["VerifiableCredential", "JsonSchemaCredential"],
  "issuer": "did:example:ecosystem",
  "issuanceDate": "2024-01-01T19:23:24Z",
  "credentialSchema": {
    "id": "https://www.w3.org/ns/credentials/json-schema/v2.json",
    "type": "JsonSchema",
    "digestSRI": "sha384-S57yQDg1MTzF56Oi9DbSQ14u7jBy0RDdx0YbeV7shwhCS88G8SCXeFq82PafhCrW"
  },
  "credentialSubject": {
    "id": "vpr:verana:mainnet/cs/v1/js/12345678",
    "type": "JsonSchema",
    "jsonSchema": {
      "$ref": "vpr:verana:mainnet/cs/v1/js/12345678"
    },
    "digestSRI": "sha384-ABCSGyugst67rs67rdbugsy0RDdx0YbeV7shwhCS88G8SCXeFq82PafhCeZ" 
  }
}
```

## 3. Updating the Ecosystem DID Document

Finally, ecosystem presents, in its DID document, the **verifiable trust JSON schema credential** as a [linked verifiable presentation](https://identity.foundation/linked-vp/), and declares the VPR in a "service" section.

This ensures that the credential schema and its controlling ecosystem are publicly discoverable and cryptographically verifiable.

```json
"service": [
    {
      "id": "did:example:ecosystem#vpr-schemas-example-jsc-vp",
      "type": "LinkedVerifiablePresentation",
      "serviceEndpoint": ["https://ecosystem/schemas-example-jsc-vp.json"]
    },
    {
      "id": "did:example:ecosystem#vpr-schemas-ecosystem-1234",
      "type": "VerifiablePublicRegistry",
      "version": "1.0",
      "serviceEndpoint": ["vpr:verana:mainnet"]
    }
    ...
  ]
```

Then, authorized issuers can issue **verifiable trust credentials** linked to the **verifiable trust JSON Schema Credential** issued by ecosystem DID.

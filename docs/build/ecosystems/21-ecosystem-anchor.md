---
title: Run the ecosystem anchor
description: "Why the ecosystem DID is a VS Agent, and what it publishes automatically for every schema: the schema credential, the SD-JWT type metadata, the AnonCreds schema."
sidebar_position: 21
persona: ecosystem-builder
surface: admin-api
verified_on: pending (testnet v4, VS Agent 2.0)
---

# Run the ecosystem anchor

The ecosystem DID is the trust root of everything the ecosystem governs, and it has work to do: it issues the credential that binds each schema to the ecosystem, and it serves the artefacts issuers of both rails need. A VS Agent does all of it, so the anchor is simply a VS Agent whose DID you give to the ecosystem.

## Deploy

Deploy and make trusted a VS Agent exactly as in the [Verifiable Services quickstart](../verifiable-services/00-quickstart.mdx), under the ecosystem's corporation. Its Service credential describes the ecosystem (name, description, logo); its Organization credential is the controlling organisation's. Use its DID when you [create the ecosystem](./20-create-ecosystem.md).

## What it does on its own

When the ecosystem creates a credential schema, the anchor sees the event through the indexer and:

1. issues the schema credential (the Verifiable Trust JSON Schema Credential) for that schema, signed with the ecosystem DID, and publishes it as a linked presentation under a fragment ending in `-vtjsc-vp`;
2. serves the SD-JWT VC type metadata of the schema at `/vt/vct/{schemaId}`, the `vct` every accredited OpenID4VC issuer will reference;
3. publishes the AnonCreds schema of the schema, the one every accredited AnonCreds issuer builds its credential definition on.

Schemas are immutable, so each is a one-off. The anchor never needs to update a schema credential.

## Verify

```bash
curl -s https://ecosystem.example.com/.well-known/did.json | jq '.service[] | select(.id|endswith("vtjsc-vp")) | .id'
curl -s https://ecosystem.example.com/vt/vct/<schemaId> | jq '{vct, name, relatedJsonSchemaCredentialId}'
```

## Next

- [Define a credential schema](./30-credential-schemas.md).
- Specification: VS Agent v4, `VSA-VTI-VTJSC`, `VSA-PUB-VT-5`, `VSA-PUB-AC-5`; Verifiable Trust v4, `VT-ECOSYSTEM-DIDDOC`.

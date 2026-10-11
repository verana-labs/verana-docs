---
title: Define a credential schema
description: "Author the JSON schema, choose the onboarding modes, validity periods, pricing asset and digest algorithm, and understand what is immutable."
sidebar_position: 30
persona: ecosystem-builder
surface: frontend
verified_on: pending (testnet v4)
---

# Define a credential schema

## Author the JSON schema

A credential schema's shape is a JSON Schema (draft 2020-12) whose `credentialSubject` lists the claims. Give it a `title` (it becomes the credential's name in wallets) and a `description`. Use `VPR_CHAIN_ID` and `VPR_CREDENTIAL_SCHEMA_ID` as placeholders in `$id`; the registry replaces them.

```json
{
  "$id": "vpr:verana:VPR_CHAIN_ID:cs:VPR_CREDENTIAL_SCHEMA_ID",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "MembershipCredential",
  "description": "Membership of the Example Association.",
  "type": "object",
  "properties": {
    "credentialSubject": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "format": "uri" },
        "memberName": { "type": "string", "minLength": 1, "maxLength": 256 },
        "memberId": { "type": "string", "minLength": 1, "maxLength": 64 },
        "since": { "type": "string", "format": "date" }
      },
      "required": ["memberName", "memberId", "since"]
    }
  }
}
```

The [five Essential Credential Schemas](../../reference/credentials/essential-credential-schemas.md) are good models. Keep `id` as a property only when the subject is a DID (a service, an organisation); credentials for people carry no subject DID.

## Choose the policy

| Setting | Options | Think about |
|---|---|---|
| Issuer onboarding mode | open, ecosystem validation, grantor validation | Who may issue. Open is right when anyone may describe themselves; validation when the ecosystem vouches. |
| Verifier onboarding mode | same | Who may ask people for this credential. Open is common for low-sensitivity credentials. |
| Holder onboarding mode | issuer validation, permissionless | Issuer validation gives each holder an entry the issuer can revoke; required for credentials issued to services. Permissionless for credentials issued to people. |
| Validity periods | days per role, zero for none | How often grantors, issuers, verifiers and holders must renew |
| Pricing asset | native coin (frontend today), trust unit, fiat | The unit of every fee on this schema |
| Digest algorithm | sha384 or sha512 | Used to anchor public credentials |

Everything except the validity periods is immutable; the frontend warns before you sign.

## Steps

Ecosystem page, **Credential schemas**, **New schema**: paste the JSON schema (validated in the browser, bounded by the network's size limit), set the modes, periods and algorithm, sign. The anchor publishes the schema credential, type metadata and AnonCreds schema within a block or two.

## Verify

```bash
curl -s https://idx.testnet.verana.network/v4/credential-schema/get/<id> | jq '{id, ecosystem_id, issuer_onboarding_mode, verifier_onboarding_mode, holder_onboarding_mode, pricing_asset_type, pricing_asset, digest_algorithm}'
curl -s https://idx.testnet.verana.network/v4/credential-schema/js/<id> | jq .title
```

## Next

- [Root participants and grantors](./31-root-participants-grantors.md).
- Specification: VPR v4, `MOD-CS-MSG-1`, `MOD-CS-MSG-2`; Frontend v4, `VFE-PAGE-ES-4`.

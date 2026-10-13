---
title: Credential formats
description: W3C JSON-LD, AnonCreds and SD-JWT VC in Verana, side by side.
---

# Credential formats

Verana supports three credential formats. Each is a Verifiable Trust Credential when it references, directly or indirectly, a VTJSC issued by an ecosystem DID, and each passes trust resolution in its own way.

| | W3C JSON-LD | AnonCreds | SD-JWT VC |
|---|---|---|---|
| Specification | VC Data Model 2.0, `VerifiableTrustCredential` type | AnonCreds 1.0 | IETF SD-JWT VC with Type Metadata |
| Transport | published as linked presentations in DID Documents; issued over vt-flow and DIDComm | DIDComm (Issue Credential 2.0, Present Proof 2.0) | OpenID4VCI and OpenID4VP |
| Subject | a DID (service, organization, persona) | a holder key, no DID | the wallet's key (`cnf`) |
| Visibility | public | private, unlinkable presentations | private, selective disclosure |
| Link to the schema | `credentialSchema.id` is the VTJSC | the credential definition's `relatedJsonSchemaCredentialId` | the Type Metadata's `relatedJsonSchemaCredentialId`, after `vct#integrity` |
| Issuance time | objective: the JCS digest is anchored on chain, its block time is the issuance time | not objective | not objective |
| Issuer authorization checked | at the anchored issuance time | now | now (reception time is checked by the wallet) |
| Revocation | none at credential level in v4: revoke the holder's participant entry | revocation registries | Token Status Lists signed by the issuer |
| Typical use | ECS Service, Organization, Persona; VTJSCs; any public claim about a service | ECS User Agent, ECS Badge; privacy-preserving personal credentials | ECS User Agent, ECS Badge; wallet-facing credentials in the EU style; the playground DemoCredential |

Where each is specified: `VT-CRED-W3C`, `VT-CRED-ANON`, `VT-CRED-SDJWT` in the [Verifiable Trust specification](https://verana-labs.github.io/verifiable-trust-spec/versions/v4/).

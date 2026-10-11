---
title: Essential Credential Schemas
description: The five Essential Credential Schemas of the Verifiable Trust specification, rendered from the published JSON schemas.
---

# Essential Credential Schemas

Rendered from the JSON schemas published by the [Verifiable Trust specification](https://github.com/verana-labs/verifiable-trust-spec/tree/main/schemas/v4). The `id` claim, when present, is the DID of the subject. Constraints are the JSON schema constraints; `required` marks the claims an issuer must set.

| Schema | Subject | Format | Who issues | DID Document fragment |
|---|---|---|---|---|
| Service | the service | W3C JSON-LD | the service itself or its parent organization (OPEN issuer mode) | `#vpr-schemas-service-vtc-vp` |
| Organization | the legal entity | W3C JSON-LD | accredited ECS issuers (onboarding process) | `#vpr-schemas-org-vtc-vp` |
| Persona | the human-controlled persona | W3C JSON-LD | accredited ECS issuers (onboarding process) | `#vpr-schemas-persona-vtc-vp` |
| User Agent | a wallet or agent instance | AnonCreds | accredited wallet vendors | none, private |
| Badge | a human | AnonCreds | any Verifiable Service (OPEN issuer mode, permissionless holders) | none, private |

The ECS ecosystem publishes the matching VTJSCs under the reserved fragments `#vpr-schemas-{service,org,persona,ua,badge}-vtjsc-vp`.

## Service (`ServiceCredential`)

ECS Service: identifies a Verifiable Service and declares the minimum requirements to interact with it. Subject: the service DID. Public, W3C JSON-LD, presented as a linked presentation under `#vpr-schemas-service-vtc-vp`.

Schema id: `https://verana-labs.github.io/verifiable-trust-spec/schemas/v4/service.json`

| Claim | Type | Constraints | Required |
|---|---|---|---|
| `description` | string | length 0 to 4096 | yes |
| `descriptionFormat` | string | one of `text/plain`, `text/markdown`; default `text/plain` | no |
| `id` | string | uri; length 0 to 2048 | yes |
| `logoDigestSri` | string | length 0 to 256 | yes |
| `logoUri` | string | uri; length 0 to 4096 | yes |
| `minimumAgeRequired` | integer | 0 to 255 | yes |
| `name` | string | length 1 to 512 | yes |
| `privacyPolicyDigestSri` | string | length 0 to 256 | yes |
| `privacyPolicyUri` | string | uri; length 0 to 4096 | yes |
| `termsAndConditionsDigestSri` | string | length 0 to 256 | yes |
| `termsAndConditionsUri` | string | uri; length 0 to 4096 | yes |
| `type` | string | length 1 to 128 | yes |

## Organization (`OrganizationCredential`)

ECS Organization: identifies the legal entity that operates one or more Verifiable Services. Subject: the organization DID. Public, W3C JSON-LD, `#vpr-schemas-org-vtc-vp`. Issued by accredited ECS issuers after an onboarding process.

Schema id: `https://verana-labs.github.io/verifiable-trust-spec/schemas/v4/org.json`

| Claim | Type | Constraints | Required |
|---|---|---|---|
| `address` | string | length 1 to 1024 | yes |
| `countryCode` | string | length 2 to 2; pattern `^[A-Z]{2}$` | yes |
| `id` | string | uri; length 0 to 2048 | yes |
| `legalJurisdiction` | string | length 1 to 64; pattern `^[A-Z]{2}(-[A-Z0-9]{1,3})?$` | no |
| `lei` | string | pattern `^[A-Z0-9]{20}$` | no |
| `logoDigestSri` | string | length 0 to 256 | yes |
| `logoUri` | string | uri; length 0 to 4096 | yes |
| `name` | string | length 1 to 512 | yes |
| `organizationKind` | string | length 1 to 64 | no |
| `registryId` | string | length 1 to 256 | yes |
| `registryUri` | string | uri; length 0 to 4096 | no |

## Persona (`PersonaCredential`)

ECS Persona: identifies a human-controlled persona that operates one or more Verifiable Services, the alternative to Organization. Subject: the persona DID. Public, W3C JSON-LD, `#vpr-schemas-persona-vtc-vp`.

Schema id: `https://verana-labs.github.io/verifiable-trust-spec/schemas/v4/persona.json`

| Claim | Type | Constraints | Required |
|---|---|---|---|
| `avatarDigestSri` | string | length 0 to 256 | when `avatarUri` is set |
| `avatarUri` | string | uri; length 0 to 4096 | no |
| `controllerCountryCode` | string | length 2 to 2; pattern `^[A-Z]{2}$` | yes |
| `controllerJurisdiction` | string | length 1 to 64; pattern `^[A-Z]{2}(-[A-Z0-9]{1,3})?$` | no |
| `description` | string | length 0 to 16384 | no |
| `descriptionFormat` | string | one of `text/plain`, `text/markdown`; default `text/plain` | no |
| `id` | string | uri; length 0 to 2048 | yes |
| `name` | string | length 1 to 256 | yes |

## User Agent (`UserAgentCredential`)

ECS User Agent: identifies a user agent instance and the software it runs; the issuer identifies the product line. Private, AnonCreds, presented over DIDComm, never in a DID Document.

Schema id: `https://verana-labs.github.io/verifiable-trust-spec/schemas/v4/ua.json`

| Claim | Type | Constraints | Required |
|---|---|---|---|
| `build` | string | length 1 to 128 | no |
| `version` | string | length 1 to 64 | yes |

## Badge (`BadgeCredential`)

ECS Badge: identifies a human, for example an employee or member of the organization behind a service; the issuer identifies whom they represent. Private, AnonCreds, never in a DID Document. Attributes are facts, not authorizations.

Schema id: `https://verana-labs.github.io/verifiable-trust-spec/schemas/v4/badge.json`

| Claim | Type | Constraints | Required |
|---|---|---|---|
| `badgeNumber` | string | length 1 to 256 | yes |
| `biometricPattern` | string | length 0 to 262144; base64 | no |
| `biometricPatternScheme` | string | length 1 to 128 | when `biometricPattern` is set |
| `birthDate` | integer | 10000101 to 99991231 | no |
| `department` | string | length 1 to 128 | no |
| `name` | string | length 1 to 256 | yes |
| `photo` | string | length 0 to 262144; pattern `^data:image/(png\|jpeg);base64,[A-Za-z0-9+/]+={0,2}$` | yes |
| `title` | string | length 1 to 128 | no |

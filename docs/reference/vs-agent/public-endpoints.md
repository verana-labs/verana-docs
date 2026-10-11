---
title: Public endpoints and DID Document
description: What a VS Agent publishes to peers and wallets: DID Document service entries, DIDComm endpoints, trust resources, AnonCreds registry, OpenID4VC endpoints, invitations.
---

# Public endpoints and DID Document

The public listener (`PUBLIC_API_PORT`, reached at `PUBLIC_API_BASE_URL`) is what peers, wallets and resolvers see. The DID Document is its table of contents. Source: specification section Public Endpoints.

## DID Document service entries

| Entry type | Who creates it | Rule |
|---|---|---|
| `DIDCommMessaging` | the agent | Mandatory. One DIDComm v1 and one DIDComm v2 entry per endpoint, so a peer of either envelope reaches the agent. |
| `LinkedVerifiablePresentation` | the agent | One per published credential (fragments `#vpr-schemas-<qualifier>-vtc-vp`) and, for an ecosystem anchor, one per VTJSC (`#vpr-schemas-<qualifier>-vtjsc-vp`). ECS credentials use the reserved qualifiers `service`, `org`, `persona`. |
| `VsAgentAdminAPI` | the agent, when `ADMIN_API_PUBLIC_URL` is set | A single `https://` origin equal to that variable. Consumers locate it by type, not by fragment. |
| `AnonCredsRegistry` (`#anoncreds`) | the agent, `did:web` only | `serviceEndpoint` is `{PUBLIC_API_BASE_URL}/anoncreds/v1`. |
| `relativeRef` (`#files`) | the agent, `did:webvh` only | The implicit attested-resources service of did:webvh. |
| `MCP`, `A2A`, `LinkedDomains`, any ecosystem-defined type | the operator, through the Admin API | Consumable endpoints. A peer may use them only after trust resolution of the DID succeeded. |

The operator cannot create, modify or delete the agent-managed entries through the Admin API.

## DIDComm inbound endpoint

Each `DIDCommMessaging` endpoint is an `https://` or `wss://` URL at the host, port and base path of `PUBLIC_API_BASE_URL`. On `https://` the agent accepts a DIDComm message as the body of a `POST`; on `wss://` as one WebSocket message. Both envelopes (v1 and v2) are accepted on either.

## Verifiable Trust resources

| Resource | Path | Rule |
|---|---|---|
| Linked presentation | the `serviceEndpoint` of its entry | JSON document holding the presentation and the credential it wraps. |
| VTJSC | the URL that is the credential `id` | Under `PUBLIC_API_BASE_URL`; stable while published. Credential definitions reference it by `relatedJsonSchemaCredentialId`, verifiers by `credentialSchema.id`. |
| `#whois` presentation | the same endpoint as the ECS Service entry | `did:webvh` only, in addition to the required entry, never instead of it. |
| Placeholders | `/vt/default/logo.svg`, `/vt/default/terms.html`, `/vt/default/privacy.html` | Optional; content stable while a credential carries their digest. |
| SD-JWT VC type metadata | `/vt/vct/{credentialSchemaId}` | Served by the ecosystem anchor for each VTJSC it issues, whether or not OpenID4VC is enabled. `vct` equals that URL; `relatedJsonSchemaCredentialId` is the VTJSC id; no `schema` or `schema_uri`; identical bytes on every request. |

The reference implementation serves presentations and VTJSCs under `/vt/`, with names such as `schemas-<schema>-vtc-vp.json` and `schemas-<schema>-jsc.json`. Peers never depend on those names.

## AnonCreds registry

The agent is the AnonCreds registry of the objects it creates. The layout follows the DID method.

`did:web`, below the `AnonCredsRegistry` endpoint:

| Path | Object |
|---|---|
| `/schema/{schemaId}` | Schema |
| `/credDef/{credentialDefinitionId}` | Credential definition |
| `/revRegDef/{revocationRegistryDefinitionId}` | Revocation registry definition, with `statusListEndpoint` in its metadata |
| `/revStatus/{revocationRegistryDefinitionId}[/{timestamp}]` | Revocation status list, current or at a time |

Responses are `{ resource, resourceMetadata }`. Unknown identifiers answer `404`.

`did:webvh`: each object is an attested resource at `/resources/{resourceId}`. `GET /resources?resourceType=anonCredsSchema&relatedJsonSchemaCredentialId={id}` lists the AnonCreds schema of a VTJSC.

Tails files are served at the `tailsLocation` the revocation registry definition declares, under `PUBLIC_API_BASE_URL`.

One AnonCreds schema governs every AnonCreds credential of a VTJSC, and its publisher is the issuer of the VTJSC, normally the ecosystem anchor. Attribute names are the `credentialSubject` properties of the JSON schema; the resource metadata carries the VTJSC id as `relatedJsonSchemaCredentialId`.

## OpenID4VC endpoints

Served only when `OID4VC_CONFIG_FILE_LOCATION` is set.

| Path | Purpose |
|---|---|
| `/.well-known/openid-credential-issuer`, `/.well-known/oauth-authorization-server`, `/.well-known/jwt-vc-issuer` | Issuer and authorization server metadata |
| `/oid4vci/issuer/...` | Token and credential traffic of the issuer capability |
| `/oid4vp/verifier/...` | Authorization request and response traffic of the verifier capability |
| `/oid4vc/status-list/{statusListId}` | A Token Status List, `application/statuslist+jwt`, signed with the issuer certificate chain (`x5c`), one bit per status (`0` valid, `1` invalid) |

Wallets follow the URLs the Admin API and the metadata return; nobody constructs these paths by hand.

## Invitations

Methods that start a DIDComm exchange without a connection return an Out-of-Band invitation as `invitation`, and a `shortUrl` under `PUBLIC_API_BASE_URL`. The caller decides where a link lands and encodes the invitation as the `oob` query parameter. A `GET` on the short URL returns the invitation as `application/json` for as long as the exchange is not terminal; unknown short URLs answer `404`. Optional parameters: `useLegacyDid` (advertise the `did:web` form of a `did:webvh` agent) and `didcommVersion` (`v1` or `v2`, default `v2`).

## Health

Liveness and readiness are Admin API methods served without authentication in both auth modes: `GET /v2/agent/health/live` answers `200` as soon as the HTTP listener is up; `GET /v2/agent/health/ready` answers `200` once the bootstrap sequence completed and the agent has caught up with the indexer, `503 NOT_READY` otherwise.

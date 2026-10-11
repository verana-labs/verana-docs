---
title: Environment variables
description: Every environment variable of the VS Agent container, grouped by the decision it answers.
---

# VS Agent environment variables

The agent is configured entirely through environment variables, read once at startup. Startup fails on an invalid value. Source: specification section `VSA-VTI-CFG-ENV`.

## Identity and corporation

| Variable | Required | Meaning |
|---|---|---|
| `VERANA_CORPORATION_ID` | yes | Id of the corporation the agent acts for. The agent is one of its VS operators. |
| `VERANA_ACCOUNT_MNEMONIC` | yes | BIP-39 mnemonic of the agent's own account on the network. This account signs the transactions the corporation has authorized it for. Keep it secret. |

## Network

| Variable | Required | Meaning |
|---|---|---|
| `VERANA_RPC_ENDPOINT_URL` | yes | RPC of a Verana node, for example `https://rpc.testnet.verana.network`. Used to broadcast transactions. |
| `VERANA_INDEXER_BASE_URL` | yes | Indexer API, for example `https://idx.testnet.verana.network`. The agent reads all chain state from the indexer, never from the node. |
| `VERANA_CHAIN_ID` | no | Chain id, for example `vna-testnet-1`. |
| `VERANA_INDEXER_SUBSCRIPTION_SCOPE` | no | `did` (default) subscribes to events about the agent's DID only; `corporation` subscribes to every event of the corporation. |
| `VERANA_INDEXER_DEFAULT_HANDLERS_OVERRIDE` | no | Comma-separated indexer event types whose built-in reaction is disabled, or `*`. The backend still receives them as `vpr.notification` events and reacts itself. |
| `VERANA_GAS_ADJUSTMENT` | no | Multiplier applied to simulated gas. Default `1.5`. Raise it on `out of gas` after a successful simulation. |

## Agent mode

| Variable | Required | Meaning |
|---|---|---|
| `AGENT_MODE` | no | `standalone` (default): the agent obtains its own ECS Organization or Persona credential and issues its own Service credential. `delegated`: a parent Verifiable Service issues this agent's Service credential and carries the Organization or Persona credential. |
| `AGENT_DELEGATED_PARENT_VS_DID` | when delegated | DID of the parent Verifiable Service. |
| `TRUSTED_ECS_ECOSYSTEM_DIDS` | when standalone | Comma-separated DIDs of the ECS ecosystems the agent trusts for essential schemas. |

## ECS credential claims

The claims the agent proposes for its own ECS credentials. The `id` claim and every `*DigestSri` claim are derived by the agent: it fetches each paired URI and computes the digest. A URI that cannot be fetched stops the flow with an error naming the variable.

| Variable | Claim | When read |
|---|---|---|
| `ECS_CLAIMS_ORG_NAME`, `ECS_CLAIMS_ORG_LOGO_URI`, `ECS_CLAIMS_ORG_REGISTRY_ID`, `ECS_CLAIMS_ORG_REGISTRY_URI`, `ECS_CLAIMS_ORG_ADDRESS`, `ECS_CLAIMS_ORG_COUNTRY_CODE`, `ECS_CLAIMS_ORG_LEGAL_JURISDICTION`, `ECS_CLAIMS_ORG_ORGANIZATION_KIND`, `ECS_CLAIMS_ORG_LEI` | ECS Organization `name`, `logoUri`, `registryId`, `registryUri`, `address`, `countryCode`, `legalJurisdiction`, `organizationKind`, `lei` | Standalone mode, and self-issuance |
| `ECS_CLAIMS_PERSONA_NAME`, `ECS_CLAIMS_PERSONA_DESCRIPTION`, `ECS_CLAIMS_PERSONA_DESCRIPTION_FORMAT`, `ECS_CLAIMS_PERSONA_AVATAR_URI`, `ECS_CLAIMS_PERSONA_CONTROLLER_COUNTRY_CODE`, `ECS_CLAIMS_PERSONA_CONTROLLER_JURISDICTION` | ECS Persona `name`, `description`, `descriptionFormat`, `avatarUri`, `controllerCountryCode`, `controllerJurisdiction` | Standalone mode, and self-issuance |
| `ECS_CLAIMS_SERVICE_NAME`, `ECS_CLAIMS_SERVICE_TYPE`, `ECS_CLAIMS_SERVICE_DESCRIPTION`, `ECS_CLAIMS_SERVICE_LOGO_URI`, `ECS_CLAIMS_SERVICE_MINIMUM_AGE_REQUIRED`, `ECS_CLAIMS_SERVICE_TERMS_AND_CONDITIONS_URI`, `ECS_CLAIMS_SERVICE_PRIVACY_POLICY_URI` | ECS Service `name`, `type`, `description`, `logoUri`, `minimumAgeRequired`, `termsAndConditionsUri`, `privacyPolicyUri`. All required in standalone mode. | Standalone mode |
| `ECS_CLAIMS_SERVICE_DESCRIPTION_FORMAT` | ECS Service `descriptionFormat` (`text/plain` or `text/markdown`) | Optional |

The agent can serve placeholder resources for a logo, terms and privacy policy at `/vt/default/logo.svg`, `/vt/default/terms.html` and `/vt/default/privacy.html`, so a first deployment can point the URI variables at itself.

## Runtime

| Variable | Required | Meaning |
|---|---|---|
| `PUBLIC_API_BASE_URL` | yes | Public `https://` base URL where peers reach the agent. The DID is derived from it, so it must not change after first start. A base path is allowed; credentials in the URL are rejected. |
| `PUBLIC_API_PORT` | no | Port of the public listener inside the container. Default `3001`. |
| `AGENT_PUBLIC_DID_METHOD` | no | `webvh` (default) or `web`. Chosen once, at first start. |
| `MRTD_MASTER_LIST_CSCA_LOCATION` | no | Path or `https://` URL of the CSCA master list for the MRTD module (passport reading). |

## Administration API

| Variable | Required | Meaning |
|---|---|---|
| `ADMIN_API_PORT` | no | Port of the admin listener. Default `3000`. Must differ from the public port. |
| `ADMIN_API_AUTH_MODE` | no | `internal` (default): only trusted networks may call. `corporation`: external callers authenticate with an account signature. |
| `ADMIN_API_TRUSTED_NETWORKS` | no | CIDR blocks served without authentication. Default `127.0.0.0/8,::1/128`. Keep the address of any public ingress out of this list. |
| `ADMIN_API_PUBLIC_URL` | when corporation mode | Public origin of the Admin API. Also published in the DID Document as a `VsAgentAdminAPI` service entry. |
| `ADMIN_API_CORPORATION_ALLOWED_ACCOUNTS` | when corporation mode | Account addresses allowed to call from outside. This allowlist is the whole authorization model for external callers. |

## Events

| Variable | Required | Meaning |
|---|---|---|
| `EVENTS_WEBHOOK_URL` | no | Webhook that receives every event by HTTP `POST`. Unset means no events. See [Events](./events.md). |
| `EVENTS_WEBHOOK_API_KEY` | no | Sent as `Authorization: Bearer` on every delivery. |

## OpenID4VC

| Variable | Required | Meaning |
|---|---|---|
| `OID4VC_CONFIG_FILE_LOCATION` | no | Path or `https://` URL of the OpenID4VC configuration file. Setting it enables both the issuer and the verifier capability and their public endpoints; unset means no OpenID4VC. |

The file is JSON and every key is optional, so `{}` is valid. It holds what the agent cannot derive: the signing mode of each capability and the X.509 roots of wallet and key attestations.

```json
{
  "issuer": {
    "signing": { "configured": { "certificateChain": ["..."], "privateJwk": { } } },
    "walletAttestationCertificates": [],
    "keyAttestationCertificates": []
  },
  "verifier": {
    "signing": { }
  }
}
```

With `signing` absent, the agent generates a self-signed P-256 certificate per capability and publishes its key in the DID Document. That is development signing, not for production. With `signing.configured`, the operator supplies the certificate chain (leaf first, carrying the agent DID as a URI SAN) and the private key, and publishes the key in the DID Document before startup.

## Logging

| Variable | Default | Values |
|---|---|---|
| `AGENT_LOG_LEVEL` | `warn` | `trace`, `debug`, `info`, `warn`, `error`, `off` |
| `ADMIN_API_LOG_LEVEL` | `info` | same |

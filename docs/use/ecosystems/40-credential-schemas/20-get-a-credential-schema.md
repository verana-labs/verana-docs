# Get a Credential Schema

`MOD-CS-QRY-2`

Get a single credential schema by its numeric ID.

## Query Parameters

| Name | Description                          | Mandatory |
|------|--------------------------------------|-----------|
| `id` | ID of the credential schema to get   | yes       |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query cs get-schema [id] --node $NODE_RPC --output json
```

### Example

```bash
NODE_RPC=https://rpc.testnet.verana.network
SCHEMA_ID=3
veranad query cs get-schema $SCHEMA_ID --node $NODE_RPC --output json
```

### Example response

```json
{
  "schema": {
    "id": "3",
    "created": "2025-10-06T07:14:58.914878265Z",
    "modified": "2025-10-20T12:15:27.945453876Z",
    "json_schema": "{\n  \"$id\": \"vpr:verana:vna-testnet-1/cs/v1/js/3\",\n  \"$schema\": \"https://json-schema.org/draft/2020-12/schema\",\n  ... \n}",
    "issuer_grantor_validation_validity_period": 1,
    "verifier_grantor_validation_validity_period": 1,
    "issuer_validation_validity_period": 1,
    "verifier_validation_validity_period": 1,
    "holder_validation_validity_period": 1,
    "issuer_onboarding_mode": "ISSUER_ONBOARDING_MODE_OPEN",
    "verifier_onboarding_mode": "VERIFIER_ONBOARDING_MODE_OPEN"
  }
}
```

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/cs/v1/get/3" -H "accept: application/json"
```

[Read the Swagger documentation here](https://api.testnet.verana.network/#/)

  </TabItem>
  <TabItem value="frontend" label="Frontend">

Browse and inspect credential schemas on the [Verana Testnet frontend](https://app.testnet.verana.network).

  </TabItem>
</Tabs>

## Response fields

The response is a single `CredentialSchema` object. Proto3 JSON omits any field left at its default value.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uint64 | Schema ID |
| `created` | timestamp | Creation time |
| `modified` | timestamp | Last modification time |
| `archived` | timestamp | Set when the schema is archived; absent otherwise |
| `json_schema` | string | The JSON schema document (with `VPR_*` placeholders resolved) |
| `issuer_grantor_validation_validity_period` | uint32 | Days an issuer-grantor validation stays valid |
| `verifier_grantor_validation_validity_period` | uint32 | Days a verifier-grantor validation stays valid |
| `issuer_validation_validity_period` | uint32 | Days an issuer validation stays valid |
| `verifier_validation_validity_period` | uint32 | Days a verifier validation stays valid |
| `holder_validation_validity_period` | uint32 | Days a holder validation stays valid |
| `issuer_onboarding_mode` | enum | `ISSUER_ONBOARDING_MODE_OPEN` \| `..._ECOSYSTEM_VALIDATION_PROCESS` \| `..._GRANTOR_VALIDATION_PROCESS` |
| `verifier_onboarding_mode` | enum | `VERIFIER_ONBOARDING_MODE_OPEN` \| `..._ECOSYSTEM_VALIDATION_PROCESS` \| `..._GRANTOR_VALIDATION_PROCESS` |
| `holder_onboarding_mode` | enum | `HOLDER_ONBOARDING_MODE_ISSUER_VALIDATION_PROCESS` \| `..._PERMISSIONLESS` |
| `pricing_asset_type` | enum | `TU` \| `COIN` \| `FIAT` |
| `pricing_asset` | string | `tu`, a denom, or an ISO-4217 code |
| `digest_algorithm` | string | `sha256`, `sha384`, or `sha512` |
| `ecosystem_id` | uint64 | ID of the Ecosystem that owns the schema |

:::info
The example above is captured from the public testnet, whose node predates the v4 `ecosystem_id`, `pricing_asset_type`, `pricing_asset`, `digest_algorithm`, and `holder_onboarding_mode` fields — a v4 node returns these additional fields when they are set. The field table above is the authoritative v4 structure.
:::

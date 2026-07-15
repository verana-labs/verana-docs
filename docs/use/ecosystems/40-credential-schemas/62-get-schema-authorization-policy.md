# Get a Schema Authorization Policy

`MOD-CS-QRY-5`

Get a single Schema Authorization Policy (SAP) by its numeric ID.

## Query Parameters

| Name | Description                                   | Mandatory |
|------|-----------------------------------------------|-----------|
| `id` | ID of the schema authorization policy to get  | yes       |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query cs get-sap [id] --node $NODE_RPC --output json
```

### Example

```bash
veranad query cs get-sap 1 --node $NODE_RPC --output json
```

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/cs/v1/sap/get/1" -H "accept: application/json"
```

  </TabItem>
</Tabs>

## Response schema

No SAP has been created on the public networks yet, so no live output is available. The response is `QueryGetSchemaAuthorizationPolicyResponse`, wrapping a single `SchemaAuthorizationPolicy`:

| Field | Type | Description |
|-------|------|-------------|
| `id` | uint64 | Policy ID |
| `schema_id` | uint64 | Credential schema the policy is attached to |
| `role` | enum | `SCHEMA_AUTHORIZATION_POLICY_ROLE_ISSUER` \| `SCHEMA_AUTHORIZATION_POLICY_ROLE_VERIFIER` |
| `url` | string | URL of the policy document |
| `digest_sri` | string | SRI digest of the policy document |
| `effective_from` | timestamp | When the version became active; `null` while pending |
| `effective_until` | timestamp | When the version stopped being active; `null` while current |
| `revoked` | bool | Whether the version has been revoked |
| `created` | timestamp | Creation time |
| `version` | uint32 | Version number of the policy |

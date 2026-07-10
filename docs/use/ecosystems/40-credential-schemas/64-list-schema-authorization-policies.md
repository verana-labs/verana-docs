# List Schema Authorization Policies

`MOD-CS-QRY-6`

List all Schema Authorization Policy (SAP) versions for a `(schema-id, role)` pair, ordered by ascending version.

## Query Parameters

| Name        | Description                                       | Mandatory |
|-------------|---------------------------------------------------|-----------|
| `schema-id` | ID of the credential schema                       | yes       |
| `role`      | Role to list: `1` = ISSUER, `2` = VERIFIER        | yes       |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query cs list-sap [schema-id] [role] --node $NODE_RPC --output json
```

### Example

List all issuer policies for schema `1`:

```bash
veranad query cs list-sap 1 1 --node $NODE_RPC --output json
```

List all verifier policies for schema `1`:

```bash
veranad query cs list-sap 1 2 --node $NODE_RPC --output json
```

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/cs/v1/sap/list?schema_id=1&role=1" -H "accept: application/json"
```

  </TabItem>
</Tabs>

## Response schema

No SAP has been created on the public networks yet, so no live output is available. The response is `QueryListSchemaAuthorizationPoliciesResponse`, a `policies` array of `SchemaAuthorizationPolicy` objects (ordered by ascending `version`). Each object has the fields documented in [Get a Schema Authorization Policy](./get-schema-authorization-policy#response-schema):

```json
{
  "policies": [
    {
      "id": "...",
      "schema_id": "1",
      "role": "SCHEMA_AUTHORIZATION_POLICY_ROLE_ISSUER",
      "url": "...",
      "digest_sri": "...",
      "effective_from": "...",
      "effective_until": null,
      "revoked": false,
      "created": "...",
      "version": 1
    }
  ]
}
```

# Render JSON Schema

`MOD-CS-QRY-3`

Render the JSON schema definition for a credential schema, with the template placeholders (`VPR_CREDENTIAL_SCHEMA_ID`, `VPR_CHAIN_ID`) resolved to their actual values.

:::info
Over REST the response is served with content type **`application/schema+json`** — the raw JSON Schema document — rather than a wrapped JSON envelope. This lets tooling consume the schema directly by its `vpr:` `$id` URL.
:::

## Query Parameters

| Name | Description                              | Mandatory |
|------|------------------------------------------|-----------|
| `id` | ID of the credential schema to render    | yes       |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query cs render-json-schema [id] --node $NODE_RPC --output json
```

### Example

```bash
SCHEMA_ID=3
veranad query cs render-json-schema $SCHEMA_ID --node $NODE_RPC --output json
```

### Example response

```json
{
  "schema": "{\n  \"$id\": \"vpr:verana:vna-testnet-1/cs/v1/js/3\",\n  \"$schema\": \"https://json-schema.org/draft/2020-12/schema\",\n  \"additionalProperties\": false,\n  \"description\": \"ExampleCredential using JsonSchema\",\n  \"properties\": {\n    \"email\": {\n      \"format\": \"email\",\n      \"type\": \"string\"\n    },\n    \"name\": {\n      \"type\": \"string\"\n    }\n  },\n  \"required\": [\n    \"name\"\n  ],\n  \"title\": \"ExampleCredential\",\n  \"type\": \"object\"\n}"
}
```

The `schema` string is the resolved JSON Schema document; note the `$id` has been rewritten from the `vpr:verana:VPR_CHAIN_ID/cs/v1/js/VPR_CREDENTIAL_SCHEMA_ID` template to the concrete `vpr:verana:vna-testnet-1/cs/v1/js/3`.

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/cs/v1/js/3" -H "accept: application/schema+json"
```

[Read the Swagger documentation here](https://api.testnet.verana.network/#/)

  </TabItem>
</Tabs>

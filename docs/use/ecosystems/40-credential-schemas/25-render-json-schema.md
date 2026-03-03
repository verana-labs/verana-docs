# Render JSON Schema

`MOD-CS-QRY-3`

Render the full JSON schema definition for a credential schema. The response contains the schema with all template variables (`VPR_CREDENTIAL_SCHEMA_ID`, `VPR_CHAIN_ID`) replaced with actual values.

## Query Parameters

| Name | Description                                      | Mandatory |
|------|--------------------------------------------------|-----------|
| id   | ID of the credential schema to render            | yes       |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q cs render-json-schema [id] --node $NODE_RPC --output json
```

### Example

```bash
SCHEMA_ID=1
veranad q cs render-json-schema $SCHEMA_ID --node $NODE_RPC --output json
```

  </TabItem>
  <TabItem value="api" label="API">

Example:
```bash
curl -X GET "https://api.testnet.verana.network/verana/cs/v1/js/1" -H "accept: application/json"
```

[Read the Swagger documentation here](https://api.testnet.verana.network/#/)

  </TabItem>
</Tabs>

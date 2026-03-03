# Get a Credential Schema

`MOD-CS-QRY-2`

Query method for getting a credential schema by ID.

## Query Parameters

| Name | Description                          | Mandatory |
|------|--------------------------------------|-----------|
| id   | ID of the credential schema to get   | yes       |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q cs get-schema [id] --node $NODE_RPC --output json
```

### Example

```bash
NODE_RPC=https://rpc.testnet.verana.network
SCHEMA_ID=1
veranad q cs get-schema $SCHEMA_ID --node $NODE_RPC --output json
```

  </TabItem>
  <TabItem value="api" label="API">

Example:
```bash
curl -X GET "https://api.testnet.verana.network/verana/cs/v1/get/1" -H  "accept: application/json"
```

[Read the Swagger documentation here](https://api.testnet.verana.network/#/)

  </TabItem>
  <TabItem value="frontend" label="Frontend">

You can browse and inspect credential schemas on the [Verana Testnet frontend](https://app.testnet.verana.network).

  </TabItem>
</Tabs>

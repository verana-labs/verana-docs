# Get a Credential Schema

Simple query method for getting a credential schema.

## Query Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| id    | id of the credential schema to get  | yes |

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
NODE_RPC=http://node1.testnet.verana.network:26657
SCHEMA_ID=1
veranad query cs get-schema $SCHEMA_ID --node $NODE_RPC --output json
```

  </TabItem>
  <TabItem value="api" label="API">

[Try the query here](https://api.testnet.verana.network/#/)

  </TabItem>
  <TabItem value="frontend" label="Frontend">

You can browse and inspect credential schemas on the [Verana Testnet frontend](https://testnet.verana.network).

  </TabItem>
</Tabs>

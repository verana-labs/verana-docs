# Module Parameters

`MOD-TR-QRY-3`

Query the current parameters of the Trust Registry module.

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q tr params --node $NODE_RPC --output json
```

### Example

```bash
veranad q tr params --node $NODE_RPC --output json
```

### Example Response

```json
{
  "params": {
    "trust_unit_price": "1000000"
  }
}
```

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/tr/v1/params" -H "accept: application/json"
```

  </TabItem>
</Tabs>

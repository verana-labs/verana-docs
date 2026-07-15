# Module Parameters

`MOD-ES-QRY-3`

Query the current parameters of the Ecosystem (`ec`) module.

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query ec params --node $NODE_RPC --output json
```

### Example response

```json
{
  "params": {
    "trust_unit_price": "1000000"
  }
}
```

`trust_unit_price` is the price (in `uvna`) of one Trust Unit, used to resolve deposit and fee amounts.

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/ec/v1/params" -H "accept: application/json"
```

  </TabItem>
</Tabs>

:::info Governance-only updates
Ecosystem module parameters can only be changed through a governance proposal (`MOD-ES-MSG-4`, the `update-params` message). A normal key cannot sign it.
:::

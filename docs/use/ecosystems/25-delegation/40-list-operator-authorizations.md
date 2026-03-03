# List Operator Authorizations

`MOD-DE-QRY-1`

Query existing operator authorizations. You can filter by authority, operator, or both.

## Query Parameters

| Name             | Description                                                     | Mandatory |
|------------------|-----------------------------------------------------------------|-----------|
| authority        | Filter by authority (group account) address                     | no        |
| operator         | Filter by operator account address                              | no        |
| limit             | Max items to return (default: 64, range: 1-1024)              | no        |

:::tip
At least one of `authority` or `operator` should be specified for meaningful results.
:::

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q de list-operator-authorizations \
  [--authority <address>] \
  [--operator <address>] \
  [--limit <n>] \
  --node $NODE_RPC --output json
```

### Example: List all authorizations for an authority

```bash
veranad q de list-operator-authorizations \
  --authority $AUTHORITY_ACC \
  --node $NODE_RPC --output json
```

### Example: List all authorizations for a specific operator

```bash
veranad q de list-operator-authorizations \
  --operator $OPERATOR_ACC \
  --node $NODE_RPC --output json
```

### Example: Check authorization between specific authority and operator

```bash
veranad q de list-operator-authorizations \
  --authority $AUTHORITY_ACC \
  --operator $OPERATOR_ACC \
  --node $NODE_RPC --output json
```

### Example Response

```json
{
  "operator_authorizations": [
    {
      "authority": "verana1abc...",
      "operator": "verana1xyz...",
      "msg_types": [
        "/verana.tr.v1.MsgCreateTrustRegistry",
        "/verana.tr.v1.MsgUpdateTrustRegistry"
      ],
      "spend_limit": [
        {
          "denom": "uvna",
          "amount": "1000000"
        }
      ],
      "fee_spend_limit": [],
      "expiration": "2026-12-31T23:59:59Z",
      "period": null
    }
  ]
}
```

  </TabItem>

  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/de/v1/authz/list?authority=verana1abc..." \
  -H "accept: application/json" | jq
```

[Find the API doc here](https://api.testnet.verana.network/#/)

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

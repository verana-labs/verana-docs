import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List Credential Schemas

Use this query to list existing credential schemas.

## Query Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| tr_id        | filter by trust registry id | no |
| modified_after    | only credential schemas modified after this RFC3339 timestamp | no |
| response-max-size    | max items to return  | no |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>
Example:
```bash
veranad q cs list-schemas --node $NODE_RPC  --output json
```

Examples with parameters
```bash
veranad q cs list-schemas --tr_id 5 --modified_after "2025-08-01T16:42:59Z" --node $NODE_RPC  --output json
```
```bash
veranad q cs list-schemas --tr_id 5 --response_max_size 10 --node $NODE_RPC --output json
```

Use the output to identify each schema `id` and its `tr-id`.
  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/cs/v1/list?tr-id=1&response-max-size=10" -H  "accept: application/json" | jq
 ```

[Find the API doc here](https://api.testnet.verana.network/#/)


  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::todo
    TODO: describe here
    :::
  </TabItem>
</Tabs>

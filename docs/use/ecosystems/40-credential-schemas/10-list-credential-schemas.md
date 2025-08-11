# List Credential Schemas

Use this query to list existing credential schemas.

## Query Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| tr_id        | filter by trust registry id | no |
| modified_after    | show only trust registries modified after this date | no |
| response_max_size    | max items to return  | no |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

```bash
veranad q cs list-schemas --node $NODE_RPC  --output json
```

  </TabItem>
  <TabItem value="api" label="API">

[Try the query here](https://api.testnet.verana.network/#/)


  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::todo
    TODO: describe here
    :::
  </TabItem>
</Tabs>

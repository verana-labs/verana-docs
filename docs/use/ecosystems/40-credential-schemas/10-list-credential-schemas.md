import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List Credential Schemas

`MOD-CS-QRY-1`

Use this query to list existing credential schemas.

## Query Parameters

| Name                      | Description                                                        | Mandatory |
|---------------------------|--------------------------------------------------------------------|-----------|
| tr_id                     | Filter by trust registry ID                                        | no        |
| modified_after            | Only credential schemas modified after this RFC 3339 timestamp     | no        |
| response_max_size         | Max items to return                                                | no        |
| only-active               | Show only non-archived schemas                                     | no        |
| issuer-perm-management-mode  | Filter by issuer permission management mode (`OPEN`, `GRANTOR_VALIDATION`, `ECOSYSTEM`) | no |
| verifier-perm-management-mode | Filter by verifier permission management mode                    | no        |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>
Example:
```bash
veranad q cs list-schemas --node $NODE_RPC  --output json
```

Examples with parameters:
```bash
veranad q cs list-schemas --tr_id 5 --modified_after "2025-08-01T16:42:59Z" --node $NODE_RPC  --output json
```
```bash
veranad q cs list-schemas --tr_id 5 --response_max_size 10 --only-active=true --node $NODE_RPC --output json
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
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

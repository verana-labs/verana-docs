# Update a Trust Registry

Post a message that will modify the ledger state by updating a trust registry.

:::tip
Only the account that is the controller of the trust registry can execute this method.
:::

## Message Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| id    |  id of the trust registry to update  | yes |
| did    |  Decentralized Identifier (DID) - must follow DID specification  | yes |
| aka    | Also Known As URL.  | no |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
  veranad tx tr update-trust-registry [id] [did] [flags] --node $NODE_RPC
```

### Example

```bash
veranad tx tr update-trust-registry ${TRUST_REG_ID} did:example:newdidmat --aka https://new-aka-example.com --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

  </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

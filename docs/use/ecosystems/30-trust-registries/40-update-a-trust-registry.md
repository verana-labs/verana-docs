# Update a Trust Registry

`MOD-TR-MSG-4`

Post a message that will modify the ledger state by updating a trust registry. This operation is **delegable**.

:::tip
Only the authority (group account) that controls the trust registry can execute this method. The operator must be authorized by the authority.
:::

## Message Parameters

| Name      | Description                                                   | Mandatory |
|-----------|---------------------------------------------------------------|-----------|
| authority | Group account that controls the trust registry                | yes       |
| id        | ID of the trust registry to update                            | yes       |
| did       | Decentralized Identifier (DID) — must follow DID-CORE syntax | yes       |
| aka       | Also Known As URI (set to empty to clear)                     | no        |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx tr update-trust-registry [authority] [id] [did] \
  [--aka <aka>] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --node $NODE_RPC
```

### Example

```bash
veranad tx tr update-trust-registry $AUTHORITY_ACC ${TRUST_REG_ID} did:example:newdidvalue \
  --aka https://new-aka-example.com \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

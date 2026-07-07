# Update a Trust Registry

`MOD-TR-MSG-4`

Post a message that will modify the ledger state by updating a trust registry. This operation is **delegable**.

:::warning Prerequisites
1. **Group account (authority)** — You need a [Cosmos SDK group account](https://docs.cosmos.network/v0.50/build/modules/group) that controls the trust registry.
2. **Operator authorization** — Your operator account must be granted authorization for `MsgUpdateTrustRegistry` by the authority. See [Grant Operator Authorization](../delegation/grant-operator-authorization).
3. **Existing trust registry** — The trust registry you want to update must already exist and be controlled by your authority.
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

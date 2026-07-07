# Archive or Unarchive a Trust Registry

`MOD-TR-MSG-5`

You can archive or unarchive a trust registry with the following command. This operation is **delegable**.

:::warning Prerequisites
1. **Group account (authority)** — You need a [Cosmos SDK group account](https://docs.cosmos.network/v0.50/build/modules/group) that controls the trust registry.
2. **Operator authorization** — Your operator account must be granted authorization for `MsgArchiveTrustRegistry` by the authority. See [Grant Operator Authorization](../delegation/grant-operator-authorization).
3. **Existing trust registry** — The trust registry must already exist and be controlled by your authority.
:::

## Message Parameters

| Name              | Description                                        | Mandatory |
|-------------------|----------------------------------------------------|-----------|
| authority         | Group account that controls the trust registry     | yes       |
| trust-registry-id | ID of the trust registry to archive or unarchive  | yes       |
| archive           | `true` to archive, `false` to unarchive            | yes       |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx tr archive-trust-registry [authority] [trust-registry-id] [archive] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --node $NODE_RPC
```

**Note:** The following examples assume you have set `TRUST_REG_ID` and `AUTHORITY_ACC` environment variables.

### Archive a Trust Registry

```bash
veranad tx tr archive-trust-registry $AUTHORITY_ACC ${TRUST_REG_ID} true \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Unarchive a Trust Registry

```bash
veranad tx tr archive-trust-registry $AUTHORITY_ACC ${TRUST_REG_ID} false \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```
 </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

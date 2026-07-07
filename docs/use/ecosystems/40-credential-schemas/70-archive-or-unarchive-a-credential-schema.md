# Archive or Unarchive a Credential Schema

`MOD-CS-MSG-3`

You can archive or unarchive a credential schema with the following command. This operation is **delegable**.

:::warning Prerequisites
1. **Group account (authority)** — You need a [Cosmos SDK group account](https://docs.cosmos.network/v0.50/build/modules/group) that controls the trust registry owning this schema.
2. **Operator authorization** — Your operator account must be granted authorization for `MsgArchiveCredentialSchema` by the authority. See [Grant Operator Authorization](../delegation/grant-operator-authorization).
3. **Existing schema** — The credential schema must already exist and be controlled by your authority.
:::

## Message Parameters

| Name    | Description                                                 | Mandatory |
|---------|-------------------------------------------------------------|-----------|
| id      | ID of the credential schema to archive or unarchive         | yes       |
| archive | `true` to archive, `false` to unarchive                     | yes       |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx cs archive [id] [archive] \
  --authority <authority> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --node $NODE_RPC
```

:::info
The `--authority` flag specifies the group account that controls the trust registry owning this schema. The `--from` flag specifies the **operator** (transaction signer) who must be authorized by the authority.
:::

### Archive a Credential Schema

```bash
SCHEMA_ID=10
veranad tx cs archive ${SCHEMA_ID} true \
  --authority $AUTHORITY_ACC \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Unarchive a Credential Schema

```bash
SCHEMA_ID=10
veranad tx cs archive ${SCHEMA_ID} false \
  --authority $AUTHORITY_ACC \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```
 </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

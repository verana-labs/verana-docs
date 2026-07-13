# Archive or Unarchive an Ecosystem

`MOD-ES-MSG-3`

Archive or unarchive an [Ecosystem](../../../learn/verifiable-public-registry/ecosystems) by toggling its `archived` flag.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) that controls the ecosystem — see [Create a Corporation](../../corporation/create-a-corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.ec.v1.MsgArchiveEcosystem` via [Grant Operator Authorization](../../corporation/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` as the `[corporation]` argument.
:::

## Message Parameters

| Name          | Description                                                     | Mandatory |
|---------------|-----------------------------------------------------------------|-----------|
| `corporation` | `policy_address` of the Corporation that controls the ecosystem | yes       |
| `id`          | ID of the ecosystem to archive or unarchive                     | yes       |
| `archive`     | `true` to archive, `false` to unarchive                         | yes       |

:::info
The message aborts if the ecosystem is already in the requested state (`MOD-ES-MSG-3-2-1`): archiving an already-archived ecosystem, or unarchiving one that is not archived, both fail.
:::

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx ec archive-ecosystem [corporation] [id] [archive] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Archive an ecosystem

```bash
veranad tx ec archive-ecosystem $CORPORATION 1 true \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

Example response:

```yaml
code: 0
events:
- type: message
  attributes:
  - key: action
    value: /verana.ec.v1.MsgArchiveEcosystem
  - key: module
    value: ec
- type: archive_ecosystem
  attributes:
  - key: ecosystem_id
    value: "1"
  - key: corporation_id
    value: "2"
  - key: archive_status
    value: archived
gas_used: "62706"
txhash: 009559CF9A84F2FF1E103F79A1659110301A2E169FB9DC1CFC2AF4FD8AD71435
```

### Unarchive an ecosystem

```bash
veranad tx ec archive-ecosystem $CORPORATION 1 false \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

The `archive_ecosystem` event then reports `archive_status: unarchived`.

Attempting to re-apply the current state is rejected:

```
ecosystem 1 archived=true: ecosystem already in target archive state
```

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

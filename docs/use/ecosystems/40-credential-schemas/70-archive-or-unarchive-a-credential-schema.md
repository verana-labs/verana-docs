# Archive or Unarchive a Credential Schema

`MOD-CS-MSG-3`

Archive or unarchive a credential schema. This operation is **delegable**.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) that controls the Ecosystem owning this schema — see [Create a Corporation](../../corporation/create-a-corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.cs.v1.MsgArchiveCredentialSchema` via [Grant Operator Authorization](../../corporation/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` with the `--corporation` flag.
:::

## Message Parameters

| Name      | Description                                          | Mandatory |
|-----------|------------------------------------------------------|-----------|
| `id`      | ID of the credential schema to archive or unarchive  | yes       |
| `archive` | `true` to archive, `false` to unarchive              | yes       |

## Required Environment Variables

```bash
CORPORATION=verana1f6fyc0ptxh7padqr3hnrw6sm8wjfr93w6cgv39jwm00nd6kh08esdak22l
OPERATOR=verana1qrdyvgf74jpu5kxufg0gczz5rfv0ws646t3kw4
SCHEMA_ID=1
CHAIN_ID=vna-testnet-1
NODE_RPC=https://rpc.testnet.verana.network
```

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx cs archive [id] [archive] \
  --corporation <policy_address> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Archive a Credential Schema

```bash
veranad tx cs archive $SCHEMA_ID true \
  --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Unarchive a Credential Schema

```bash
veranad tx cs archive $SCHEMA_ID false \
  --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example response

The transaction emits an `archive_credential_schema` event; its `archive_status` attribute is `archived` or `unarchived`:

```yaml
code: 0
events:
- type: message
  attributes:
  - key: action
    value: /verana.cs.v1.MsgArchiveCredentialSchema
  - key: module
    value: cs
- type: archive_credential_schema
  attributes:
  - key: credential_schema_id
    value: "1"
  - key: ecosystem_id
    value: "3"
  - key: corporation
    value: verana1f6fyc0ptxh7padqr3hnrw6sm8wjfr93w6cgv39jwm00nd6kh08esdak22l
  - key: operator
    value: verana1qrdyvgf74jpu5kxufg0gczz5rfv0ws646t3kw4
  - key: archive_status
    value: archived
gas_used: "94438"
txhash: AAE9F0742D26F17E35A63ADA93C9F0C5C979B40DE1972E72B2359D75C6888B23
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

## Notes

- Unarchiving a schema that is not archived is rejected — the schema must be in the archived state to be unarchived (`MOD-CS-MSG-3-3`).
- Only an operator authorized by the Corporation that controls the ecosystem owning the schema can archive or unarchive it.

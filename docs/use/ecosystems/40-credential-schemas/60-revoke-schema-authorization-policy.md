# Revoke a Schema Authorization Policy

`MOD-CS-MSG-7`

Revoke a specific Schema Authorization Policy version for a `(schema, role)` pair. The targeted version is marked `revoked`.

This operation is **delegable**.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) that controls the Ecosystem owning the target schema — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.cs.v1.MsgRevokeSchemaAuthorizationPolicy` via [Grant Operator Authorization](../delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` with the `--corporation` flag.
:::

## Message Parameters

The on-chain message is `/verana.cs.v1.MsgRevokeSchemaAuthorizationPolicy`.

| Field / Flag        | Description                                                     | Mandatory |
|---------------------|-----------------------------------------------------------------|-----------|
| `--corporation`     | `policy_address` of the Corporation                             | yes       |
| `--from` (operator) | Signer — operator authorized by the Corporation                | yes       |
| `--schema-id`       | ID of the credential schema                                     | yes       |
| `--role`            | Role of the policy: `issuer` or `verifier`                     | yes       |
| `--version`         | Policy version number to revoke                                 | yes       |

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
veranad tx cs revoke-schema-authorization-policy \
  --schema-id <schema-id> \
  --role <issuer|verifier> \
  --version <version> \
  --corporation <policy_address> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Example

```bash
veranad tx cs revoke-schema-authorization-policy \
  --schema-id $SCHEMA_ID \
  --role issuer \
  --version 1 \
  --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Response schema

No live SAP transaction is captured yet. The RPC returns an empty `MsgRevokeSchemaAuthorizationPolicyResponse`:

```proto
message MsgRevokeSchemaAuthorizationPolicyResponse {}
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

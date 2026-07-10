# Create a Schema Authorization Policy

`MOD-CS-MSG-5`

A **Schema Authorization Policy (SAP)** is a versioned policy document attached to a credential schema for a specific role (issuer or verifier). It references an off-chain document by URL and integrity digest (SRI), and governs who may be onboarded under that role for the schema.

Policies are **versioned**: a new policy is created here in a *pending* state (its `effective_from` / `effective_until` are `null`), and only becomes active when you [increase the active version](./increase-active-schema-authorization-policy-version). This lets an ecosystem stage a new policy before switching to it.

This operation is **delegable**.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) that controls the Ecosystem owning the target schema — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.cs.v1.MsgCreateSchemaAuthorizationPolicy` via [Grant Operator Authorization](../delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` with the `--corporation` flag.
:::

## Message Parameters

The on-chain message is `/verana.cs.v1.MsgCreateSchemaAuthorizationPolicy`.

| Field / Flag        | Description                                                              | Mandatory |
|---------------------|--------------------------------------------------------------------------|-----------|
| `--corporation`     | `policy_address` of the Corporation on whose behalf the policy is created | yes      |
| `--from` (operator) | Signer — operator authorized by the Corporation                          | yes       |
| `--schema-id`       | ID of the credential schema the policy is attached to                    | yes       |
| `--role`            | Role the policy governs: `issuer` or `verifier`                          | yes       |
| `--url`             | URL of the policy document                                               | yes       |
| `--digest-sri`      | Subresource Integrity (SRI) digest of the policy document                | yes       |

:::info
`effective_from` and `effective_until` are **not** set at creation — the new policy version is created inactive (`MOD-CS-MSG-5-3`). Activate it with [Increase Active SAP Version](./increase-active-schema-authorization-policy-version).
:::

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
veranad tx cs create-schema-authorization-policy \
  --schema-id <schema-id> \
  --role <issuer|verifier> \
  --url <policy-document-url> \
  --digest-sri <sri-digest> \
  --corporation <policy_address> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Example

```bash
veranad tx cs create-schema-authorization-policy \
  --schema-id $SCHEMA_ID \
  --role issuer \
  --url https://example.com/schemas/1/issuer-policy-v1.json \
  --digest-sri sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 \
  --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Response schema

No live SAP transaction is captured yet. The RPC returns `MsgCreateSchemaAuthorizationPolicyResponse`, whose only field is the new policy `id`:

```proto
message MsgCreateSchemaAuthorizationPolicyResponse {
  uint64 id = 1;  // ID of the created schema authorization policy
}
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

## Next steps

- [Increase the active SAP version](./increase-active-schema-authorization-policy-version) to make this policy effective.
- [Get a SAP](./get-schema-authorization-policy) by its ID, or [list SAPs](./list-schema-authorization-policies) for a `(schema-id, role)` pair.

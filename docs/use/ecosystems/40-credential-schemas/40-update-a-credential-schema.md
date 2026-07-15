import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update a Credential Schema

`MOD-CS-MSG-2`

Update the **validity periods** attached to an existing credential schema. This operation is **delegable**. It does **not** change the JSON Schema itself or the onboarding modes; it only adjusts how long validations remain effective for each role.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) that controls the Ecosystem owning this schema — see [Create a Corporation](../../corporation/create-a-corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.cs.v1.MsgUpdateCredentialSchema` via [Grant Operator Authorization](../../corporation/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` with the `--corporation` flag.
:::

## Message Parameters

| Name                        | Description                                        | Mandatory |
|-----------------------------|----------------------------------------------------|-----------|
| `id`                        | ID of the credential schema to update              | yes       |
| `--issuer-grantor-validation-validity-period`   | Days an issuer-grantor validation remains valid  | no |
| `--verifier-grantor-validation-validity-period` | Days a verifier-grantor validation remains valid | no |
| `--issuer-validation-validity-period`           | Days an issuer validation remains valid          | no |
| `--verifier-validation-validity-period`         | Days a verifier validation remains valid         | no |
| `--holder-validation-validity-period`           | Days a holder validation remains valid           | no |

Each flag takes the wrapped-integer form `'{"value":N}'`. A value of `0` means *never expires*.

## Required Environment Variables

```bash
CORPORATION=verana1f6fyc0ptxh7padqr3hnrw6sm8wjfr93w6cgv39jwm00nd6kh08esdak22l
OPERATOR=verana1qrdyvgf74jpu5kxufg0gczz5rfv0ws646t3kw4
SCHEMA_ID=1
CHAIN_ID=vna-testnet-1
NODE_RPC=https://rpc.testnet.verana.network
```

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx cs update [id] \
  --corporation <policy_address> \
  [--issuer-grantor-validation-validity-period '{"value":N}'] \
  [--verifier-grantor-validation-validity-period '{"value":N}'] \
  [--issuer-validation-validity-period '{"value":N}'] \
  [--verifier-validation-validity-period '{"value":N}'] \
  [--holder-validation-validity-period '{"value":N}'] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

The `--from` flag is the **operator** (transaction signer); `--corporation` is the `policy_address` of the Corporation that controls the ecosystem owning this schema.

### Example

```bash
veranad tx cs update $SCHEMA_ID \
  --corporation $CORPORATION \
  --issuer-grantor-validation-validity-period '{"value":365}' \
  --verifier-grantor-validation-validity-period '{"value":365}' \
  --issuer-validation-validity-period '{"value":180}' \
  --verifier-validation-validity-period '{"value":180}' \
  --holder-validation-validity-period '{"value":90}' \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example response

The transaction emits an `update_credential_schema` event echoing the new validity periods:

```yaml
code: 0
events:
- type: message
  attributes:
  - key: action
    value: /verana.cs.v1.MsgUpdateCredentialSchema
  - key: module
    value: cs
- type: update_credential_schema
  attributes:
  - key: credential_schema_id
    value: "1"
  - key: ecosystem_id
    value: "3"
  - key: corporation
    value: verana1f6fyc0ptxh7padqr3hnrw6sm8wjfr93w6cgv39jwm00nd6kh08esdak22l
  - key: operator
    value: verana1qrdyvgf74jpu5kxufg0gczz5rfv0ws646t3kw4
  - key: issuer_grantor_validation_validity_period
    value: "365"
  - key: verifier_grantor_validation_validity_period
    value: "365"
  - key: issuer_validation_validity_period
    value: "180"
  - key: verifier_validation_validity_period
    value: "180"
  - key: holder_validation_validity_period
    value: "90"
gas_used: "95271"
txhash: 497FB6ED9CA9822444366FB56DE495991E6244E1F7768A1C47A95DEEEC531015
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

## Verify the update

Query the schema and inspect the validity fields:

```bash
veranad query cs get-schema $SCHEMA_ID --node $NODE_RPC --output json | jq
```

## Notes

- Validity values must be within the module parameter limits (see [Module Parameters](./module-params)).
- You cannot change **onboarding modes** with this command; create a new schema if you need different modes.
- Only an operator authorized by the Corporation that controls the ecosystem owning the schema can update it.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update a Credential Schema

`MOD-CS-MSG-2`

Update the **validity periods** attached to an existing credential schema. This operation is **delegable**. This does **not** change the JSON Schema itself or the permission management modes; it only adjusts how long validations remain effective for each role.

:::warning Prerequisites
1. **Group account (authority)** — You need a [Cosmos SDK group account](https://docs.cosmos.network/v0.50/build/modules/group) that controls the trust registry owning this schema.
2. **Operator authorization** — Your operator account must be granted authorization for `MsgUpdateCredentialSchema` by the authority. See [Grant Operator Authorization](../delegation/grant-operator-authorization).
3. **Existing, non-archived schema** — The credential schema must already exist and must not be archived.
:::

## Message Parameters

| Name                           | Description                                                             | Mandatory |
|--------------------------------|-------------------------------------------------------------------------|-----------|
| credential-schema-id           | ID of the credential schema to update                                   | yes       |
| issuer-grantor-validity        | Max days an **Issuer-Grantor** validation remains valid                 | yes       |
| verifier-grantor-validity      | Max days a **Verifier-Grantor** validation remains valid                | yes       |
| issuer-validity                | Days an **Issuer** validation remains valid                             | yes       |
| verifier-validity              | Max days a **Verifier** validation remains valid                        | yes       |
| holder-validity                | Max days a **Holder** validation remains valid                          | yes       |

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx cs update [id] \
  --authority <authority> \
  [--issuer-grantor-validation-validity-period '{"value":N}'] \
  [--verifier-grantor-validation-validity-period '{"value":N}'] \
  [--issuer-validation-validity-period '{"value":N}'] \
  [--verifier-validation-validity-period '{"value":N}'] \
  [--holder-validation-validity-period '{"value":N}'] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

:::info
The `--authority` flag specifies the group account that controls the trust registry owning this schema. The `--from` flag specifies the **operator** (transaction signer) who must be authorized by the authority.
:::

### Copy-pasteable example

Set your environment (adjust values):
```bash
SCHEMA_ID=10
AUTHORITY_ACC=<your-group-policy-address>
USER_ACC="mat-test-acc"
CHAIN_ID="vna-testnet-1"
NODE_RPC=https://rpc.testnet.verana.network
```

Increase Issuer/Verifier periods and keep grantor/holder at 365 days:
```bash
veranad tx cs update $SCHEMA_ID \
  --authority $AUTHORITY_ACC \
  --issuer-grantor-validation-validity-period '{"value":365}' \
  --verifier-grantor-validation-validity-period '{"value":365}' \
  --issuer-validation-validity-period '{"value":280}' \
  --verifier-validation-validity-period '{"value":280}' \
  --holder-validation-validity-period '{"value":365}' \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
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
veranad q cs get-schema $SCHEMA_ID --node $NODE_RPC --output json | jq
```

## Notes
- Validity values must be **positive integers** (days) and within module parameter limits.
- You cannot change **permission management modes** (`OPEN`, `GRANTOR_VALIDATION`, `ECOSYSTEM`) with this command; create a new schema if you need different modes.
- Only the **authority** controlling the trust registry that owns the schema can update it.

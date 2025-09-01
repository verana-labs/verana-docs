import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update a Credential Schema

Update the **validity periods** attached to an existing credential schema. This does **not** change the JSON Schema itself or the permission management modes; it only adjusts how long validations remain effective for each role.

:::tip
Only the account that controls the **trust registry** that owns this credential schema can run this command.
:::

## Message Parameters

| Name                           | Description                                                             | Mandatory |
|--------------------------------|-------------------------------------------------------------------------|-----------|
| credential-schema-id           | ID of the credential schema to update                                   | yes       |
| issuer-grantor-validity        | Max days an **Issuer‑Grantor** validation remains valid                 | yes       |
| verifier-grantor-validity      | Max days a **Verifier‑Grantor** validation remains valid                | yes       |
| issuer-validity                | Days an **Issuer** validation remains valid                             | yes       |
| verifier-validity              | Max days a **Verifier** validation remains valid                        | yes       |
| holder-validity                | Max days a **Holder** validation remains valid                          | yes       |

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx cs update <credential-schema-id> <issuer-grantor-validity> <verifier-grantor-validity> <issuer-validity> <verifier-validity> <holder-validity> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Copy‑pasteable example

Set your environment (adjust values):
```bash
SCHEMA_ID=10
USER_ACC="mat-test-acc"
CHAIN_ID="vna-testnet-1"
NODE_RPC=http://node1.testnet.verana.network:26657
```

Increase Issuer/Verifier periods and keep grantor/holder at 365 days:
```bash
veranad tx cs update $SCHEMA_ID 365 365 280 280 365 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::todo
    When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

## Verify the update

Query the schema and inspect the validity fields:
```bash
veranad query cs get-schema $SCHEMA_ID --node $NODE_RPC --output json | jq
```

## Notes
- Validity values must be **positive integers** (days).
- You cannot change **permission management modes** (`OPEN`, `GRANTOR_VALIDATION`, `ECOSYSTEM`) with this command; create a new schema if you need different modes.
- Only the **controller** of the trust registry that owns the schema can update it.
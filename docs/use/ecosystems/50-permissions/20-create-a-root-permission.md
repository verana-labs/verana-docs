import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create a Root Permission

A Credential Schema always requires at least one **root permission** (type: ECOSYSTEM). After creating a credential schema, the **Trust Registry controller** must create a root permission for that schema.

**Why it matters**
- It anchors the permission hierarchy for the schema (enables Grantors, Issuers, Verifiers).
- It defines default trust fees (validation, issuance, verification) used by the ecosystem.
- Without an active root permission:
  - Candidates cannot run a validation process with the Trust Registry controller.
  - If the schema is in `OPEN` mode, candidates still cannot self-create ISSUER/VERIFIER permissions (a root must exist and act as the validator of last resort).

**Overlaps & rotation**
- Multiple root permissions can co‑exist only if their **effective periods do not overlap**.
- If an existing root permission has no `effective_until`, you must **terminate** it (or set an end date, when available) before creating a new one.

:::tip
Only the account that controls the **Trust Registry** owning the credential schema can execute this method.
:::

## Message Parameters

| Name               | Description                                                                 | Mandatory |
|--------------------|-----------------------------------------------------------------------------|-----------|
| schema-id          | ID of the credential schema                                                 | yes       |
| did                | DID of the **grantee** (the Verifiable Service that will hold the root perm)| yes       |
| validation-fees    | Fee (trust units) charged by the root for each validation process           | yes       |
| issuance-fees      | Fee (trust units) applied to each issuance under this schema                | yes       |
| verification-fees  | Fee (trust units) applied to each verification under this schema            | yes       |

> *Trust fees are priced in the ecosystem’s trust unit; gas/tx fees are paid in chain tokens (e.g., `uvna`).*

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx perm create-root-perm [schema-id] [did] [validation-fees] [issuance-fees] [verification-fees] \
  --from <controller-account> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Copy‑pasteable example

Set your environment first (adjust as needed):
```bash
SCHEMA_ID=10
ROOT_DID=did:example:123456789abcdefghi
USER_ACC="mat-test-acc"
CHAIN_ID="vna-testnet-1"
NODE_RPC=http://node1.testnet.verana.network:26657
```

Create the root permission:
```bash
veranad tx perm create-root-perm $SCHEMA_ID $ROOT_DID 1000000 1000000 1000000 \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

#### What the arguments mean
- `validation-fees` = `1000000` (trust units) → charged when validators run a validation process.
- `issuance-fees`   = `1000000` (trust units) → applied on each issuance session.
- `verification-fees` = `1000000` (trust units) → applied on each verification session.

</TabItem>

  <TabItem value="frontend" label="Frontend">
    :::todo
    When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

## Verify

List permissions and filter for your schema and the ECOSYSTEM root:
```bash
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq '.permissions[] | select(.schema_id == "'$SCHEMA_ID'" and .type == "PERMISSION_TYPE_ECOSYSTEM")'
```

You should see a permission entry with `type: "PERMISSION_TYPE_ECOSYSTEM"`, your `did`, and your `grantee` account.

## See also
- [Create a schema](../credential-schemas/create-a-credential-schema)
- [Self-create a permission (OPEN mode)](./self-create-a-permission)
- [Run a validation process (GRANTOR/ECOSYSTEM modes)](./run-a-validation-process-to-obtain-a-permission)
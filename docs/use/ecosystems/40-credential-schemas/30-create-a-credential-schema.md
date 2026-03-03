# Create a Credential Schema

`MOD-CS-MSG-1`

Make sure you've read [the Learn section](../../../learn/verifiable-public-registry/credential-schema).

Post a message that will create a new credential schema. This operation is **delegable**.

:::warning Prerequisites
Before creating a credential schema, ensure you have completed these steps:

1. **Create a group account** — The authority that controls the trust registry must be a [Cosmos SDK group](https://docs.cosmos.network/v0.50/build/modules/group) with a decision policy.
2. **Grant operator authorization** — Use the [Delegation module](../delegation/grant-operator-authorization) to authorize your operator account to execute CS messages on behalf of the authority (via a group proposal).
3. **Create a trust registry** — You need an existing [trust registry](../trust-registries/create-a-trust-registry) to attach credential schemas to.
:::

## Message Parameters

| Name                       | Description                                                                 | Mandatory |
|----------------------------|-----------------------------------------------------------------------------|-----------|
| trust-registry-id          | Numeric ID of the trust registry                                            | yes       |
| json-schema                | JSON schema (inline string or loaded from file)                             | yes       |
| issuer-perm-mode           | Permission management mode for issuers (integer, see table below)           | yes       |
| verifier-perm-mode         | Permission management mode for verifiers (integer, see table below)         | yes       |
| pricing-asset-type         | Pricing asset type (integer: `1`=TU, `2`=COIN, `3`=FIAT)                   | yes       |
| pricing-asset              | Pricing asset identifier (e.g., `uvna` for COIN, empty for TU)             | yes       |
| digest-algorithm           | Digest algorithm for schema integrity (e.g., `sha256`)                      | yes       |
| issuer-grantor-validity    | Validity period for issuer grantor validation (in days)                     | no        |
| verifier-grantor-validity  | Validity period for verifier grantor validation (in days)                   | no        |
| issuer-validity            | Validity period for issuer validation (in days)                             | no        |
| verifier-validity          | Validity period for verifier validation (in days)                           | no        |
| holder-validity            | Validity period for holder validation (in days)                             | no        |

:::tip
You must specify the JSON schema definition. Refer to the [specification](https://verana-labs.github.io/verifiable-trust-spec/#vt-json-schema-cred-verifiable-trust-json-schema-credential) for required attributes.
:::

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx cs create-credential-schema [tr-id] [json-schema] [issuer-perm-mode] [verifier-perm-mode] [pricing-asset-type] [pricing-asset] [digest-algorithm] \
  --authority <authority> \
  [--issuer-grantor-validation-validity-period '{"value":N}'] \
  [--verifier-grantor-validation-validity-period '{"value":N}'] \
  [--issuer-validation-validity-period '{"value":N}'] \
  [--verifier-validation-validity-period '{"value":N}'] \
  [--holder-validation-validity-period '{"value":N}'] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --node $NODE_RPC
```

:::info
The `--authority` flag specifies the group account that controls the trust registry. The `--from` flag specifies the **operator** (transaction signer) who must be authorized by the authority.
:::

#### Permission Management Modes for Issuer and Verifier

| Value | Mode Name            | Description                                                              |
|-------|-----------------------|--------------------------------------------------------------------------|
| `1`   | OPEN                 | Anyone can self-create the permission without validation.               |
| `2`   | GRANTOR_VALIDATION   | Requires validation by a Grantor permission holder (Issuer or Verifier).|
| `3`   | ECOSYSTEM            | Requires validation by the Ecosystem controller (Trust Registry owner).|

#### Pricing Asset Types

| Value | Type   | pricing-asset value                                  | Description                                           |
|-------|--------|------------------------------------------------------|-------------------------------------------------------|
| `1`   | TU     | `tu`                                                 | Trust Unit (non-transferable token)                   |
| `2`   | COIN   | denom (e.g., `uvna`)                                 | Native blockchain token or IBC asset                  |
| `3`   | FIAT   | ISO-4217 code (e.g., `USD`)                          | Fiat currency (off-chain settlement)                  |


### Example (inline JSON schema):

```bash
veranad tx cs create-credential-schema ${TRUST_REG_ID} \
  '{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"vpr:verana:VPR_CHAIN_ID/cs/v1/js/VPR_CREDENTIAL_SCHEMA_ID","title": "ExampleCredential","description": "ExampleCredential using JsonSchema","type":"object","properties":{"name":{"type":"string"}},"required":["name"],"additionalProperties":false}' \
  1 1 1 tu sha256 \
  --authority $AUTHORITY_ACC \
  --issuer-grantor-validation-validity-period '{"value":365}' \
  --verifier-grantor-validation-validity-period '{"value":365}' \
  --issuer-validation-validity-period '{"value":180}' \
  --verifier-validation-validity-period '{"value":180}' \
  --holder-validation-validity-period '{"value":180}' \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Example (inline JSON schema) with default values:

```bash
veranad tx cs create-credential-schema ${TRUST_REG_ID} \
  '{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"vpr:verana:VPR_CHAIN_ID/cs/v1/js/VPR_CREDENTIAL_SCHEMA_ID","title": "ExampleCredential","description": "ExampleCredential using JsonSchema","type":"object","properties":{"name":{"type":"string"}},"required":["name"],"additionalProperties":false}' \
  1 1 1 tu sha256 \
  --authority $AUTHORITY_ACC \
  --issuer-grantor-validation-validity-period '{"value":0}' \
  --verifier-grantor-validation-validity-period '{"value":0}' \
  --issuer-validation-validity-period '{"value":0}' \
  --verifier-validation-validity-period '{"value":0}' \
  --holder-validation-validity-period '{"value":0}' \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Example (using JSON file):
```bash
# Save schema to file first
cat > schema.json << 'EOF'
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "vpr:verana:VPR_CHAIN_ID/cs/v1/js/VPR_CREDENTIAL_SCHEMA_ID",
    "title": "ExampleCredential",
    "description": "ExampleCredential using JsonSchema",
    "type": "object",
    "$defs": {},
    "properties": {
        "name": {
            "type": "string"
        },
        "email": {
            "type": "string",
            "format": "email"
        }
    },
    "required": ["name"],
    "additionalProperties": false
}
EOF

# Use in command
veranad tx cs create-credential-schema ${TRUST_REG_ID} "$(cat schema.json)" \
  2 2 2 uvna sha256 \
  --authority $AUTHORITY_ACC \
  --issuer-grantor-validation-validity-period '{"value":365}' \
  --verifier-grantor-validation-validity-period '{"value":365}' \
  --issuer-validation-validity-period '{"value":180}' \
  --verifier-validation-validity-period '{"value":180}' \
  --holder-validation-validity-period '{"value":180}' \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

:::tip
How to find the id of the credential schema that was just created?
```bash
TX_HASH=<replace with tx-hash>
veranad q tx $TX_HASH --node $NODE_RPC --output json
```
:::

:::tip
Make sure you are pointing towards your own Trust Registry (ID) before you run the above example!

Remember to [List Trust Registries](../trust-registries/list-trust-registries) to find the relevant ID.
```bash
TRUST_REG_ID=5
```
:::

Replace with the correct transaction hash.

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    You can also use the [testnet frontend](https://app.testnet.verana.network) to create a credential schema using the web interface.
    :::
  </TabItem>
</Tabs>

## Publish your Credential Schema

When the credential schema has been created, you now need to self-issue a Verifiable Trust Json Schema Credential with the DID of your trust registry, as specified in the [verifiable trust spec](https://verana-labs.github.io/verifiable-trust-spec/#vt-json-schema-cred-verifiable-trust-json-schema-credential).

### Create and publish the Json Schema Credential

Self issue your credential and publish the credential in a publicly accessible URL.

### Add the Json Schema Credential as a Linked-VP in your DID Document

Create and sign a presentation of your self-issued Verifiable Trust Json Schema Credential with your DID and present it in your DID Document as a linked-vp.

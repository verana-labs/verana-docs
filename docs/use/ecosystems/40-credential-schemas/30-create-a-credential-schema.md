# Create a Credential Schema

Make sure you've read [the Learn section](../../../learn/verifiable-public-registry/credential-schema).

## Message Parameters

| Name                       | Description                                                                 | Mandatory |
|----------------------------|-----------------------------------------------------------------------------|-----------|
| trust-registry-id          | Numeric ID of the trust registry                                            | Yes       |
| json-schema                | JSON schema (inline string or loaded from file)                             | Yes       |
| issuer-grantor-validity    | Validity period for issuer grantor (in days)                                | Yes       |
| verifier-grantor-validity  | Validity period for verifier grantor (in days)                              | Yes       |
| issuer-validity            | Validity period for issuer (in days)                                        | Yes       |
| verifier-validity          | Validity period for verifier (in days)                                      | Yes       |
| holder-validity            | Validity period for holder (in days)                                        | Yes       |
| issuer-perm-mode           | Permission mode for issuer (integer)                                        | Yes       |
| verifier-perm-mode         | Permission mode for verifier (integer)                                      | Yes       |

:::tip
You must specify the name, version, and JSON schema definition. Refer to the [specification](https://verana-labs.github.io/verifiable-trust-spec/#vt-json-schema-cred-verifiable-trust-json-schema-credential) for required attributes.
:::

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx cs create-schema <trust-registry-id> <json-schema> <issuer-grantor-validity> <verifier-grantor-validity> <issuer-validity> <verifier-validity> <holder-validity> <issuer-perm-mode> <verifier-perm-mode> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount>
```

#### Permission Management Modes for Issuer and Verifier

| Value | Mode Name            | Description                                                              |
|-------|-----------------------|--------------------------------------------------------------------------|
| `1`   | OPEN                 | Anyone can self-create the permission without validation.               |
| `2`   | GRANTOR_VALIDATION   | Requires validation by a Grantor permission holder (Issuer or Verifier).|
| `3`   | ECOSYSTEM            | Requires validation by the Ecosystem controller (Trust Registry owner).|


### Example (inline JSON schema):

```bash
veranad tx cs create-credential-schema ${TRUST_REG_ID} '{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"vpr:verana:VPR_CHAIN_ID/cs/v1/js/VPR_CREDENTIAL_SCHEMA_ID","title": "ExampleCredential","description": "ExampleCredential using JsonSchema","type":"object","properties":{"name":{"type":"string"}},"required":["name"],"additionalProperties":false}' 365 365 180 180 180 1 1 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Example (using JSON file):**
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

# Use in command (you'll need to escape or quote properly)
veranad tx cs create-credential-schema ${TRUST_REG_ID} "$(cat schema.json)" 365 365 180 180 180 1 1 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

:::tip
How to find the id of the credential schema that was just created?
```bash
TX_HASH=4E7DEE1DFDE24A804E8BD020657EB22B07D54CBA695788ACB59D873B827F3CA6
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

replace with the correct transaction hash.

  </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::tip
    You can also use the [testnet frontend](https://testnet.verana.io/) to create a credential schema using a simple web interface.
    :::
  </TabItem>
</Tabs>

## Publish your Credential Schema

When the credential schema has been created, you now need to self-issue a Verifiable Trust Json Schema Credential with the DID of your trust registry, as specified in the [verifiable trust spec](https://verana-labs.github.io/verifiable-trust-spec/#vt-json-schema-cred-verifiable-trust-json-schema-credential).

### Create and publish the Json Schema Credential

Self issue your credential and publish the credential in a publicly accessible URL.

### Add the Json Schema Credential as a Linked-VP in your DID Document

Create and sign a presentation of your self-issued Verifiable Trust Json Schema Credential with your DID and present it in your DID Document as a linked-vp.

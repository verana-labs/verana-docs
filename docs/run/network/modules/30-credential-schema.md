# Credential Schema Module

The Credential Schema (CS) module lets you define and manage schemas for verifiable credentials within a trust registry.

## Transaction Messages

| Spec ID        | Command                      | Description                                   |
|----------------|------------------------------|-----------------------------------------------|
| MOD-CS-MSG-1   | `create-credential-schema`   | Create a new credential schema                |
| MOD-CS-MSG-2   | `update`                     | Update a credential schema's validity periods |
| MOD-CS-MSG-3   | `archive`                    | Archive or unarchive a credential schema      |

### Create a Credential Schema

```bash
echo '{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "vpr:verana:VPR_CHAIN_ID/cs/v1/js/VPR_CREDENTIAL_SCHEMA_ID",
    "type": "object",
    "$defs": {},
    "properties": {
        "name": {
            "type": "string"
        }
    },
    "required": ["name"],
    "additionalProperties": false
}' > schema.json

veranad tx cs create-credential-schema \
  1 \
  "$(cat schema.json)" \
  2 2 1 "" sha256 \
  --issuer-grantor-validation-validity-period '{"value":365}' \
  --verifier-grantor-validation-validity-period '{"value":365}' \
  --issuer-validation-validity-period '{"value":180}' \
  --verifier-validation-validity-period '{"value":180}' \
  --holder-validation-validity-period '{"value":180}' \
  --from $FAUCET_ACC \
  --keyring-backend test \
  --chain-id $CHAIN_ID \
  --fees 600000uvna --node $NODE_RPC --yes
```

### Update a Credential Schema

```bash
veranad tx cs update 1 \
  --issuer-grantor-validation-validity-period '{"value":365}' \
  --verifier-grantor-validation-validity-period '{"value":365}' \
  --issuer-validation-validity-period '{"value":280}' \
  --verifier-validation-validity-period '{"value":280}' \
  --holder-validation-validity-period '{"value":365}' \
  --from $FAUCET_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```

### Archive a Credential Schema

```bash
veranad tx cs archive 1 true \
  --from $FAUCET_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```

## Queries

| Spec ID        | Command              | Description                              |
|----------------|----------------------|------------------------------------------|
| MOD-CS-QRY-1   | `list-schemas`      | List credential schemas                  |
| MOD-CS-QRY-2   | `get-schema`        | Get a credential schema by ID            |
| MOD-CS-QRY-3   | `render-json-schema` | Get the rendered JSON schema definition |
| MOD-CS-QRY-4   | `params`            | Get module parameters                    |

### List Credential Schemas

```bash
veranad q cs list-schemas \
  --tr-id 2 \
  --modified_after "2024-01-01T00:00:00Z" \
  --response-max-size 100 \
  --output json --node $NODE_RPC
```

### Get a Credential Schema

```bash
veranad q cs get-schema 1 --node $NODE_RPC --output json
```

### Render JSON Schema

```bash
veranad q cs render-json-schema 1 --node $NODE_RPC --output json
```

### Get Module Parameters

```bash
veranad q cs params --node $NODE_RPC --output json
```

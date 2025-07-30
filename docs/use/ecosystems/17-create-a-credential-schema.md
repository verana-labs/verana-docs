# Credential Schema Module CLI Commands

This document provides comprehensive CLI commands for the Credential Schema (cs) module in the Verana blockchain.

## Module Overview

```bash
veranad tx cs
Transactions commands for the cs module

Usage:
  veranad tx cs [flags]
  veranad tx cs [command]

Available Commands:
  archive                  Archive or unarchive a credential schema
  create-credential-schema Create a new credential schema
  update                   Update a credential schema's validity periods
```

---

### Environment Setup

#### Set Environment Variables

```bash
USER_ACC="mat-test-acc"
USER_ACC_LIT=verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0
CHAIN_ID="vna-testnet-1"
NODE_RPC=http://node1.testnet.verana.network:26657
```

*These variables are required to target the correct environment (testnet, mainnet, or local). Adjust values accordingly.*

> **Prerequisite:** Ensure the `veranad` binary is installed and up-to-date.  
> See [Install or Update Veranad Binary](/docs/next/run/network/run-a-node/prerequisites).

See [Install from Source](/docs/next/run/network/run-a-node/local-node-isolated) for detailed instructions.


---

### Define your Trust Registry ID so the below commands work

```bash
TRUST_REG_ID=5
```

---

## Transaction Commands

### 1. Create Credential Schema

Creates a new credential schema linked to an existing trust registry.

**Syntax:**
```bash
veranad tx cs create-credential-schema <trust-registry-id> <json-schema> <issuer-grantor-validity> <verifier-grantor-validity> <issuer-validity> <verifier-validity> <holder-validity> <issuer-perm-mode> <verifier-perm-mode> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<trust-registry-id>`: Numeric ID of the trust registry
- `<json-schema>`: JSON schema (inline string or from file prefixed with `@`)
- `<issuer-grantor-validity>`: Validity period for issuer grantor (in seconds)
- `<verifier-grantor-validity>`: Validity period for verifier grantor (in seconds)
- `<issuer-validity>`: Validity period for issuer (in seconds)
- `<verifier-validity>`: Validity period for verifier (in seconds)
- `<holder-validity>`: Validity period for holder (in seconds)
- `<issuer-perm-mode>`: Issuer permission management mode (integer)
- `<verifier-perm-mode>`: Verifier permission management mode (integer)

**Example (inline JSON schema):**
```bash
veranad tx cs create-credential-schema ${TRUST_REG_ID} '{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"/vpr/v1/cs/js/1","type":"object","properties":{"name":{"type":"string"}},"required":["name"],"additionalProperties":false}' 31536000 31536000 31536000 31536000 31536000 1 1 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Example (using JSON file):**
```bash
# Save schema to file first
cat > schema.json << 'EOF'
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "/vpr/v1/cs/js/1",
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

### Listing Credential Schemas

To list all existing Credential Schemas and find their IDs, run:

```bash
veranad q cs list-schemas --node $NODE_RPC  --output json
```

---

### 2. Update Credential Schema

Updates the validity periods of an existing credential schema.

**Syntax:**
```bash
veranad tx cs update <credential-schema-id> <issuer-grantor-validity> <verifier-grantor-validity> <issuer-validity> <verifier-validity> <holder-validity> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount>
```

**Example:**
```bash
veranad tx cs update ${TRUST_REG_ID} 365 365 280 280 280 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

---

### 3. Archive Credential Schema

Archives or unarchives a credential schema.

**Syntax:**
```bash
veranad tx cs archive <credential-schema-id> <archive-flag> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount>
```

**Parameters:**
- `<credential-schema-id>`: Numeric ID of the credential schema
- `<archive-flag>`: Boolean (`true` to archive, `false` to unarchive)

**Examples:**
```bash
veranad tx cs archive ${TRUST_REG_ID} true --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
veranad tx cs archive ${TRUST_REG_ID} false --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

---

## Parameter Details

### JSON Schema Requirements
- Must be valid JSON Schema (Draft 2020-12 or later)
- Include `$schema`, `$id`, `type`, and `properties`
- Properly escape inline JSON or use file with `@filename.json`

### Validity Periods
- Specified in days
- Common values:
  - 365 = 1 year

### Permission Management Modes
- Integer values representing modes for issuer and verifier
- See module documentation for mode definitions

---

## Validation Rules
- Only trust registry controller can create/update/archive schemas
- JSON schema must be valid and parseable
- Cannot archive an already archived schema
- Validity periods must be positive integers

---

## Common Error Scenarios
- Invalid JSON schema format
- Unauthorized controller attempting modification
- Negative or zero validity periods
- Missing or incorrect parameters

---

## Transaction Fees
- Use `--fees` to specify fees (e.g., `60000uvna`)
- Use `--gas auto` for automatic gas estimation

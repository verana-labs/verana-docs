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

## Setting up the Environment

### Testnet Example

```bash
USER_ACC="mat-test-acc"
USER_ACC_LIT=verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0
CHAIN_ID="vna-testnet-1"
NODE_RPC=http://node1.testnet.verana.network:26657
```

*Adjust values for your environment (testnet, mainnet, or local).*

### Install or Update the Veranad Binary

To install or update the `veranad` binary, you can download the latest release or build from source.

Download script example:

```bash
curl -L https://github.com/verana/veranad/releases/latest/download/veranad-linux-amd64 -o veranad
chmod +x veranad
sudo mv veranad /usr/local/bin/
```

Alternatively, install from source:

```bash
make install
```

Verify installation:

```bash
veranad version
```

See [Install from Source](/docs/next/run/network/run-a-node/local-node-isolated) for detailed instructions.

## Account Setup

### Create a New Account

Create a new keypair:

```bash
veranad version
```

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
veranad tx cs create-credential-schema ${TRUST_REG_ID} '{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"/vpr/v1/cs/js/1","type":"object","properties":{"name":{"type":"string"}},"required":["name"],"additionalProperties":false}' 31536000 31536000 31536000 31536000 31536000 1 1 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 50000uvna --gas auto
```

**Example (using JSON file):**
```bash
veranad tx cs create-credential-schema ${TRUST_REG_ID} @./schema.json 31536000 31536000 31536000 31536000 31536000 1 1 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 50000uvna --gas auto
```

---

### 2. Update Credential Schema

Updates the validity periods of an existing credential schema.

**Syntax:**
```bash
veranad tx cs update <credential-schema-id> <issuer-grantor-validity> <verifier-grantor-validity> <issuer-validity> <verifier-validity> <holder-validity> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Example:**
```bash
veranad tx cs update 1 63072000 63072000 63072000 63072000 63072000 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 50000uvna --gas auto
```

---

### 3. Archive Credential Schema

Archives or unarchives a credential schema.

**Syntax:**
```bash
veranad tx cs archive <credential-schema-id> <archive-flag> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<credential-schema-id>`: Numeric ID of the credential schema
- `<archive-flag>`: Boolean (`true` to archive, `false` to unarchive)

**Examples:**
```bash
veranad tx cs archive 1 true --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 50000uvna --gas auto
veranad tx cs archive 1 false --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 50000uvna --gas auto
```

---

## Parameter Details

### JSON Schema Requirements
- Must be valid JSON Schema (Draft 2020-12 or later)
- Include `$schema`, `$id`, `type`, and `properties`
- Properly escape inline JSON or use file with `@filename.json`

### Validity Periods
- Specified in seconds
- Common values:
  - 31536000 = 1 year
  - 63072000 = 2 years

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
- Use `--fees` to specify fees (e.g., `50000uvna`)
- Use `--gas auto` for automatic gas estimation

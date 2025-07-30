# Credential Schema Module CLI Commands

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

## Setting up the Environment

### Set Environment Variables

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

See [Install from Source](/docs/next/run/network/run-a-node/local-node-isolated) for detailed instructions.

## Account Setup

### Create a New Account

Create a new keypair:

```bash
veranad keys add $USER_ACC --keyring-backend test
```

Save the mnemonic securely for recovery.

### List Accounts

```bash
veranad keys list --keyring-backend test
```

### Request Test Tokens

Use the faucet to fund your account on testnet:

```bash
curl -X POST "https://faucet.testnet.verana.network/request" -d '{"address":"'$USER_ACC_LIT'"}'
```

### Check Account Balance

```bash
veranad query bank balances $USER_ACC_LIT --node $NODE_RPC
```

## Transaction Commands

### Create Credential Schema

Create a new credential schema with the following syntax:

```bash
veranad tx cs create-credential-schema <trust-registry-id> <json-schema> <issuer-grantor-validity> <verifier-grantor-validity> <issuer-validity> <verifier-validity> <holder-validity> <issuer-perm-mode> <verifier-perm-mode> --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 5000uvera --gas auto
```

- `<trust-registry-id>`: Identifier of the trust registry controlling the schema.
- `<json-schema>`: JSON schema as a string or a path to a JSON file prefixed with `@`.
- Validity periods (in seconds):
  - `<issuer-grantor-validity>`
  - `<verifier-grantor-validity>`
  - `<issuer-validity>`
  - `<verifier-validity>`
  - `<holder-validity>`
- Permission modes (integer values):
  - `<issuer-perm-mode>`
  - `<verifier-perm-mode>`

#### Example with inline JSON schema

```bash
TRUST_REG_ID="did:example:1234"
veranad tx cs create-credential-schema $TRUST_REG_ID '{"title":"Example Schema","type":"object","properties":{"name":{"type":"string"}},"required":["name"]}' 31536000 31536000 31536000 31536000 31536000 1 1 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 5000uvera --gas auto
```

#### Example using JSON file

```bash
veranad tx cs create-credential-schema $TRUST_REG_ID @./schema.json 31536000 31536000 31536000 31536000 31536000 1 1 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 5000uvera --gas auto
```

### Update Credential Schema

Update validity periods of an existing credential schema:

```bash
veranad tx cs update <credential-schema-id> <issuer-grantor-validity> <verifier-grantor-validity> <issuer-validity> <verifier-validity> <holder-validity> --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 5000uvera --gas auto
```

Example:

```bash
veranad tx cs update cs1 63072000 63072000 63072000 63072000 63072000 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 5000uvera --gas auto
```

### Archive Credential Schema

Archive or unarchive a credential schema by setting its archive status:

```bash
veranad tx cs archive <credential-schema-id> <archive-status> --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 5000uvera --gas auto
```

- `<archive-status>`: `true` to archive, `false` to unarchive.

Example to archive:

```bash
veranad tx cs archive cs1 true --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 5000uvera --gas auto
```

Example to unarchive:

```bash
veranad tx cs archive cs1 false --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 5000uvera --gas auto
```

## Parameter Details

### JSON Schema Requirements

- Must be a valid JSON Schema draft-07 or later.
- Should define the structure of the credential subject.
- Must be properly escaped if passed inline.
- Alternatively, use a file reference with `@filename.json`.

### Validity Periods

- Specified in seconds.
- Define how long the schema is valid for different roles:
  - Issuer grantor
  - Verifier grantor
  - Issuer
  - Verifier
  - Holder
- Must be positive integers.

### Permission Management Modes

- Integers representing permission modes for issuers and verifiers.
- Define how permissions are managed for the schema.
- Refer to the module documentation for mode definitions.

### Trust Registry Link Requirement

- The credential schema must be linked to a trust registry identified by `<trust-registry-id>`.
- Only controllers of the trust registry can create or update schemas.

## Validation Rules

- Only the controller of the trust registry can create, update, or archive credential schemas.
- Validity periods must be consistent and positive.
- JSON schema must be valid and parsable.
- Cannot archive an already archived schema or unarchive a non-archived schema.
- All parameters must adhere to expected formats and constraints.

## Common Error Scenarios

- **Invalid JSON Schema:** Errors when the JSON schema is malformed or invalid.
- **Unauthorized Controller:** Attempting operations without proper control over the trust registry.
- **Archive Status Conflicts:** Trying to archive an already archived schema or unarchive an active schema.
- **Invalid Validity Periods:** Negative or zero values for validity periods.
- **Missing or Incorrect Parameters:** Omitting required parameters or incorrect types.

## Transaction Fees

- Use `--fees` to specify transaction fees, e.g., `--fees 5000uvera`.
- Use `--gas auto` to automatically estimate gas required.
- Adjust fees based on network conditions.

---

**Note:** Before creating a credential schema, define the trust registry ID in your environment:

```bash
export TRUST_REG_ID="did:example:your-trust-registry-id"
```

This will help reuse variables and simplify command execution.

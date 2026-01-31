# Trust Registry Module CLI Commands

## Module Overview

```bash
veranad tx tr            
Transactions commands for the tr module

Usage:
  veranad tx tr [flags]
  veranad tx tr [command]

Available Commands:
  add-governance-framework-document Add a governance framework document
  archive-trust-registry            Archive or unarchive a trust registry
  create-trust-registry             Create a new trust registry
  increase-active-gf-version        Increase the active governance framework version
  update-params                     Execute the UpdateParams RPC method
  update-trust-registry             Update a trust registry
```

## Setting up the Environment

### Testnet

```
USER_ACC="mat-test-acc"
USER_ACC_LIT=verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0
CHAIN_ID="vna-testnet-1"
NODE_RPC=https://rpc.testnet.verana.network
```


### download or update your current local binary

```
# Fetch the binary manifest
curl -s https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/$CHAIN_ID/binaries/manifest.json > manifest.json

# Get the binary filename for your architecture
BINARY_FILE=$(jq -r '.["linux-amd64"]' manifest.json)

# Download the binary
wget https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/$CHAIN_ID/binaries/$BINARY_FILE

# Make it executable
chmod +x $BINARY_FILE

# Move to system path
sudo mv $BINARY_FILE /usr/local/bin/veranad

# Verify installation
veranad version
```

### create the account

```
veranad keys add $USER_ACC --ledger --keyring-backend test
```
or if you have a passphrase then
```
SEED_PHRASE_USER_ACC="pink glory help gown abstract eight nice crazy forward ketchup skill cheese"
echo "$SEED_PHRASE_USER_ACC" | veranad keys add $USER_ACC --recover --keyring-backend test
```

### List accounts:
```
veranad keys list --keyring-backend test
```

### Use faucet to get tokens

```
/to verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0
```


### check balance

```
veranad q bank balance $USER_ACC_LIT uvna --node $NODE_RPC
```


## Transaction Commands

### 1. Create Trust Registry

Creates a new trust registry with governance framework documents.

**Syntax:**
```bash
veranad tx tr create-trust-registry <did> <language> <doc-url> <doc-digest-sri> [aka] --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<did>`: Decentralized Identifier (DID) - must follow DID specification
- `<language>`: ISO 639-1 language code (e.g., en, fr, es)
- `<doc-url>`: URL to the governance framework document
- `<doc-digest-sri>`: SHA-384 hash with SRI format prefix
- `[aka]`: Optional - Also Known As URL

**Examples:**

Basic creation:
```bash
veranad tx tr create-trust-registry did:example:123456789abcdefghi en https://example.com/doc sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

With AKA (Also Known As):
```bash
veranad tx tr create-trust-registry did:example:123456789abcdefghi en https://example.com/doc001-01 sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68001 --aka http://example.com --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```


#### How to find the id of the trust registry that was just created?

```
TX_HASH=4E7DEE1DFDE24A804E8BD020657EB22B07D54CBA695788ACB59D873B827F3CA6
veranad q tx $TX_HASH \
  --node $NODE_RPC --output json \
| jq '.events[] | select(.type == "create_trust_registry") | .attributes | map({(.key): .value}) | add'
```

replace with the correct transaction hash.

#### list trust registries

```
veranad q tr list-trust-registries --node $NODE_RPC  --output json
```

#### define your trust registry id so the below commands work

```
TRUST_REG_ID=5
```

---

### 2. Add Governance Framework Document

Adds a new governance framework document to an existing trust registry.

**Syntax:**
```bash
veranad tx tr add-governance-framework-document <trust-registry-id> <doc-language> <doc-url> <doc-digest-sri> <version> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<trust-registry-id>`: Numeric ID of the trust registry
- `<doc-language>`: ISO 639-1 language code
- `<doc-url>`: URL to the governance framework document
- `<doc-digest-sri>`: SHA-384 hash with SRI format prefix
- `<version>`: Version number (must be sequential)

**Examples:**

Add document for next version:
```bash
veranad tx tr add-governance-framework-document ${TRUST_REG_ID} en https://example.com/doc2 sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 --from $USER_ACC --chain-id vna-testnet-1 --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

Add document in different language for same version:
```bash
veranad tx tr add-governance-framework-document ${TRUST_REG_ID} fr https://example.com/doc2-fr sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 --from $USER_ACC --chain-id vna-testnet-1 --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

Add document for version 3:
```bash
veranad tx tr add-governance-framework-document ${TRUST_REG_ID} es https://example.com/doc3-es sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 3 --from $USER_ACC --chain-id vna-testnet-1 --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

---

### 3. Increase Active Governance Framework Version

Increases the active version of the governance framework. Requires that a document exists in the default language for the target version.

**Syntax:**
```bash
veranad tx tr increase-active-gf-version <trust-registry-id> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<trust-registry-id>`: Numeric ID of the trust registry

**Example:**
```bash
veranad tx tr increase-active-gf-version ${TRUST_REG_ID} --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Note:** This command will fail if there's no document in the default language for the next version.

---

### 4. Update Trust Registry

Updates the DID and/or AKA fields of an existing trust registry.

**Syntax:**
```bash
veranad tx tr update-trust-registry <trust-registry-id> <new-did> [new-aka] --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<trust-registry-id>`: Numeric ID of the trust registry
- `<new-did>`: New DID for the trust registry
- `[new-aka]`: Optional - New AKA URL (use empty string to clear)

**Examples:**

Update DID and AKA:
```bash
veranad tx tr update-trust-registry 1 did:example:newdid --aka http://new.example.com --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
```

---

### 5. Archive Trust Registry

Archives or unarchives a trust registry.

**Syntax:**
```bash
veranad tx tr archive-trust-registry <trust-registry-id> <archive-flag> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<trust-registry-id>`: Numeric ID of the trust registry
- `<archive-flag>`: Boolean value (`true` to archive, `false` to unarchive)

**Examples:**

Archive a trust registry:
```bash
veranad tx tr archive-trust-registry 1 true --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
```

Unarchive a trust registry:
```bash
veranad tx tr archive-trust-registry 1 false --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
```

---


## Parameter Validation Rules

### DID Format
- Must follow DID specification
- Example: `did:example:123456789abcdefghi`

### Language Codes
- Must be valid ISO 639-1 language codes
- Examples: `en`, `fr`, `es`, `de`, `zh`

### Document Digest SRI
- Must use SHA-384 hash with SRI format
- Format: `sha384-<base64-encoded-hash>`
- Example: `sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26`

### Version Rules
- Versions must be sequential
- Cannot skip versions when adding documents
- Must have default language document before increasing active version

### Access Control
- Only the trust registry controller (creator) can perform updates
- Wrong controller will result in transaction failure

## Common Error Scenarios

1. **Invalid Version**: Attempting to add a document with a version that skips numbers
2. **Missing Default Language**: Trying to increase version without default language document
3. **Wrong Controller**: Non-controller attempting to modify trust registry
4. **Already Archived/Unarchived**: Attempting to archive an already archived registry
5. **Invalid Language Format**: Using non-ISO 639-1 language codes
6. **Non-existent Trust Registry**: Using invalid trust registry ID

## Transaction Fees

All transactions require gas fees. Use `--gas auto` for automatic gas estimation or specify a specific gas limit. Fee examples:
- `--fees 50000uvna` (50,000 micro-VNA)
- `--gas auto`


###################################################################

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

## Transaction Commands

### 1. Create Credential Schema

Creates a new credential schema linked to a trust registry.

**Syntax:**
```bash
veranad tx cs create-credential-schema <trust-registry-id> <json-schema> <issuer-grantor-validity> <verifier-grantor-validity> <issuer-validity> <verifier-validity> <holder-validity> <issuer-perm-mode> <verifier-perm-mode> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<trust-registry-id>`: Numeric ID of the trust registry (must exist and caller must be controller)
- `<json-schema>`: JSON schema definition (properly escaped JSON string)
- `<issuer-grantor-validity>`: Issuer grantor validation validity period in days
- `<verifier-grantor-validity>`: Verifier grantor validation validity period in days
- `<issuer-validity>`: Issuer validation validity period in days
- `<verifier-validity>`: Verifier validation validity period in days
- `<holder-validity>`: Holder validation validity period in days
- `<issuer-perm-mode>`: Issuer permission management mode (integer)
- `<verifier-perm-mode>`: Verifier permission management mode (integer)

**Example:**

Basic credential schema creation:
```bash
veranad tx cs create-credential-schema 1 '{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"/vpr/v1/cs/js/1","type":"object","properties":{"name":{"type":"string"}},"required":["name"],"additionalProperties":false}' 365 365 180 180 180 2 2 --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
```

**Note:** The JSON schema must be properly escaped when passed as a command line argument. For complex schemas, consider using a file:

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
veranad tx cs create-credential-schema 1 "$(cat schema.json)" 365 365 180 180 180 2 2 --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
```

---

### 2. Update Credential Schema

Updates the validity periods of an existing credential schema.

**Syntax:**
```bash
veranad tx cs update <credential-schema-id> <issuer-grantor-validity> <verifier-grantor-validity> <issuer-validity> <verifier-validity> <holder-validity> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<credential-schema-id>`: Numeric ID of the credential schema
- `<issuer-grantor-validity>`: New issuer grantor validation validity period in days
- `<verifier-grantor-validity>`: New verifier grantor validation validity period in days
- `<issuer-validity>`: New issuer validation validity period in days
- `<verifier-validity>`: New verifier validation validity period in days
- `<holder-validity>`: New holder validation validity period in days

**Examples:**

Update validity periods:
```bash
veranad tx cs update 1 365 365 180 180 180 --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
```

Extend all validity periods:
```bash
veranad tx cs update 1 730 730 365 365 365 --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
```

Shorter validity periods for testing:
```bash
veranad tx cs update 1 30 30 7 7 7 --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
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
- `<archive-flag>`: Boolean value (`true` to archive, `false` to unarchive)

**Examples:**

Archive a credential schema:
```bash
veranad tx cs archive 1 true --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
```

Unarchive a credential schema:
```bash
veranad tx cs archive 1 false --from cooluser --chain-id vna-testnet-1 --keyring-backend test --fees 50000uvna --gas auto
```

## Parameter Details

### JSON Schema Requirements
- Must be valid JSON Schema (Draft 2020-12 recommended)
- Should include `$schema`, `$id`, `type`, and `properties` fields
- Must define required fields and additionalProperties behavior
- Common pattern: `{"$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "/path/to/schema", "type": "object", "properties": {...}, "required": [...], "additionalProperties": false}`

### Validity Periods
- Measured in days
- Must not exceed system maximum limits
- Common values:
    - **Grantor periods**: 365-730 days (1-2 years)
    - **Validation periods**: 30-365 days (1 month to 1 year)
    - **Testing periods**: 1-7 days for development

### Permission Management Modes
- Integer values representing different permission models
- Mode `2` appears to be a standard mode in examples
- Specific mode meanings depend on system configuration

### Trust Registry Requirements
- Credential schema must be linked to an existing trust registry
- Only the trust registry controller can create/modify credential schemas
- Trust registry must not be archived

## Validation Rules

### Access Control
- **Create**: Only trust registry controller can create schemas
- **Update**: Only trust registry controller can update schemas
- **Archive**: Only trust registry controller can archive/unarchive schemas

### Business Logic
- Cannot archive an already archived schema
- Cannot unarchive a schema that's not archived
- Validity periods cannot exceed system maximums
- JSON schema must be valid and parseable

## Transaction Fees

All transactions require gas fees. Use `--gas auto` for automatic gas estimation:
- `--fees 50000uvna` (50,000 micro-VNA)
- `--gas auto`

For complex JSON schemas, gas consumption may be higher due to storage requirements.

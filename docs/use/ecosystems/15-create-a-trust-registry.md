# Create an Ecosystem Trust Registry

Make sure you've read [the Learn section](/docs/next/learn/verifiable-public-registry/trust-registries).

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

---

## Create a Trust Registry

Use the following command to create a new trust registry within the ecosystem:

```bash
veranad tx tr create-trust-registry <did> <language> <doc-url> <doc-digest-sri> [aka] --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Parameters:**
- `<did>`: Decentralized Identifier (DID) - must follow DID specification
- `<language>`: ISO 639-1 language code (e.g., en, fr, es)
- `<doc-url>`: URL to the governance framework document
- `<doc-digest-sri>`: SHA-384 hash with SRI format prefix
- `[aka]`: Optional - Also Known As URL

### Example:

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

### Listing Trust Registries

To list all existing trust registries and find their IDs, run:

```bash
veranad q tr list-trust-registries --node $NODE_RPC  --output json
```

Use the output to identify the `id` of the trust registry you want to manage.

#### define your trust registry id so the below commands work

```bash
TRUST_REG_ID=5
```

---

## Update a Trust Registry

To update the details of an existing trust registry, use:

```bash
veranad tx tr update-trust-registry
Update a trust registry's DID and AKA URI. Only the controller can update a trust registry.

Usage:
  veranad tx tr update-trust-registry [id] [did] [flags]
```

### Parameters:

```
Usage:
  veranad tx tr update-trust-registry [id] [did] [flags]
```

### Example:

```bash
veranad tx tr update-trust-registry ${TRUST_REG_ID} did:example:newdidmat --aka https://new-aka-example.com --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

---

## Add a Governance Framework Document

> **Note:** The following examples assume you have set `TRUST_REG_ID` as shown above.

Add a new governance framework document to an existing trust registry with:

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
veranad tx tr add-governance-framework-document ${TRUST_REG_ID} en https://example.com/doc2 sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

Add document in different language for same version:
```bash
veranad tx tr add-governance-framework-document ${TRUST_REG_ID} fr https://example.com/doc2-fr sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

Add document for version 3:
```bash
veranad tx tr add-governance-framework-document ${TRUST_REG_ID} es https://example.com/doc3-es sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 3 --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

---

## Increase Active Governance Framework Version

> **Note:** The following examples assume you have set `TRUST_REG_ID` as shown above.

To increase or change the active governance framework version for a trust registry, run:

**Syntax:**
```bash
veranad tx tr increase-active-gf-version <trust-registry-id> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount>
```

**Parameters:**
- `<trust-registry-id>`: Numeric ID of the trust registry

**Example:**
```bash
veranad tx tr increase-active-gf-version ${TRUST_REG_ID} --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Note:** This command will fail if there's no document in the default language for the next version.

#### How to find the id of the trust registry that was just created?

```
TX_HASH=<Tx_Hash>
veranad q tx $TX_HASH \
  --node $NODE_RPC --output json \
| jq
```


---

## Archive a Trust Registry

You can archive or unarchive a trust registry with the following command:

**Syntax:**
```bash
veranad tx tr archive-trust-registry <trust-registry-id> <archive-flag> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount>
```

**Parameters:**
- `<trust-registry-id>`: Numeric ID of the trust registry
- `<archive-flag>`: Boolean value (`true` to archive, `false` to unarchive)

**Examples:**

Archive a trust registry:
```bash
veranad tx tr archive-trust-registry ${TRUST_REG_ID} true --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna 
```

Unarchive a trust registry:
```bash
veranad tx tr archive-trust-registry ${TRUST_REG_ID} false --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna 
```

---

## Query Module Parameters

View the current trust registry module parameters and their values.

**Syntax:**
```bash
veranad q tr params --node <rpc-endpoint> --output json
```

**Example:**
```bash
veranad q tr params --node $NODE_RPC --output json
```

**Example Output:**
```json
{
  "params": {
    "trust_registry_trust_deposit": "10",
    "trust_unit_price": "1000000"
  }
}
```

### Parameter Descriptions

| Parameter | Description | Default Value |
|-----------|-------------|---------------|
| `trust_registry_trust_deposit` | Trust deposit required for creating a trust registry (in trust units) | 10 |
| `trust_unit_price` | Price of one trust unit in uvna | 1000000 (1 VNA) |

---

## Parameter Validation and Common Errors

- Ensure all required parameters are provided; missing parameters will cause command failures.
- The `--id` or `--trust-registry-id` must correspond to an existing trust registry.
- The `--admin` address must be a valid account address on the chain.
- The `--archive` parameter only accepts `true` or `false`.
- Always confirm you have sufficient balance for transaction fees.
- Use `--yes` to skip confirmation prompts; omit it to review before submitting.
- Network errors or invalid node URLs will cause commands to fail; verify `NODE_RPC`.
- If you encounter permission errors, ensure your account has the necessary privileges for the action.
- For governance framework documents, ensure the URI is accessible and properly formatted JSON.
- Version numbers for governance frameworks must be sequential integers (e.g., 1, 2, 3).

For further assistance, refer to the official Verana CLI documentation or contact support.

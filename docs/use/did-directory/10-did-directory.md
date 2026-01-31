# Publish DIDs

Managing DIDs in the DID Directory is straightforward.

Make sure you've read [the Learn section](../../learn/verifiable-public-registry/verifiable-service-DID-directory).

### Environment Setup

#### Set Environment Variables

```bash
USER_ACC="mat-test-acc"
USER_ACC_LIT=verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0
CHAIN_ID="vna-testnet-1"
NODE_RPC=https://rpc.testnet.verana.network
```

*These variables are required to target the correct environment (testnet, mainnet, or local). Adjust values accordingly.*

> **Prerequisite:** Ensure the `veranad` binary is installed and up-to-date.  
> See [Install or Update Veranad Binary](/docs/next/run/network/run-a-node/prerequisites).

---

## List DIDs

Use this method to list DIDs with optional filtering by controller, changed time, expiration status, and pagination.

**Syntax:**
```bash
veranad q dd list-dids [flags] --node $NODE_RPC
```

**Parameters:**
- `--account`: Filter by controller account address
- `--changed`: Filter by changed time (RFC3339 format)
- `--expired`: Show expired services (boolean)
- `--over-grace`: Show services over grace period (boolean)
- `--max-results`: Maximum number of results (1-1024, default 64)

**Examples:**

List all DIDs:
```bash
veranad q dd list-dids --node $NODE_RPC --output json
```

List DIDs controlled by specific account:
```bash
veranad q dd list-dids --account $USER_ACC_LIT --node $NODE_RPC --output json
```

List DIDs changed after specific date:
```bash
veranad q dd list-dids --changed "2024-01-01T00:00:00Z" --node $NODE_RPC --output json
```

List expired DIDs:
```bash
veranad q dd list-dids --expired --node $NODE_RPC --output json
```

---

## Get a DID

Use this method to get the full details of a specific DID entry from the directory.

**Syntax:**
```bash
veranad q dd get-did [did] --node <rpc-endpoint> --output json
```

**Parameters:**
- `[did]`: The DID identifier (mandatory) - must conform to DID specification

**Example:**

```bash
DID_IDENTIFIER="did:example:123456789abcdefghi"
veranad q dd get-did $DID_IDENTIFIER --node $NODE_RPC --output json
```

**Example Output:**
```json
{
  "did_directory": {
    "did": "did:example:123456789abcdefghi",
    "controller": "verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0",
    "deposit": "1000000",
    "expire_ts": "2025-08-07T12:00:00Z",
    "last_modified_ts": "2024-08-07T12:00:00Z"
  }
}
```

---

## Add a DID

Adds a DID to the DID Directory. It will trigger index of the corresponding Verifiable Service.

**Syntax:**
```bash
veranad tx dd add-did [did] [years] --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

**Parameters:**
- `[did]`: The DID identifier (mandatory) - must conform to DID specification
- `[years]`: Registration period in years (optional, 1-31, default 1)

**Examples:**

Add DID for 1 year (default):
```bash
DID_IDENTIFIER="did:example:123456789abcdefghi"
veranad tx dd add-did $DID_IDENTIFIER --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

Add DID for 5 years:
```bash
veranad tx dd add-did $DID_IDENTIFIER 5 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

#### How to find the DID that was just added?

```bash
TX_HASH=4E7DEE1DFDE24A804E8BD020657EB22B07D54CBA695788ACB59D873B827F3CA6
veranad q tx $TX_HASH \
  --node $NODE_RPC --output json \
| jq '.events[] | select(.type == "add_did") | .attributes | map({(.key): .value}) | add'
```

Replace with the correct transaction hash.

---

## Renew a DID

Renew a DID and extends its expiration date. It will trigger a reindex of the Verifiable Service.

**Syntax:**
```bash
veranad tx dd renew-did [did] [years] --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

**Parameters:**
- `[did]`: The DID identifier (mandatory) - must exist in DID directory
- `[years]`: Additional years to renew (optional, 1-31, default 1)

**Examples:**

Renew DID for 1 additional year:
```bash
veranad tx dd renew-did $DID_IDENTIFIER --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

Renew DID for 3 additional years:
```bash
veranad tx dd renew-did $DID_IDENTIFIER 3 --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Note:** Only the controller account can renew a DID, unless the DID is past its grace period.

---

## Remove a DID

This method is used to remove a DID from the Directory. It will trigger a removal of the DID from all indexes containers.

**Syntax:**
```bash
veranad tx dd remove-did [did] --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

**Parameters:**
- `[did]`: The DID identifier (mandatory) - must exist in DID directory

**Example:**

```bash
veranad tx dd remove-did $DID_IDENTIFIER --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Access Control:**
- If DID is not expired or within grace period: Only the controller can remove it
- If DID is past grace period: Any account can remove it

**Trust Deposit Recovery:**
When a DID is removed, the trust deposit is returned to the controller account.

---

## Touch a DID

This method is used to force reindex of the Verifiable Service. It just changes the `lastModifiedTs` timestamp. Use it if you updated your DID Document to trigger a reindex.

**Syntax:**
```bash
veranad tx dd touch-did [did] --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

**Parameters:**
- `[did]`: The DID identifier (mandatory) - must exist in DID directory

**Example:**

```bash
veranad tx dd touch-did $DID_IDENTIFIER --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Use Cases:**
- Updated your DID Document and want indexers to re-crawl

---

### Query Module Parameters

List the current module parameters and their values:

**Syntax:**
```bash
veranad q dd params --node <rpc-endpoint> --output json
```

**Example:**
```bash
veranad q dd params --node $NODE_RPC --output json
```

**Example Output:**
```json
{
  "params": {
    "did_directory_trust_deposit": "5",
    "did_directory_grace_period": "30"
  }
}
```

---

## Verification and Troubleshooting

### Verify DID Registration Status

Check if your DID was successfully added:
```bash
veranad q dd get-did $DID_IDENTIFIER --node $NODE_RPC --output json
```

### Check Account Balance Before Operations

Ensure sufficient funds for fees:
```bash
veranad q bank balances $USER_ACC_LIT --node $NODE_RPC
```

### List Your Controlled DIDs

See all DIDs controlled by your account:
```bash
veranad q dd list-dids --account $USER_ACC_LIT --node $NODE_RPC --output json
```

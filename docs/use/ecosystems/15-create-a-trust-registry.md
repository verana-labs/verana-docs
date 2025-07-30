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
veranad tx registry create-trust-registry \
  --name <name> \
  --description <description> \
  --governance-framework-uri <uri> \
  --governance-framework-version <version> \
  --governance-framework-type <type> \
  --admin <admin-address> \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

### Parameters:

- `--name`: Name of the trust registry.
- `--description`: Description of the trust registry.
- `--governance-framework-uri`: URI pointing to the governance framework document.
- `--governance-framework-version`: Version identifier of the governance framework. **Versions must be sequential integers (e.g., 1, 2, 3).**
- `--governance-framework-type`: Type of the governance framework (e.g., "ISO-Standard").
- `--admin`: Address of the administrator account.

### Example:

```bash
veranad tx registry create-trust-registry \
  --name "Healthcare Providers" \
  --description "Registry for accredited healthcare providers" \
  --governance-framework-uri "https://example.com/gf/1.json" \
  --governance-framework-version 1 \
  --governance-framework-type "ISO-Standard" \
  --admin $(veranad keys show $USER_ACC -a) \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

### Listing Trust Registries

To list all existing trust registries and find their IDs, run:

```bash
veranad query registry list-trust-registries --node $NODE_RPC
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
veranad tx registry update-trust-registry \
  --id <trust-registry-id> \
  --name <new-name> \
  --description <new-description> \
  --admin <new-admin-address> \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

### Parameters:

- `--id`: The identifier of the trust registry to update.
- `--name`: New name for the trust registry.
- `--description`: New description.
- `--admin`: New administrator address.

### Example:

```bash
veranad tx registry update-trust-registry \
  --id 1 \
  --name "Updated Healthcare Providers" \
  --description "Updated registry for accredited healthcare providers" \
  --admin $(veranad keys show $USER_ACC -a) \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

---

## Add a Governance Framework Document

> **Note:** The following examples assume you have set `TRUST_REG_ID` as shown above.

Add a new governance framework document to an existing trust registry with:

```bash
veranad tx registry add-governance-framework-document \
  --trust-registry-id $TRUST_REG_ID \
  --uri <document-uri> \
  --version <version> \
  --type <type> \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

### Parameters:

- `--trust-registry-id`: ID of the trust registry.
- `--uri`: URI of the governance framework document.
- `--version`: Version of the governance framework document. **Versions must be sequential integers (e.g., 2, 3, 4).**
- `--type`: Type of the governance framework (e.g., "ISO-Standard").

### Example:

```bash
veranad tx registry add-governance-framework-document \
  --trust-registry-id $TRUST_REG_ID \
  --uri "https://example.com/gf/2.json" \
  --version 2 \
  --type "ISO-Standard" \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

---

## Increase Active Governance Framework Version

> **Note:** The following examples assume you have set `TRUST_REG_ID` as shown above.

To increase or change the active governance framework version for a trust registry, run:

```bash
veranad tx registry increase-active-governance-framework-version \
  --trust-registry-id $TRUST_REG_ID \
  --version <new-version> \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

### Parameters:

- `--trust-registry-id`: ID of the trust registry.
- `--version`: New active governance framework version. **Must be a sequential integer (e.g., 2, 3, 4).**

### Example:

```bash
veranad tx registry increase-active-governance-framework-version \
  --trust-registry-id $TRUST_REG_ID \
  --version 2 \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

---

## Archive a Trust Registry

You can archive or unarchive a trust registry with the following command:

```bash
veranad tx registry archive-trust-registry \
  --id <trust-registry-id> \
  --archive <true|false> \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

### Parameters:

- `--id`: ID of the trust registry.
- `--archive`: Set to `true` to archive, `false` to unarchive.

### Example (archive):

```bash
veranad tx registry archive-trust-registry \
  --id 1 \
  --archive true \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

### Example (unarchive):

```bash
veranad tx registry archive-trust-registry \
  --id 1 \
  --archive false \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --node $NODE_RPC \
  --yes
```

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

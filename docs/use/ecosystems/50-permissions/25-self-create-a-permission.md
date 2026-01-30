# Self-Create a Permission

Create an **ISSUER** or **VERIFIER** permission for a credential schema **when the schema is configured in OPEN mode**. This is the fastest way to become authorized to issue or verify credentials for that schema.

> **Heads‑up:** You must still comply with the Ecosystem Governance Framework (EGF). Even in OPEN mode, your permission can be revoked and deposits slashed if you violate the EGF.

---

## When can you self-create?

You can self-create when **the relevant mode for your permission type is OPEN**:

- **For ISSUER**: the schema’s `issuer_perm_management_mode` is **OPEN**  
- **For VERIFIER**: the schema’s `verifier_perm_management_mode` is **OPEN**

Additionally, the schema must have an **active ECOSYSTEM (root) permission** (created by the Trust Registry controller).

Check with:
```bash
# List schemas, inspect issuer/verifier modes
veranad q cs list-schemas --node $NODE_RPC --output json | jq

# Ensure a root (ECOSYSTEM) permission exists for the schema
SCHEMA_ID=5
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq '.permissions[] | select(.schema_id == "'$SCHEMA_ID'" and .type == "ECOSYSTEM")'
```

---

## CLI

### Usage
```bash
veranad tx perm create-perm [schema-id] [type] [did] [flags]
```

**Positional args**
- `schema-id`: ID of the credential schema
- `type`: Permission type use lowercase **issuer** or **verifier**.
- `did`: DID of the Verifiable Service that will hold the permission

**Common flags (per `-h`)**
- `--country string` — ISO‑3166 alpha‑2 (e.g., `US`, `FR`)
- `--effective-from timestamp (RFC 3339)` — must be in the **future**
- `--effective-until timestamp (RFC 3339)` — must be **after** `--effective-from` (omit for no expiry)
- `--verification-fees uint` — issuer-only; fees in trust units (omit for verifier)

---

## Examples

Set your environment:
```bash
USER_ACC="mat-test-acc"
CHAIN_ID="vna-testnet-1"
NODE_RPC=https://rpc.testnet.verana.network
SCHEMA_ID=5
```

### 1) Minimal ISSUER (OPEN mode)
```bash
veranad tx perm create-perm $SCHEMA_ID issuer did:example:123456789abcdefghi \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

### 2) ISSUER with flags
```bash
veranad tx perm create-perm $SCHEMA_ID issuer did:example:issuerService \
  --country US \
  --effective-from 2025-09-02T00:00:00Z \
  --effective-until 2026-09-01T00:00:00Z \
  --verification-fees 1000000 \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

### 3) Minimal VERIFIER (OPEN mode)
```bash
veranad tx perm create-perm $SCHEMA_ID verifier did:example:verifierService \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

> **Note:** For a **verifier** permission, do **not** set `--verification-fees`.

---

## Verify on-chain

Find the new permission (filter by schema and by your account):
```bash
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq '.permissions[] | select(.schema_id == "'$SCHEMA_ID'" and .created_by == "'$(veranad keys show $USER_ACC -a --keyring-backend test)'" )'
```

You should see:
- `type`: `ISSUER` or `VERIFIER`
- `validator_perm_id`: points to the ECOSYSTEM root permission for the schema
- Optional fields you provided (country, effective_from/until, fees) populated accordingly

---

## Common errors & fixes

- **Schema not in OPEN mode** → You’ll get an authorization error. Use a **validation process** instead: see [Run a Validation Process to Obtain a Permission](./run-a-validation-process-to-obtain-a-permission).
- **No root permission** → Ask the Trust Registry controller to [Create a Root Permission](./create-a-root-permission).
- **Invalid DID** → Ensure it follows DID Core syntax (e.g., `did:example:xyz`, `did:web:example.com`).
- **Timestamps** → `effective-from` must be in the future; `effective-until` must be later than `effective-from`.
- **Fees on VERIFIER** → `validation-fees` and `verification-fees` are for ISSUER only.

---

## See also
- [Create a Root Permission](./create-a-root-permission)
- [Run a Validation Process to Obtain a Permission](./run-a-validation-process-to-obtain-a-permission)
- [Set Permission to Validated](./set-permission-to-validated)
- [Revoke a Permission](./permission-revocation)
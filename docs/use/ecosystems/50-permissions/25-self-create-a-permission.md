# Self-Create a Permission

Create an **ISSUER** or **VERIFIER** permission for a credential schema **when the schema is configured in OPEN mode**. This is the fastest way to become authorized to issue or verify credentials for that schema.

> **Heads‑up:** You must still comply with the Ecosystem Governance Framework (EGF). Even in OPEN mode, your permission can be revoked and deposits slashed if you violate the EGF.

:::warning Prerequisites
1. **Group account (authority)** — You need a [Cosmos SDK group account](https://docs.cosmos.network/v0.50/build/modules/group) that owns the Verifiable Service that will hold the permission.
2. **Operator authorization** — Your operator account must be granted authorization for `MsgCreatePermission` by the authority. See [Grant Operator Authorization](../delegation/grant-operator-authorization).
3. **Schema in OPEN mode** — The schema's `issuer_perm_management_mode` (for ISSUER) or `verifier_perm_management_mode` (for VERIFIER) must be `OPEN`. Otherwise, use [Run a Validation Process](./run-a-validation-process-to-obtain-a-permission).
4. **Active ECOSYSTEM (root) permission** — The schema must have an active root permission. See [Create a Root Permission](./create-a-root-permission) if one does not exist.
5. **`effective-from` in the future** — If you set `--effective-from`, it must be at least 30–90 seconds ahead of the current time.
:::

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
veranad tx perm create-perm [type] [validator-perm-id] [did] \
  --authority <group-account> \
  --from <operator-account> [flags] --node $NODE_RPC
```

**Positional args**
- `type`: Permission type — use lowercase **issuer** or **verifier**.
- `validator-perm-id`: ID of the root (ECOSYSTEM) permission for the schema.
- `did`: DID of the Verifiable Service that will hold the permission.

**Common flags (per `-h`)**
- `--authority string` — Group account (authority) on whose behalf this message is executed (**mandatory**)
- `--country string` — ISO‑3166 alpha‑2 (e.g., `US`, `FR`)
- `--effective-from timestamp (RFC 3339)` — must be in the **future**
- `--effective-until timestamp (RFC 3339)` — must be **after** `--effective-from` (omit for no expiry)
- `--verification-fees uint` — issuer-only; fees in trust units (omit for verifier)

---

## Examples

Set your environment:
```bash
AUTHORITY_ACC="verana1groupaccountaddress"
OPERATOR_ACC="mat-test-acc"
CHAIN_ID="vna-testnet-1"
NODE_RPC=https://rpc.testnet.verana.network
VALIDATOR_PERM_ID=1   # root (ECOSYSTEM) perm ID for the schema
```

### 1) Minimal ISSUER (OPEN mode)
```bash
veranad tx perm create-perm issuer $VALIDATOR_PERM_ID did:example:123456789abcdefghi \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

### 2) ISSUER with flags
```bash
veranad tx perm create-perm issuer $VALIDATOR_PERM_ID did:example:issuerService \
  --authority $AUTHORITY_ACC \
  --country US \
  --effective-from 2026-09-02T00:00:00Z \
  --effective-until 2027-09-01T00:00:00Z \
  --verification-fees 1000000 \
  --from $OPERATOR_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

### 3) Minimal VERIFIER (OPEN mode)
```bash
veranad tx perm create-perm verifier $VALIDATOR_PERM_ID did:example:verifierService \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

> **Note:** For a **verifier** permission, do **not** set `--verification-fees`.

---

## Verify on-chain

Find the new permission (filter by your authority account):
```bash
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq '.permissions[] | select(.authority == "'$AUTHORITY_ACC'")'
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
- **Missing authority** → You must provide `--authority` with the group account address.

---

## See also
- [Create a Root Permission](./create-a-root-permission)
- [Run a Validation Process to Obtain a Permission](./run-a-validation-process-to-obtain-a-permission)
- [Set Permission to Validated](./set-permission-to-validated)
- [Revoke a Permission](./permission-revocation)
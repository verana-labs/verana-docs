# Join an Ecosystem

## Module Overview

```bash
veranad tx perm               
Transactions commands for the perm module

Usage:
  veranad tx perm [flags]
  veranad tx perm [command]

Available Commands:
  cancel-perm-vp-request        Cancel a pending perm VP request
  confirm-vp-termination        Confirm the termination of a perm VP
  create-or-update-perm-session Create or update a perm session
  create-perm                   Create a new perm for open schemas
  create-root-perm              Create a new root perm for a credential schema
  extend-perm                   Extend a perm's effective duration
  renew-perm-vp                 Renew a perm validation process
  repay-perm-slashed-td         Repay a slashed perm's trust deposit
  request-vp-termination        Request termination of a perm validation process
  revoke-perm                   Revoke a perm
  set-perm-vp-validated         Set perm validation process to validated state
  slash-perm-td                 Slash a perm's trust deposit
  start-perm-vp                 Start a new perm validation process
```

---

## Before You Start: How Schema Rules Affect Onboarding

When joining an ecosystem, your onboarding path depends on **permission management modes** configured in the **Credential Schema**.  
For each schema:

- **Issuer Perm Management Mode** and **Verifier Perm Management Mode** can be:
  - `1` = **OPEN** → you can self-create the permission.
  - `2` = **GRANTOR_VALIDATION** → you need validation from a Grantor.
  - `3` = **ECOSYSTEM** → you need validation from an Ecosystem-level validator.

See [Create a Credential Schema](../17-create-a-credential-schema.md) for how these modes are defined.

---

### Permission Types

| Type ID | Role              |
|---------|-------------------|
| 1       | Issuer           |
| 2       | Verifier         |
| 3       | Issuer-Grantor   |
| 4       | Verifier-Grantor |
| 5       | Ecosystem        |
| 6       | Holder           |

These types are required when creating permissions or running validation processes.

---

## Onboarding Process

### 1. List available Ecosystems

```bash
veranad q tr list-trust-registries --node $NODE_RPC --output json
```

---

### 2. Review the Governance Framework

Check the governance framework URL (`doc-url`) and verify its `digest_sri` hash matches.

---

### 3. Identify Credential Schemas

List schemas for the selected Trust Registry:

```bash
veranad q cs list-schemas --node $NODE_RPC --output json
```

Set your Schema ID for further steps:

```bash
SCHEMA_ID=5
```

---

### 4. Determine Onboarding Path

Based on **schema configuration** and your target **permission type**, the required action varies:

#### For Issuance Permissions (or VC issuance):

| Role              | OPEN Mode                              | ECOSYSTEM Mode                                        | GRANTOR Mode                                              |
|-------------------|---------------------------------------|--------------------------------------------------------|-----------------------------------------------------------|
| Issuer Grantor    | N/A                                   | N/A                                                    | Validation process with Ecosystem validator              |
| Issuer            | **Self-create** (Permission type = 1) | Validation with Ecosystem (Permission type = 5)        | Validation with Issuer Grantor (Permission type = 3)     |
| Holder            | Self-create Issuer, then self-issue   | Validation with Issuer, then get credential            | Validation with Issuer, then get credential              |

#### For Verification Permissions:

| Role              | OPEN Mode                              | ECOSYSTEM Mode                                        | GRANTOR Mode                                              |
|-------------------|---------------------------------------|--------------------------------------------------------|-----------------------------------------------------------|
| Verifier Grantor  | N/A                                   | N/A                                                    | Validation process with Ecosystem validator              |
| Verifier          | **Self-create** (Permission type = 2) | Validation with Ecosystem (Permission type = 5)        | Validation with Verifier Grantor (Permission type = 4)   |

---

## 5. Self-Create a Permission (OPEN Mode)

Use this for Issuer or Verifier roles when the schema allows **OPEN** mode.

**Syntax:**
```bash
veranad tx perm create-perm <schema-id> <permission-type> <did> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Example:**
```bash
veranad tx perm create-perm $SCHEMA_ID 1 did:example:123456789abcdefghi \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

---

## 6. Start a Validation Process (GRANTOR or ECOSYSTEM Mode)

If the schema requires **validation**, you cannot self-create the permission. Instead:

1. Request a validator (Grantor or Ecosystem) based on the schema policy.
2. Start the validation process using:

```bash
veranad tx perm start-perm-vp <schema-id> <permission-type> <did> --from $USER_ACC --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```

**Example:**
```bash
veranad tx perm start-perm-vp $SCHEMA_ID 1 did:example:123456789abcdefghi \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

---

### Verify Permissions
```bash
veranad q perm list-permissions --node $NODE_RPC --output json
```

---

✅ **Next Step:** If acting as a validator, see the [Validation Process Guide](../../learn/verifiable-public-registry/onboarding-participants#validation-process).

**Note:** For schema creation and permission modes, see [Create a Credential Schema](../17-create-a-credential-schema.md).

(Visual flow diagram placeholder)
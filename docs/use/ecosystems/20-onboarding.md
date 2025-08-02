# Join an Ecosystem

Learn how to join an ecosystem and obtain permissions for issuing, verifying, or holding credentials.

## Quick Decision Flow

```
What role do you need?
    ↓
Check the schema configuration (issuer and verifier modes)
    ↓
If mode = OPEN → Self-create permission
If mode = GRANTOR or ECOSYSTEM → Start a validation process
    ↓
Once permission is granted, act as Issuer / Verifier / Holder
```

```plantuml
@startuml
start
:List Ecosystems (trust registries);
:Review Governance Framework;
:List Credential Schemas;
if (Schema Mode = OPEN?) then (Yes)
  :Self-create Permission;
  stop
else (No)
  :Start Validation Process;
  :Validator reviews applicant (off-chain);
  if (Approved?) then (Yes)
    :Validator sets permission VALIDATED;
    stop
  else (No)
    :Process ends (Rejected);
    stop
endif
@enduml
```

## Core Concepts

### Permission Management Modes

| Mode ID | Mode Name           | Meaning                                                  |
|---------|---------------------|----------------------------------------------------------|
| 1       | OPEN                | Self-create your permission—no validation required.      |
| 2       | GRANTOR_VALIDATION  | A Grantor (Issuer Grantor or Verifier Grantor) must validate you. |
| 3       | ECOSYSTEM           | The Ecosystem controller must validate you.              |

### Permission Types

| ID | Role              | Description                                                  |
|----|-------------------|--------------------------------------------------------------|
| 1  | Issuer            | Can issue credentials for this schema.                      |
| 2  | Verifier          | Can request verification of credentials for this schema.    |
| 3  | Issuer-Grantor    | Validates issuers and grants them permissions.              |
| 4  | Verifier-Grantor  | Validates verifiers and grants them permissions.            |
| 5  | Ecosystem         | Controls trust registry and manages schema governance.      |
| 6  | Holder            | Holds credentials issued under this schema.                 |

> **Additional Context:**  
> IDs 3–6 represent roles that are not commonly requested during standard onboarding but are critical for ecosystem governance:
> - **3 (Issuer-Grantor):** Validates and grants Issuer permissions under GRANTOR mode.
> - **4 (Verifier-Grantor):** Validates and grants Verifier permissions under GRANTOR mode.
> - **5 (Ecosystem):** Represents the Trust Registry controller (creates root permissions and manages governance).
> - **6 (Holder):** Typically does not require explicit permission creation; holders obtain credentials by issuance.
> These roles usually come into play during ecosystem setup or for advanced governance scenarios.

> **Note:**  
> These numeric IDs represent internal enum values used by the Verana protocol and appear in on-chain data and JSON query outputs.  
> - For example, `type: "1"` means `ISSUER`, `type: "2"` means `VERIFIER`.  
> - The CLI does **not** use numbers as input; it accepts lowercase names like `issuer` or `verifier`.  
> This mapping is useful for developers reading raw chain data or integrating APIs.

> **Special Case: Grantors**  
> Grantor roles (Issuer-Grantor, Verifier-Grantor) are not part of the typical onboarding flow for Issuers or Verifiers because:  
> - They are governance roles, not operational roles.  
> - Their creation usually requires out-of-band approval by the Ecosystem controller or existing Grantors.  
>  
> **Why does this matter?**  
> - If you are onboarding as an Issuer or Verifier, you follow the standard path (OPEN or validation).  
> - If you need to become a Grantor, you must go through a dedicated process that includes governance approval and a validation transaction.

## Onboarding Steps

### 1. List Available Ecosystems
```bash
veranad q tr list-trust-registries --node $NODE_RPC --output json
```

**Example Output:**
```json
{
  "trust_registries": [
    {
      "id": "1",
      "did": "did:example:ecosystemA",
      "controller": "verana1abcdxyz...",
      "aka": "https://ecosystem.example",
      "active_version": 1,
      "versions": [
        {
          "version": 1,
          "documents": [
            {
              "language": "en",
              "url": "https://example.com/egf.pdf",
              "digest_sri": "sha384-abc123..."
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 2. Review Governance Framework

Locate the `doc-url` for the chosen ecosystem and verify its `digest_sri` hash to ensure the governance framework is authentic.

---

### 3. Identify Credential Schemas
```bash
veranad q cs list-schemas --node $NODE_RPC --output json
```

**Example Output:**
```json
{
  "schemas": [
    {
      "id": "5",
      "tr_id": "1",
      "json_schema": "{\"$schema\":\"https://json-schema.org/draft/2020-12/schema\",\"$id\":\"/vpr/v1/cs/js/1\",\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"}},\"required\":[\"name\"]}",
      "issuer_perm_management_mode": "OPEN",
      "verifier_perm_management_mode": "GRANTOR_VALIDATION"
    }
  ]
}
```

Set your schema ID for subsequent commands:

```bash
SCHEMA_ID=5
```

---

### 4. Determine Your Path

⚠️ **Root Permission Required**  
Each schema must have an ECOSYSTEM root permission created by the Trust Registry controller. Without it, no other permissions (issuer, verifier) can be granted. See [Create Root Permission](17-create-a-credential-schema.md#4-create-a-root-permission).

Based on the schema configuration and the role you want to assume, your onboarding path differs:

| Role              | OPEN Mode                              | ECOSYSTEM Mode                                        | GRANTOR Mode                                              |
|-------------------|---------------------------------------|--------------------------------------------------------|-----------------------------------------------------------|
| Issuer Grantor    | N/A                                   | N/A                                                    | Validation process with Ecosystem validator              |
| Issuer            | **Self-create** (Permission type = 1) | Validation with Ecosystem (Permission type = 5)        | Validation with Issuer Grantor (Permission type = 3)     |
| Holder            | Self-create Issuer, then self-issue   | Validation with Issuer, then get credential            | Validation with Issuer, then get credential (may require fees and trust deposit)              |
| Verifier Grantor  | N/A                                   | N/A                                                    | Validation process with Ecosystem validator              |
| Verifier          | **Self-create** (Permission type = 2) | Validation with Ecosystem (Permission type = 5)        | Validation with Verifier Grantor (Permission type = 4)   |

Holders typically obtain credentials from Issuers. If you already have Issuer permission, you can self-issue.

---

### 5. Self-Create a Permission (OPEN Mode)

Use this for Issuer or Verifier roles when the schema allows **OPEN** mode.

**Syntax:**
```bash
veranad tx perm create-perm <schema-id> <permission-type> <did> [effective-from] [effective-until] [verification-fees] \
  --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

Optional parameters: `effective-from`, `effective-until`, and `verification-fees` can be provided as per ecosystem policy.

#### Parameters Explained:
  - `<schema-id>`: The numeric ID of the credential schema (e.g., `5`).
  - `<permission-type>`: The role you want to assume for the schema.  
    - **Spec Enum Values:** `ISSUER` or `VERIFIER`  
    - **CLI Input:** Use lowercase values:  
      - `issuer` → Permission for issuing credentials  
      - `verifier` → Permission for verifying credentials
  - `<did>`: The Decentralized Identifier (DID) for the Verifiable Service that will hold this permission (e.g., `did:example:123456789abcdefghi`).

**Important:**  
  - The CLI accepts lowercase (`issuer`, `verifier`) for `<permission-type>`.  
  - These map to the spec's enum values `ISSUER` and `VERIFIER` internally.

**Example:**
```bash
veranad tx perm create-perm $SCHEMA_ID issuer did:example:123456789abcdefghi \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

---

### 6. Start a Validation Process (GRANTOR or ECOSYSTEM Mode)

If the schema requires validation, you cannot self-create the permission. Instead:

1. Identify the validator (Grantor or Ecosystem) based on the schema policy.
2. Start the validation process:

**Syntax:**
```bash
veranad tx perm start-perm-vp <permission-type> <validator-perm-id> <country> \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Example:**
```bash
veranad tx perm start-perm-vp issuer 123 US \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

#### Parameters Explained:
- `<permission-type>`: issuer | verifier | issuer-grantor | verifier-grantor | holder
- `<validator-perm-id>`: ID of the validator permission you are applying under (find using `veranad q perm list-permissions`).
- `<country>`: ISO 3166-1 alpha-2 country code for your location.

> **Important:** You must have enough balance to cover:
> - Estimated transaction fees
> - Validation fees × trust unit price
> - Trust deposit (validation fees × trust deposit rate)

📌 **What happens next?**

- A validation entry is created on-chain.
- Off-chain, the validator contacts you (usually via DIDComm) to:
  - Prove control of your DID and Verana account.
  - Provide required documents defined in the Ecosystem Governance Framework (EGF).
- Once approved, the validator marks the process as validated and your permission is activated.

---

### Onboarding as a Grantor (Issuer-Grantor or Verifier-Grantor)

Grantor roles are essential for validating Issuers or Verifiers in GRANTOR mode. If you are approved to become a Grantor, you must create your permission using a validation process initiated by the Ecosystem controller or an existing Grantor.

**Steps:**
1. Obtain approval from the Ecosystem governance team (off-chain).
2. Use the `start-perm-vp` command with the appropriate `permission-type` set to `issuer-grantor` or `verifier-grantor`.

**Syntax:**
```bash
veranad tx perm start-perm-vp <permission-type> <validator-perm-id> <country> \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Example:**
```bash
# Apply to become an Issuer-Grantor
veranad tx perm start-perm-vp issuer-grantor 45 US \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC

# Apply to become a Verifier-Grantor
veranad tx perm start-perm-vp verifier-grantor 45 US \
  --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Validator-perm-id**: Use the permission ID of the Ecosystem root permission or an authorized Grantor who will validate your request.

📌 **Important:** Grantors typically require a higher trust deposit and may have specific obligations outlined in the Ecosystem Governance Framework.

---

### Verify Your Permissions

After onboarding, verify your permissions with:

```bash
veranad q perm list-permissions --node $NODE_RPC --output json
```

## Advanced Details

- **Off-chain validation** involves steps such as proof of DID control, sharing documents, and completing other checks.
- Some roles may require **paying validation fees** and a **trust deposit** as part of the onboarding process.
- If you are a **Holder**, you typically obtain credentials from an Issuer or self-issue if you already have Issuer permission.
- For more information on the validation process, see [Validation Process Guide](../../learn/verifiable-public-registry/onboarding-participants#validation-process).

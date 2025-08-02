# Create or Update Permission Session

A **Permission Session** is required for credential exchange processes that involve **paying issuance or verification fees** according to the permission hierarchy. This session ensures correct fee distribution to all beneficiaries (e.g., Issuers, Verifiers, and Ecosystem controllers) and maintains trust deposit compliance.

---

## What is a Permission Session?

A Permission Session acts as a temporary authorization and accounting record that connects:

- The **agent** (Verifiable Service or Wallet) handling the request.
- The **issuer or verifier** performing the action.
- The **wallet agent** where the credential will be stored.

This session is referenced during issuance or verification to:

- Validate permissions.
- Calculate and transfer trust fees.
- Enforce trust deposit rules.

---

## When to Create or Update a Permission Session?

- **Issuance Flow:** Before an Issuer issues a credential to a Holder.
- **Verification Flow:** Before a Verifier requests presentation of a credential.

Without a valid session:
- The transaction **will fail** because trust fee distribution cannot be performed.
- The credential exchange cannot proceed.

---

## CLI Command

### Syntax
```
veranad tx perm create-or-update-perm-session [id] [agent-perm-id] [flags]
```

### Command Description
Create or update a permission session with the specified parameters:

- **id**: UUID of the session
- **agent-perm-id**: ID of the agent permission (usually HOLDER)

Optional parameters:
- **issuer-perm-id**: ID of the issuer permission
- **verifier-perm-id**: ID of the verifier permission
- **wallet-agent-perm-id**: ID of the wallet agent permission if different from the agent

**Important:** At least one of `issuer-perm-id` or `verifier-perm-id` must be provided.

---

## Examples

*Note: Optional parameters such as issuer-perm-id, verifier-perm-id, and wallet-agent-perm-id are passed as flags.*

### 1. Issuance Session
```bash
SESSION_ID=$(uuidgen)
veranad tx perm create-or-update-perm-session $SESSION_ID 45 --issuer-perm-id 30 --wallet-agent-perm-id 50 \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```
Explanation:
- `agent-perm-id` = 45 (Agent handling issuance).
- `wallet-agent-perm-id` = 50 (Wallet where credential will be stored).
- `issuer-perm-id` = 30 (Permission of the Issuer).

---

### 2. Verification Session
```bash
SESSION_ID=$(uuidgen)
veranad tx perm create-or-update-perm-session $SESSION_ID 45 --verifier-perm-id 60 --wallet-agent-perm-id 50 \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```
Explanation:
- `agent-perm-id` = 45 (Agent handling verification).
- `wallet-agent-perm-id` = 50 (Wallet where credential will be stored).
- `verifier-perm-id` = 60 (Permission of the Verifier).

---

## Workflow Diagram (Issuance)
```plantuml
@startuml
scale max 800 width
actor "Agent" as agent
participant "VPR" as vpr #3fbdb6
actor "Issuer" as issuer
actor "Holder" as holder

holder -> issuer: Request Credential
issuer -> agent: Prepare Issuance
agent -> vpr: create-or-update-perm-session
vpr -> vpr: Validate and persist session
agent -> issuer: Session validated, proceed
issuer -> holder: Issue credential
holder -> wallet: Store credential
@enduml
```

---

## Workflow Diagram (Verification)
```plantuml
@startuml
scale max 800 width
actor "Verifier" as verifier
actor "Agent" as agent
participant "VPR" as vpr #3fbdb6
actor "Holder" as holder

verifier -> agent: Request Verification
agent -> vpr: create-or-update-perm-session
vpr -> vpr: Validate and persist session
agent -> verifier: Session validated, proceed
verifier -> holder: Request presentation
holder -> verifier: Provide credential proof
@enduml
```

---

## Key Points
- Fees are calculated based on the **permission hierarchy** and **GlobalVariables**.
- Both issuance and verification sessions require a valid **agent** and **wallet agent** permission.
- Failure to create the session before the exchange will block the process.

For details on fee calculation and hierarchy, see [Permission Module Spec](https://verana-labs.github.io/verifiable-trust-vpr-spec/#permission-module).

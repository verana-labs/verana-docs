import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Self-Create a Participant

Create an **ISSUER** or **VERIFIER** participant for a credential schema **when the schema is configured in OPEN management mode** (`MOD-PP-MSG-14`, `MsgSelfCreateParticipant`). This is the fastest way to become authorized to issue or verify credentials for that schema — no onboarding process required.

> **Heads-up:** You must still comply with the Ecosystem Governance Framework (EGF). Even in OPEN mode, your participant can be revoked and its deposit slashed if you violate the EGF.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) that owns the Verifiable Service — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees and trust deposit.
3. An **operator** granted authorization for `/verana.pp.v1.MsgSelfCreateParticipant` via [Grant Operator Authorization](../delegation/grant-operator-authorization).
4. A schema in **OPEN** management mode for the relevant role, with an active **ECOSYSTEM (root)** participant — see [Create a Root Participant](./create-a-root-participant).

Sign with `--from <operator>` and pass the corporation with `--corporation <policy_address>`.
:::

## When can you self-create?

You can self-create when the schema's management mode for your role is **OPEN**:

- **For ISSUER**: the schema's issuer management mode is `OPEN`.
- **For VERIFIER**: the schema's verifier management mode is `OPEN`.

Additionally, the schema must have an **active ECOSYSTEM (root) participant** (created by the Ecosystem controller). Check with:

```bash
# Inspect issuer/verifier modes
veranad query cs list-schemas --node $NODE_RPC --output json | jq

# Ensure a root (ECOSYSTEM) participant exists for the schema
veranad query pp list-participants --schema-id 8 --role ecosystem --node $NODE_RPC --output json
```

If the schema is **not** in OPEN mode, use [Run an Onboarding Process](./run-an-onboarding-process-to-obtain-a-participant) instead.

## Message Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `role` | `issuer` or `verifier`. | yes |
| `validator-participant-id` | ID of the root (ECOSYSTEM) participant for the schema. | yes |
| `did` | DID of the Verifiable Service that will hold the participant. | yes |
| `--corporation` | `policy_address` of the owning Corporation. | yes |
| `--validation-fees <uint>` | Fee (trust units) charged by an ISSUER for a holder onboarding process. | no |
| `--verification-fees <uint>` | Fee (trust units) an ISSUER charges a verifier. | no |
| `--effective-from` / `--effective-until` | Optional RFC3339 validity window. | no |

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage
```bash
veranad tx pp self-create-participant [role] [validator-participant-id] [did] \
  --corporation <policy_address> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example — ISSUER (OPEN mode)

```bash
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q
VALIDATOR_PARTICIPANT_ID=11   # ECOSYSTEM root participant for the schema

veranad tx pp self-create-participant issuer $VALIDATOR_PARTICIPANT_ID \
  did:example:18c0df8c0e1f210891b43cfe1686375d \
  --corporation $CORPORATION \
  --validation-fees 25 --verification-fees 50 \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

> **Note:** For a **verifier** participant, do not set `--validation-fees` / `--verification-fees` (issuer-only).

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, links and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

## Verify on-chain

The example above self-creates participant **12**. Query it:
```bash
veranad query pp get-participant 12 --node $NODE_RPC --output json
```

```json
{
  "participant": {
    "id": "12",
    "schema_id": "8",
    "role": "ISSUER",
    "did": "did:example:18c0df8c0e1f210891b43cfe1686375d",
    "created": "2026-07-10T08:14:27.220107Z",
    "effective_from": "2026-07-10T08:14:35.064065Z",
    "effective_until": "2027-07-05T08:13:50.055379Z",
    "modified": "2026-07-10T08:14:27.220107Z",
    "validation_fees": "25",
    "verification_fees": "50",
    "validator_participant_id": "11",
    "op_state": "VALIDATED",
    "op_last_state_change": "2026-07-10T08:14:27.220107Z",
    "corporation_id": "6"
  }
}
```

Note that a self-created participant is immediately `VALIDATED` — no onboarding process runs.

## Common errors & fixes

- **Schema not in OPEN mode** → run an [onboarding process](./run-an-onboarding-process-to-obtain-a-participant) instead.
- **No root participant** → ask the Ecosystem controller to [Create a Root Participant](./create-a-root-participant).
- **Unauthorized operator** → grant `/verana.pp.v1.MsgSelfCreateParticipant` to the operator first.

## See also
- [Create a Root Participant](./create-a-root-participant)
- [Run an Onboarding Process](./run-an-onboarding-process-to-obtain-a-participant)
- [Revoke a Participant](./participant-revocation)

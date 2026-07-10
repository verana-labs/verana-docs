# Participant Sessions

:::info Terminology
This concept was previously called a *permission session*. In VPR v4 it is a
**participant session** (the `pp` module's `ParticipantSession`). The page filename is kept
for stable links, but the concept — and every command — uses the **participant** term.
:::

A **participant session** records the credential-exchange operations between Participants so
that **pay-per-issuance (PPI)** and **pay-per-verification (PPV)** fees can be charged and
distributed. For a Verifiable User Agent, the session is what ties an issuance or
verification to the agent (and its wallet agent) so the agent earns its
[reward share](./ecosystem-rewards).

A session is controlled by a Corporation and holds one or more **session records**, each
capturing the participants involved in a single credential-exchange operation.

## Create or update a session

```bash
veranad tx pp create-or-update-participant-session [id] \
  --corporation [corporation] \
  --issuer-participant-id [uint] \
  --verifier-participant-id [uint] \
  --agent-participant-id [uint] \
  --wallet-agent-participant-id [uint] \
  --digest [string]
```

Key flags (from the CLI help):

- At least one of **`--issuer-participant-id`** or **`--verifier-participant-id`** must be
  provided — these identify the PPI issuer and/or PPV verifier for the operation.
- **`--agent-participant-id`** and **`--wallet-agent-participant-id`** — set **only when the
  peer is a Verifiable User Agent**. They point to the agent's User Agent Credential issuer
  Participant and its wallet-agent Participant, which is how user-agent and wallet
  user-agent rewards are attributed.
- **`--digest`** — an optional digest derived from the issued or verified credential.
- **`--corporation`** — the Corporation (group policy address) on whose behalf the session
  is written; this is a **delegable** transaction.

:::warning Prerequisites
`create-or-update-participant-session` is a **delegable** transaction executed on behalf of
a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for
   `/verana.pp.v1.MsgCreateOrUpdateParticipantSession` via
   [Grant Operator Authorization](../ecosystems/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation as `--corporation`.
:::

For a full worked example with a live tx response, see
[Create or update a participant session](../ecosystems/pay-per-issuance-or-verification/create-or-update-participant-session).

## Inspect sessions (read-only)

Get a single session by id:

```bash
veranad query pp get-participant-session [id]
```

```json
{
  "session": {
    "id": "d9f96456-fe25-46a2-b115-4a6198b1bf7d",
    "corporation_id": "6",
    "vs_operator": "verana16mzeyu9l6kua2cdg9x0jk5g6e7h0kk8q6uadu4",
    "created": "2026-07-10T08:10:00.555798Z",
    "modified": "2026-07-10T08:10:05.587186Z",
    "session_records": [
      {
        "id": "1",
        "created": "2026-07-10T08:10:00.555798Z",
        "issuer_participant_id": "6",
        "wallet_agent_participant_id": "8",
        "agent_participant_id": "8"
      },
      {
        "id": "2",
        "created": "2026-07-10T08:10:05.587186Z",
        "issuer_participant_id": "6",
        "wallet_agent_participant_id": "8",
        "agent_participant_id": "8"
      }
    ]
  }
}
```

Note the `agent_participant_id` / `wallet_agent_participant_id` on each record — these are
populated because the peer is a VUA, and they drive the reward distribution.

List all sessions (supports `--modified-after`, `--response-max-size` for pagination):

```bash
veranad query pp list-participant-sessions
```

## Pay-per fees and beneficiaries

The fees charged through a session flow to the Participants in the tree above the
issuer/verifier. To see who is paid for a given issuer/verifier:

```bash
veranad query pp find-beneficiaries --issuer-participant-id [uint] --verifier-participant-id [uint]
```

For the full pay-per concept and beneficiary distribution, see:

- [How PPI and PPV work](../ecosystems/pay-per-issuance-or-verification/how-ppi-and-ppv-work)
- [Get a participant session](../ecosystems/pay-per-issuance-or-verification/get-participant-session)
- [Find beneficiaries](../ecosystems/pay-per-issuance-or-verification/find-beneficiaries)
- [Ecosystem rewards](./ecosystem-rewards)

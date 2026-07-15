# Participant Module

The Participant (`pp`) module manages **participants** — the on-chain authorizations that let a Verifiable Service issue, verify, or grant credentials within an Ecosystem. It is the v4 replacement for the removed Permission (`perm`) module: "permission" is now "participant", and the old **Validation Process (VP)** is now the **onboarding process (OP)**.

All `pp` transaction messages are **delegable**: they are signed by an `operator` (`--from`) and executed on behalf of a **Corporation** whose `policy_address` is passed with the `--corporation` **flag** (not a positional argument). The operator must have been granted authorization for the exact `Msg` type-URL via the [Delegation (`de`) module](./delegation). None of the `pp` messages are governance-only.

Refer to the [Environments section](../environments/10-environments.md) for RPC endpoints, and [set up environment variables](../run-a-node/30-remote-cli.md) for the target network.

:::warning Delegable prerequisites
Every tx below requires a registered [Corporation](../../../use/corporation/create-a-corporation) (`policy_address`), a funded policy, and an operator granted authorization for the relevant type-URL. Sign with `--from <operator>` and pass `--corporation <policy_address>`. The delegable type-URLs are:

`/verana.pp.v1.MsgCreateRootParticipant`, `MsgSelfCreateParticipant`, `MsgStartParticipantOP`, `MsgSetParticipantOPToValidated`, `MsgRenewParticipantOP`, `MsgCancelParticipantOPLastRequest`, `MsgSetParticipantEffectiveUntil`, `MsgRevokeParticipant`, `MsgSlashParticipantTrustDeposit`, `MsgRepayParticipantSlashedTrustDeposit`, `MsgCreateOrUpdateParticipantSession`, `MsgTriggerResolver`.
:::

The examples below use a real testnet Corporation and operator:

```bash
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q
CHAIN_ID="vna-testnet-1"
NODE_RPC=https://rpc.testnet.verana.network
```

## Transaction Messages

| Spec ID | Command | Signature | Description |
|---------|---------|-----------|-------------|
| MOD-PP-MSG-1 | `start-participant-op` | `[role] [validator-participant-id] [did]` | Start a participant onboarding process |
| MOD-PP-MSG-2 | `renew-participant-op` | `[id]` | Renew a participant onboarding process |
| MOD-PP-MSG-3 | `set-participant-op-validated` | `[id]` | Set an onboarding process to VALIDATED |
| MOD-PP-MSG-6 | `cancel-participant-op-request` | `[id]` | Cancel a pending OP request |
| MOD-PP-MSG-7 | `create-root-participant` | `[schema-id] [did] [validation-fees] [issuance-fees] [verification-fees]` | Create the root (ECOSYSTEM) participant |
| MOD-PP-MSG-8 | `set-participant-effective-until` | `[id] [effective-until]` | Adjust a participant's effective duration |
| MOD-PP-MSG-9 | `revoke-participant` | `[id]` | Revoke a participant |
| MOD-PP-MSG-10 | `create-or-update-participant-session` | `[id]` | Create/update a participant session (PPI/PPV) |
| MOD-PP-MSG-12 | `slash-participant-td` | `[id] [amount] [reason]` | Slash a participant's trust deposit |
| MOD-PP-MSG-13 | `repay-participant-slashed-td` | `[id] --corporation [corporation]` | Repay a slashed participant's deposit |
| MOD-PP-MSG-14 | `self-create-participant` | `[role] [validator-participant-id] [did] --corporation [corporation]` | Self-create an ISSUER/VERIFIER (OPEN mode) |
| MOD-PP-MSG-15 | `trigger-resolver` | `[id] --corporation [corporation] --operator [operator]` | Signal a resolver to re-resolve a DID |

All commands also require the global flags shown in the examples (`--from`, `--chain-id`, `--keyring-backend`, `--fees`, `--gas`, `--node`).

### Create a Root Participant

`MOD-PP-MSG-7`. Only the Ecosystem controller can create the root (ECOSYSTEM) participant. Requires `--effective-from` (future timestamp).

```bash
veranad tx pp create-root-participant 3 did:example:18c0df1833f9f2002c4395780e84af3b 100 50 25 \
  --corporation $CORPORATION --effective-from 2026-07-10T08:06:20Z \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits `create_root_participant` with `root_participant_id: "3"`, `validation_fees: "100"`, `issuance_fees: "50"`, `verification_fees: "25"` (txhash `0D410489...`).

### Self-Create a Participant (OPEN mode)

`MOD-PP-MSG-14`. For schemas in OPEN management mode.

```bash
veranad tx pp self-create-participant issuer 11 did:example:18c0df8c0e1f210891b43cfe1686375d \
  --corporation $CORPORATION --validation-fees 25 --verification-fees 50 \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Creates a `VALIDATED` ISSUER participant (id `12`, `validator_participant_id: 11`).

### Start a Participant Onboarding Process

`MOD-PP-MSG-1`. Roles: `issuer`, `verifier`, `issuer-grantor`, `verifier-grantor`, `ecosystem`, `holder`.

```bash
veranad tx pp start-participant-op issuer-grantor 1 did:example:18c0deef42d88ad05c25093ca7f60d46 \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Creates a `PENDING` participant (id `2`) and emits `start_participant_op` (txhash `2D4BDC66...`).

### Set Participant OP to Validated

`MOD-PP-MSG-3`. Called by the validator's Corporation. Optional fee/expiry flags: `--effective-until`, `--validation-fees`, `--issuance-fees`, `--verification-fees`, `--issuance-fee-discount`, `--verification-fee-discount`, `--op-summary-digest`.

```bash
veranad tx pp set-participant-op-validated 2 \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits `set_participant_op_to_validated` (txhash `871E4DD2...`).

### Renew a Participant Onboarding Process

`MOD-PP-MSG-2`. Preserves the existing fees; moves the participant back to `PENDING` until re-validated.

```bash
veranad tx pp renew-participant-op 2 \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Cancel a Pending OP Request

`MOD-PP-MSG-6`. Sets a never-validated participant to `TERMINATED` (or resets a renewal to `VALIDATED`) and refunds fees.

```bash
veranad tx pp cancel-participant-op-request 2 \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits `cancel_participant_op_last_request` (txhash `191301EF...`).

### Adjust a Participant (Effective Until)

`MOD-PP-MSG-8`. May increase or reduce `effective_until`.

```bash
veranad tx pp set-participant-effective-until 3 2028-06-29T08:06:45Z \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits `set_participant_effective_until` with `new_effective_until` (txhash `54F6C712...`).

### Revoke a Participant

`MOD-PP-MSG-9`. Executable by an ancestor validator, the participant's own Corporation, or the Ecosystem controller.

```bash
veranad tx pp revoke-participant 4 \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits `revoke_participant` with `revoked_at` (txhash `3BECF3A7...`).

### Create or Update a Participant Session

`MOD-PP-MSG-10`. At least one of `--issuer-participant-id` / `--verifier-participant-id` is required. Set `--agent-participant-id` / `--wallet-agent-participant-id` only when the peer is a Verifiable User Agent.

```bash
veranad tx pp create-or-update-participant-session d9f96456-fe25-46a2-b115-4a6198b1bf7d \
  --issuer-participant-id 6 --agent-participant-id 8 --wallet-agent-participant-id 8 \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits `create_update_csps` (txhash `5EA754A7...`).

### Slash a Participant Trust Deposit

`MOD-PP-MSG-12`. A non-empty `reason` is mandatory (`MOD-PP-MSG-12-1`). The slashed amount is burned.

```bash
veranad tx pp slash-participant-td 10 10 "journey 308 test slash" \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits `burn` + `slash_participant_trust_deposit` with `slashed_amount: "10"` (txhash `EE3FD47B...`).

### Repay a Slashed Participant Trust Deposit

`MOD-PP-MSG-13`. Only the owning Corporation may repay. Does not revive the participant.

```bash
veranad tx pp repay-participant-slashed-td 10 --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Trigger a Resolver

`MOD-PP-MSG-15`. Emits a `trigger_resolver` event only — does not modify VPR state. Requires both `--corporation` and `--operator`.

```bash
veranad tx pp trigger-resolver 14 --corporation $CORPORATION --operator $OPERATOR \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits `trigger_resolver` with `participant_id=14` (txhash `A9861613...`).

## Queries

| Spec ID | Command | Signature | Description |
|---------|---------|-----------|-------------|
| MOD-PP-QRY-1 | `list-participants` | (filter flags) | List participants with server-side filters |
| MOD-PP-QRY-2 | `get-participant` | `[id]` | Get a participant by ID |
| MOD-PP-QRY-3 | `find-participants-with-did` | `[did] [role] [schema-id]` | Find participants by DID + role + schema |
| MOD-PP-QRY-4 | `find-beneficiaries` | (participant-id flags) | Find beneficiary participants in the tree |
| MOD-PP-QRY-5 | `get-participant-session` | `[id]` | Get a participant session by UUID |
| — | `list-participant-sessions` | (filter flags) | List participant sessions |
| — | `params` | | Get module parameters |

### List Participants

Server-side filter flags: `--schema-id`, `--participant-id`, `--role` (`issuer`…`holder`), `--did`, `--grantee`, `--op-state` (`pending`/`validated`/`terminated`), `--only-valid`, `--only-slashed`, `--only-repaid`, `--modified-after`, `--when`, `--response-max-size`.

```bash
veranad query pp list-participants --schema-id 3 --role ecosystem --node $NODE_RPC --output json
```

### Get a Participant

```bash
veranad query pp get-participant 3 --node $NODE_RPC --output json
```

```json
{
  "participant": {
    "id": "3",
    "schema_id": "3",
    "role": "ECOSYSTEM",
    "did": "did:example:18c0df1833f9f2002c4395780e84af3b",
    "created": "2026-07-10T08:06:09.158617Z",
    "adjusted": "2026-07-10T08:06:49.399925Z",
    "effective_from": "2026-07-10T08:06:20.510395Z",
    "effective_until": "2027-01-06T08:06:52.550388Z",
    "modified": "2026-07-10T08:06:49.399925Z",
    "validation_fees": "100",
    "issuance_fees": "50",
    "verification_fees": "25",
    "op_state": "VALIDATED",
    "op_last_state_change": "2026-07-10T08:06:09.158617Z",
    "corporation_id": "6"
  }
}
```

### Find Participants with DID

The `role` positional is **numeric** (`1`=ISSUER, `2`=VERIFIER, `3`=ISSUER_GRANTOR, `4`=VERIFIER_GRANTOR, `5`=ECOSYSTEM, `6`=HOLDER). Optional `--when <RFC3339>`.

```bash
veranad query pp find-participants-with-did did:example:18c0df1833f9f2002c4395780e84af3b 5 3 --node $NODE_RPC --output json
```

### Find Beneficiaries

At least one of `--issuer-participant-id` / `--verifier-participant-id`. Walks the full ancestor chain (`MOD-PP-QRY-4-3`).

```bash
veranad query pp find-beneficiaries --issuer-participant-id 6 --node $NODE_RPC --output json
```

### Get a Participant Session

```bash
veranad query pp get-participant-session d9f96456-fe25-46a2-b115-4a6198b1bf7d --node $NODE_RPC --output json
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
      }
    ]
  }
}
```

### List Participant Sessions

Filter flags: `--modified-after <RFC3339>`, `--response-max-size <1-1024>`.

```bash
veranad query pp list-participant-sessions --node $NODE_RPC --output json
```

### Get Module Parameters

```bash
veranad query pp params --node $NODE_RPC --output json
```

```json
{
  "params": {
    "validation_term_requested_timeout_days": "7"
  }
}
```

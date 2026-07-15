import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Set Participant to Validated

Finalize an **onboarding process (OP)** by setting the applicant's participant to `VALIDATED` (`MOD-PP-MSG-3`, `MsgSetParticipantOPToValidated`). This activates the participant so the grantee can operate (issue / verify / grant) under the target Credential Schema.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) that controls the **validator** participant (the ECOSYSTEM root or the Grantor the applicant applied under) — see [Create a Corporation](../../corporation/create-a-corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.pp.v1.MsgSetParticipantOPToValidated` via [Grant Operator Authorization](../../corporation/delegation/grant-operator-authorization).
4. A **pending OP** — the target participant must be in `op_state = PENDING`.

Sign with `--from <operator>` and pass the corporation with `--corporation <policy_address>`.
:::

## Preconditions

- The target participant exists and its `op_state` is `PENDING`.
- Your Corporation is the owner of the validator participant recorded in the applicant's `validator_participant_id`.
- Your policy has enough balance to cover gas/fees.

## Message Parameters

| Name | Flag | Description | Mandatory |
|------|------|-------------|-----------|
| Participant ID | _(positional)_ | ID of the applicant participant to validate. | Yes |
| Corporation | `--corporation` | Validator's Corporation `policy_address`. | Yes |
| Effective Until | `--effective-until` | RFC3339 timestamp when the participant expires. Omit for "no expiry". | No |
| Validation Fees | `--validation-fees` | Fee (trust units) an ISSUER charges a Holder in an onboarding process. ISSUER only. | No |
| Issuance Fees | `--issuance-fees` | Fee (trust units) applied on issuance. ISSUER only. | No |
| Verification Fees | `--verification-fees` | Fee (trust units) a Verifier pays an Issuer to verify. ISSUER only. | No |
| OP Summary Digest (SRI) | `--op-summary-digest` | Optional digest (e.g. `sha384-...`) of the off-chain onboarding summary. | No |
| Issuance Fee Discount | `--issuance-fee-discount` | 0–10000, where 10000 = 100% discount. Default 0. | No |
| Verification Fee Discount | `--verification-fee-discount` | 0–10000, where 10000 = 100% discount. Default 0. | No |

> Fees set here become the **effective** fees for this participant. For VERIFIER participants, fee flags are ignored.

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx pp set-participant-op-validated <participant-id> \
  --corporation <policy_address> \
  --from <operator> --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC \
  [--effective-until 2027-12-31T23:59:59Z] \
  [--validation-fees 100] [--issuance-fees 50] [--verification-fees 25] \
  [--issuance-fee-discount 0] [--verification-fee-discount 0] \
  [--op-summary-digest sha384-BASE64...]
```

### Example — minimal

```bash
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q

veranad tx pp set-participant-op-validated 2 \
  --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Real result

Succeeds with `code: 0` and emits `set_participant_op_to_validated` for participant 2 (txhash `871E4DD25B0D4AD0BD7F470C9B237AB2505A81D9BB09D0AAC35587980CDDAE21`):

```yaml
- type: message
  attributes:
  - key: action
    value: /verana.pp.v1.MsgSetParticipantOPToValidated
- type: set_participant_op_to_validated
  attributes:
  - key: participant_id
    value: "2"
  - key: validator_participant_id
    value: "1"
  - key: validation_fees
    value: "0"
  - key: issuance_fees
    value: "0"
  - key: verification_fees
    value: "0"
  - key: corporation_id
    value: "6"
```

  </TabItem>

  <TabItem value="verify" label="Verify Result">

```bash
veranad query pp get-participant 2 --node $NODE_RPC --output json
```

Check that `op_state == "VALIDATED"` and any optional fields you set (effective_until, fees) are reflected.

  </TabItem>
</Tabs>

## What this changes on-chain

- Sets `op_state` → `VALIDATED`.
- Updates optional fields you provided (expiry, fees).
- The participant becomes **active** for its role (ISSUER can issue, VERIFIER can request presentations, GRANTOR can validate others).

## Troubleshooting

- **not authorized / operator authorization not found** → the signer's Corporation is not the recorded validator for the applicant participant, or the operator lacks the grant. Use the correct validator Corporation and grant `/verana.pp.v1.MsgSetParticipantOPToValidated`.
- **fees ignored on VERIFIER** → only ISSUER participants carry validation/issuance/verification fees.

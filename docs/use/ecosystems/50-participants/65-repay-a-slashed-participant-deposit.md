import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Repay a Slashed Participant Deposit

Repay the full slashed trust deposit of a participant (`MOD-PP-MSG-13`, `MsgRepayParticipantSlashedTrustDeposit`). This can only be called by the **Corporation that owns the participant**.

Repaying does **not** make the slashed participant reusable — a new participant must be requested. However, repaying the slashed deposit is a **prerequisite** for the owner to obtain a new participant in that ecosystem.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) that owns the slashed participant — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees and the repayment.
3. An **operator** granted authorization for `/verana.pp.v1.MsgRepayParticipantSlashedTrustDeposit` via [Grant Operator Authorization](../delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation with `--corporation <policy_address>`.
:::

## Message Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `id` | Numeric ID of the participant whose slashed deposit to repay. | yes |
| `--corporation` | `policy_address` of the Corporation that owns the participant. | yes |

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx pp repay-participant-slashed-td <id> --corporation <corporation> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example

```bash
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q

veranad tx pp repay-participant-slashed-td 10 --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Real result

Succeeds with `code: 0`; the participant's `repaid_deposit` is recorded (journey 309, participant 10 — "RepayPermissionSlashedTrustDeposit succeeded for perm 10", repaid_deposit=10).

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, links and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

## Verify

```bash
veranad query pp get-participant 10 --node $NODE_RPC --output json
```

Real testnet state after repayment (`slashed_deposit` and `repaid_deposit` both `10`):

```json
{
  "participant": {
    "id": "10",
    "role": "ISSUER",
    "slashed": "2026-07-10T08:12:16.375173Z",
    "repaid": "2026-07-10T08:12:46.564729Z",
    "deposit": "20000000",
    "slashed_deposit": "10",
    "repaid_deposit": "10",
    "validator_participant_id": "9",
    "op_state": "VALIDATED",
    "corporation_id": "6"
  }
}
```

## See also
- [Slash a Participant Deposit](./slash-a-participant)
- [Create a Root Participant](./create-a-root-participant)

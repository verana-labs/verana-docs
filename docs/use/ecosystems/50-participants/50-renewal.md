import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Renew (Extend) a Participant

Renewing a participant re-runs its **onboarding process (OP)** to extend validity without creating a new participant or changing its terms (`MOD-PP-MSG-2`, `MsgRenewParticipantOP`). Useful when the current participant is about to expire but the validator relationship remains valid.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) that owns the participant to renew — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.pp.v1.MsgRenewParticipantOP` via [Grant Operator Authorization](../delegation/grant-operator-authorization).
4. The participant in **VALIDATED** state, with its original validator still active. Renewal **preserves** the existing fees — to change them, start a new onboarding process instead.

Sign with `--from <operator>` and pass the corporation with `--corporation <policy_address>`.
:::

## Message Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `id` | Numeric ID of the participant to renew. | yes |
| `--corporation` | `policy_address` of the owning Corporation. | yes |

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx pp renew-participant-op <id> \
  --corporation <policy_address> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example

```bash
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q

veranad tx pp renew-participant-op 2 \
  --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Real result

Succeeds with `code: 0` and emits `renew_participant_op` (a renewal moves the participant back to `PENDING` until the validator re-validates it):

```yaml
- type: message
  attributes:
  - key: action
    value: /verana.pp.v1.MsgRenewParticipantOP
- type: renew_participant_op
  attributes:
  - key: participant_id
    value: "2"
  - key: validator_participant_id
    value: "1"
  - key: validation_fees
    value: "0"
  - key: validation_deposit
    value: "0"
  - key: corporation_id
    value: "6"
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, links and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

## Verify renewal

```bash
veranad query pp get-participant 2 --node $NODE_RPC --output json
```

After the validator re-validates with [Set Participant to Validated](./set-participant-to-validated), `op_state` returns to `VALIDATED` with an extended `effective_until`.

## See also
- [Run an Onboarding Process](./run-an-onboarding-process-to-obtain-a-participant)
- [Set Participant to Validated](./set-participant-to-validated)
- [Cancel a Pending OP Request](./cancel-op-pending-action)

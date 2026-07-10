import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cancel a Pending OP Request

Cancel a pending participant **onboarding process (OP)** before it completes (`MOD-PP-MSG-6`, `MsgCancelParticipantOPLastRequest`). Can only be executed by the participant's authority and only while the participant is in `PENDING` state.

Useful when:
- The applicant submitted incorrect details.
- The validator has not yet completed their part and the applicant wants to withdraw.
- The applicant wishes to stop the process to avoid additional trust deposit usage or fees.

When an onboarding process is cancelled:
- If it never completed (first-time OP), the participant entry is set to **TERMINATED**.
- If it had previously been validated and was being renewed, the participant is reset to **VALIDATED**.
- Trust deposit and fees are refunded where applicable.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) that owns the participant with the pending OP — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.pp.v1.MsgCancelParticipantOPLastRequest` via [Grant Operator Authorization](../delegation/grant-operator-authorization).
4. The participant in **PENDING** state.

Sign with `--from <operator>` and pass the corporation with `--corporation <policy_address>`.
:::

## Message Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `id` | Numeric ID of the participant whose current OP you want to cancel. | yes |
| `--corporation` | `policy_address` of the owning Corporation. | yes |

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx pp cancel-participant-op-request <id> \
  --corporation <policy_address> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example

```bash
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q

veranad tx pp cancel-participant-op-request 2 \
  --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Real result

Succeeds with `code: 0` and emits `cancel_participant_op_last_request` (txhash `191301EFDA9B93D69E7CCFA3D515E4A1F7FC4A9E693E0501B0856670C90D41A3`). The journey verified: "permission is TERMINATED after cancel" and "op_current_fees=0, op_current_deposit=0 (fees refunded)".

```yaml
- type: message
  attributes:
  - key: action
    value: /verana.pp.v1.MsgCancelParticipantOPLastRequest
- type: cancel_participant_op_last_request
  attributes:
  - key: participant_id
    value: "2"
  - key: corporation
    value: verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, links and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

## Verify

```bash
veranad query pp get-participant 2 --node $NODE_RPC --output json
```

Expected `op_state`: `TERMINATED` (a cancelled first-time OP) or `VALIDATED` (a cancelled renewal). Real testnet state for participant 2:

```json
{
  "participant": {
    "id": "2",
    "role": "ISSUER_GRANTOR",
    "validator_participant_id": "1",
    "op_state": "TERMINATED",
    "op_last_state_change": "2026-07-10T08:04:48.663674Z",
    "corporation_id": "6"
  }
}
```

## See also
- [Run an Onboarding Process](./run-an-onboarding-process-to-obtain-a-participant)
- [Renew a Participant](./renewal)

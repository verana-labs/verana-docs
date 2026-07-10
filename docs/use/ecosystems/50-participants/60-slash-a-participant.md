import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Slash a Participant Deposit

The Trust Deposit linked to a participant can be slashed (`MOD-PP-MSG-12`, `MsgSlashParticipantTrustDeposit`) by:

- the **validator ancestor** that onboarded the participant;
- the **Ecosystem controller** (owner of the root participant of this credential schema).

A **non-empty reason** is required (`MOD-PP-MSG-12-1`). The slashed amount is **burned** and cannot be recovered.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) that controls the validator participant or the schema's Ecosystem — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.pp.v1.MsgSlashParticipantTrustDeposit` via [Grant Operator Authorization](../delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation with `--corporation <policy_address>`.
:::

## Message Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `id` | Numeric ID of the participant whose deposit to slash. | yes |
| `amount` | Amount to slash (≤ the participant's current deposit). | yes |
| `reason` | Non-empty reason string, recorded in the event. | yes |
| `--corporation` | `policy_address` of the slashing Corporation. | yes |

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx pp slash-participant-td <id> <amount> <reason> \
  --corporation <policy_address> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example

```bash
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q

veranad tx pp slash-participant-td 10 10 "journey 308 test slash" \
  --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Real result

Succeeds with `code: 0`; the slashed amount is burned and the participant's `slashed_deposit` is recorded (txhash `EE3FD47BD8E4824050F70D010849D7A047B63D7E8C4CE4E021C46F3FBAC89B36`):

```yaml
- type: burn
  attributes:
  - key: amount
    value: 10uvna
- type: slash_participant_trust_deposit
  attributes:
  - key: participant_id
    value: "10"
  - key: slashed_amount
    value: "10"
  - key: reason
    value: journey 308 test slash
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
veranad query pp get-participant 10 --node $NODE_RPC --output json
```

Real testnet state shows the slash recorded (and later repaid):

```json
{
  "participant": {
    "id": "10",
    "role": "ISSUER",
    "deposit": "20000000",
    "slashed": "2026-07-10T08:12:16.375173Z",
    "slashed_deposit": "10",
    "validator_participant_id": "9",
    "op_state": "VALIDATED",
    "corporation_id": "6"
  }
}
```

> A slashed participant cannot be revived. To operate again, the owner must repay the slashed deposit ([Repay a Slashed Participant Deposit](./repay-a-slashed-participant-deposit)) and request a new participant.

## See also
- [Repay a Slashed Participant Deposit](./repay-a-slashed-participant-deposit)
- [Revoke a Participant](./participant-revocation)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Adjust a Participant

Adjust a participant's **effective duration** by setting a new `effective_until` (`MOD-PP-MSG-8`, `MsgSetParticipantEffectiveUntil`). Use this to extend or shorten the validity period of an existing participant without a full renewal. In v4 the value may be **increased or reduced**.

Executed by the participant's own Corporation (for ECOSYSTEM or self-created participants) or by the validator's Corporation (for OP-managed participants).

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) that controls the participant — the participant's own Corporation (ECOSYSTEM / self-created) or the validator's Corporation (OP-managed) — see [Create a Corporation](../../corporation/create-a-corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.pp.v1.MsgSetParticipantEffectiveUntil` via [Grant Operator Authorization](../../corporation/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation with `--corporation <policy_address>`.
:::

## Message Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `id` | Numeric ID of the participant to adjust. | yes |
| `effective-until` | New expiration timestamp (RFC3339). | yes |
| `--corporation` | `policy_address` of the controlling Corporation. | yes |

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx pp set-participant-effective-until <id> <effective-until> \
  --corporation <policy_address> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example

```bash
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q

veranad tx pp set-participant-effective-until 3 2028-06-29T08:06:45Z \
  --corporation $CORPORATION \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Real result

Succeeds with `code: 0` and emits `set_participant_effective_until` (txhash `54F6C712E1D32F5E9C9CE0ECA0B4DDD50E44FDD1EA70C4736F89B95974648877`):

```yaml
- type: set_participant_effective_until
  attributes:
  - key: new_effective_until
    value: 2028-06-29 08:06:45.542802 +0000 UTC
  - key: corporation_id
    value: "6"
  - key: operator
    value: verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q
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
veranad query pp get-participant 3 --node $NODE_RPC --output json
```

The response includes an `adjusted` timestamp and the updated `effective_until`. Real testnet state after adjustment:

```json
{
  "participant": {
    "id": "3",
    "role": "ECOSYSTEM",
    "adjusted": "2026-07-10T08:06:49.399925Z",
    "effective_until": "2027-01-06T08:06:52.550388Z",
    "op_state": "VALIDATED",
    "corporation_id": "6"
  }
}
```

## See also
- [Create a Root Participant](./create-a-root-participant)
- [Renew a Participant](./renewal)
- [Revoke a Participant](./participant-revocation)

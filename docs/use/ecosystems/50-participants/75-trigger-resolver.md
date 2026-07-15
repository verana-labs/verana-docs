import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Trigger a Resolver

Emit an on-chain event signaling that a **trust resolver** must re-resolve the DID registered in a participant entry (`MOD-PP-MSG-15`, `MsgTriggerResolver`). This is one of the two **trust-resolution primitives** of the `pp` module (the other is the [find-participants-with-did](./find-participants-with-did) query).

This message **does not modify VPR state** — it only emits a `trigger_resolver` event that off-chain resolvers listen for, prompting them to re-fetch and re-verify the participant's DID document.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) — an **ancestor validator** of the target participant, or the participant's own Corporation — see [Create a Corporation](../../corporation/create-a-corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.pp.v1.MsgTriggerResolver` via [Grant Operator Authorization](../../corporation/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass **both** the corporation and the operator flags.
:::

## Message Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `id` | Numeric ID of the participant whose DID should be re-resolved. | yes |
| `--corporation` | `policy_address` of the Corporation on whose behalf the message runs. | yes |
| `--operator` | Operator account authorized by the corporation to run this message. | yes |

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx pp trigger-resolver <id> \
  --corporation <policy_address> --operator <operator> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example

```bash
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q

veranad tx pp trigger-resolver 14 \
  --corporation $CORPORATION --operator $OPERATOR \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Real result

Succeeds and emits a `trigger_resolver` event for the target participant (journey 311, txhash `A986161300C2E66CF7366C8E76ADAD397E2C9929D1030B8BE8BBA42A52D22E43`):

> `OK Step 8: "trigger_resolver" event emitted with participant_id=14`

The event is validated via **ancestor-validator authorization** — a validator in the participant's branch may trigger a re-resolution of the child's DID.

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, links and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

## See also
- [Find Participants with DID](./find-participants-with-did)
- [Participant Module reference](../../../run/network/modules/participant)

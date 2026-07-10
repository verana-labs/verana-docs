import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create a Root Participant

A Credential Schema always requires at least one **root participant** (role: `ECOSYSTEM`). After creating a credential schema, the **Ecosystem controller** (the Corporation that owns the schema's Ecosystem) must create a root participant for that schema (`MOD-PP-MSG-7`, `MsgCreateRootParticipant`).

**Why it matters**
- It anchors the participant hierarchy for the schema (enables Grantors, Issuers, Verifiers).
- It defines the default trust fees (validation, issuance, verification) used by the ecosystem.
- Without an active root participant:
  - Candidates cannot run an onboarding process with the Ecosystem controller.
  - Even in `OPEN` mode, candidates cannot self-create ISSUER/VERIFIER participants — a root must exist as the validator of last resort.

**Overlaps & rotation**
- Multiple root participants can co-exist only if their **effective periods do not overlap**.
- If an existing root participant has no `effective_until`, set an end date before creating a new one.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) that controls the schema's Ecosystem — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.pp.v1.MsgCreateRootParticipant` via [Grant Operator Authorization](../delegation/grant-operator-authorization).
4. An **existing credential schema** — see [Create a Credential Schema](../credential-schemas/create-a-credential-schema).

Sign with `--from <operator>` and pass the corporation with `--corporation <policy_address>`.
:::

## Message Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `schema-id` | ID of the credential schema. | yes |
| `did` | DID of the Verifiable Service that will hold the root participant. | yes |
| `validation-fees` | Fee (trust units) charged for each onboarding process under this schema. | yes |
| `issuance-fees` | Fee (trust units) applied to each issuance under this schema. | yes |
| `verification-fees` | Fee (trust units) applied to each verification under this schema. | yes |
| `--corporation` | `policy_address` of the owning Corporation. | yes |
| `--effective-from` | RFC3339 timestamp from which the participant is effective (must be in the future). | yes |
| `--effective-until` | Optional RFC3339 timestamp until which the participant is effective. | no |

> Trust fees are priced in the ecosystem's trust unit; gas/tx fees are paid in chain tokens (`uvna`).

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx pp create-root-participant [schema-id] [did] [validation-fees] [issuance-fees] [verification-fees] \
  --corporation <policy_address> \
  --effective-from <RFC3339> [--effective-until <RFC3339>] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example

Set your environment first (values below are from a real testnet run):
```bash
SCHEMA_ID=3
ROOT_DID=did:example:18c0df1833f9f2002c4395780e84af3b
CORPORATION=verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
OPERATOR=verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q
CHAIN_ID="vna-testnet-1"
NODE_RPC=https://rpc.testnet.verana.network
```

Create the root participant with fees `100/50/25`:
```bash
veranad tx pp create-root-participant $SCHEMA_ID $ROOT_DID 100 50 25 \
  --corporation $CORPORATION \
  --effective-from 2026-07-10T08:06:20Z \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

### Real result

The transaction succeeds with `code: 0` and emits a `create_root_participant` event (txhash `0D410489E466B0B7E798FA6F60DD7A5034D5AA62A80867692E8BA4939A6DF4ED`):

```yaml
- type: message
  attributes:
  - key: action
    value: /verana.pp.v1.MsgCreateRootParticipant
  - key: module
    value: pp
- type: create_root_participant
  attributes:
  - key: root_participant_id
    value: "3"
  - key: schema_id
    value: "3"
  - key: corporation
    value: verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu
  - key: corporation_id
    value: "6"
  - key: operator
    value: verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q
  - key: validation_fees
    value: "100"
  - key: issuance_fees
    value: "50"
  - key: verification_fees
    value: "25"
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, links and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

## Verify

Query the new participant by its ID:
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
    "effective_from": "2026-07-10T08:06:20.510395Z",
    "effective_until": "2027-07-05T08:06:20.510395Z",
    "modified": "2026-07-10T08:06:09.158617Z",
    "validation_fees": "100",
    "issuance_fees": "50",
    "verification_fees": "25",
    "op_state": "VALIDATED",
    "op_last_state_change": "2026-07-10T08:06:09.158617Z",
    "corporation_id": "6"
  }
}
```

You should see a participant with `role: "ECOSYSTEM"`, your `did`, the fees you set, and `op_state: "VALIDATED"`.

## Common errors

- **Unauthorized operator** → `authorization check failed: operator authorization not found for this corporation/operator pair`. Grant the operator `/verana.pp.v1.MsgCreateRootParticipant` first.
- **`effective-from` not in the future** → set it a few seconds ahead so it is still in the future when the block is produced.

## See also
- [Create a schema](../credential-schemas/create-a-credential-schema)
- [Self-create a participant (OPEN mode)](./self-create-a-participant)
- [Run an onboarding process (GRANTOR/ECOSYSTEM modes)](./run-an-onboarding-process-to-obtain-a-participant)

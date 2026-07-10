# Increase Active Governance Framework Version

`MOD-GF-MSG-2`

Post a message that activates the next Governance Framework version of the target subject — either an [Ecosystem](../../../learn/verifiable-public-registry/ecosystems) (set `--ecosystem-id`) or the signing [Corporation](../corporation)'s own CGF (omit `--ecosystem-id`). It sets the subject's `active_version` to `active_version + 1`.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion` via [Grant Operator Authorization](../delegation/grant-operator-authorization).
4. A draft version `active_version + 1` that already exists and contains a document in the subject's default language — [add the document first](./add-a-governance-framework-document).

Sign with `--from <operator>` and pass the corporation's `policy_address` as `[corporation]` and the operator as `[operator]`.
:::

## Message Parameters

| Name             | Description                                                              | Mandatory |
|------------------|--------------------------------------------------------------------------|-----------|
| `corporation`    | `policy_address` of the Corporation on whose behalf the message is executed | yes       |
| `operator`       | Operator account authorized to run this message                          | yes       |
| `--ecosystem-id` | Target Ecosystem ID. Omit to target the signing Corporation's own CGF.   | no        |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx gf increase-active-gf-version [corporation] [operator] \
  --ecosystem-id <id> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Example

```bash
veranad tx gf increase-active-gf-version $CORPORATION $OPERATOR \
  --ecosystem-id 1 \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

Example response:

```yaml
code: 0
events:
- type: message
  attributes:
  - key: action
    value: /verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion
  - key: module
    value: gf
- type: increase_active_gf_version
  attributes:
  - key: corporation
    value: verana1dlszg2sst9r69my4f84l3mj66zxcf3umcgujys30t84srg95dgvs9v9a3a
  - key: ecosystem_id
    value: "1"
  - key: gfv_id
    value: "6"
  - key: version
    value: "2"
gas_used: "72819"
txhash: C59BCD21E030A9105D032792E59265AEEC986D5DA3F72B0BD15208E190B31E62
```

If no document exists in the default language for the next version, the transaction is rejected:

```
no GFV for next version 4: no governance framework version available to activate
```

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

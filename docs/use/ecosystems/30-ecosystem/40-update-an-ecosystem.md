# Update an Ecosystem

`MOD-ES-MSG-2`

Post a message that rotates an [Ecosystem](../../../learn/verifiable-public-registry/ecosystems)'s DID. In spec v4 this is the only field `update-ecosystem` changes.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) that controls the ecosystem — see [Create a Corporation](../../corporation/create-a-corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.ec.v1.MsgUpdateEcosystem` via [Grant Operator Authorization](../../corporation/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` as the `[corporation]` argument.
:::

## Message Parameters

| Name          | Description                                                       | Mandatory |
|---------------|-------------------------------------------------------------------|-----------|
| `corporation` | `policy_address` of the Corporation that controls the ecosystem   | yes       |
| `id`          | ID of the ecosystem to update                                     | yes       |
| `did`         | New Decentralized Identifier (DID) — must follow DID-CORE syntax  | yes       |

:::info
The ecosystem must be controlled by the signing corporation (`ecosystem.corporation_id` must match). Rotating the DID to a value already held by an ecosystem controlled by a different Corporation is forbidden (`MOD-ES-MSG-2-2-1`).
:::

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx ec update-ecosystem [corporation] [id] [did] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Example

```bash
veranad tx ec update-ecosystem $CORPORATION 1 did:example:18c0de8b382b27289488be5aaabae72e \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example response

```yaml
code: 0
events:
- type: message
  attributes:
  - key: action
    value: /verana.ec.v1.MsgUpdateEcosystem
  - key: module
    value: ec
- type: update_ecosystem
  attributes:
  - key: ecosystem_id
    value: "1"
  - key: corporation_id
    value: "2"
  - key: did
    value: did:example:18c0de8b382b27289488be5aaabae72e
gas_used: "67973"
txhash: 2E38D26BDA0527FDAEB53649CC14934EE13D90A5E8DFFF294F52821680460B8E
```

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

# Create an Ecosystem

`MOD-ES-MSG-1`

Make sure you've read [the Learn section](../../../learn/verifiable-public-registry/ecosystems).

Post a message that creates a new [Ecosystem](../../../learn/verifiable-public-registry/ecosystems) on behalf of a [Corporation](../corporation). In a single transaction this creates the `Ecosystem`, its first `GovernanceFrameworkVersion` (version 1), and a `GovernanceFrameworkDocument` seeded from `doc-url` / `doc-digest-sri`.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.ec.v1.MsgCreateEcosystem` via [Grant Operator Authorization](../delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` as the `[corporation]` argument.
:::

## Message Parameters

| Name             | Description                                                              | Mandatory |
|------------------|--------------------------------------------------------------------------|-----------|
| `corporation`    | `policy_address` of the Corporation on whose behalf the ecosystem is created | yes       |
| `did`            | Decentralized Identifier (DID) of the ecosystem — must follow DID-CORE syntax | yes       |
| `language`       | BCP 47 primary language tag (e.g., `en`, `fr`, `es`), max 17 chars       | yes       |
| `doc-url`        | URL of the Governance Framework document in the primary language         | yes       |
| `doc-digest-sri` | Document hash with SRI format prefix (e.g., `sha384-...`)                | yes       |

:::info
The provided document MUST be in the same language as the ecosystem's primary `language`. Per the spec, a DID MAY be shared by several ecosystems, but all ecosystems sharing a `did` MUST be controlled by the same Corporation (the `(did, corporation_id)` consistency invariant, `MOD-ES-MSG-1-2-1`).
:::

## Required Environment Variables

```bash
CORPORATION=verana1dlszg2sst9r69my4f84l3mj66zxcf3umcgujys30t84srg95dgvs9v9a3a
OPERATOR=verana16xkw85ecwlh5pwy0uhutq3y6ddw0ycv4tnl6h6
CHAIN_ID=vna-testnet-1
NODE_RPC=https://rpc.testnet.verana.network
```

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx ec create-ecosystem [corporation] [did] [language] [doc-url] [doc-digest-sri] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Example

```bash
veranad tx ec create-ecosystem $CORPORATION did:example:18c0de7edb5fbab0691d56616f48043a en \
  https://example.com/ec-alpha-v1.pdf sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example response

The transaction emits an `add_gf_document` event (for the seeded GF v1) and a `create_ecosystem` event carrying the new `ecosystem_id`:

```yaml
code: 0
events:
- type: message
  attributes:
  - key: action
    value: /verana.ec.v1.MsgCreateEcosystem
  - key: module
    value: ec
- type: add_gf_document
  attributes:
  - key: ecosystem_id
    value: "1"
  - key: gfv_id
    value: "5"
  - key: gfd_id
    value: "6"
  - key: version
    value: "1"
  - key: language
    value: en
- type: create_ecosystem
  attributes:
  - key: ecosystem_id
    value: "1"
  - key: corporation_id
    value: "2"
  - key: did
    value: did:example:18c0de7edb5fbab0691d56616f48043a
  - key: language
    value: en
gas_used: "90138"
txhash: A907225E5992732156F75680DAAE97F724BB0C6556F88269E6AAFC626EE416C7
```

:::tip How to find the id of the ecosystem you just created
Read the `create_ecosystem` event from the transaction:

```bash
TX_HASH=A907225E5992732156F75680DAAE97F724BB0C6556F88269E6AAFC626EE416C7
veranad query tx $TX_HASH --node $NODE_RPC --output json \
| jq '.events[] | select(.type == "create_ecosystem") | .attributes | map({(.key): .value}) | add'
```
:::

If the operator is not authorized for this corporation, the transaction is rejected:

```
authorization check failed: operator authorization not found for this corporation/operator pair
```

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

## Publish your Ecosystem in your DID Document

Add the corresponding `service` entry to your DID Document to prove control of the DID, replacing `1` with your ecosystem `id`:

```json
"service": [
    {
      "id": "did:example:ecosystem#vpr-ecosystem-1",
      "type": "VerifiablePublicRegistry",
      "version": "1.0",
      "serviceEndpoint": ["vpr:verana:testnet"]
    }
  ]
```

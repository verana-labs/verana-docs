# Create a Trust Registry

`MOD-TR-MSG-1`

Make sure you've read [the Learn section](../../../learn/verifiable-public-registry/trust-registries).

Post a message that will modify the ledger state by creating a trust registry. This operation is **delegable** — it can be executed by an operator on behalf of an authority (group account).

This creates a TrustRegistry, a GovernanceFrameworkVersion (v1), and a GovernanceFrameworkDocument in a single transaction.

:::warning Prerequisites
Before creating a trust registry, ensure you have completed these steps:

1. **Create a group account** — The authority that controls the trust registry must be a [Cosmos SDK group](https://docs.cosmos.network/v0.50/build/modules/group) with a decision policy. This group will be the `authority`.
2. **Grant operator authorization** — Use the [Delegation module](../delegation/grant-operator-authorization) to authorize your operator account to execute TR messages on behalf of the authority (via a group proposal).
3. **Prepare your Ecosystem Governance Framework (EGF)** — Have your EGF document published at a public URL and calculate its `digest-sri` hash.
:::

## Message Parameters

| Name            | Description                                                        | Mandatory |
|-----------------|--------------------------------------------------------------------|-----------|
| authority       | Group account that will control the trust registry                 | yes       |
| did             | Decentralized Identifier (DID) — must follow DID-CORE syntax      | yes       |
| language        | BCP 47 default language tag (e.g., `en`, `fr`, `es`), max 17 chars | yes       |
| doc-url         | URL of the EGF in the default language                             | yes       |
| doc-digest-sri  | Hash (e.g., SHA-384) with SRI format prefix                       | yes       |
| aka             | Also Known As URI                                                  | no        |

## Required Environment Variables

Set the following environment variables before running the CLI commands:

```bash
USER_ACC=my-user-account
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
veranad tx tr create-trust-registry [authority] [did] [language] [doc-url] [doc-digest-sri] \
  [--aka <aka>] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

:::info
The `[authority]` is the group account address. The `--from` flag specifies the **operator** (transaction signer) who must be authorized by the authority.
:::

### Example #1: Basic creation

```bash
veranad tx tr create-trust-registry $AUTHORITY_ACC did:example:123456789abcdefghi en \
  https://example.com/doc sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Example #2: With AKA (Also Known As)

```bash
veranad tx tr create-trust-registry $AUTHORITY_ACC did:example:123456789abcdefghi en \
  https://example.com/doc001-01 sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68001 \
  --aka http://example.com \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

:::tip
How to find the id of the trust registry that was just created?
:::

```bash
TX_HASH=<replace with tx-hash>
veranad q tx $TX_HASH \
  --node $NODE_RPC --output json \
| jq '.events[] | select(.type == "create_trust_registry") | .attributes | map({(.key): .value}) | add'
```

Replace with the correct transaction hash.

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

## Publish your Trust Registry in your DID Document

Make sure to add the corresponding `service` entry to your DID Document in order to prove ownership of the DID, by replacing `1234` with your trust registry id and setting the serviceEndpoint:

```json
"service": [
    {
      "id": "did:example:ecosystem#vpr-schemas-trust-registry-1234",
      "type": "VerifiablePublicRegistry",
      "version": "1.0",
      "serviceEndpoint": ["vpr:verana:testnet"]
    }
  ]
```

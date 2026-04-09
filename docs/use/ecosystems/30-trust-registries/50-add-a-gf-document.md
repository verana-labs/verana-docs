# Add a Governance Framework Document

`MOD-TR-MSG-2`

Post a message that will modify the ledger state by adding an ecosystem governance framework document to a trust registry. This operation is **delegable**.

This can target an existing governance framework version or create a new version. The target version must be greater than the current `active_version`.

:::warning Prerequisites
1. **Group account (authority)** — You need a [Cosmos SDK group account](https://docs.cosmos.network/v0.50/build/modules/group) that controls the trust registry.
2. **Operator authorization** — Your operator account must be granted authorization for `MsgAddGovernanceFrameworkDocument` by the authority. See [Grant Operator Authorization](../delegation/grant-operator-authorization).
3. **Existing trust registry** — The target trust registry must already exist and be controlled by your authority.
4. **Target version** — The version you are adding a document to must be greater than the current `active_version`.
:::

## Message Parameters

| Name              | Description                                                               | Mandatory |
|-------------------|---------------------------------------------------------------------------|-----------|
| authority         | Group account that controls the trust registry                            | yes       |
| trust-registry-id | ID of the trust registry for which to add the EGF document               | yes       |
| doc-language      | Language of the added document (BCP 47 tag)                               | yes       |
| doc-url           | URL of the EGF in the specified language                                  | yes       |
| doc-digest-sri    | Hash (e.g., SHA-384) with SRI format prefix                              | yes       |
| version           | Version of the EGF this document will be added to                        | yes       |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx tr add-governance-framework-document [authority] [trust-registry-id] [doc-language] [doc-url] [doc-digest-sri] [version] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

**Note:** The following examples assume you have set `TRUST_REG_ID` and `AUTHORITY_ACC` environment variables.

### Example #1: Add document for next version

```bash
TRUST_REG_ID=5
veranad tx tr add-governance-framework-document $AUTHORITY_ACC ${TRUST_REG_ID} en \
  https://example.com/doc2 sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Example #2: Add document in different language for same version

```bash
TRUST_REG_ID=5
veranad tx tr add-governance-framework-document $AUTHORITY_ACC ${TRUST_REG_ID} fr \
  https://example.com/doc2-fr sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Example #3: Add document for version 3

```bash
TRUST_REG_ID=5
veranad tx tr add-governance-framework-document $AUTHORITY_ACC ${TRUST_REG_ID} es \
  https://example.com/doc3-es sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 3 \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">

You can also add a Governance Framework document using the [Verana Testnet Frontend](https://app.testnet.verana.network/tr).

:::tip
Make sure your wallet is connected and you're using an account with operator authorization for the Trust Registry's authority.
:::

  </TabItem>
</Tabs>

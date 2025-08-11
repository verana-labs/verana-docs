# Add a Governance Framework Document

Post a message that will modify the ledger state by adding an ecosystem governance framework to a trust registry.

:::tip
Only the account that is the controller of the trust registry can execute this method.
:::

## Message Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| trust-registry-id    |  id of the trust registry for which we want to add the EGF document.  | yes |
| doc-language    |  language of the added document.  | yes |
| doc-url    | URL of the EGF in the specified language.  | yes |
| doc-digest-sri    | hash (example: SHA-384) with SRI format prefix.  | yes |
| version    | version of the EGF this document will be added to.  | yes |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx tr add-governance-framework-document <trust-registry-id> <doc-language> <doc-url> <doc-digest-sri> <version> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

**Note:** The following examples assume you have set a `TRUST_REG_ID` environment variable, update it with your trust registry id.

### Example #1: Add document for next version

```bash
TRUST_REG_ID=5
veranad tx tr add-governance-framework-document ${TRUST_REG_ID} en https://example.com/doc2 sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Example #2: Add document in different language for same version

```bash
TRUST_REG_ID=5
veranad tx tr add-governance-framework-document ${TRUST_REG_ID} fr https://example.com/doc2-fr sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

### Example #3: Add document for version 3

```bash
TRUST_REG_ID=5
veranad tx tr add-governance-framework-document ${TRUST_REG_ID} es https://example.com/doc3-es sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 3 --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

  </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::todo
    TODO: describe here
    :::
  </TabItem>
</Tabs>

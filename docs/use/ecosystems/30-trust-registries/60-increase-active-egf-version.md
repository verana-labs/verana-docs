# Increase Active Governance Framework Version

Post a message that will modify the ledger state by increasing the active EGF version of a given trust registry.

:::tip
Only the account that is the controller of the trust registry can execute this method.
:::

## Message Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| trust-registry-id    |  id of the trust registry for which we want to increase the active EGF version.  | yes |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx tr increase-active-gf-version <trust-registry-id> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount>
```

**Note:** The following example assume you have set a `TRUST_REG_ID` environment variable:

```bash
TRUST_REG_ID=5
```

### Example

```bash
veranad tx tr increase-active-gf-version ${TRUST_REG_ID} --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Note:** This command will fail if there's no document in the default language for the next version.

  </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::todo
    TODO: describe here
    :::
  </TabItem>
</Tabs>

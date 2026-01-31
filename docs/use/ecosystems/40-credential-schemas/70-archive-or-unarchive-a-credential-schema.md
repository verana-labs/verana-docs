# Archive or Unarchive a Credential Schema

You can archive or unarchive a credential schema with the following command:

:::tip
Only the account that is the controller of the trust registry can execute this method.
:::

## Message Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| id    |  id of the trust registry to archive or unarchive.  | yes |
| archive   |  true archive, false unarchive.  | yes |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx ... --node $NODE_RPC
```

:::tip[TODO]
@matlux
:::

### Archive a Credential Schema

```bash
TRUST_REG_ID=5
veranad tx tr archive-trust-registry ${TRUST_REG_ID} true --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna  --node $NODE_RPC
```

### Unarchive a Credential Schema

```bash
TRUST_REG_ID=5
veranad tx tr archive-trust-registry ${TRUST_REG_ID} false --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna  --node $NODE_RPC
```
 </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>
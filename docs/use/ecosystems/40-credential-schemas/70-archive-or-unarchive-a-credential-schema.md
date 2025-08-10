# Archive or Unarchive a Trust Registry

You can archive or unarchive a trust registry with the following command:

## Message Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| trust-registry-id    |  id of the trust registry to archive or unarchive.  | yes |
| archive    |  true to archive, false to unarchive.  | yes |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx tr archive-trust-registry <trust-registry-id> <archive-flag> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount>
```

**Note:** The following example assume you have set a `TRUST_REG_ID` environment variable:

```bash
TRUST_REG_ID=5
```

### Archive a Trust Registry

```bash
veranad tx tr archive-trust-registry ${TRUST_REG_ID} true --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna 
```

### Unarchive a Trust Registry

```bash
veranad tx tr archive-trust-registry ${TRUST_REG_ID} false --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna 
```
 </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::todo
    TODO: describe here
    :::
  </TabItem>
</Tabs>
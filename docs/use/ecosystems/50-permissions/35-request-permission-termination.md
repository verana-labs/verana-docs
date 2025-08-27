# Request Permission Termination

Permission termination is the process of **ending the validity of an existing permission** in the ecosystem.

In can only be executed by the `grantee` of the permission.

- If the permission to terminate is of type ISSUER, ISSUER_GRANTOR, VERIFIER, VERIFIER_GRANTOR, ECOSYSTEM, it is terminated immediately and corresponding trust deposit is freed.
- if permission type is HOLDER, validator must call the [confirm permission termination](confirm-permission-termination) so that the permission is terminated and trust deposit freed.


## Message Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|

:::tip[TODO]
@matlux
:::

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx perm request-vp-termination <perm-id> --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto
```

:::tip[TODO]
@matlux
:::

### Example

```bash
veranad tx perm request-vp-termination $PERM_ID --from $USER_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

:::tip[TODO]
@matlux
:::

  </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>
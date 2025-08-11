# Create a Root Permission

A Credential Schema always requires at least a root permission. After creating a credential schema, a trust registry owner must create a root permission for its schema.

Things to consider:

- Several root permissions can co-exist, but they cannot overlap. If an existing permission has no `effective_until` set, it is not possible no create a new root permission, you must first terminate the existing one.
- If you credential schema has no active root permission: participants will not be able to run validation process with the trust registry controller anymore; or if the schema is set as `OPEN` candidates will not be able to self-create their ISSUER or VERIFIER permission.

:::tip
Only the account that is the controller of the trust registry that owns the credential schema can execute this method.
:::

## Message Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|

::tip[TODO]
@matlux
:::

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx ...
```
:::tip[TODO]
@matlux
:::

### Example

:::tip[TODO]
@matlux
:::

  </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::todo
    TODO: describe here
    :::
  </TabItem>
</Tabs>

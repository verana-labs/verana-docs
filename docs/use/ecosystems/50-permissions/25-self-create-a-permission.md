# Self Create a Permission

If the credential schema configuration allows it, candidates that would like to join as a participant of a credential schema can self-create their ISSUER or VERIFIER permission.

- if credential schema attribute `issuer_perm_management_mode` is set to `OPEN`, candidate can self-create its ISSUER permission;

- if credential schema attribute `verifier_perm_management_mode` is set to `OPEN`, candidate can self-create its VERIFIER permission;

:::tip
In any other credential schema permission management configuration mode (ECOSYSTEM, GRANTOR), self-creation of a permission is not possible, and candidate must run a validation process to obtain a permission.
:::

For a given credential schema, added to the conditions above, self creation of a permission requires an active root permission. Self-created permission will set this root permission as the validator.

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
# Create a Credential Schema

Make sure you've read [the Learn section](../../../learn/verifiable-public-registry/credential-schema).

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

:::tip[TODO]
@matlux
:::

```bash
veranad tx 
```

### Example

:::tip[TODO]
@matlux
:::

```bash
veranad tx 
```

### Example

:::tip[TODO]
@matlux
:::

```bash
veranad tx ...
```

:::tip
How to find the id of the credential schema that was just created?
:::

```bash
TX_HASH=4E7DEE1DFDE24A804E8BD020657EB22B07D54CBA695788ACB59D873B827F3CA6
veranad q tx ...
```

replace with the correct transaction hash.

  </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::todo
    TODO: describe here
    :::
  </TabItem>
</Tabs>

## Publish your Credential Schema

When the credential schema has been created, you now need to self-issue a Verifiable Trust Json Schema Credential with the DID of your trust registry, as specified in the [verifiable trust spec](https://verana-labs.github.io/verifiable-trust-spec/#vt-json-schema-cred-verifiable-trust-json-schema-credential).

### Create and publish the Json Schema Credential

Self issue your credential and publish the credential in a publicly accessible URL.

### Add the Json Schema Credential as a Linked-VP in your DID Document

Create and sign a presentation of your self-issued Verifiable Trust Json Schema Credential with your DID and present it in your DID Document as a linked-vp.

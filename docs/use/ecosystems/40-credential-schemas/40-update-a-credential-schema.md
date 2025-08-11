# Update a Credential Schema

Post a message that will modify the ledger state by updating a credential schema.

:::tip
Only the account that is the controller of the credential schema can execute this method.
:::

## Message Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| id    |  id of the trust registry to archive or unarchive.  | yes |
| issuer_grantor_validation_validity_period    |  maximum number of days an issuer grantor validation can be valid for.  | yes |
| verifier_grantor_validation_validity_period    |  maximum number of days an verifier grantor validation can be valid for.  | yes |
| issuer_validation_validity_period    |  number of days an issuer validation can be valid for.  | yes |
| verifier_validation_validity_period    |  maximum number of days an verifier validation can be valid for.  | yes |
| holder_validation_validity_period    |  maximum number of days an holder validation can be valid for.  | yes |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
  veranad tx tr update-trust-registry [id] [did] [flags]
```

### Example

```bash
veranad tx tr...
```

  </TabItem>
  
  <TabItem value="frontend" label="Frontend">
    :::todo
    TODO: describe here
    :::
  </TabItem>
</Tabs>

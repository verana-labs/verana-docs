# Run a Validation Process to Obtain a Permission

This method is executed by any candidate that would like to join an Ecosystem's credential schema, when the credential schema has been configured so that self-creating permission is not possible.

Refer to [the learn section](../../../learn/verifiable-public-registry/onboarding-participants) for understanding validation processes.

Use cases:

- if credential schema attribute `issuer_perm_management_mode` is set to `ECOSYSTEM`, a candidate that wants to obtain an ISSUER permission for this credential schema will need to run a validation process with the active root permission of the credential schema.

- if credential schema attribute `issuer_perm_management_mode` is set to `GRANTOR`, a candidate that wants to obtain an ISSUER permission for this credential schema will need to run a validation process with an active ISSUER_GRANTOR permission of the credential schema.

- if credential schema attribute `verifier_perm_management_mode` is set to `ECOSYSTEM`, a candidate that wants to obtain a VERIFIER permission for this credential schema will need to run a validation process with the active root permission of the credential schema.

- if credential schema attribute `verifier_perm_management_mode` is set to `GRANTOR`, a candidate that wants to obtain a VERIFIER permission for this credential schema will need to run a validation process with an active VERIFIER_GRANTOR permission of the credential schema.

finally in some cases it may be needed to run a validation process even for being issued a credential by an active ISSUER:

- if an holder candidate would like to obtain a permission from an ISSUER and the selected ISSUER permission has `validation_fees` set, then a validation process must take place.

:::tip
In any other credential schema permission management configuration mode (OPEN), self-creation of a permission is possible, and candidate must not run a validation process to obtain a permission.
:::

- When a permission is created using this method, its `vp_state` is set to `PENDING`.
- After having started the validation process, applicant must connect to validator `did` configured in permission to perform a set of user space steps to prove things, as defined in the EGF published in the trust registry of the ecosystem.
- Only the associated validator will have the right to to set it to `VALIDATED`, after having validated the candidate.

## Choose the Permission Type

Based on your need, and the configuration of the credential schema, choose if you want to apply as an ISSUER, VERIFIER, ISSUER_GRANTOR, VERIFIER_GRANTOR, or HOLDER.

## Select a Validator

Select a validator permission that will be your validator for the validation process and obtain your credential.
Choose your validator based on:

- the price they request for executing the validation process (usually a subscription business model, renewed each year)
- the possible fees they will charge for issuing/verifying credentials of this schema,
- the country where they operate,
- their reputation,
- etc.

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

## Connect to Validator Userspace Service

When the validation process message has been accepted, candidate can now connect to the DID of the validator (example: using the DIDComm protocol) or any other connection method defined by the validator, to start an interactive session with the validator and provide requested documentation.

As soon as documentation has been verified by the validator, validator will execute the [set permission to validated](set-permission-to-validated) method.

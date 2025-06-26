# Slash a Permission Deposit

## Perform a Permission Deposit Slash

The Trust Deposit linked to a Permission can be slashed by:

- the validator that granted the Permission;
- the Ecosystem Trust Registry controller (the `grantee` of the ECOSYSTEM permission of the Trust Registry).

:::tip[TODO]

@pratikasr
Finish documentation here.
:::

## Repay a Permission Slashed Deposit

This method can only be called by anyone that want to repay the deposit of a slashed perm. This won’t make the perm re-usable: it will be needed for the `grantee` to request a new permission, as slashed permissions cannot be revived (same happen for revoked, etc…).

:::warning

To get a new permission for a given Ecosystem, it is needed, using this method, to **first repay the deposit of a slashed permission**.

:::

:::tip[TODO]

@pratikasr
Finish documentation here.
:::
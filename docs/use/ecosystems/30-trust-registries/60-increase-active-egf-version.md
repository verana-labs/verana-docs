# Increase Active Governance Framework Version

`MOD-TR-MSG-3`

Post a message that will modify the ledger state by increasing the active EGF version of a given trust registry. This operation is **delegable**.

A GovernanceFrameworkVersion with `version = active_version + 1` must already exist and must contain at least one document in the trust registry's primary language.

:::tip
Only the authority (group account) that controls the trust registry can execute this method. The operator must be authorized by the authority.
:::

## Message Parameters

| Name              | Description                                                              | Mandatory |
|-------------------|--------------------------------------------------------------------------|-----------|
| authority         | Group account that controls the trust registry                           | yes       |
| trust-registry-id | ID of the trust registry for which to increase the active EGF version   | yes       |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx tr increase-active-gf-version [authority] [trust-registry-id] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --node $NODE_RPC
```

**Note:** The following examples assume you have set `TRUST_REG_ID` and `AUTHORITY_ACC` environment variables.

### Example

```bash
veranad tx tr increase-active-gf-version $AUTHORITY_ACC ${TRUST_REG_ID} \
  --from $USER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

**Note:** This command will fail if there's no document in the default language for the next version.

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

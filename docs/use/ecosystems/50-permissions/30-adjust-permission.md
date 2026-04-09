import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Adjust a Permission

Adjust a permission's **effective duration**. This is useful when you need to extend or shorten the validity period of an existing permission without going through a full renewal process.

This is a **delegable** message — it requires an `authority` (group account) and can be executed by an authorized `operator`.

:::warning Prerequisites
1. **Group account (authority)** — You need a [Cosmos SDK group account](https://docs.cosmos.network/v0.50/build/modules/group) that controls the permission: the permission's own authority (for ECOSYSTEM/self-created perms) or the validator's authority (for VP-managed perms).
2. **Operator authorization** — Your operator account must be granted authorization for `MsgAdjustPerm` by the authority. See [Grant Operator Authorization](../delegation/grant-operator-authorization).
3. **Existing permission** — The permission must exist and be in an active, adjustable state.
:::

---

## Message Parameters

| Name             | Description                                                                 | Mandatory |
|------------------|-----------------------------------------------------------------------------|-----------|
| `id`             | Numeric ID of the permission to adjust.                                     | yes       |
| `effective-until`| New expiration timestamp (RFC 3339 format). Must be in the future.          | yes       |
| `--authority`    | Group account (authority) on whose behalf this message is executed.         | yes       |

---

## Post the Message

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx perm adjust-perm <id> <effective-until> \
  --authority <group-account> \
  --from <operator-account> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Example

```bash
PERM_ID=10
veranad tx perm adjust-perm $PERM_ID 2027-12-31T23:59:59Z \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --node $NODE_RPC
```

Verify the updated permission:
```bash
veranad q perm get-perm $PERM_ID --node $NODE_RPC --output json
```

Check that `effective_until` reflects the new timestamp.

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

---

## See also
- [Create a Root Permission](./create-a-root-permission)
- [Renew (Extend) a Permission](./renewal)
- [Revoke a Permission](./permission-revocation)

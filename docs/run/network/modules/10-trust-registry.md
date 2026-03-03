# Trust Registry Module

The Trust Registry (TR) module lets you manage governance frameworks for ecosystems. All transaction messages are **delegable** — they require an `authority` (group account) and can be executed by an authorized `operator`.

Refer to the [Environments section](../environments/10-environments.md) for details on RPC endpoints to target the correct network.
Setup [Environments variable](../run-a-node/30-remote-cli.md) for specific RPC endpoints to target the correct network.

## Transaction Messages

| Spec ID        | Command                                | Description                                        |
|----------------|----------------------------------------|----------------------------------------------------|
| MOD-TR-MSG-1   | `create-trust-registry`                | Create a new trust registry                        |
| MOD-TR-MSG-2   | `add-governance-framework-document`    | Add a governance framework document                |
| MOD-TR-MSG-3   | `increase-active-gf-version`           | Increase the active governance framework version   |
| MOD-TR-MSG-4   | `update-trust-registry`                | Update a trust registry                            |
| MOD-TR-MSG-5   | `archive-trust-registry`               | Archive or unarchive a trust registry              |

### Create a Trust Registry

```bash
veranad tx tr create-trust-registry $AUTHORITY_ACC \
  did:example:123456789abcdefghi en \
  https://example.com/framework.pdf "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26" \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Update a Trust Registry

```bash
veranad tx tr update-trust-registry $AUTHORITY_ACC 1 did:example:newdid \
  --aka https://example.com \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```

### Add a Governance Framework Document

```bash
veranad tx tr add-governance-framework-document $AUTHORITY_ACC 1 en \
  https://example.com/doc-v2 "sha384-abc123" 2 \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```

### Increase Active GF Version

```bash
veranad tx tr increase-active-gf-version $AUTHORITY_ACC 1 \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```

### Archive a Trust Registry

```bash
veranad tx tr archive-trust-registry $AUTHORITY_ACC 1 true \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```

## Queries

| Spec ID        | Command                    | Description                              |
|----------------|----------------------------|------------------------------------------|
| MOD-TR-QRY-1   | `get-trust-registry`      | Get a trust registry by ID               |
| MOD-TR-QRY-2   | `list-trust-registries`   | List trust registries                    |
| MOD-TR-QRY-3   | `params`                  | Get module parameters                    |

### Get a Trust Registry

```bash
veranad q tr get-trust-registry 1 --node $NODE_RPC --output json
```

### List Trust Registries

```bash
veranad q tr list-trust-registries --node $NODE_RPC --output json
```

### Get Module Parameters

```bash
veranad q tr params --node $NODE_RPC --output json
```

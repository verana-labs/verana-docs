# Delegation Module

The Delegation (DE) module manages operator authorizations, allowing group accounts (authorities) to delegate transaction execution to operator accounts.

Refer to the [Environments section](../environments/10-environments.md) for details on RPC endpoints to target the correct network.
Setup [Environments variable](../run-a-node/30-remote-cli.md) for specific RPC endpoints to target the correct network.

## Transaction Messages

| Spec ID        | Command                  | Description                                      |
|----------------|--------------------------|--------------------------------------------------|
| MOD-DE-MSG-3   | `grant-operator-authz`   | Grant operator authorization to a grantee        |
| MOD-DE-MSG-4   | `revoke-operator-authz`  | Revoke operator authorization for a grantee      |

### Grant Operator Authorization

```bash
veranad tx de grant-operator-authz $AUTHORITY_ACC $OPERATOR_ACC \
  --msg-types "/verana.tr.v1.MsgCreateTrustRegistry,/verana.tr.v1.MsgUpdateTrustRegistry" \
  --with-feegrant \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Revoke Operator Authorization

```bash
veranad tx de revoke-operator-authz $AUTHORITY_ACC $OPERATOR_ACC \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC
```

## Queries

| Spec ID        | Command                          | Description                              |
|----------------|----------------------------------|------------------------------------------|
| MOD-DE-QRY-1   | `list-operator-authorizations`  | List operator authorizations             |
| MOD-DE-QRY-2   | `params`                        | Get module parameters                    |

### List Operator Authorizations

```bash
veranad q de list-operator-authorizations \
  --authority $AUTHORITY_ACC \
  --node $NODE_RPC --output json
```

### Get Module Parameters

```bash
veranad q de params --node $NODE_RPC --output json
```

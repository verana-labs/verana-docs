# Trust Deposit Module

The Trust Deposit (TD) module manages trust deposits that participants stake when engaging in the Verana ecosystem. Trust deposits grow through the "Proof-of-Trust" mechanism as participants perform trust operations (validation processes, credential issuance, presentations, etc.).

Refer to the [Environments section](../environments/10-environments.md) for details on RPC endpoints to target the correct network.
Setup [Environments variable](../run-a-node/30-remote-cli.md) for specific RPC endpoints to target the correct network.

## Transaction Messages

| Spec ID        | Command                   | Description                                              | Delegable |
|----------------|---------------------------|----------------------------------------------------------|-----------|
| MOD-TD-MSG-1   | *(internal)*              | Adjust trust deposit (called automatically by the chain) | N/A       |
| MOD-TD-MSG-2   | `reclaim-yield`           | Reclaim earned yield from trust deposits                 | No        |
| —              | `reclaim-deposit`         | Reclaim freed trust deposit balance                      | No        |
| MOD-TD-MSG-4   | `update-params`           | Update module parameters (governance only)               | No        |
| MOD-TD-MSG-5   | `slash-trust-deposit`     | Slash an account's trust deposit (governance only)       | No        |
| MOD-TD-MSG-6   | `repay-slashed-td`        | Repay outstanding slashed trust deposit                  | No        |
| MOD-TD-MSG-7   | *(internal)*              | Burn ecosystem slashed trust deposit                     | N/A       |

### Reclaim Trust Deposit Yield

Reclaim any available yield earned by your account. The signer (`--from`) is the account whose trust deposit yield is being reclaimed.

```bash
veranad tx td reclaim-yield \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --gas auto --node $NODE_RPC
```

### Reclaim Freed Trust Deposit

Reclaim a specific amount from your claimable trust deposit balance. A burn rate is applied to the reclaimed amount.

```bash
veranad tx td reclaim-deposit 1000000 \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --gas auto --node $NODE_RPC
```

### Repay Slashed Trust Deposit

Repay the slashed trust deposit for a target account. The signer can repay on behalf of any slashed account.

```bash
veranad tx td repay-slashed-td $ACCOUNT 1000000 \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --gas auto --node $NODE_RPC
```

### Slash Trust Deposit (Governance Proposal)

Slash an account's trust deposit. Must be executed via a governance proposal.

```bash
veranad tx td slash-trust-deposit $ACCOUNT 1000000 \
  --title "Slash for violation" --description "Details..." --deposit 10000000uvna \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

## Queries

| Spec ID        | Command                | Description                        |
|----------------|------------------------|------------------------------------|
| MOD-TD-QRY-1   | `get-trust-deposit`   | Get trust deposit for an account   |
| MOD-TD-QRY-2   | `params`              | Get module parameters              |

### Get Trust Deposit

```bash
veranad q td get-trust-deposit $ACCOUNT --node $NODE_RPC --output json
```

### Get Module Parameters

```bash
veranad q td params --node $NODE_RPC --output json
```

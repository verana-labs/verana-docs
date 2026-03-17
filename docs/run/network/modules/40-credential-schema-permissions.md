# Permission Module

The Permission (PERM) module manages credential schema permissions — the on-chain authorizations that allow participants to issue, verify, or grant credentials within an ecosystem. All transaction messages are **delegable** — they require an `authority` (group account) and can be executed by an authorized `operator`.

Refer to the [Environments section](../environments/10-environments.md) for details on RPC endpoints to target the correct network.
Setup [Environments variable](../run-a-node/30-remote-cli.md) for specific RPC endpoints to target the correct network.

## Transaction Messages

| Spec ID          | Command                          | Description                                          |
|------------------|----------------------------------|------------------------------------------------------|
| MOD-PERM-MSG-1   | `start-perm-vp`                 | Start a new permission validation process            |
| MOD-PERM-MSG-2   | `renew-perm-vp`                 | Renew a permission validation process                |
| MOD-PERM-MSG-3   | `set-perm-vp-validated`         | Set permission VP to validated state                 |
| MOD-PERM-MSG-6   | `cancel-perm-vp-request`        | Cancel a pending VP request                          |
| MOD-PERM-MSG-7   | `create-root-perm`              | Create a root (ECOSYSTEM) permission                 |
| MOD-PERM-MSG-8   | `adjust-perm`                   | Adjust a permission's fees or duration               |
| MOD-PERM-MSG-9   | `revoke-perm`                   | Revoke a permission                                  |
| MOD-PERM-MSG-10  | `create-or-update-perm-session` | Create or update a permission session                |
| MOD-PERM-MSG-12  | `slash-perm-td`                 | Slash a permission's trust deposit                   |
| MOD-PERM-MSG-13  | `repay-perm-slashed-td`         | Repay a slashed permission's trust deposit           |
| MOD-PERM-MSG-14  | `create-perm`                   | Self-create a permission (OPEN mode schemas)         |

### Create a Root Permission

```bash
veranad tx perm create-root-perm $SCHEMA_ID did:example:123456789abcdefghi 1000000 1000000 1000000 \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Self-Create a Permission (OPEN Mode)

```bash
veranad tx perm create-perm issuer $VALIDATOR_PERM_ID did:example:123456789abcdefghi \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Start a Permission Validation Process

```bash
veranad tx perm start-perm-vp issuer $VALIDATOR_PERM_ID did:example:123456789abcdefghi \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Set Permission VP to Validated

```bash
veranad tx perm set-perm-vp-validated $PERM_ID \
  --authority $AUTHORITY_ACC \
  --effective-until 2027-12-31T23:59:59Z \
  --validation-fees 1000000 --issuance-fees 500000 --verification-fees 200000 \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Cancel a Pending VP Request

```bash
veranad tx perm cancel-perm-vp-request $PERM_ID \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Renew a Permission Validation Process

```bash
veranad tx perm renew-perm-vp $PERM_ID \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Adjust a Permission

```bash
veranad tx perm adjust-perm $PERM_ID 2027-12-31T23:59:59Z \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Revoke a Permission

```bash
veranad tx perm revoke-perm $PERM_ID \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Create or Update a Permission Session

```bash
veranad tx perm create-or-update-perm-session $SESSION_ID $AGENT_PERM_ID $WALLET_AGENT_PERM_ID \
  --issuer-perm-id $ISSUER_PERM_ID \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Slash a Permission Trust Deposit

```bash
veranad tx perm slash-perm-td $PERM_ID 1000000 \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

### Repay a Slashed Permission Trust Deposit

```bash
veranad tx perm repay-perm-slashed-td $PERM_ID \
  --authority $AUTHORITY_ACC \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

## Queries

| Spec ID          | Command                       | Description                                      |
|------------------|-------------------------------|--------------------------------------------------|
| MOD-PERM-QRY-1   | `list-permissions`           | List all permissions                             |
| MOD-PERM-QRY-2   | `get-perm`                   | Get a permission by ID                           |
|                   | `find-permissions-with-did`  | Find permissions by DID, type, and schema        |
| MOD-PERM-QRY-4   | `find-beneficiaries`         | Find beneficiary permissions in the tree         |
| MOD-PERM-QRY-5   | `get-perm-session`           | Get a permission session by ID                   |
|                   | `list-perm-sessions`         | List all permission sessions                     |
| MOD-PERM-QRY-6   | `params`                     | Get module parameters                            |

### List Permissions

```bash
veranad q perm list-permissions --node $NODE_RPC --output json
```

### Get a Permission

```bash
veranad q perm get-perm 1 --node $NODE_RPC --output json
```

### Find Permissions with DID

```bash
# type is numeric: 1=ISSUER, 2=VERIFIER, 3=ISSUER_GRANTOR, 4=VERIFIER_GRANTOR, 5=ECOSYSTEM, 6=HOLDER
veranad q perm find-permissions-with-did did:example:123 1 1 --node $NODE_RPC --output json
```

### Find Beneficiaries

```bash
veranad q perm find-beneficiaries --issuer-perm-id 1 --node $NODE_RPC --output json
```

### Get a Permission Session

```bash
veranad q perm get-perm-session $SESSION_ID --node $NODE_RPC --output json
```

### List Permission Sessions

```bash
veranad q perm list-perm-sessions --node $NODE_RPC --output json
```

### Get Module Parameters

```bash
veranad q perm params --node $NODE_RPC --output json
```

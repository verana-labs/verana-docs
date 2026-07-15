# Ecosystem Module

The Ecosystem (`ec`) module manages the lifecycle of [Ecosystems](../../../use/ecosystems/ecosystem/list-ecosystems) — the on-chain registries that were previously part of the removed Trust Registry (`tr`) module. Governance Framework documents and version activations now live in the separate [Governance Framework (`gf`) module](./governance-framework).

All `ec` transaction messages are **delegable**: they are signed by an `operator` (`--from`) and executed on behalf of a **Corporation** whose `policy_address` is passed as the positional `[corporation]` argument. The operator must have been granted authorization for the exact `Msg` type-URL via the [Delegation (`de`) module](./delegation). The `update-params` message is governance-only.

Refer to the [Environments section](../environments/10-environments.md) for RPC endpoints, and [set up environment variables](../run-a-node/30-remote-cli.md) for the target network.

:::warning Delegable prerequisites
The tx commands below require a registered [Corporation](../../../use/corporation/create-a-corporation) (`policy_address`), a funded policy, and an operator granted authorization for the relevant type-URL (`/verana.ec.v1.MsgCreateEcosystem`, `/verana.ec.v1.MsgUpdateEcosystem`, `/verana.ec.v1.MsgArchiveEcosystem`). Sign with `--from <operator>`.
:::

## Transaction Messages

| Spec ID       | Command             | Signature                                                       | Description                     |
|---------------|---------------------|-----------------------------------------------------------------|---------------------------------|
| MOD-ES-MSG-1  | `create-ecosystem`  | `[corporation] [did] [language] [doc-url] [doc-digest-sri]`     | Create a new ecosystem          |
| MOD-ES-MSG-2  | `update-ecosystem`  | `[corporation] [id] [did]`                                      | Rotate an ecosystem's DID       |
| MOD-ES-MSG-3  | `archive-ecosystem` | `[corporation] [id] [archive]`                                  | Archive or unarchive an ecosystem |
| MOD-ES-MSG-4  | `update-params`     | (governance proposal only)                                      | Update module parameters        |

### Create an Ecosystem

Creates the `Ecosystem`, its Governance Framework version 1, and the seeding document in one transaction (`MOD-ES-MSG-1`).

```bash
veranad tx ec create-ecosystem $CORPORATION \
  did:example:18c0de7edb5fbab0691d56616f48043a en \
  https://example.com/ec-alpha-v1.pdf "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26" \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Key events from the real transaction (`txhash A907225E...`):

```yaml
- type: create_ecosystem
  attributes:
  - key: ecosystem_id
    value: "1"
  - key: corporation_id
    value: "2"
  - key: did
    value: did:example:18c0de7edb5fbab0691d56616f48043a
  - key: language
    value: en
```

### Update an Ecosystem

Rotates the DID only (`MOD-ES-MSG-2`).

```bash
veranad tx ec update-ecosystem $CORPORATION 1 did:example:18c0de8b382b27289488be5aaabae72e \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

Emits an `update_ecosystem` event with the new `did` (`txhash 2E38D26B...`).

### Archive / Unarchive an Ecosystem

Toggles `archived` (`MOD-ES-MSG-3`). Pass `true` to archive, `false` to unarchive.

```bash
veranad tx ec archive-ecosystem $CORPORATION 1 true \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

Emits an `archive_ecosystem` event with `archive_status: archived` (`txhash 009559CF...`). Re-applying the current state fails with `ecosystem already in target archive state`.

## Queries

| Spec ID       | Command           | Signature | Description               |
|---------------|-------------------|-----------|---------------------------|
| MOD-ES-QRY-1  | `get-ecosystem`   | `[id]`    | Get an ecosystem by ID    |
| MOD-ES-QRY-2  | `list-ecosystems` |           | List ecosystems           |
| MOD-ES-QRY-3  | `params`          |           | Get module parameters     |

### Get an Ecosystem

```bash
veranad query ec get-ecosystem 1 --node $NODE_RPC --output json
```

```json
{
  "ecosystem": {
    "id": "1",
    "did": "did:example:18c0de8b382b27289488be5aaabae72e",
    "corporation_id": "2",
    "created": "2026-07-10T07:54:44.951932Z",
    "modified": "2026-07-10T07:55:50.330131Z",
    "language": "en",
    "active_version": 4,
    "versions": [
      {
        "id": "5",
        "ecosystem_id": "1",
        "created": "2026-07-10T07:54:44.951932Z",
        "version": 1,
        "active_since": "2026-07-10T07:54:44.951932Z",
        "documents": [
          {
            "id": "6",
            "gfv_id": "5",
            "created": "2026-07-10T07:54:44.951932Z",
            "language": "en",
            "url": "https://example.com/ec-alpha-v1.pdf",
            "digest_sri": "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26"
          }
        ]
      }
    ]
  }
}
```

Optional flags: `--active-gf-only`, `--preferred-language <tag>`.

### List Ecosystems

```bash
veranad query ec list-ecosystems --node $NODE_RPC --output json
```

Optional filters: `--corporation-id <id>`, `--modified-after <RFC3339>`, `--active-gf-only`, `--preferred-language <tag>`, `--response-max-size <1-1024>`.

### Get Module Parameters

```bash
veranad query ec params --node $NODE_RPC --output json
```

```json
{
  "params": {
    "trust_unit_price": "1000000"
  }
}
```

# Governance Framework Module

The Governance Framework (`gf`) module manages the Governance Framework versions and documents of a subject — either an [Ecosystem](./ecosystem) or a Corporation's own Corporation Governance Framework (CGF). It was split out of the removed Trust Registry (`tr`) module together with [Ecosystem (`ec`)](./ecosystem).

Each subject owns an ordered chain of `GovernanceFrameworkVersion` entries, each holding one or more `GovernanceFrameworkDocument` entries (one per language). Version 1 of an ecosystem's GF is seeded by `ec create-ecosystem`; further versions are drafted with `add-governance-framework-document` and activated with `increase-active-gf-version`.

All `gf` transaction messages are **delegable**: they are signed by an `operator` (`--from`) and executed on behalf of a **Corporation**. Both the corporation's `policy_address` and the operator are passed as positional arguments (`[corporation] [operator]`), and the target is selected with the optional `--ecosystem-id` flag (omit it to target the Corporation's own CGF).

Refer to the [Environments section](../environments/10-environments.md) for RPC endpoints, and [set up environment variables](../run-a-node/30-remote-cli.md) for the target network.

:::warning Delegable prerequisites
The tx commands below require a registered [Corporation](../../../use/corporation/create-a-corporation) (`policy_address`), a funded policy, and an operator granted authorization for the relevant type-URL (`/verana.gf.v1.MsgAddGovernanceFrameworkDocument`, `/verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion`) via the [Delegation (`de`) module](./delegation). Sign with `--from <operator>`.
:::

## Transaction Messages

| Spec ID       | Command                              | Signature                                                                        | Description                              |
|---------------|--------------------------------------|----------------------------------------------------------------------------------|------------------------------------------|
| MOD-GF-MSG-1  | `add-governance-framework-document`  | `[corporation] [operator] [doc-language] [doc-url] [doc-digest-sri] [version]`    | Add/replace a GF document (draft version) |
| MOD-GF-MSG-2  | `increase-active-gf-version`         | `[corporation] [operator]`                                                        | Activate the next GF version              |

### Add a Governance Framework Document

Adds or replaces a document for a **draft** version (`MOD-GF-MSG-1`). Use `--ecosystem-id` to target an ecosystem; omit it for the Corporation's CGF. `version` must be `max(version)+1` (or an existing draft) and greater than `active_version`.

```bash
veranad tx gf add-governance-framework-document $CORPORATION $OPERATOR en \
  https://example.com/ec-alpha-gf-v2-en.pdf "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26" 2 \
  --ecosystem-id 1 \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

Key event from the real transaction (`txhash 399BE6E9...`):

```yaml
- type: add_gf_document
  attributes:
  - key: corporation
    value: verana1dlszg2sst9r69my4f84l3mj66zxcf3umcgujys30t84srg95dgvs9v9a3a
  - key: ecosystem_id
    value: "1"
  - key: gfv_id
    value: "6"
  - key: gfd_id
    value: "7"
  - key: version
    value: "2"
  - key: language
    value: en
```

Call the command again with the same `version` and a different `doc-language` to attach translations. Skipping a version is rejected with `version must be 3`.

### Increase Active Governance Framework Version

Activates version `active_version + 1` (`MOD-GF-MSG-2`). The next version must already contain a document in the subject's default language.

```bash
veranad tx gf increase-active-gf-version $CORPORATION $OPERATOR \
  --ecosystem-id 1 \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

Key event from the real transaction (`txhash C59BCD21...`):

```yaml
- type: increase_active_gf_version
  attributes:
  - key: corporation
    value: verana1dlszg2sst9r69my4f84l3mj66zxcf3umcgujys30t84srg95dgvs9v9a3a
  - key: ecosystem_id
    value: "1"
  - key: gfv_id
    value: "6"
  - key: version
    value: "2"
```

If no document exists in the default language for the next version, the transaction fails with `no governance framework version available to activate`.

## Queries

| Spec ID       | Command                              | Signature | Description                          |
|---------------|--------------------------------------|-----------|--------------------------------------|
| MOD-GF-QRY-1  | `get-governance-framework-version`   | `[id]`    | Get a GF version by ID with documents |
| MOD-GF-QRY-2  | `list-governance-framework-versions` |           | List GF versions for a subject        |
| —             | `params`                             |           | Get module parameters                 |

### Get a Governance Framework Version

```bash
veranad query gf get-governance-framework-version 8 --node $NODE_RPC --output json
```

```json
{
  "version": {
    "id": "8",
    "ecosystem_id": "1",
    "created": "2026-07-10T07:55:20.151207Z",
    "version": 4,
    "active_since": "2026-07-10T07:55:30.209972Z",
    "documents": [
      {
        "id": "11",
        "gfv_id": "8",
        "created": "2026-07-10T07:55:20.151207Z",
        "language": "en",
        "url": "https://example.com/ec-alpha-gf-v4-en.pdf",
        "digest_sri": "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26"
      },
      {
        "id": "12",
        "gfv_id": "8",
        "created": "2026-07-10T07:55:25.180509Z",
        "language": "fr",
        "url": "https://example.com/ec-alpha-gf-v4-fr.pdf",
        "digest_sri": "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26"
      }
    ]
  }
}
```

Optional flag: `--preferred-language <tag>`.

### List Governance Framework Versions

Exactly one of `--ecosystem-id` and `--corporation-id` must be set.

```bash
veranad query gf list-governance-framework-versions --ecosystem-id 1 --node $NODE_RPC --output json
```

Optional flags: `--active-only`, `--preferred-language <tag>`, `--response-max-size <1-1024>`. Results are ordered by ascending `version`.

### Get Module Parameters

```bash
veranad query gf params --node $NODE_RPC --output json
```

```json
{
  "params": {}
}
```

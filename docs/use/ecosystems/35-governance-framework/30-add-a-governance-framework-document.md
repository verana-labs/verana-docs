# Add a Governance Framework Document

`MOD-GF-MSG-1`

Post a message that adds (or replaces) a Governance Framework document for a **draft** `GovernanceFrameworkVersion`. The target subject is either an [Ecosystem](../../../learn/verifiable-public-registry/ecosystems) (set `--ecosystem-id`) or the signing [Corporation](../corporation)'s own Corporation Governance Framework (CGF, omit `--ecosystem-id`).

If a document already exists for the given language and version, it is replaced; otherwise a new document is created. Only future versions can be edited — the active version cannot be modified.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) — see [Create a Corporation](../corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.gf.v1.MsgAddGovernanceFrameworkDocument` via [Grant Operator Authorization](../delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` as `[corporation]` and the operator as `[operator]`.
:::

## Message Parameters

| Name             | Description                                                                                 | Mandatory |
|------------------|---------------------------------------------------------------------------------------------|-----------|
| `corporation`    | `policy_address` of the Corporation on whose behalf the message is executed                 | yes       |
| `operator`       | Operator account authorized to run this message                                             | yes       |
| `doc-language`   | Language of the document (BCP 47 tag)                                                        | yes       |
| `doc-url`        | URL of the document in the specified language                                                | yes       |
| `doc-digest-sri` | Document hash with SRI format prefix (e.g., `sha384-...`)                                    | yes       |
| `version`        | Target governance framework version                                                          | yes       |
| `--ecosystem-id` | Target Ecosystem ID. Omit to target the signing Corporation's own CGF.                       | no        |

:::info Version rules
`version` must either match an existing draft version owned by the subject, or be exactly `max(version) + 1`, and it MUST be greater than the subject's `active_version` (`MOD-GF-MSG-1-2-1`). Version numbers cannot be skipped — adding a document for version 4 while version 3 does not yet exist is rejected with `version must be 3`.
:::

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx gf add-governance-framework-document [corporation] [operator] [doc-language] [doc-url] [doc-digest-sri] [version] \
  --ecosystem-id <id> \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Example — add version 2 (English) for an ecosystem

```bash
veranad tx gf add-governance-framework-document $CORPORATION $OPERATOR en \
  https://example.com/ec-alpha-gf-v2-en.pdf sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 \
  --ecosystem-id 1 \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

Example response:

```yaml
code: 0
events:
- type: message
  attributes:
  - key: action
    value: /verana.gf.v1.MsgAddGovernanceFrameworkDocument
  - key: module
    value: gf
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
gas_used: "81779"
txhash: 399BE6E9DE567BA885180ACEB3C0A01ADBE04D8D77A63547289959E053079A63
```

### Example — add a translation for the same version

Call the command again for the same `version` with a different `doc-language` to attach a translation (e.g. `fr`, then `es`):

```bash
veranad tx gf add-governance-framework-document $CORPORATION $OPERATOR fr \
  https://example.com/ec-alpha-gf-v2-fr.pdf sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 \
  --ecosystem-id 1 \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

### Example — add to the Corporation's own CGF

Omit `--ecosystem-id` to target the signing Corporation's CGF instead of an ecosystem:

```bash
veranad tx gf add-governance-framework-document $CORPORATION $OPERATOR en \
  https://example.com/cgf-v2-en.pdf sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 2 \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

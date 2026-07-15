# List Governance Framework Versions

`MOD-GF-QRY-2`

List the `GovernanceFrameworkVersion` entries owned by a single subject — either an [Ecosystem](../../../learn/verifiable-public-registry/ecosystems) or a [Corporation](../../corporation/create-a-corporation) (its own Corporation Governance Framework, or CGF). Each version is returned with its nested documents, ordered by ascending `version`.

## Query Parameters

Exactly one of `--ecosystem-id` and `--corporation-id` MUST be set.

| Flag                   | Description                                                                     |
|------------------------|---------------------------------------------------------------------------------|
| `--ecosystem-id`       | Ecosystem ID (XOR with `--corporation-id`).                                     |
| `--corporation-id`     | Corporation ID for the Corporation's own CGF (XOR with `--ecosystem-id`).       |
| `--active-only`        | If true, return only the entry for the subject's `active_version`.              |
| `--preferred-language` | Return only one document per version, preferring this BCP 47 language tag.      |
| `--response-max-size`  | Max results (1-1024, default 64).                                              |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query gf list-governance-framework-versions --ecosystem-id [id] --node $NODE_RPC --output json
```

### Example — all versions of an ecosystem

```bash
veranad query gf list-governance-framework-versions --ecosystem-id 1 --node $NODE_RPC --output json
```

```json
{
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
    },
    {
      "id": "6",
      "ecosystem_id": "1",
      "created": "2026-07-10T07:54:49.981359Z",
      "version": 2,
      "active_since": "2026-07-10T07:55:10.093606Z",
      "documents": [
        {
          "id": "7",
          "gfv_id": "6",
          "created": "2026-07-10T07:54:49.981359Z",
          "language": "en",
          "url": "https://example.com/ec-alpha-gf-v2-en.pdf",
          "digest_sri": "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26"
        }
      ]
    }
  ]
}
```

### Example — active version only

```bash
veranad query gf list-governance-framework-versions --ecosystem-id 1 --active-only --preferred-language en --node $NODE_RPC --output json
```

```json
{
  "versions": [
    {
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
        }
      ]
    }
  ]
}
```

### Example — a Corporation's own CGF

```bash
veranad query gf list-governance-framework-versions --corporation-id 2 --node $NODE_RPC --output json
```

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/gf/v1/list?ecosystem-id=1" -H "accept: application/json"
```

  </TabItem>
</Tabs>

# Get a Governance Framework Version

`MOD-GF-QRY-1`

Get a single `GovernanceFrameworkVersion` by its numeric `id`. The response includes the owning subject reference (`ecosystem_id` or `corporation_id`) and all nested `GovernanceFrameworkDocument` entries.

## Query Parameters

| Name                   | Description                                                          | Mandatory |
|------------------------|----------------------------------------------------------------------|-----------|
| `id`                   | ID of the governance framework version (positional).                 | yes       |
| `--preferred-language` | Return only the document matching this BCP 47 language tag, if any.  | no        |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query gf get-governance-framework-version [id] --node $NODE_RPC --output json
```

### Example

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

Querying a non-existent id returns an error:

```
rpc error: code = NotFound desc = gfv 999999 not found: key not found
```

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/gf/v1/get/8" -H "accept: application/json"
```

  </TabItem>
</Tabs>

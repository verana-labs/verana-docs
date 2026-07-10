# List Ecosystems

`MOD-ES-QRY-2`

Use this query to list the [Ecosystems](../../../learn/verifiable-public-registry/ecosystems) registered on the ledger. Each ecosystem is returned with its nested Governance Framework versions and documents.

## Query Parameters

All parameters are optional.

| Flag                   | Description                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------|
| `--corporation-id`     | Filter to ecosystems controlled by this Corporation (numeric `corporation_id`).                        |
| `--modified-after`     | Return only ecosystems modified after this RFC 3339 timestamp. Results are ordered by `modified` desc. |
| `--active-gf-only`     | Include only the active Governance Framework version, hiding the other GF versions.                    |
| `--preferred-language` | Return only one document per version, preferring this BCP 47 language tag.                              |
| `--response-max-size`  | Max items to return (1-1024, default 64).                                                              |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query ec list-ecosystems --node $NODE_RPC --output json
```

### Example with parameters

```bash
veranad query ec list-ecosystems \
  --corporation-id 2 \
  --modified-after "2025-01-01T00:00:00Z" \
  --active-gf-only \
  --preferred-language en \
  --response-max-size 10 \
  --node $NODE_RPC --output json
```

### Example response

```json
{
  "ecosystems": [
    {
      "id": "1",
      "did": "did:example:18c0de8b382b27289488be5aaabae72e",
      "corporation_id": "2",
      "created": "2026-07-10T07:54:44.951932Z",
      "modified": "2026-07-10T07:55:50.330131Z",
      "language": "en",
      "active_version": 4,
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
      ]
    }
  ]
}
```

Use the `id` field to identify the ecosystem you want to manage.

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/ec/v1/list?response-max-size=10" -H "accept: application/json"
```

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::info
    Ecosystem browsing may be exposed via the [Verana Frontend](https://app.testnet.verana.network). Availability depends on the deployed frontend version.
    :::
  </TabItem>
</Tabs>

# Get an Ecosystem

`MOD-ES-QRY-1`

Query method for getting an [Ecosystem](../../../learn/verifiable-public-registry/ecosystems) by its numeric `id`, with its nested Governance Framework versions and documents.

## Query Parameters

| Name                   | Description                                                                              | Mandatory |
|------------------------|------------------------------------------------------------------------------------------|-----------|
| `id`                   | ID of the ecosystem to get (positional).                                                 | yes       |
| `--active-gf-only`     | Include only the active Governance Framework version, hiding the other GF versions.      | no        |
| `--preferred-language` | Return only one document per version, preferring this BCP 47 language tag.               | no        |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query ec get-ecosystem [id] --node $NODE_RPC --output json
```

### Example

```bash
veranad query ec get-ecosystem 1 --node $NODE_RPC --output json
```

### Example response

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

:::info
The response above is trimmed to version 1 for brevity. An ecosystem with several activated versions returns all of them under `versions` (each with its `documents`) unless you pass `--active-gf-only`.
:::

### Example with optional parameters

Return only the active GF version, preferring the English document:

```bash
veranad query ec get-ecosystem 1 --active-gf-only --preferred-language en --node $NODE_RPC --output json
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
}
```

Querying a non-existent id returns an error:

```
rpc error: code = NotFound desc = ecosystem not found: key not found
```

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/ec/v1/get/1" -H "accept: application/json"
```

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::info
    Ecosystem details may be exposed via the [Verana Frontend](https://app.testnet.verana.network). Availability depends on the deployed frontend version.
    :::
  </TabItem>
</Tabs>

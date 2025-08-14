# List Trust Registries

Use this query to list existing Ecosystem trust registries.

## Query Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| controller        | specify a verana account to list only trust registries controlled by this account. | no |
| modified-after    | show only trust registries modified after this date | no |
| active-gf-only    | return only active ecosystem governance framework, hide the other EGF versions  | no |
| preferred-language    | prefer ecosystem governance framework in this language. If an EGF doesn't exist in this language, returns the default language.  | no |
| response-max-size    | max items to return  | no |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

Example:
```bash
veranad q tr list-trust-registries --node $NODE_RPC  --output json
```

Example with Parameters:

```bash
veranad q tr list-trust-registries --controller $USER_ACC_LIT --modified-after "2025-01-01T00:00:00Z" --active-gf-only=true --response-max-size=10 --preferred-language en --node $NODE_RPC --output json
```

:::tip
You can specify optional parameters by adding flags like `--controller`, `--modified-after`, etc. The above example will return at most 10 active trust registries modified after Jan 1, 2025, controlled by the specified user, and will prefer English governance frameworks.

Make sure you set `$USER_ACC_LIT` with a valid Verana address e.g.
```
USER_ACC_LIT=verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0
```
:::

Use the output to identify the `id` of the trust registry you want to manage.
  </TabItem>
  
  <TabItem value="api" label="API">

[Try the query here](https://api.testnet.verana.network/#/)


    ```bash
curl -X GET "https://api.testnet.verana.network/verana/tr/v1/list?response_max_size=10" -H  "accept: application/json"
```

```json
{
  "trust_registries": [
    {
      "id": "1",
      "did": "did:example:184a2fddab1b3d505d477adbf0643446",
      "controller": "verana12dyk649yce4dvdppehsyraxe6p6jemzg2qwutf",
      "created": "2025-06-18T16:27:13.531941769Z",
      "modified": "2025-06-18T16:27:13.531941769Z",
      "archived": null,
      "deposit": "10000000",
      "aka": "http://example-aka.com",
      "active_version": 1,
      "language": "en",
      "versions": [
        {
          "id": "1",
          "tr_id": "1",
          "created": "2025-06-18T16:27:13.531941769Z",
          "version": 1,
          "active_since": "2025-06-18T16:27:13.531941769Z",
          "documents": [
            {
              "id": "1",
              "gfv_id": "1",
              "created": "2025-06-18T16:27:13.531941769Z",
              "language": "en",
              "url": "https://example.com/governance-framework.pdf",
              "digest_sri": "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26"
            }
          ]
        }
      ]
    },
    ...
  ]
}
```

  </TabItem>
  <TabItem value="indexer" label="Indexer">
    :::info
    This query is not currently exposed via the indexer.
    :::
  </TabItem>
  <TabItem value="frontend" label="Frontend">
    You can explore and interact with Trust Registries directly via the [Verana Frontend](https://app.testnet.verana.network/tr). This interface allows you to browse trust registries, view governance frameworks, and inspect individual versions and documents.
  </TabItem>
</Tabs>

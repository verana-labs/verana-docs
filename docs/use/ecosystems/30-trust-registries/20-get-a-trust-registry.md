# Get a Trust Registry

Simple query method for getting a trust registry.

## Query Parameters

|Name               |Description                            |Mandatory|
|-------------------|---------------------------------------|--------|
| tr-id    | id of the trust registry to get  | yes |
| active-gf-only    | return only active ecosystem governance framework, hide the other EGF versions  | no |
| preferred-language    | prefer ecosystem governance framework in this language. If an EGF doesn't exist in this language, returns the default language.  | no |

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q tr get-trust-registry $TR_ID --node $NODE_RPC --output json
```

:::tip Copy-pasteable example
You can run these examples directly if you define the variables first:

```bash
TR_ID=5
NODE_RPC=http://node1.testnet.verana.network:26657
```
:::


### Example

```bash
veranad q tr get-trust-registry 1 --node $NODE_RPC --output json
```

### Example with optional parameters

```bash
veranad q tr get-trust-registry 1 --active-gf-only=true --preferred-language=fr --node $NODE_RPC --output json
```

<!-- The tip above applies to these examples as well -->

  </TabItem>
  <TabItem value="api" label="API">

[Try the query here](https://api.testnet.verana.network/#/)


    ```bash
curl -X GET "https://api.testnet.verana.network/verana/tr/v1/get/1" -H  "accept: application/json"
```

```json
{
  "trust_registry": {
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
        "tr-id": "1",
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
  }
}
```

  </TabItem>
  <TabItem value="indexer" label="Indexer">
  </TabItem>
  <TabItem value="frontend" label="Frontend">
```markdown
You can view Trust Registries in the frontend UI by navigating to:

[https://frontend.testnet.verana.network/trust-registries](https://frontend.testnet.verana.network/trust-registries)

Click on a registry entry to inspect its metadata, DID, active governance framework, and associated documents.
```
  </TabItem>
</Tabs>

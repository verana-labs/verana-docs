import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List Credential Schemas

`MOD-CS-QRY-1`

List existing credential schemas, optionally filtered by ecosystem, onboarding mode, or modification time.

## Query Parameters

| Flag                        | Description                                                                 | Mandatory |
|-----------------------------|-----------------------------------------------------------------------------|-----------|
| `--ecosystem_id`            | Filter by the numeric Ecosystem ID that owns the schemas                    | no        |
| `--modified_after`          | Only schemas modified after this RFC 3339 timestamp                         | no        |
| `--response_max_size`       | Max items to return (1-1024, default 64)                                    | no        |
| `--only-active`             | Show only non-archived schemas                                              | no        |
| `--issuer-onboarding-mode`  | Filter by issuer onboarding mode (`open`, `ecosystem-validation-process`, `grantor-validation-process`) | no |
| `--verifier-onboarding-mode`| Filter by verifier onboarding mode (same values as issuer)                  | no        |
| `--holder-onboarding-mode`  | Filter by holder onboarding mode (`issuer-validation-process`, `permissionless`) | no   |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

```bash
veranad query cs list-schemas --node $NODE_RPC --output json
```

Examples with filters:

```bash
veranad query cs list-schemas --ecosystem_id 3 --modified_after "2025-08-01T16:42:59Z" --node $NODE_RPC --output json
```

```bash
veranad query cs list-schemas --ecosystem_id 3 --response_max_size 10 --only-active --node $NODE_RPC --output json
```

### Example response

```json
{
  "schemas": [
    {
      "id": "3",
      "created": "2025-10-06T07:14:58.914878265Z",
      "modified": "2025-10-20T12:15:27.945453876Z",
      "json_schema": "{ ... }",
      "issuer_grantor_validation_validity_period": 1,
      "verifier_grantor_validation_validity_period": 1,
      "issuer_validation_validity_period": 1,
      "verifier_validation_validity_period": 1,
      "holder_validation_validity_period": 1,
      "issuer_onboarding_mode": "ISSUER_ONBOARDING_MODE_OPEN",
      "verifier_onboarding_mode": "VERIFIER_ONBOARDING_MODE_OPEN"
    }
  ]
}
```

Each entry is a `CredentialSchema`. The full v4 field set is documented in [Get a Credential Schema](./get-a-credential-schema#response-fields); fields set to their default (for example `ecosystem_id` `0` or an unspecified onboarding mode) are omitted from JSON output.

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/cs/v1/list?ecosystem_id=3&response_max_size=10" -H "accept: application/json" | jq
```

[Find the API doc here](https://api.testnet.verana.network/#/)

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::tip
    Browse credential schemas on the [Verana Testnet frontend](https://app.testnet.verana.network).
    :::
  </TabItem>
</Tabs>

# Module Parameters

`MOD-CS-QRY-4`

Query the current parameters of the Credential Schema module.

## Execute the Query

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q cs params --node $NODE_RPC --output json
```

### Example

```bash
veranad q cs params --node $NODE_RPC --output json
```

### Example Response

```json
{
  "params": {
    "credential_schema_schema_max_size": "8192",
    "credential_schema_issuer_grantor_validation_validity_period_max_days": 3650,
    "credential_schema_verifier_grantor_validation_validity_period_max_days": 3650,
    "credential_schema_issuer_validation_validity_period_max_days": 3650,
    "credential_schema_verifier_validation_validity_period_max_days": 3650,
    "credential_schema_holder_validation_validity_period_max_days": 3650
  }
}
```

  </TabItem>
  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/cs/v1/params" -H "accept: application/json"
```

  </TabItem>
</Tabs>

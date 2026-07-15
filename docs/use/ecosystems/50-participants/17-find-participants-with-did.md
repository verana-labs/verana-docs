import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Find Participants with DID

Resolve the participant entry (or entries) that match a given **DID**, **role**, and **Credential Schema** (`MOD-PP-QRY-3`). This is one of the two **trust-resolution primitives** of the `pp` module (the other is [Trigger a Resolver](./trigger-resolver)): a trust resolver uses it to confirm that a DID it encountered off-chain is a registered, currently-valid participant of the expected schema and role.

## Query Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `did` | DID to look up. | yes |
| `role` | **Numeric** role: `1`=ISSUER, `2`=VERIFIER, `3`=ISSUER_GRANTOR, `4`=VERIFIER_GRANTOR, `5`=ECOSYSTEM, `6`=HOLDER. | yes |
| `schema-id` | Credential Schema ID. | yes |
| `--when <RFC3339>` | Optional: only return participants valid at the given timestamp. | no |

:::info Role is numeric here
Unlike `list-participants` (which accepts role names like `ecosystem`), `find-participants-with-did` takes the **numeric** role as its positional argument. Passing a name (e.g. `ecosystem`) fails with `strconv.ParseUint: parsing "ecosystem": invalid syntax`.
:::

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage
```bash
veranad query pp find-participants-with-did [did] [role] [schema-id] \
  [--when <RFC3339>] --node $NODE_RPC --output json
```

### Example — find the ECOSYSTEM (role 5) participant for schema 3
```bash
veranad query pp find-participants-with-did \
  did:example:18c0df1833f9f2002c4395780e84af3b 5 3 \
  --node $NODE_RPC --output json
```

  </TabItem>

  <TabItem value="api" label="API">
  Not exposed via REST yet. Use the CLI.
  </TabItem>
</Tabs>

## Example Output

Real testnet output:

```json
{
  "participants": [
    {
      "id": "3",
      "schema_id": "3",
      "role": "ECOSYSTEM",
      "did": "did:example:18c0df1833f9f2002c4395780e84af3b",
      "created": "2026-07-10T08:06:09.158617Z",
      "adjusted": "2026-07-10T08:06:49.399925Z",
      "effective_from": "2026-07-10T08:06:20.510395Z",
      "effective_until": "2027-01-06T08:06:52.550388Z",
      "modified": "2026-07-10T08:06:49.399925Z",
      "validation_fees": "100",
      "issuance_fees": "50",
      "verification_fees": "25",
      "op_state": "VALIDATED",
      "op_last_state_change": "2026-07-10T08:06:09.158617Z",
      "corporation_id": "6"
    }
  ]
}
```

## Related

- [Trigger a Resolver](./trigger-resolver)
- [List Participants](./list-participants)

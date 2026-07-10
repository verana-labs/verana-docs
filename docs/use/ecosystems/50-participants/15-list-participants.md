import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List Participants

List on-chain **participants** (Issuer, Verifier, Grantors, Ecosystem, Holder) across all credential schemas. Unlike the legacy `perm` module, `pp list-participants` supports **server-side filters** (`MOD-PP-QRY-1`).

## Query Parameters

The CLI accepts these optional filter flags:

| Flag | Description |
|------|-------------|
| `--schema-id <uint>` | Only participants of this Credential Schema |
| `--participant-id <uint>` | A specific participant ID |
| `--role <role>` | `issuer`, `verifier`, `issuer-grantor`, `verifier-grantor`, `ecosystem`, `holder` |
| `--did <string>` | Filter by registered DID |
| `--grantee <string>` | Filter by grantee account |
| `--op-state <state>` | `unspecified`, `pending`, `validated`, `terminated` |
| `--only-valid` | Only currently-valid participants |
| `--only-slashed` | Only participants with a slashed deposit |
| `--only-repaid` | Only participants whose slashed deposit was repaid |
| `--modified-after <RFC3339>` | Modified after the given timestamp |
| `--when <RFC3339>` | Validity at a specific timestamp |
| `--response-max-size <1-1024>` | Cap the number of results |

## Useful fields in the response

| Field | Description |
|-------|-------------|
| `id` | Participant ID |
| `schema_id` | Credential Schema this participant belongs to |
| `role` | Role enum string (see mapping below) |
| `did` | DID registered in the participant (Verifiable Service) |
| `op_state` | `PENDING`, `VALIDATED`, or `TERMINATED` |
| `validator_participant_id` | Participant the entry was onboarded under (absent for root) |
| `effective_from` / `effective_until` | Validity window |
| `validation_fees` / `issuance_fees` / `verification_fees` | Trust-unit fees |
| `slashed` / `revoked` | Timestamps set when the deposit is slashed / the participant revoked |
| `corporation_id` | Numeric ID of the owning Corporation |

### Role mapping

The CLI/REST output returns **enum strings** (e.g. `ISSUER`), not numbers. The numeric IDs used by `find-participants-with-did` are listed for reference.

| Enum string | Meaning | Numeric ID |
|-------------|---------|-----------|
| `ISSUER` | Issuer | 1 |
| `VERIFIER` | Verifier | 2 |
| `ISSUER_GRANTOR` | Issuer-Grantor | 3 |
| `VERIFIER_GRANTOR` | Verifier-Grantor | 4 |
| `ECOSYSTEM` | Ecosystem (root) | 5 |
| `HOLDER` | Holder | 6 |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

Set up your environment (if not already):

```bash
NODE_RPC=https://rpc.testnet.verana.network
```

**List all participants**
```bash
veranad query pp list-participants --node $NODE_RPC --output json
```

**Filter by schema**
```bash
veranad query pp list-participants --schema-id 3 --node $NODE_RPC --output json
```

**Filter by role**
```bash
veranad query pp list-participants --role ecosystem --node $NODE_RPC --output json
```

**Only slashed participants**
```bash
veranad query pp list-participants --only-slashed --node $NODE_RPC --output json
```

  </TabItem>

  <TabItem value="api" label="API">
  N/A (not exposed via REST yet).
  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    UI support is planned. For now, use the CLI.
    :::
  </TabItem>
</Tabs>

## Example Output

Real output from the testnet (trimmed to two entries):

```json
{
  "participants": [
    {
      "id": "1",
      "schema_id": "2",
      "role": "ECOSYSTEM",
      "did": "did:example:18c0deee1817a9586c97135dd80fcc28",
      "created": "2026-07-10T08:02:42.88908Z",
      "effective_from": "2026-07-10T08:02:56.626515Z",
      "effective_until": "2027-07-05T08:02:56.626515Z",
      "modified": "2026-07-10T08:02:42.88908Z",
      "op_state": "VALIDATED",
      "op_last_state_change": "2026-07-10T08:02:42.88908Z",
      "corporation_id": "6"
    },
    {
      "id": "2",
      "schema_id": "2",
      "role": "ISSUER_GRANTOR",
      "did": "did:example:18c0deef42d88ad05c25093ca7f60d46",
      "created": "2026-07-10T08:03:13.07172Z",
      "effective_from": "2026-07-10T08:03:18.104198Z",
      "modified": "2026-07-10T08:04:48.663674Z",
      "validator_participant_id": "1",
      "op_state": "TERMINATED",
      "op_last_state_change": "2026-07-10T08:04:48.663674Z",
      "corporation_id": "6"
    }
  ]
}
```

## Related

- [Get / Find Participants with DID](./find-participants-with-did)
- [Participant Module reference](../../../run/network/modules/participant)

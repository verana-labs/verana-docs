import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Participant Session

Return the on-chain **Participant Session** that matches a given session ID (UUID) (`MOD-PP-QRY-5`). Use this to prove the peer paid (PPI/PPV) before you issue or request a presentation.

## Query Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `id` | Session ID (UUID) that was exchanged between peers. | yes |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query pp get-participant-session <session-id> --node $NODE_RPC --output json
```

### Example

```bash
SESSION_ID=d9f96456-fe25-46a2-b115-4a6198b1bf7d
veranad query pp get-participant-session $SESSION_ID --node $NODE_RPC --output json
```

  </TabItem>

  <TabItem value="api" label="API">
  The Participant Session lookup is not yet exposed in the public REST API. Use the CLI for now.
  </TabItem>
</Tabs>

## Example Output

Real testnet output. A session holds one or more **session records**, each keyed to the issuer/verifier and agent participants involved:

```json
{
  "session": {
    "id": "d9f96456-fe25-46a2-b115-4a6198b1bf7d",
    "corporation_id": "6",
    "vs_operator": "verana16mzeyu9l6kua2cdg9x0jk5g6e7h0kk8q6uadu4",
    "created": "2026-07-10T08:10:00.555798Z",
    "modified": "2026-07-10T08:10:05.587186Z",
    "session_records": [
      {
        "id": "1",
        "created": "2026-07-10T08:10:00.555798Z",
        "issuer_participant_id": "6",
        "wallet_agent_participant_id": "8",
        "agent_participant_id": "8"
      },
      {
        "id": "2",
        "created": "2026-07-10T08:10:05.587186Z",
        "issuer_participant_id": "6",
        "wallet_agent_participant_id": "8",
        "agent_participant_id": "8"
      }
    ]
  }
}
```

## Related

- [Create or Update Participant Session](./create-or-update-participant-session)
- [List Participant Sessions](./list-participant-sessions)
- [Find Beneficiaries](./find-beneficiaries)

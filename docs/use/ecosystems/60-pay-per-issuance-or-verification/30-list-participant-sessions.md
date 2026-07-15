import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List Participant Sessions

List all **participant sessions** with optional filtering and pagination. Each session records the PPI/PPV credential-exchange activity between peers.

## Query Parameters

| Flag | Description |
|------|-------------|
| `--modified-after <RFC3339>` | Only sessions modified after the given timestamp. |
| `--response-max-size <1-1024>` | Cap the number of results returned. |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query pp list-participant-sessions --node $NODE_RPC --output json
```

### Filtered example

```bash
veranad query pp list-participant-sessions \
  --modified-after 2026-07-10T00:00:00Z \
  --response-max-size 100 \
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
  "sessions": [
    {
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
  ]
}
```

## Related

- [Get Participant Session](./get-participant-session)
- [Create or Update Participant Session](./create-or-update-participant-session)

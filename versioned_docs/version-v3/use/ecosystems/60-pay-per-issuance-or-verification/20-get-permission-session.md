import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Permission Session

Return the on-chain **Permission Session** that matches a given session ID (UUID).  
Use this to prove the peer paid (PPI/PPV) before you issue or request a presentation.

## Query Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| id   | Session ID (UUID) that was exchanged between peers. | yes |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q perm get-perm-session <session-id> --node $NODE_RPC --output json
```

### Example

```bash
SESSION_ID=123e4567-e89b-12d3-a456-426614174000
veranad q perm get-perm-session $SESSION_ID --node $NODE_RPC --output json
```

  </TabItem>

  <TabItem value="api" label="API">

The Permission Session lookup is not yet exposed in the public REST API (Swagger). Use the CLI for now.

  </TabItem>

  <TabItem value="frontend" label="Frontend">

Coming soon to the testnet frontend. For now, inspect sessions via the CLI.

  </TabItem>
</Tabs>

## Example Output

```json
{
  "session": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "agent_perm_id": "45",
    "wallet_agent_perm_id": "50",
    "issuer_perm_id": "30",
    "verifier_perm_id": null,
    "schema_id": "5",
    "created": "2025-08-21T12:34:56Z",
    "status": "ACTIVE"
  }
}
```

## Related

- [Create or Update Permission Session](create-or-update-permission-session)
- [Find Beneficiaries](find-beneficiaries)

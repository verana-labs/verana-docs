import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List Permissions

List on-chain **permissions** (Issuer, Verifier, Grantors, Ecosystem, Holder) for all credential schemas. Use the CLI today; the Indexer will provide richer server-side filters.

## Query Parameters

At the moment, the CLI query does not accept filter flags. Use client-side filters (examples below). The Indexer will expose parameters such as `schema_id`, `type`, `status`, and `grantee`.

## Useful fields in the response

| Field      | Description                                              |
|------------|----------------------------------------------------------|
| id         | Permission ID                                            |
| schema_id  | Credential Schema ID this permission belongs to          |
| type       | Role type (see mapping below)                            |
| grantee    | DID or account that holds the permission                 |
| did        | DID registered in the permission (verifiable service)   |
| status     | `PENDING`, `VALIDATED`, `TERMINATED`, or `REVOKED`       |

### Type mapping

> The CLI/REST output returns **enum strings** (e.g., `PERMISSION_TYPE_ISSUER`), not numbers. Legacy docs sometimes refer to numeric IDs; both are listed here for reference.

| Enum string                    | Meaning           | Legacy ID |
|--------------------------------|-------------------|-----------|
| PERMISSION_TYPE_ISSUER         | ISSUER            | 1         |
| PERMISSION_TYPE_VERIFIER       | VERIFIER          | 2         |
| PERMISSION_TYPE_ISSUER_GRANTOR | ISSUER-GRANTOR    | 3         |
| PERMISSION_TYPE_VERIFIER_GRANTOR | VERIFIER-GRANTOR | 4         |
| PERMISSION_TYPE_ECOSYSTEM      | ECOSYSTEM         | 5         |
| PERMISSION_TYPE_HOLDER         | HOLDER            | 6         |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

Set up your environment (if not already):

```bash
NODE_RPC=http://node1.testnet.verana.network:26657
```

**List all permissions**
```bash
veranad q perm list-permissions --node $NODE_RPC --output json
```

**Filter examples (client-side with jq)**

- By schema:
```bash
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq '.permissions[] | select(.schema_id == "5")'
```

- By type = ISSUER:
```bash
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq '.permissions[] | select(.type == "PERMISSION_TYPE_ISSUER")'
```
```bash
# Alternatively, match by suffix (works across enum names)
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq 'select(.permissions != null) | .permissions[] | select(.type | endswith("_ISSUER"))'
```

**Why `type == "1"` didn’t work?** The `.type` field is an **enum string** (e.g., `PERMISSION_TYPE_ISSUER`), not a numeric ID. Use the string value (or the `endswith("_ISSUER")` helper) when filtering with `jq`.

- By status = VALIDATED:
```bash
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq '.permissions[] | select(.status == "VALIDATED")'
```

- By grantee DID:
```bash
DID=did:example:abc123
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq --arg did "$DID" '.permissions[] | select(.grantee == $did)'
```

- Count per type:
```bash
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq -r '.permissions[].type' | sort | uniq -c
```

  </TabItem>

  <TabItem value="api" label="API">
  N/A (not exposed via REST yet).
  </TabItem>

  <TabItem value="indexer" label="Indexer">
  Coming soon — will support server-side filtering (schema, type, status, grantee) and pagination.
  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

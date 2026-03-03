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

> The CLI/REST output returns **enum strings** (e.g., `ISSUER`), not numbers. Legacy docs sometimes refer to numeric IDs; both are listed here for reference.

| Enum string                    | Meaning           | Legacy ID |
|--------------------------------|-------------------|-----------|
| ISSUER         | ISSUER            | 1         |
| VERIFIER       | VERIFIER          | 2         |
| ISSUER_GRANTOR | ISSUER-GRANTOR    | 3         |
| VERIFIER_GRANTOR | VERIFIER-GRANTOR | 4         |
| ECOSYSTEM      | ECOSYSTEM         | 5         |
| HOLDER         | HOLDER            | 6         |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

Set up your environment (if not already):

```bash
NODE_RPC=https://rpc.testnet.verana.network
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
| jq '.permissions[] | select(.type == "ISSUER")'
```
```bash
# Alternatively, match by suffix (works across enum names)
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq 'select(.permissions != null) | .permissions[] | select(.type | endswith("ISSUER"))'
```

**Why `type == "1"` didn’t work?** The `.type` field is an **enum string** (e.g., `ISSUER`), not a numeric ID. Use the string value (or the `endswith("ISSUER")` helper) when filtering with `jq`.

- By status = VALIDATED:
```bash
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq '.permissions[] | select(.status == "VALIDATED")'
```

- By grantee DID:
```bash
DID=did:example:123456789abcdefghi
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq --arg did "$DID" '.permissions[] | select(.did == $did)'
```

- By grantee Account Address:
```bash
GRANTEE=verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0
veranad q perm list-permissions --node $NODE_RPC --output json \
| jq --arg grantee "$GRANTEE" '.permissions[] | select(.grantee == $grantee)'
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

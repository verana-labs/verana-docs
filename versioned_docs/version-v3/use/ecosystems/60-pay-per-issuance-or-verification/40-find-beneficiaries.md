
# Find Beneficiaries

Use this query to compute who gets paid (beneficiaries) and how much trust fee must be locked/transferred **before** you create a Permission Session for **Pay‑Per‑Issuance (PPI)** or **Pay‑Per‑Verification (PPV)**.

See the VPR spec: [find-beneficiaries](https://verana-labs.github.io/verifiable-trust-vpr-spec/#mod-perm-qry-4-find-beneficiaries).

## Query Parameters

| Name | Description | Mandatory |
|------|-------------|-----------|
| `schema-id` | Credential Schema ID the action relates to. | yes |
| `issuer-perm-id` | Issuer permission ID when you are preparing an **issuance** flow. Provide **either** this or `verifier-perm-id`. | conditional |
| `verifier-perm-id` | Verifier permission ID when you are preparing a **verification** flow. Provide **either** this or `issuer-perm-id`. | conditional |
| `agent-perm-id` | Agent (service) permission ID initiating the action. Used to include/validate agent-related fees if applicable. | no |
| `wallet-agent-perm-id` | Wallet agent permission ID (holder side). Used to include/validate wallet-agent-related fees if applicable. | no |

> Exactly one of `issuer-perm-id` **or** `verifier-perm-id` must be supplied.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

**Usage**
```bash
veranad q perm find-beneficiaries <schema-id> \
  [--issuer-perm-id <id> | --verifier-perm-id <id>] \
  [--agent-perm-id <id>] \
  [--wallet-agent-perm-id <id>] \
  --node $NODE_RPC --output json
```

**Example – Issuance**
```bash
SCHEMA_ID=5
ISSUER_PERM_ID=30
AGENT_PERM_ID=45
WALLET_AGENT_PERM_ID=50

veranad q perm find-beneficiaries $SCHEMA_ID \
  --issuer-perm-id $ISSUER_PERM_ID \
  --agent-perm-id $AGENT_PERM_ID \
  --wallet-agent-perm-id $WALLET_AGENT_PERM_ID \
  --node $NODE_RPC --output json
```

**Example – Verification**
```bash
SCHEMA_ID=5
VERIFIER_PERM_ID=60
AGENT_PERM_ID=45
WALLET_AGENT_PERM_ID=50

veranad q perm find-beneficiaries $SCHEMA_ID \
  --verifier-perm-id $VERIFIER_PERM_ID \
  --agent-perm-id $AGENT_PERM_ID \
  --wallet-agent-perm-id $WALLET_AGENT_PERM_ID \
  --node $NODE_RPC --output json
```

**Example Output (truncated)**
```json
{
  "schema_id": "5",
  "mode": "issuance",
  "currency": "uvna",
  "total_fee": "1200000",
  "beneficiaries": [
    {"perm_id":"2","role":"ECOSYSTEM","amount":"400000"},
    {"perm_id":"30","role":"ISSUER","amount":"600000"},
    {"perm_id":"45","role":"AGENT","amount":"100000"},
    {"perm_id":"50","role":"WALLET_AGENT","amount":"100000"}
  ],
  "notes": "Use these amounts when creating the permission session so the chain can enforce monetization."
}
```

  </TabItem>
  <TabItem value="api" label="API">
Currently not exposed via REST. Use the CLI.
  </TabItem>
  <TabItem value="indexer" label="Indexer">
Indexer support: coming soon.
  </TabItem>
  <TabItem value="frontend" label="Frontend">
UI support is planned; for now, compute beneficiaries with the CLI before using the frontend to perform issuance/verification.
  </TabItem>
</Tabs>
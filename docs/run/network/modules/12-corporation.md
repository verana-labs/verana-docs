# Corporation Module (`co`)

The **Corporation** module (`x/co`, spec `MOD-CO`) manages on-chain Corporations — the entities that own and govern every other Verana resource. A Corporation is an [`x/group`](https://docs.cosmos.network/main/build/modules/group) policy; its **`policy_address`** is the identity passed as the `corporation` argument to commands in the other modules.

:::warning No CLI
`x/co` ships **no** `veranad tx co` or `veranad query co` commands (its autocli is intentionally absent). Corporation transactions are submitted by broadcasting a signed tx built from JSON, and Corporations are inspected through the `x/group` queries. A step-by-step walkthrough is in [Create a Corporation](../../../use/ecosystems/corporation).
:::

## Transactions

| RPC | Spec | Signer | Notes |
|---|---|---|---|
| `MsgCreateCorporation` | `MOD-CO-MSG-1` | any account (`signer`) | Atomically creates an `x/group` group + policy and registers the `policy_address` as a Corporation; seeds CGF v1. |
| `MsgUpdateCorporation` | `MOD-CO-MSG-2` | `policy_address` + operator | Rotates the Corporation's DID. Delegable (`/verana.co.v1.MsgUpdateCorporation`). |
| `MsgUpdateParams` | `MOD-CO-MSG-3` | gov | Governance-only. |

### Create a Corporation

Since there is no CLI, build a transaction JSON and broadcast it. The message:

```json
{
  "@type": "/verana.co.v1.MsgCreateCorporation",
  "signer": "verana16mzeyu9l6kua2cdg9x0jk5g6e7h0kk8q6uadu4",
  "members": [
    { "address": "verana16mzeyu9l6kua2cdg9x0jk5g6e7h0kk8q6uadu4", "weight": "1", "metadata": "founder" }
  ],
  "group_metadata": "Acme Corporation",
  "group_policy_metadata": "Acme threshold policy",
  "decision_policy": {
    "@type": "/cosmos.group.v1.ThresholdDecisionPolicy",
    "threshold": "1",
    "windows": { "voting_period": "300s", "min_execution_period": "0s" }
  },
  "did": "did:example:acme-corp",
  "language": "en",
  "doc_url": "https://example.com/acme-cgf-v1.pdf",
  "doc_digest_sri": "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26"
}
```

Wrap it in an unsigned tx, then `veranad tx sign … | veranad tx broadcast …` (full commands in the [how-to](../../../use/ecosystems/corporation)). On success the `create_corporation` event returns the identity:

```json
{
  "type": "create_corporation",
  "attributes": [
    { "key": "corporation_id", "value": "4" },
    { "key": "policy_address", "value": "verana17pmq7hp4upvmmveqexzuhzu64v36re3w3447n7dt46uwp594wtps7npxm4" },
    { "key": "did", "value": "did:example:acme-corp" }
  ]
}
```

## Queries

`x/co` exposes no query CLI (and its REST endpoint currently returns *Not Implemented*). Inspect a Corporation through the underlying group policy:

```bash
veranad query group group-policy-info <policy_address> -o json
veranad query group group-members <group_id> -o json
```

```json
{
  "info": {
    "address": "verana1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsh3z8fv",
    "group_id": "1",
    "admin": "verana1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsh3z8fv",
    "metadata": "testharness threshold policy",
    "decision_policy": {
      "type": "/cosmos.group.v1.ThresholdDecisionPolicy",
      "value": { "threshold": "2", "windows": { "voting_period": "300s", "min_execution_period": "0s" } }
    }
  }
}
```

:::info Spec
`MOD-CO-MSG-1/2/3`, `MOD-CO-QRY-1/2/3`. The `QRY` methods are defined in the spec but not yet exposed by the node — track this in the [VPR v4 spec](https://verana-labs.github.io/verifiable-trust-vpr-spec/).
:::

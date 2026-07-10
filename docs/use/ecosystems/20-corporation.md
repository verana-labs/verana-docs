# Create a Corporation

A **Corporation** is the on-chain entity that owns and governs Verana resources — Ecosystems, Credential Schemas, Participants, Governance Framework documents, and Trust Deposits. It is the v4 replacement for the loose notion of an "authority" account.

Under the hood a Corporation is a [Cosmos SDK `x/group`](https://docs.cosmos.network/main/build/modules/group) **group + group policy**. Creating one atomically:

1. creates a `group` with your initial members,
2. creates a `group policy` with a decision policy (threshold or percentage),
3. registers the resulting **`policy_address`** as a Corporation (spec `MOD-CO-MSG-1`), and
4. seeds version 1 of the Corporation's Governance Framework (CGF) from `doc_url` / `doc_digest_sri`.

The **`policy_address`** returned is the Corporation's on-chain identity — you pass it as the `corporation` argument to nearly every other command.

:::warning No CLI for the `co` module
The Corporation module (`x/co`) does **not** ship a `veranad tx co` command. You create a Corporation by broadcasting a `MsgCreateCorporation` transaction built from JSON (shown below). Likewise there is currently no `veranad query co` command — inspect a Corporation through the `x/group` queries (see [Inspect a Corporation](#inspect-a-corporation)).
:::

## Message: `MsgCreateCorporation`

| Field | Meaning |
|---|---|
| `signer` | The account that submits and pays for the tx. It holds **no** ongoing admin rights afterward — the `policy_address` becomes admin of the group and policy. |
| `members` | Initial group members. At least one. Each has `address`, `weight` (non-zero positive decimal string), optional `metadata`. |
| `decision_policy` | A `cosmos.group.v1.ThresholdDecisionPolicy` **or** `PercentageDecisionPolicy`. |
| `did` | Globally unique DID of the Corporation. |
| `language` | Primary language tag (BCP 47), e.g. `en`. |
| `doc_url` / `doc_digest_sri` | The v1 Corporation Governance Framework (CGF) document URL and its [SRI](https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity) digest. |

## Step 1 — Build the transaction JSON

Save this as `corp-tx.json`, replacing `signer`/`members` with your own account and choosing a unique `did`:

```json
{
  "body": {
    "messages": [
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
    ],
    "memo": ""
  },
  "auth_info": { "signer_infos": [], "fee": { "amount": [{ "denom": "uvna", "amount": "750000" }], "gas_limit": "500000" } },
  "signatures": []
}
```

## Step 2 — Sign it

```bash
veranad tx sign corp-tx.json \
  --from cooluser \
  --chain-id vna-testnet-1 \
  --keyring-backend test \
  --node http://localhost:26657 \
  --output-document corp-tx-signed.json
```

## Step 3 — Broadcast it

```bash
veranad tx broadcast corp-tx-signed.json --node http://localhost:26657 -o json
```

```json
{
  "code": 0,
  "txhash": "EF72058E958AA5540B3F7888FCF715DA0FCAB45DA93055B553B9E7C3A8380834",
  "raw_log": ""
}
```

`code: 0` means success. Fetch the transaction to read the Corporation's `policy_address`:

```bash
veranad query tx EF72058E958AA5540B3F7888FCF715DA0FCAB45DA93055B553B9E7C3A8380834 -o json
```

The `create_corporation` event carries the new identity:

```json
{
  "type": "create_corporation",
  "attributes": [
    { "key": "corporation_id",  "value": "4" },
    { "key": "policy_address",  "value": "verana17pmq7hp4upvmmveqexzuhzu64v36re3w3447n7dt46uwp594wtps7npxm4" },
    { "key": "did",             "value": "did:example:acme-corp" }
  ]
}
```

Record the `policy_address` — this is your `CORPORATION`.

## Step 4 — Fund the Corporation

The `policy_address` pays the fees for every transaction executed on the Corporation's behalf, so send it some `uvna`:

```bash
veranad tx bank send cooluser \
  verana17pmq7hp4upvmmveqexzuhzu64v36re3w3447n7dt46uwp594wtps7npxm4 \
  100000000uvna \
  --chain-id vna-testnet-1 --keyring-backend test --fees 750000uvna --node http://localhost:26657 -y
```

## Step 5 — Grant an operator

To let a regular account submit transactions on the Corporation's behalf, grant it an operator authorization — see [Grant Operator Authorization](./delegation/grant-operator-authorization). The Corporation's group members vote on the grant through a group proposal.

## Inspect a Corporation

Because `x/co` exposes no query endpoint yet, inspect the Corporation's governance through the underlying group policy:

```bash
veranad query group group-policy-info \
  verana17pmq7hp4upvmmveqexzuhzu64v36re3w3447n7dt46uwp594wtps7npxm4 -o json
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

List the members with `veranad query group group-members <group_id>`, and update the DID with `MsgUpdateCorporation` (`MOD-CO-MSG-2`), which is signed by the `policy_address` and an authorized operator.

:::info Spec reference
Corporation module: `MOD-CO-MSG-1` (create), `MOD-CO-MSG-2` (update DID), `MOD-CO-QRY-1/2` (get/list). See the [VPR v4 specification](https://verana-labs.github.io/verifiable-trust-vpr-spec/).
:::

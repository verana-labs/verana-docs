# Store and Query a Digest

`MOD-DI-MSG-1` · `MOD-DI-QRY-1`

Make sure you've read [Digest](../../learn/verifiable-public-registry/digest) in the Learn section.

The **Digest** (`di`) module is a minimal, standalone registry of content hashes. It lets a [Corporation](../corporation/create-a-corporation) **anchor the existence and integrity of off-chain content at a point in time** — proving that a document existed and has not changed — without storing the content itself on-chain.

:::info Not a DID directory
The `di` module **replaces** the former *DID Directory* (`dd`). The DID-lifecycle feature — `add-did` / `renew-did` / `remove-did` / `touch-did`, per-DID deposits, expiry, grace periods, and `list-dids` — has been **removed**, not renamed. `di` is a different, smaller primitive: a content-digest store with two transactions/queries only. Discovery in v4 is built directly over the `Participant` registry (see the Learn page).
:::

## What a digest is

A `Digest` entry has just two fields:

| Field     | Description                                                            |
|-----------|-----------------------------------------------------------------------|
| `digest`  | The content digest string, in **SRI** format, and the entry's primary key (globally unique across all entries). |
| `created` | Block timestamp at which the digest was first persisted.              |

The `digest` value is a [Subresource Integrity (SRI)](https://www.w3.org/TR/SRI/) string: an algorithm prefix followed by the base64-encoded hash, e.g. `sha256-…`, `sha384-…`, or `sha512-…`. The hash **algorithm is inferred from the SRI prefix** — there is no separate `digest_algorithm` argument (it was removed).

## Store a Digest

Adds a digest to the registry on behalf of a Corporation (`MOD-DI-MSG-1`).

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) — see [Create a Corporation](../corporation/create-a-corporation).
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.di.v1.MsgStoreDigest` via [Grant Operator Authorization](../corporation/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` as the `[authority]` argument.
:::

### Message Parameters

| Name          | Description                                                                        | Mandatory |
|---------------|------------------------------------------------------------------------------------|-----------|
| `authority`   | `policy_address` of the Corporation on whose behalf the digest is stored (the first positional argument). | yes |
| `digest`      | The digest string to store, in SRI format (e.g. `sha256-…`, `sha384-…`, `sha512-…`). | yes |

:::info `[authority]` vs. operator
The corporation is passed as the `[authority]` positional argument. The **signer** is the operator, supplied with `--from`. This mirrors the on-chain message, where `authority` is the corporation and `operator` is the authorized signer.
:::

### Idempotency

Storing a digest that **already exists is an idempotent no-op**: the transaction returns success, the existing entry (and its original `created` timestamp) is left unchanged, and no second entry is created (`MOD-DI-MSG-1-3`). A given content hash therefore exists at most once in the registry.

### Required Environment Variables

```bash
CORPORATION=verana1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsh3z8fv
OPERATOR=verana16xkw85ecwlh5pwy0uhutq3y6ddw0ycv4tnl6h6
DIGEST=sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=
CHAIN_ID=vna-testnet-1
NODE_RPC=https://rpc.testnet.verana.network
```

### Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

#### Usage

```bash
veranad tx di store-digest [authority] [digest] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

#### Example

```bash
veranad tx di store-digest $CORPORATION $DIGEST \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

#### Response

`MsgStoreDigest` returns an empty `MsgStoreDigestResponse` — success is signalled by `code: 0`; the stored record is read back with `get-digest` (below). The response payload shape (from `tx.proto`) is:

```proto
// MsgStoreDigestResponse defines the response for MsgStoreDigest.
message MsgStoreDigestResponse {}
```

If the operator is not authorized for this corporation, the transaction is rejected:

```
authorization check failed: operator authorization not found for this corporation/operator pair
```

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

## Get a Digest

Look up a stored digest by its digest string (`MOD-DI-QRY-1`). This is a read-only query — no corporation, signer, or fee is required.

### Usage

```bash
veranad query di get-digest [digest] --node <rpc-endpoint> --output json
```

### Example

```bash
veranad query di get-digest $DIGEST --node $NODE_RPC --output json
```

If the digest has never been stored, the node returns a `NotFound` (captured live against the testnet node):

```
rpc error: code = NotFound desc = digest not found: key not found
```

When the digest exists, the query returns the stored `DigestInfo` record (captured live after storing `sha256-testdigest…`):

```json
{
  "digest": {
    "digest": "sha256-testdigest1783677340909628000",
    "created": "2026-07-10T09:55:59.648382Z"
  }
}
```

:::tip
Because the digest is passed as a query-string parameter (not a URL path segment), SRI base64 characters (`/`, `+`, `=`) are safe to use directly.
:::

## Module Parameters

The `di` module currently exposes no configurable parameters:

```bash
veranad query di params --node $NODE_RPC --output json
```

```json
{
  "params": {}
}
```

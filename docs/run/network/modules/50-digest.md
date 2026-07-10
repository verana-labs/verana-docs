# Digest Module

The Digest (`di`) module is a minimal registry of content hashes. It **replaces** the removed **DID Directory** (`dd`) module: the DID-lifecycle feature (`add-did` / `renew-did` / `remove-did` / `touch-did`, per-DID deposits, expiry, grace, `list-dids`) is gone. `di` stores content **digests** — proving that off-chain content existed and has not changed — and exposes a single transaction and two queries. See the [usage guide](../../../use/digest/digest) and the [DID Indexing & Digest](../../../learn/verifiable-public-registry/did-indexing-and-digest) learn page.

The single `store-digest` transaction is **delegable**: it is signed by an `operator` (`--from`) and executed on behalf of a **Corporation** whose `policy_address` is passed as the positional `[authority]` argument. `/verana.di.v1.MsgStoreDigest` is a member of the VPR delegable message-type set, so an operator must have been granted authorization for it via the [Delegation (`de`) module](./delegation). The `update-params` message is governance-only.

Refer to the [Environments section](../environments/10-environments.md) for RPC endpoints, and [set up environment variables](../run-a-node/30-remote-cli.md) for the target network.

:::warning Delegable prerequisites
`store-digest` requires a registered [Corporation](../../../use/ecosystems/corporation) (`policy_address`), a funded policy, and an operator granted authorization for `/verana.di.v1.MsgStoreDigest`. Sign with `--from <operator>` and pass the corporation as the `[authority]` argument.
:::

## Transaction Messages

| Spec ID       | Command         | Signature              | Description                                    |
|---------------|-----------------|------------------------|------------------------------------------------|
| MOD-DI-MSG-1  | `store-digest`  | `[authority] [digest]` | Store a digest on behalf of a corporation      |
| —             | `update-params` | (governance proposal only) | Update module parameters                   |

### Store a Digest

Stores a digest on behalf of the corporation given as `[authority]`; the operator signs with `--from` (`MOD-DI-MSG-1`). `digest` is an SRI-format string (`sha256-…` / `sha384-…` / `sha512-…`); the algorithm is inferred from the prefix (the former `digest_algorithm` argument was removed).

```bash
veranad tx di store-digest [authority] [digest] \
  --from <operator> --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

Example:

```bash
veranad tx di store-digest $CORPORATION sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU= \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

Storing a digest that already exists is an **idempotent no-op**: the transaction succeeds (`code: 0`), the existing entry and its original `created` timestamp are unchanged, and no duplicate is created (`MOD-DI-MSG-1-3`).

`MsgStoreDigest` returns an empty response — the stored record is read back with `get-digest`. The response payload shape (from `tx.proto`) is:

```proto
// MsgStoreDigestResponse defines the response for MsgStoreDigest.
message MsgStoreDigestResponse {}
```

## Queries

| Spec ID       | Command      | Signature   | Description                          |
|---------------|--------------|-------------|--------------------------------------|
| MOD-DI-QRY-1  | `get-digest` | `[digest]`  | Look up a stored digest by its string |
| —             | `params`     |             | Get module parameters                |

### Get a Digest

Looks up a stored digest by its digest string (`MOD-DI-QRY-1`).

```bash
veranad query di get-digest [digest] --node $NODE_RPC --output json
```

Example:

```bash
veranad query di get-digest sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU= --node $NODE_RPC --output json
```

A non-existent digest returns a `NotFound` (captured live against the testnet node):

```
rpc error: code = NotFound desc = digest not found: key not found
```

When the digest exists the query returns a `DigestInfo` record (`query.proto`) carrying the `digest` string and its `created` timestamp:

```proto
message QueryGetDigestResponse {
  DigestInfo digest = 1;  // { string digest, google.protobuf.Timestamp created }
}
```

### Module Parameters

The `di` module exposes no configurable parameters (`Params` is empty):

```bash
veranad query di params --node $NODE_RPC --output json
```

```json
{
  "params": {}
}
```

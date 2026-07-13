# Digest

A VPR provides a **`Digest`** entity: a minimal, standalone registry of content hashes, served by the `di` module. It is used to **anchor the existence and integrity of off-chain content at a point in time** — proving that a document existed and has not changed — without storing the content itself on-chain.

:::info Unrelated to DID indexing
The `Digest` is a content-hash primitive, not a discovery mechanism. It has nothing to do with listing DIDs or indexing services — that is covered by [DID Indexing](./did-indexing). It also does **not** replace the removed *DID Directory*: the DID-lifecycle feature (per-DID registration, deposits, expiry, renewal) is gone, not renamed.
:::

## The Digest entity

A `Digest` has just two fields:

| Field     | Description                                                                                                      |
|-----------|------------------------------------------------------------------------------------------------------------------|
| `digest`  | The content digest, in **SRI** format, and the entry's primary key — **globally unique** across all `Digest` entries. |
| `created` | The block time at which the digest was first persisted.                                                           |

Its defining properties:

- **String-keyed** — unlike most VPR entities (which use a server-assigned numeric `id`), a `Digest` is keyed by its own content.
- **Idempotent / create-once** — storing a digest that already exists is a **no-op**: the transaction succeeds, no second entry is created, and the original `created` timestamp stands.
- **Globally unique** — a given content hash exists at most once in the registry.

## SRI format

The `digest` value is a [Subresource Integrity (SRI)](https://www.w3.org/TR/SRI/) string: an algorithm prefix followed by the base64-encoded hash — `sha256-…`, `sha384-…`, or `sha512-…`. The hash **algorithm is inferred from the SRI prefix**; there is no separate algorithm argument.

The same SRI format is used elsewhere in the VPR for content that must be verifiable but is stored off-chain, such as the `digest_sri` of governance framework documents and schema authorization policy documents.

## What it is used for

Anchoring a digest gives a **verifiable, tamper-resistant timestamp** for off-chain content. The main use in Verifiable Trust is **objective credential issuance time**: an issuer canonicalizes a verifiable trust credential ([JCS, RFC 8785](https://www.rfc-editor.org/rfc/rfc8785)), computes its digest with the `digest_algorithm` of the credential schema, and stores that digest in the VPR. During [trust resolution](../verifiable-trust/trust-resolution), a verifier recomputes the digest from the presented credential, looks it up, and uses the `created` timestamp of the matching `Digest` entry as the credential's **effective issuance time** — a value the issuer cannot forge or backdate. Issuer authorization is then checked as of that time.

The same primitive can anchor any other off-chain artifact: a governance framework document, a terms-of-service page, a schema authorization policy, an audit report.

## On-chain interface

The `di` module exposes exactly one transaction and two queries:

- `MOD-DI-MSG-1` **Store Digest** — `veranad tx di store-digest [authority] [digest]`, a **delegable** transaction executed on behalf of a Corporation (`authority` is the corporation's `policy_address`; the signer is an authorized operator). Storing an existing digest is an idempotent no-op.
- `MOD-DI-QRY-1` **Get Digest** — `veranad query di get-digest [digest]`, a read-only lookup returning the `digest` and its `created` timestamp.
- **Params** — `veranad query di params`; the module currently has no configurable parameters.

:::tip
For the exact commands, parameters, and responses, see the how-to guide [Store and Query a Digest](../../use/digest/digest).
:::

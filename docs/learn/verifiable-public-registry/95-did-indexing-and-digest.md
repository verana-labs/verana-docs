# DID Indexing & Digest

This page covers two distinct, unrelated v4 primitives that are often confused: **DID indexing** — building searchable indexes of verifiable services over the Participant registry — and the **Digest** — a standalone content-hash registry.

:::info No more "DID Directory"
Earlier versions of Verana exposed a dedicated **DID Directory**: a separate database where anyone registered a DID for crawlers to index. That entity no longer exists. Discovery in v4 is built **directly over the `Participant` registry**, and content integrity is handled by the separate `Digest` primitive described below.
:::

## DID Indexing over the Participant registry

The `Participant` registry is the foundation for building **searchable indexes of verifiable services (VSs) and the verifiable metadata they expose**. Crawlers iterate over `Participant` entries, resolve each service identifier (currently a DID, extensible in the future), verify that the service is a verifiable service, and extract its verifiable metadata — most notably the credentials presented through [linked-vp](https://identity.foundation/linked-vp/) — together with the ecosystem memberships, credential-schema permissions, and trust-deposit level associated with the controlling [Corporation](./corporations).

Unlike a traditional web index, this index is **trust-typed**: every entry carries cryptographically verifiable claims about *what* the service is, *who* operates it, and *under which governance frameworks* it is accredited. This unlocks discovery use cases that traditional search engines cannot serve.

```plantuml

@startuml
scale max 1000 width

object "Participant registry" as didd
object "Crawler" as crawler #3fbdb6
object "Index" as index #3fbdb6

object "VS #1" as dts1 #7677ed
object "VS #2" as dts2 #7677ed

object "AI agent" as aiagent #ffb347
object "VUA" as browser #00b0f0
object "Search engine" as search #d3d3d3
object "Governance /\nAudit / Analytics" as gov #f5b7b1

object "User" as user

didd <|-- crawler : iterate Participant registry
crawler --|> dts1 : resolve DID, fetch linked-vps,\nindex verifiable metadata
crawler --|> dts2 : resolve DID, fetch linked-vps,\nindex verifiable metadata
crawler --|> index : create / update index

aiagent --|> index : query (find counterparts\nby credentials presented)
browser --|> index : query (find content\ncompatible with user context)
search --|> index : query (enrich links\nwith trust signals)
gov --|> index : query (monitor accreditations,\naudit, build reputation)

user <|-- browser : show feed of\nverifiable services
user <|-- search : show enriched\nsearch results
@enduml

```

### Who consumes the index

- **AI agents** — before delegating a task or accepting a connection, an agent queries the index to find counterparts whose **presented credentials match the capabilities required** (e.g. a KYC issuer recognized by a target ecosystem, or an MCP-style service whose operator holds a recognized organization credential). It can restrict the search to a specific ecosystem or schema, and rank candidates by trust-deposit size, accreditations held, slashing history, or credential freshness. Because every indexed claim is anchored in the VPR, an agent can verify a counterpart end-to-end *before* interacting.
- **Verifiable User Agents (VUAs)** — social browsers, agentic browsers, and similar clients use the index to **find content and services compatible with the user's context**: *"show only services accredited under ecosystem X"*, *"show services that accept the credentials currently in my wallet"*, *"show issuers of schema Y operating in jurisdiction Z"*. The result is a feed of VSs for which a proof of trust can be displayed to the user before connection.
- **Search engines** — trust-aware and traditional, form-based engines return ordinary links to VSs enriched with verifiable trust signals.
- **Governance authorities, auditors, and analytics services** — monitor accredited issuers, verifiers, and grantors; map the supply chain of trust behind a service or credential; and combine indexed metadata with on-chain history to produce reputational signals at the Corporation level.

:::tip Unbiased by design
An indexer can be run as a container alongside a locally deployed VPR node for total **unlinkability**, then power a familiar search prompt. Results are not biased nor manipulable, because **they rely on verifiable data**.
:::

## The Digest primitive

Separately from indexing, a VPR provides a **`Digest`** entity: a minimal, standalone registry of content hashes.

A `Digest` has just two fields:

- `digest` (string, primary key) — the content digest to store, **globally unique** across all `Digest` entries;
- `created` (timestamp) — the block time at which the digest was first persisted.

Its defining properties:

- **String-keyed** — unlike most VPR entities (which use a server-assigned numeric `id`), a `Digest` is keyed by its own content.
- **Idempotent / create-once** — storing a digest that already exists does not create a second entry; the first `created` timestamp stands.
- **Globally unique** — a given content hash exists at most once in the registry.

The `Digest` primitive is used to **anchor the existence and integrity of off-chain content at a point in time** — proving that a document existed and has not changed — without storing the content itself on-chain. It is unrelated to DID listing or service discovery.

:::tip
For the transactions that register and query digests, see the how-to guide [Store and Query a Digest](../../use/digest/digest).
:::

# Trust Resolver

The Trust Resolver (repo: [`verana-labs/verre`](https://github.com/verana-labs/verre)) is the service that turns Verana’s raw ledger data into a queryable trust graph. It keeps a synchronized store by consuming updates from the indexer, DID directory, and registered verifiable services, then exposes an API that verifiable user agents, search experiences, or custom dashboards can call.

## Why you run it

- **Unified query API.** Instead of making clients stitch together RPC calls, the resolver exposes trust-oriented endpoints (Who issued this credential? Which registries endorse this verifier?).
- **Credential dereferencing and crawling.** The resolver actively visits verifiable services, dereferences credentials, and verifies signatures so only attested data enters the store.
- **Deterministic view of trust registries.** Because it subscribes to the chain and directory, it can answer “what did this registry look like at block X?”—a requirement for compliance and audits.

## High-level architecture

1. **Ingestion:** Workers subscribe to the indexer’s event bus (or Kafka/Postgres listeners) and DID directory webhooks.
2. **Normalization:** Credentials are validated, schema-checked, and mapped to internal tables optimized for trust queries.
3. **Serving:** A REST/GraphQL API (documented in the repo) powers trust-aware search engines, Verana Visualizer widgets, and bespoke integrations.

## Operator guidance

- Deploy it close to the indexer to keep ingestion latency low; both components benefit from shared monitoring.
- Harden the service with TLS and authentication—its APIs can reveal sensitive relationships between actors if exposed publicly.
- When the resolver is down, anything that depends on “verifiable search” degrades, so treat it as production-critical infrastructure.

Detailed setup instructions will be documented alongside the repository scripts. This section is meant to give you enough context to understand how the resolver fits into the broader component suite before you wire it up.

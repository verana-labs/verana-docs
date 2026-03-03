# Indexer

The Verana Indexer is a fork of [Horoscope v2](https://github.com/aura-nw/horoscope), adapted to replay every block produced by the Verana chain so it can persist historical state, enrich application-facing APIs, and supply downstream services with deterministic snapshots. The source lives in [`verana-labs/verana-indexer`](https://github.com/verana-labs/verana-indexer) and is highlighted on the [component overview](https://verana.io/page/developers/components/).

## What it does

- **Block replay and archival storage.** Instead of trusting the narrow Cosmos RPC/REST windows, the indexer stores every state change so older data never disappears.
- **Advanced querying.** By projecting chain data into a relational store, the indexer can answer multi-table joins that the on-chain API cannot expose.
- **Event feeds for higher-level services.** The Trust Resolver, Visualizer, and other analytics tools subscribe to the indexer to stay in sync without polling the chain directly.

## Core dependencies

- **Database:** Postgres is required for the Horoscope stack; plan for enough disk throughput to ingest block data at real-time speed.
- **Chain access:** RPC and gRPC endpoints from at least one healthy Verana node.
- **Indexer workers:** Horoscope uses Tendermint/WebSocket subscriptions plus ETL workers; run them close to the database to minimize latency.

## Recommended operator notes

- Treat the indexer as stateful infrastructure—regular backups of Postgres snapshots are essential because the data is expensive to recompute.
- Run it alongside a full node if you want to avoid trusting third-party RPC providers, especially in private devnets.
- Monitor lag between the indexer head and the latest block. When lag grows, downstream components such as the resolver surface stale data.

The rest of this guide (to be expanded) will cover installation, configuration, and production hardening specifics. For now, use these context notes as a map before diving into the repository’s README and scripts.

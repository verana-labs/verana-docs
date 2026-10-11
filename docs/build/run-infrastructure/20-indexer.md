---
title: Run the indexer
description: "PostgreSQL, Redis, configuration, initial sync, the trust resolution module, the Helm chart."
sidebar_position: 20
persona: operator
surface: docker, helm
verified_on: pending (testnet v4)
---

# Run the indexer

The indexer replays the chain, resolves DIDs, evaluates trust and serves the REST and WebSocket API, the resolve endpoint and TRQP. Anyone who wants to depend on nobody runs one against their own node. It is a set of Node services on the Moleculer framework, with PostgreSQL for data and Redis for queues, cache and the service bus.

## Prerequisites

- A Verana node's RPC and REST endpoints, yours or the public ones, with the transaction indexer enabled.
- PostgreSQL 15 or later with room for the chain's history; Redis 7.
- Docker, or Kubernetes with the chart from the [verana-indexer repository](https://github.com/verana-labs/verana-indexer/tree/main/charts).

## Configuration

| Variable | Meaning |
|---|---|
| `CHAIN_ID`, `RPC_ENDPOINT`, `LCD_ENDPOINT` | The network and the node to replay |
| `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | The database |
| `TRANSPORTER`, `CACHER`, `QUEUE_JOB_REDIS` | Redis connection strings for the service bus, the cache and the job queues |
| `ECS_ECOSYSTEM_DIDS` | The ECS ecosystem DIDs this indexer trusts for identity credentials |
| `NODE_ENV=production`, `SERVICEDIR=dist/src/services`, `SERVICES=**/*.service.js` | Which services to load |
| `LOGLEVEL` | Verbosity |

The repository's `.env.example` lists the tuning variables (pool sizes, timeouts, retry policy).

## Run

```bash
docker run -d --name verana-indexer --env-file .env -p 3001:3001 veranalabs/verana-indexer:<version>
```

Or with Helm, from the chart in the repository, with the same values in a Secret and a ConfigMap. The first start migrates the database and begins replay from genesis (or from a snapshot, when the deployment provides one); on a chain with history this takes hours. The API serves what is indexed so far; the `GET /v4/indexer/status` endpoint says whether it is crawling and how far it is.

## Verify

```bash
curl -s http://localhost:3001/v4/indexer/status | jq
curl -s http://localhost:3001/v4/indexer/block-height | jq
curl -s -X POST http://localhost:3001/v4/verifiable-trust/resolve -H 'content-type: application/json' -d '{"did":"<a known trusted DID>"}' | jq .trusted
```

## Operations

- Monitor the gap between the indexer's height and the chain's; downstream components see stale data when it grows.
- Back up PostgreSQL: recomputing is expensive.
- Run it next to the node to avoid trusting a third-party RPC.

## Next

- [Run the graph and search](./21-graph-and-search.md).
- Reference: [Indexer API](../../reference/indexer-api/index.md). Specification: Indexer v4.

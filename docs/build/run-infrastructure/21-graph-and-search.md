---
title: Run the graph and search
description: "The trust graph service against an indexer, and the search UI in front of it."
sidebar_position: 21
persona: operator
surface: docker, helm
verified_on: pending (testnet v4)
---

# Run the graph and search

The graph is a read-only discovery index over an indexer: on first start it snapshots every indexed DID, then follows the indexer's change stream; restarts resume from the last applied block. The search UI is a thin web client over the graph and the indexer's resolve endpoint.

## The graph

Configuration (`.env`):

| Variable | Meaning |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `INDEXER_BASE_URL` | The indexer to follow; the WebSocket URL is derived |
| `PORT` | HTTP and WebSocket port (3100 by default) |
| `FETCH_VP_BODIES` | Fetch linked presentation bodies for credential claims in snippets (on by default) |
| `FETCH_GF_DOC_BODIES` | Fetch governance documents for full-text search (off by default) |
| `TRUST_REFRESH_INTERVAL_MS` | Re-resolve DIDs whose verdict expired on a quiet chain (0 to follow the spec literally) |

```bash
docker run -d --name verana-graph --env-file .env -p 3100:3100 veranalabs/verana-graph:<version>
```

Run the migrations once (`pnpm migrate` in the repository, or the chart's job). Verify with `GET /health`, then a search:

```bash
curl -s -X POST http://localhost:3100/v4/graph/search -H 'content-type: application/json' -d '{"surface":"Ecosystem","q":"","limit":3}' | jq
```

The Helm chart is in the [verana-graph repository](https://github.com/verana-labs/verana-graph/tree/main/charts).

## The search UI

```bash
docker run -d -p 3000:3000 \
  -e GRAPH_BASE_URL=https://graph.testnet.verana.network \
  -e RESOLVER_BASE_URL=https://idx.testnet.verana.network \
  -e NETWORK_LABEL=Testnet \
  veranalabs/verana-search:<version>
```

The same image serves any network; configuration is read at runtime. Helm chart `verana-search-chart` is published as an OCI chart on Docker Hub; see the [verana-search repository](https://github.com/verana-labs/verana-search).

## Next

- [Run the frontend](./frontend.md).
- Reference: [Graph API](../../reference/graph-api/index.md). Specification: Graph v4.

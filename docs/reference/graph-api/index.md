---
title: Graph API
sidebar_position: 0
---

# Graph API

The trust graph is the query layer over the indexed network: ranked, faceted search over five entity surfaces, and nineteen canonical traversal queries that walk the participant tree and the trust chains. It ingests the indexer live and answers trusted-only by default.

The pages in this section are generated from the OpenAPI document published in the [verana-graph repository](https://github.com/verana-labs/verana-graph/blob/main/docs/api/openapi.json). The normative description is the [Verana Graph v4 specification](https://github.com/verana-labs/verana-spec/blob/main/v4/verana-graph/spec.md); the request and response JSON schemas it publishes are the ones embedded here.

A graph also exposes `WS /v4/graph/blocks/subscribe`, one notification per committed block, which is not part of the OpenAPI document.

Public instances:

| Network | Base URL |
|---|---|
| devnet | `https://graph.devnet.verana.network` |
| testnet | published with the v4 testnet upgrade |

---
title: Connect an MCP client to Verana
description: "Run the Verana MCP server for your corporation, choose a transport, bind an operator key, make the first tool call."
sidebar_position: 0
persona: ai-developer
surface: mcp
verified_on: pending (testnet v4)
---

# Connect an MCP client to Verana

The Verana MCP server exposes the network as Model Context Protocol tools. One server instance acts for one corporation with one operator key; its authority is exactly what that corporation granted.

## Prerequisites

- A corporation, and an operator account authorised by it for the message types you want the agent to use ([operators](../ecosystems/11-operators-proposals.md)). Read-only use needs no authorization at all.
- Docker, or Node 22 and pnpm.

## Steps

### 1. Configure

```yaml title="docker-compose.yml"
services:
  verana-mcp-server:
    image: ghcr.io/verana-labs/verana-mcp-server:latest
    ports: ["3000:3000"]
    environment:
      MCP_VERANA_MNEMONIC: "the operator account mnemonic"   # secret
      VERANA_CORPORATION: "<your corporation id>"
      VERANA_RPC: https://rpc.testnet.verana.network
      VERANA_INDEXER: https://idx.testnet.verana.network
      VERANA_GRAPH: https://graph.testnet.verana.network      # optional; graph tools appear when set
      MCP_TRANSPORT: http                                    # or stdio for a local client
      MCP_BEARER_TOKEN: "at least 32 random characters"       # secret, for HTTP clients
```

`docker compose up`. The server boots, derives the operator address, discovers the corporation, its authorizations and its agents from the indexer, and opens three WebSockets: the chain (to confirm transactions), the indexer (events and the read-after-write barrier), the graph (freshness).

### 2. Point a client at it

Streamable HTTP at `POST /mcp` with `Authorization: Bearer <token>`, or stdio when the client launches the server itself. Anyone who holds the bearer has the operator's full power; treat it like the mnemonic and terminate TLS in front.

### 3. First calls

Ask the agent to call `verana.wallet.getStatus` (connections, heights, bootstrap), `verana.wallet.listAuthorizations` (what it may sign), then `verana.idx.vt.resolve` on a DID. The `diagnose-server` prompt walks through the same checks.

## Verify

`GET /healthz` answers 200; the status tool reports the three sockets connected and the corporation bound; a resolve returns a verdict.

## Next

- [Tools by job](./10-tools-by-job.md).
- Reference: [MCP server](../../reference/mcp-server.md); specification MCP server v4, `VMS-CFG`, `VMS-TRANS`, `VMS-AUTH`.

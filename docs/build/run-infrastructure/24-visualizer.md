---
title: Run the visualizer
description: "Run your own Verana Visualizer: the image, the Helm chart, the runtime environment variables, and the source build."
sidebar_position: 24
---

# Run the visualizer

The Verana Visualizer is a 3D view of a Verana network: ecosystems, participants, services and credentials as entities you can open and trace, with lenses for trust, economics, chain, time, governance and registry. It is a Next.js application that reads the [indexer](./20-indexer.md), the [trust graph](./21-graph-and-search.md), the chain REST API and CometBFT RPC; it never signs anything. The code lives in [`verana-labs/verana-visualizer`](https://github.com/verana-labs/verana-visualizer) and the specification in [`verana-spec/v4/verana-visualizer`](https://github.com/verana-labs/verana-spec/tree/main/v4/verana-visualizer).

The Verana team runs it at `vis.testnet.verana.network` and `vis.devnet.verana.network`. Run your own when you want a private network, a pinned version, or a public view of your own network.

## What you need

- A network to point at: its chain id, a CometBFT RPC endpoint, a REST endpoint and an indexer (v2 or later, the `/v4` API).
- Optionally the trust graph and the frontend of the same network, for traces, search and deep links.
- Docker, or a Kubernetes cluster with Helm, or Node.js 24 with Corepack to build from source.

## Release artifacts

| Artifact | Name | Tags |
|---|---|---|
| Container image | `veranalabs/verana-visualizer` on Docker Hub | `v2.0.0` and `latest` for releases, `v2.0.0-dev.N` for pre-releases of `main` |
| Helm chart | `oci://registry-1.docker.io/veranalabs/verana-visualizer-chart` | the release tag, `v2.0.0`; it runs the image of the same tag by default |

The image listens on port 3000.

## Configuration

The image is built once and configured at start: every `NEXT_PUBLIC_*` variable is read at runtime, so the same image serves any network. The container's entrypoint checks the required variables and exits with `FATAL: missing required environment variables` when one is empty. Only the variables below reach the browser.

### Required

| Variable | Value | Testnet |
|---|---|---|
| `NEXT_PUBLIC_VERANA_INDEXER_BASE_URL` | Indexer base URL, without `/v4`. Entities, history, stats and the live events socket derive from it | `https://idx.testnet.verana.network` |
| `NEXT_PUBLIC_VERANA_RPC_ENDPOINT` | CometBFT RPC, for blocks and the chain head | `https://rpc.testnet.verana.network` |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT` | Cosmos REST API, for bank, mint, staking, gov and distribution | `https://api.testnet.verana.network` |
| `NEXT_PUBLIC_VERANA_CHAIN_ID` | Chain id | `vna-testnet-1` |

### Optional

When the indexer is at `idx.<network>.verana.network`, these default to the matching Verana hosts. On any other indexer host, the graph and frontend URLs are required.

| Variable | Default | Effect |
|---|---|---|
| `NEXT_PUBLIC_VERANA_CHAIN_NAME` | the `<network>` of the indexer host | Network name shown in the UI. |
| `NEXT_PUBLIC_VERANA_GRAPH_URL` | `graph.<network>.verana.network` | Trust graph, for traces and search. |
| `NEXT_PUBLIC_VERANA_FRONTEND_URL` | `app.<network>.verana.network` | Frontend, for the deep links from the inspector. |
| `NEXT_PUBLIC_VERANA_PEER_VISUALIZER_URL` | the visualizer of the other network | Target of the devnet/testnet switch. Empty hides it on other hosts. |

The v1 names `NEXT_PUBLIC_IDX_ENDPOINT`, `NEXT_PUBLIC_RPC_ENDPOINT`, `NEXT_PUBLIC_API_ENDPOINT`, `NEXT_PUBLIC_CHAIN_ID` and `NEXT_PUBLIC_CHAIN_NAME` are still read as fallbacks; `NEXT_PUBLIC_RESOLVER_ENDPOINT`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_LOGO` and `NEXT_PUBLIC_BASE_URL` are no longer read. Move to the new names, the fallbacks will go.

## Run with Docker

```bash
docker run -d --name verana-visualizer -p 3000:3000 \
  -e NEXT_PUBLIC_VERANA_INDEXER_BASE_URL=https://idx.testnet.verana.network \
  -e NEXT_PUBLIC_VERANA_RPC_ENDPOINT=https://rpc.testnet.verana.network \
  -e NEXT_PUBLIC_VERANA_REST_ENDPOINT=https://api.testnet.verana.network \
  -e NEXT_PUBLIC_VERANA_CHAIN_ID=vna-testnet-1 \
  veranalabs/verana-visualizer:v2.0.0
```

Open `http://localhost:3000`. Serve it over TLS behind your reverse proxy for anything public.

## Deploy with Helm

The chart deploys the visualizer's Deployment and Service with an ingress, liveness and readiness probes, and a 512Mi memory limit. Write a values file for your network:

```yaml title="values-testnet.yaml"
ingress:
  hosts:
    - host: vis.example.org
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        - vis.example.org
      secretName: visualizer-tls-secret
env:
  NEXT_PUBLIC_VERANA_INDEXER_BASE_URL: "https://idx.testnet.verana.network"
  NEXT_PUBLIC_VERANA_RPC_ENDPOINT: "https://rpc.testnet.verana.network"
  NEXT_PUBLIC_VERANA_REST_ENDPOINT: "https://api.testnet.verana.network"
  NEXT_PUBLIC_VERANA_CHAIN_ID: "vna-testnet-1"
  NEXT_PUBLIC_VERANA_CHAIN_NAME: "testnet"
  NEXT_PUBLIC_VERANA_GRAPH_URL: "https://graph.testnet.verana.network"
  NEXT_PUBLIC_VERANA_FRONTEND_URL: "https://app.testnet.verana.network"
```

```bash
helm install verana-visualizer oci://registry-1.docker.io/veranalabs/verana-visualizer-chart \
  --version v2.0.0 -n verana --create-namespace -f values-testnet.yaml
```

The chart refuses to render without the four required variables and at least one ingress host. Its own [values reference](https://github.com/verana-labs/verana-visualizer/blob/main/charts/README.md) lists the image, service, ingress, resources and probe settings; `charts/values-devnet.yaml` and `charts/values-testnet.yaml` in the repository are the values the Verana team starts from.

Upgrade by changing `--version` (and nothing else): the image tag follows the chart version.

## Build from source

```bash
git clone https://github.com/verana-labs/verana-visualizer.git
cd verana-visualizer
corepack enable
pnpm install
cp env.example .env.local
pnpm dev
```

`env.example` points at testnet. `pnpm build` then `pnpm start` runs the production build; `pnpm test` runs the unit tests and `pnpm e2e` the browser tests against recorded devnet and testnet responses.

## Check it works

- `/health` checks every upstream the visualizer reads and ends with `all N passing`. Skipped checks mean the network has no data of that kind yet, such as no trust deposits.
- The HUD shows the block height moving, and green dots for the indexer, graph and chain.
- Paste a DID in **Is this service trustworthy?**: it traces the trust chain to the ecosystem root and returns a verdict.

## Troubleshooting

| Symptom | Cause |
|---|---|
| The container exits with `FATAL: missing required environment variables` | One of the four required variables is empty. |
| The page fails with `NEXT_PUBLIC_VERANA_GRAPH_URL is required when the indexer is not idx.<net>.verana.network` | The indexer is on your own host, so the graph and frontend URLs can't be derived. Set them. |
| The scene is empty and the indexer dot is red | `NEXT_PUBLIC_VERANA_INDEXER_BASE_URL` is wrong or the indexer is down; it must be the base URL, without `/v4`. |
| Traces and search fail but the scene loads | The trust graph is unreachable. |
| The block height doesn't move | The RPC endpoint is unreachable, or the chain is halted. |

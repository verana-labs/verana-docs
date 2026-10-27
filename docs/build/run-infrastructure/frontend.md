---
title: Run the frontend
description: "Run your own Verana Frontend: the image, the Helm chart, the runtime environment variables, and the source build."
sidebar_position: 22
---

# Run the frontend

The Verana Frontend is the web console of a corporation: corporations, ecosystems, credential schemas, participants, discovery, pending tasks. It is a Next.js application with no backend of its own: the browser signs with the user's wallet, talks to the chain over CometBFT RPC, and reads everything else from the [indexer](./20-indexer.md). The code lives in [`verana-labs/verana-frontend`](https://github.com/verana-labs/verana-frontend); the guides that use it start at [Get started with the frontend](../ecosystems/05-get-started.md).

The Verana team runs it at `app.testnet.verana.network` and `app.devnet.verana.network`. Run your own when you want a branded console, a private network, or a pinned version.

## What you need

- A network to point at: its chain id, a public RPC endpoint and an indexer (v2 or later, the `/v4` API).
- Optionally an explorer, a visualizer and a faucet for the same network.
- Docker, or a Kubernetes cluster with Helm, or Node.js 22+ with Corepack to build from source.

## Release artifacts

| Artifact | Name | Tags |
|---|---|---|
| Container image | `veranalabs/verana-front` on Docker Hub | `v0.19.1` and `latest` for releases, `v0.19.1-dev.N` for pre-releases of `main` |
| Helm chart | `oci://registry-1.docker.io/veranalabs/verana-frontend-chart` | the release tag, `v0.19.1`; it runs the image of the same tag by default |

The image listens on port 3000.

## Configuration

The image is built once and configured at start: every `NEXT_PUBLIC_*` variable is read at runtime (with [next-runtime-env](https://github.com/expatfile/next-runtime-env)), so the same image serves any network. The container's entrypoint checks the required variables and exits with `FATAL: Required environment variables are missing` when one is empty.

### Required

| Variable | Value | Testnet |
|---|---|---|
| `NEXT_PUBLIC_VERANA_CHAIN_ID` | Chain id | `vna-testnet-1` |
| `NEXT_PUBLIC_VERANA_CHAIN_NAME` | Chain name registered in the wallet | `VeranaTestnet1` |
| `NEXT_PUBLIC_VERANA_RPC_ENDPOINT` | CometBFT RPC, used to simulate, sign and broadcast | `https://rpc.testnet.verana.network` |
| `NEXT_PUBLIC_VERANA_INDEXER_BASE_URL` | Indexer base URL. Every `/v4/*` route and the live events socket (`wss://…/v4/indexer/subscribe`) derive from it | `https://idx.testnet.verana.network` |
| `NEXT_PUBLIC_VERANA_EXPLORER_URL` | Explorer base, for transaction and account links | `https://explorer.testnet.verana.network/Verana%20Testnet` |

### Optional

| Variable | Default | Effect |
|---|---|---|
| `NEXT_PUBLIC_VERANA_FAUCET_URL` | empty | Faucet origin (for example `https://faucet.testnet.verana.network`). Empty hides **Get VNA** on the Account page. |
| `NEXT_PUBLIC_VERANA_VISUALIZER_URL` | empty | Visualizer origin, for the visualizer links on participants. |
| `NEXT_PUBLIC_VERANA_GRAPH_URL` | empty | Verana Graph origin (for example `https://graph.testnet.verana.network`), shown in Settings and the footer with its state. Empty hides it. |
| `NEXT_PUBLIC_VERANA_SIGN_DIRECT_MODE` | `true` | `true` signs in Direct mode, `false` in Amino (legacy JSON) mode. |
| `NEXT_PUBLIC_LOW_BALANCE_WARN_UVNA` | `1000000` | Balance, in uvna, under which the frontend warns before a transaction. |
| `NEXT_PUBLIC_SESSION_LIFETIME_SECONDS` | `86400` | How long the wallet connection is remembered before the user has to connect again. |
| `NEXT_PUBLIC_SHOW_PARTICIPANT_EXPIRE_BEFORE_DAYS` | `30` | Days before its end at which an active participant is flagged as expiring soon. |
| `NEXT_PUBLIC_VERANA_CHAIN_PROVIDER_PROJECT_ID`, `_RELAY_URL`, `_METADATA_NAME`, `_METADATA_DESCRIPTION`, `_METADATA_URL`, `_METADATA_ICONS` | Verana's, from the image | WalletConnect project and the app metadata shown in the wallet. Set your own project id for a branded deployment. |

The older `NEXT_PUBLIC_VERANA_REST_ENDPOINT`, `NEXT_PUBLIC_VERANA_REST_ENDPOINT_<MODULE>`, `NEXT_PUBLIC_VERANA_WEBSOCKET`, `NEXT_PUBLIC_VERANA_TOPUP_VS` and `NEXT_PUBLIC_BASE_URL` are no longer read; remove them. All `NEXT_PUBLIC_*` values reach the browser, so never put a secret in one.

## Run with Docker

```bash
docker run -d --name verana-frontend -p 3000:3000 \
  -e NEXT_PUBLIC_VERANA_CHAIN_ID=vna-testnet-1 \
  -e NEXT_PUBLIC_VERANA_CHAIN_NAME=VeranaTestnet1 \
  -e NEXT_PUBLIC_VERANA_RPC_ENDPOINT=https://rpc.testnet.verana.network \
  -e NEXT_PUBLIC_VERANA_INDEXER_BASE_URL=https://idx.testnet.verana.network \
  -e 'NEXT_PUBLIC_VERANA_EXPLORER_URL=https://explorer.testnet.verana.network/Verana%20Testnet' \
  -e NEXT_PUBLIC_VERANA_FAUCET_URL=https://faucet.testnet.verana.network \
  -e NEXT_PUBLIC_VERANA_SIGN_DIRECT_MODE=false \
  veranalabs/verana-front:v0.19.1
```

Open `http://localhost:3000`. Serve it over TLS behind your reverse proxy for anything public.

## Deploy with Helm

The chart deploys the frontend's Deployment and Service, with an optional ingress. Write a values file for your network:

```yaml title="values-testnet.yaml"
global:
  domain: example.org
host: app
replicas: 1
env:
  NEXT_PUBLIC_VERANA_CHAIN_ID: "vna-testnet-1"
  NEXT_PUBLIC_VERANA_CHAIN_NAME: "VeranaTestnet1"
  NEXT_PUBLIC_VERANA_RPC_ENDPOINT: "https://rpc.testnet.verana.network"
  NEXT_PUBLIC_VERANA_INDEXER_BASE_URL: "https://idx.testnet.verana.network"
  NEXT_PUBLIC_VERANA_EXPLORER_URL: "https://explorer.testnet.verana.network/Verana%20Testnet"
  NEXT_PUBLIC_VERANA_VISUALIZER_URL: "https://vis.testnet.verana.network"
  NEXT_PUBLIC_VERANA_FAUCET_URL: "https://faucet.testnet.verana.network"
  NEXT_PUBLIC_VERANA_SIGN_DIRECT_MODE: "false"
```

```bash
helm install verana-frontend oci://registry-1.docker.io/veranalabs/verana-frontend-chart \
  --version v0.19.1 -n verana --create-namespace -f values-testnet.yaml
```

The chart's own [values reference](https://github.com/verana-labs/verana-frontend/blob/main/charts/README.md) lists the image, service, ingress, resources and node selector settings; `charts/values-devnet.yaml` and `charts/values-testnet.yaml` in the repository are the values the Verana team starts from. To see the manifests without installing, `helm template` the same command.

Upgrade by changing `--version` (and nothing else): the image tag follows the chart version.

## Build from source

```bash
git clone https://github.com/verana-labs/verana-frontend.git
cd verana-frontend
corepack enable
pnpm install
pnpm dev
```

The repository ships an `.env` for devnet; put your overrides in `.env.local`, which git ignores. `pnpm build` then `pnpm start` runs the production build; `pnpm test` runs the unit tests and `pnpm e2e` the browser tests.

## Check it works

- The footer shows the network, indexer, graph and frontend versions, each **synced**: the RPC, the indexer and the graph answer and keep up.
- The dashboard shows the block height and the network figures.
- **Settings** lists the chain id and every endpoint the frontend uses.
- Connect a wallet: it asks to add the chain the first time.

## Troubleshooting

| Symptom | Cause |
|---|---|
| The container exits with `FATAL: Required environment variables are missing` | One of the five required variables is empty. |
| **Get VNA** is missing on the Account page | `NEXT_PUBLIC_VERANA_FAUCET_URL` is empty, or the faucet refuses requests from your origin (its `CORS_ORIGINS` must list your frontend). |
| Pages are empty, the indexer dot is red | `NEXT_PUBLIC_VERANA_INDEXER_BASE_URL` is wrong or the indexer is down; it must be the base URL, without `/v4`. |
| Every transaction fails in the preview | The RPC endpoint is unreachable, or the frontend is older than the chain: frontend 0.18 or later is needed for networks on verana-node 0.10.6 and later. |
| The wallet shows another network's balances | The chain id or chain name does not match the network behind the RPC endpoint. |

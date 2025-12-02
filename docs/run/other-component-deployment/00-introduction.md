# Introduction

Verana’s production nodes are only one part of the story. Running the rest of the ecosystem means deploying a handful of supporting components—indexers, trust-aware APIs, user interfaces, and utility services—that sit on top of the layer‑1 chain. This section brings together the operational runbooks for each of those components so site operators can choose the ones they need and understand how they complement validator nodes.

The component catalog published at [verana.io/page/developers/components](https://verana.io/page/developers/components/) is the canonical reference for architecture, repositories, and technologies. The guides here expand on that material with the concrete steps required to run everything in your own infrastructure.

## Component overview

- **Indexer (Horoscope v2 fork)** – Replays every block, persists historical state, and exposes richer query surfaces than the base Cosmos endpoints. The Trust Resolver, Visualizer, and analytics tooling rely on it for consistent data snapshots.
- **Trust Resolver** – Subscribes to the indexer and DID directory to build a synchronized query store. It crawls verifiable services, dereferences credentials, and exposes a universal API for verifiable search as well as downstream applications.
- **Frontend (Ledger Interface)** – The primary web experience for builders and operators. It lets you create or join ecosystems, manage trust registries, schemas, issuers, verifiers, and interact with DID directory entries.
- **Ping.pub Explorer** – A familiar Cosmos-style block explorer, preconfigured for Verana networks, so operators can quickly inspect transactions, balances, and consensus state without building an explorer from scratch.
- **Faucet Chatbot (Hologram)** – A verifiable-service chatbot that airdrops VNA to testnet accounts. Running it locally keeps onboarding smooth for your contributors, especially in isolated or private environments.
- **Verana Visualizer** – A Next.js dashboard that transforms resolver/indexer data into ecosystem analytics: trust deposit balances, credential flow, slashing history, and high-level network KPIs.

As you work through the component-specific guides, note the shared expectations:

- Each component is open source and independently deployable; mixing and matching is encouraged.
- Every service expects network access to the Verana RPC/REST APIs and, when applicable, the indexer and resolver endpoints.
- Configuration is environment-driven (`.env`, Helm values, or Kubernetes secrets) so you can swap between devnet, testnet, or production settings without code changes.

Use this introduction as your map—pick the components that match your operational needs, and dive into their respective guides for source repos, environment variables, and deployment recipes.

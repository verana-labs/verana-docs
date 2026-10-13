---
title: Environments and endpoints
sidebar_position: 1
---

# Environments and endpoints

| | devnet | testnet | mainnet |
|---|---|---|---|
| Chain id | `vna-devnet-1` | `vna-testnet-1` | `vna-mainnet-1` (planned for 2027) |
| Version | v4 | v4 from 13 October 2026 | |
| Stability | reset without notice | stable within a version; coins have no value | |
| Node RPC | `https://rpc.devnet.verana.network` | `https://rpc.testnet.verana.network` | |
| Node REST | `https://api.devnet.verana.network` | `https://api.testnet.verana.network` | |
| Indexer | `https://idx.devnet.verana.network` | `https://idx.testnet.verana.network` | |
| Trust graph | `https://graph.devnet.verana.network` | `https://graph.testnet.verana.network` | |
| Search | `https://search.devnet.verana.network` | `https://search.testnet.verana.network` | |
| Frontend | `https://app.devnet.verana.network` | `https://app.testnet.verana.network` | |
| Faucet | `https://faucet.devnet.verana.network` | `https://faucet.testnet.verana.network` | |
| Explorer | `https://explorer.devnet.verana.network` | `https://explorer.testnet.verana.network` | |
| Playground | | `https://playground.testnet.verana.network` | |
| ECS ecosystem DID | `did:web:ecs-ecosystem.devnet.verana.network` | `did:web:ecs-ecosystem.testnet.verana.network` | |

A local chain for development uses the conventional chain id `vna-local-1`; the helper script of [Run an isolated local node](../run-a-node/20-local-node-isolated.md) initialises it as `vna-testnet-1`, so pass that chain id when you talk to it.

Testnet endpoints are those of the v4 testnet from 13 October 2026; the graph, search and ECS ecosystem entries go live with the upgrade.

Each network page carries the peers, the chain parameters and the registry parameters: [devnet](./15-devnet.md), [testnet](./20-testnet.md), [mainnet](./30-mainnet.md).

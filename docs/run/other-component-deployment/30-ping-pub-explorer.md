# Ping.pub Explorer

Ping.pub is the de facto Cosmos block explorer that many validators already run for their own networks. Verana publishes a preconfigured Ping.pub bundle so you can expose chain data—blocks, transactions, validators, accounts—without building a custom explorer UI. The [component reference](https://verana.io/page/developers/components/) lists it alongside the rest of the network tooling.

## Why run Ping.pub?

- **Instant observability.** Operators, wallet developers, and ecosystem partners can check block production, validator performance, and governance proposals through a familiar interface.
- **Local-first transparency.** Hosting your own explorer eliminates dependence on third-party sites, which is especially helpful when you run isolated devnets or staging environments.
- **Config-driven.** Ping.pub simply reads a `chains.json` entry with RPC/REST endpoints, logos, and metadata—you can wire it to devnet, testnet, or private networks in minutes.

## Typical deployment approach

1. **Clone the Verana Ping.pub overlay** (instructions in this guide’s upcoming sections) or mount the `chains.json` overrides into an upstream Ping.pub image.
2. **Point it at redundant RPC/REST nodes** to provide availability even if one node is down.
3. **Expose the service** via `nginx`, an Ingress, or a static hosting provider if you export the built assets.

While the remainder of this chapter is still being expanded, this context should clarify why Ping.pub is part of the “other component” suite and how it complements the richer Verana Visualizer dashboard.

---
title: veranad command line
sidebar_position: 0
---

# veranad command line

The command line of the Verana node, one page per registry module, generated from the help output of `veranad v0.10.6`. In v4 these commands are the reference, not the daily surface: corporations administer through the [Frontend](../../../build/ecosystems/index.md), services act through [VS Agent](../../../build/verifiable-services/index.md), and AI agents through the [MCP server](../../mcp-server.md). Each transaction is signed by an operator and executes on behalf of a corporation; the [message catalog](../../network/message-catalog.md) gives the signer model per message.

Shared flags for every transaction: `--from <operator key> --chain-id vna-testnet-1 --node https://rpc.testnet.verana.network --gas auto --gas-adjustment 1.5 --fees <amount>uvna`. Install the binary per [Prerequisites for running a node](../../../build/run-infrastructure/run-a-node/12-prerequisites.md).

| Module | Page |
|---|---|
| Corporation | [`co`](./01-co.md) |
| Ecosystem | [`ec`](./02-ec.md) |
| Governance framework | [`gf`](./03-gf.md) |
| Credential schema | [`cs`](./04-cs.md) |
| Participant | [`pp`](./05-pp.md) |
| Trust deposit | [`td`](./06-td.md) |
| Delegation | [`de`](./07-de.md) |
| Digest | [`di`](./08-di.md) |
| Exchange rate | [`xr`](./09-xr.md) |

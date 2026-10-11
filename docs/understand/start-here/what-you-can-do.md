---
title: What you can do
description: "The jobs this documentation helps with, who they are for, which surface they use, and where each one starts."
sidebar_position: 3
---

# What you can do

Eight jobs cover what organisations, wallet vendors, operators and AI developers do with Verana. Each has a persona, a primary surface, and a starting guide.

| You want to | You are | You use | Start |
|---|---|---|---|
| Make a service or an AI agent verifiable and trusted | a company or a developer running services | VS Agent, its Admin API, the Frontend for the corporation | [Verifiable Services](../../build/verifiable-services/index.md) |
| Join an ecosystem to issue or verify its credentials | the same, once trusted | VS Agent and the Frontend | [Verifiable Services](../../build/verifiable-services/index.md) |
| Issue credentials to people and request them back | an issuer or verifier | VS Agent over OpenID4VC or DIDComm | [Verifiable Services](../../build/verifiable-services/index.md) |
| Create an ecosystem and govern who issues and verifies | a sector body, a government registry, a company network | the Frontend, plus one VS Agent as the ecosystem anchor | [Ecosystems](../../build/ecosystems/index.md) |
| Run a business model on credentials | an ecosystem builder | the Frontend to set fees, VS Agent to settle sessions | [Ecosystems](../../build/ecosystems/index.md) |
| Add Verana trust to a personal wallet | a wallet vendor | the indexer API and the guidelines | [Personal wallets](../../build/personal-wallets/index.md) |
| Give an AI agent access to the network | an AI developer | the Verana MCP server | [AI agents and MCP](../../build/ai-agents-mcp/index.md) |
| Run a node, an indexer or the graph | an infrastructure operator | the binaries, Docker and Helm charts | [Run the infrastructure](../../build/run-infrastructure/index.md) |

## Three surfaces, one rule

Nearly everything on the registry is done on behalf of a corporation, never by a bare account. The surfaces differ in who holds the keys:

- **The Frontend** is for people: the members of a corporation sign with their browser wallet, directly or through group proposals. Use it to set things up and to govern.
- **VS Agent** is for services: it holds its own account, authorised by the corporation for a precise set of operations on specific participant entries, and acts without a human in the loop. Use it to run.
- **The MCP server** is for AI agents and automation: an operator account exposed as tools.

The command line exists and is documented in the reference, but a v4 user rarely types a registry message by hand.

## Before you build

Read [Ecosystems](../ecosystems/index.md) if you will create or join one, [Identity](../identity/index.md) if you will run services or integrate a wallet, [Discovery](../discovery/index.md) if you will search or build on the graph. Each is a short set of concept pages with a diagram and a link to the live playground.

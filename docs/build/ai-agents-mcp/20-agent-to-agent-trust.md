---
title: Agent-to-agent trust
description: "How two AI agents verify each other through their VS Agents before exchanging anything, with the tools involved."
sidebar_position: 20
persona: ai-developer
surface: mcp, admin-api
verified_on: pending (testnet v4)
---

# Agent-to-agent trust

Two AI agents, each a Verifiable Service, want to work together. Neither trusts a name or an API key. The sequence:

1. **Find**: agent A searches the graph for a counterpart by what it proves, for instance an issuer accredited for a given schema in a given ecosystem (`verana.graph.search.did` with the ecosystem and schema facets), and picks a DID.
2. **Resolve**: `verana.idx.vt.resolve` on that DID. Trusted or nothing happens.
3. **Connect**: A's VS Agent opens a DIDComm connection to B's; B's agent resolves A in turn and refuses if untrusted. Both backends see `didcomm.connections.state-updated`.
4. **Negotiate access**: over DIDComm, B issues A a token, or asks A's agent for a credential A holds (its accreditation as a client of B's ecosystem, a badge of its operator).
5. **Call**: A calls B's MCP or A2A endpoint, declared in B's DID Document, with that material.
6. **Keep checking**: verdicts expire; the agents re-resolve each other before new sessions and stop on an untrusted verdict.

The [mcpi-two-vs-agents](https://github.com/verana-labs/mcpi-two-vs-agents) example runs this end to end with two agents on testnet.

## Next

- [Delegated execution and limits](./30-delegated-execution.md).
- Understand: [Verifiable AI agents](../../understand/identity/verifiable-ai-agents.md).

---
title: Tools by job
description: "The tool families of the Verana MCP server and the ones each job needs: read, discover, operate an agent, write to the registry."
sidebar_position: 10
persona: ai-developer
surface: mcp
verified_on: pending (testnet v4)
---

# Tools by job

Tools are named `verana.<surface>.<module>.<verb>`. Write tools are advertised only for the message types the operator is currently authorised for, and the list updates live when authorizations change.

| Job | Tools |
|---|---|
| Know who I am | `verana.wallet.getAddress`, `getCorporation`, `listAuthorizations`, `listVSAgents`, `getStatus` |
| Read the registry | `verana.idx.co.*`, `es.*`, `cs.*`, `pp.*`, `td.*`, `de.*`, `gf.*`, `gr.*` (the corporation's proposals and votes), `xr.*`, `di.*`, `stats.*` |
| Resolve trust | `verana.idx.vt.resolve`, `verana.idx.vt.listIndexedDids`, `verana.idx.trqp.authorize`, `recognize` |
| Discover | `verana.graph.search.did`, `.ecosystem`, `.corporation`, `.schema`, `.serviceEndpoint`; traversals such as `verana.graph.did.trustSummary`, `did.participantsByRole`, `participant.validatorChain`, `ecosystem.participantsByRole`, `schema.participantsByRole`, `credential.issuer`, `path.shortest` |
| Drive my VS Agent | `verana.vsa.flow.listFlows`, `getFlow`, `editCredentialClaims`, `sendOobLink`, `startValidation`, `validateFlow`, `rejectFlow`; `verana.vsa.se.*` for service endpoints |
| Write to the registry | `verana.ledger.co.*`, `es.*`, `gf.*`, `cs.*`, `pp.*` (start, renew, validate, self-create, root, sessions, revoke, slash, repay, trigger resolver), `de.*` (operator grants), `di.storeDigest`, `td.*` |
| Check the chain | `verana.cosmos.bank.*`, `auth.getAccount`, `tx.getTx`, `tendermint.getStatus`, `getBlock`, `group.*`, `feegrant.listAllowances`, `authz.listGrants` |

## How a write behaves

A ledger tool builds the message with the corporation and operator filled in, sets the corporation as fee granter when an active fee grant covers the message type, simulates for gas, signs, broadcasts, waits for inclusion, then waits for the indexer to reach that block before answering. The response says whether the indexer is synced, so the next read is consistent. On a broadcast timeout it returns the hash and tells the agent to reconcile with `verana.cosmos.tx.getTx` rather than retry.

## Prompts and resources

Fifteen prompts package the recurring jobs: diagnose the server, bootstrap a corporation, delegate an operator, create an ecosystem with a schema, create a root participant, onboard or manage a participant, validate participants, update a governance framework, rotate DIDs, audit a corporation, explore the network, reconcile a transaction. Six resources under `verana://own/` expose the operator, the corporation, its authorizations, fee grant, agents and the server status.

## Next

- [Agent-to-agent trust](./20-agent-to-agent-trust.md).

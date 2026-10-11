---
title: MCP server
description: "The Verana MCP server: configuration, transports, authorization, and the catalog of tools, resources and prompts."
---

# Verana MCP server

The server exposes the registry, the indexer, the graph and VS Agents to Model Context Protocol clients, acting for one corporation with one operator key. Source: the [mcp-server repository](https://github.com/verana-labs/mcp-server) and the [MCP server v4 specification](https://github.com/verana-labs/verana-spec/blob/main/v4/mcp-server/spec.md).

## Configuration

| Variable | Required | Default | Meaning |
|---|---|---|---|
| `MCP_VERANA_MNEMONIC` | yes | | Operator account mnemonic; read once, scrubbed from the environment, never logged |
| `VERANA_CORPORATION` | yes | | The bound corporation id |
| `VERANA_RPC` | yes | | Node RPC origin (WebSocket at `/websocket`) |
| `VERANA_INDEXER` | yes | | Indexer origin (WebSocket at `/v4/indexer/subscribe`) |
| `VERANA_GRAPH` | no | | Graph origin; graph tools are advertised only when set |
| `VERANA_CHAIN_ID` | no | from RPC | Boot aborts on mismatch |
| `VERANA_DENOM`, `VERANA_GAS_PRICE` | no | `0.025uvna` | Fee denom and gas price |
| `VERANA_TX_TIMEOUT_MS` | no | 30000 | Chain confirmation wait |
| `VERANA_INDEXER_TIMEOUT_MS` | no | 15000 | Read-after-write barrier cap |
| `VERANA_CACHE_REFRESH_MS` | no | 60000 | Periodic re-discovery of authorizations, fee grant, corporation, agents |
| `MCP_TRANSPORT` | no | `http` | `http` or `stdio` |
| `MCP_HTTP_PORT`, `MCP_HTTP_BIND` | no | 3000, 0.0.0.0 | HTTP listener |
| `MCP_BEARER_TOKEN` | http | | Shared secret, at least 32 characters |
| `VERANA_LOG_LEVEL` | no | `info` | |

HTTP endpoints: `POST`, `GET`, `DELETE /mcp` (bearer, sessions), `GET /healthz`, `GET /metrics`.

## Authorization model

The server signs with the operator key. Ledger tools are advertised only for the message types the corporation currently grants that operator, and the list changes live. VS Agent tools reach an agent by DID: the agent must run in corporation auth mode, publish its admin origin in its DID Document, and list the operator in its allowlist; the server authenticates with the agent's challenge and token exchange.

## Transaction flow

Build the message with corporation and operator filled in; set the corporation as fee granter when an active fee grant covers the type; simulate; sign; broadcast; wait for inclusion (pre-armed subscription); wait for the indexer to reach the block; answer with `indexer_synced` and the height. On timeout, return the hash and advise reconciliation with `verana.cosmos.tx.getTx`.

## Tools

Named `verana.<surface>.<module>.<verb>`.

### Ledger (write, as operator)

`co.createCorporation`, `co.updateCorporation`; `es.createEcosystem`, `es.updateEcosystem`, `es.archiveEcosystem`; `gf.addGovernanceFrameworkDocument`, `gf.increaseActiveGovernanceFrameworkVersion`; `cs.createCredentialSchema`, `cs.updateCredentialSchema`, `cs.archiveCredentialSchema`; `pp.startParticipantOp`, `pp.renewParticipantOp`, `pp.setParticipantOpToValidated`, `pp.cancelParticipantOpLastRequest`, `pp.createRootParticipant`, `pp.selfCreateParticipant`, `pp.setParticipantEffectiveUntil`, `pp.revokeParticipant`, `pp.slashParticipantTrustDeposit`, `pp.repayParticipantSlashedTrustDeposit`, `pp.createOrUpdateParticipantSession`, `pp.triggerResolver`; `de.grantOperatorAuthorization`, `de.revokeOperatorAuthorization`; `di.storeDigest`; `td.reclaimTrustDepositYield`, `td.repaySlashedTrustDeposit`.

### Indexer (read)

`co.getCorporation`, `listCorporations`, `getCorporationHistory`, `getCorporationParams`; `es.getEcosystem`, `listEcosystems`, `getEcosystemHistory`, `getEcosystemParams`; `gf.getGovernanceFrameworkVersion`, `listGovernanceFrameworkVersions`; `cs.getCredentialSchema`, `listCredentialSchemas`, `getJsonSchema`, `getCredentialSchemaHistory`, `getCredentialSchemaParams`; `pp.getParticipant`, `listParticipants`, `pendingFlat`, `findBeneficiaries`, `getParticipantSession`, `getParticipantHistory`, `getParticipantSessionHistory`, `getParticipantParams`; `td.getTrustDeposit`, `getTrustDepositHistory`, `getTrustDepositParams`; `de.listOperatorAuthorizations`, `getOperatorAuthorization`, `listVSOperatorAuthorizations`, `getVSOperatorAuthorization`, `listFeeGrants`; `gr.getCorporationGroup`, `listCorporationsByMember`, `listProposals`, `getProposal`, `listVotes`; `di.getDigest`; `xr.getExchangeRate`, `listExchangeRates`, `getPrice`; `stats.getStats`, `getStatsRange`, `countParticipants`, `getStatsSnapshot`; `indexer.getBlockHeight`, `getStatus`, `getVersion`, `getSnapshot`, `listChanges`, `listEvents`; `vt.resolve`, `listIndexedDids`, `listChanges`; `trqp.authorize`, `recognize`, `getProfile`.

### Graph

Search: `search.did`, `search.ecosystem`, `search.corporation`, `search.schema`, `search.serviceEndpoint`. Traversals: `did.trustSummary`, `did.participantsByRole`, `did.heldCredentials`, `did.issuedCredentials`, `did.linkedVps`, `did.serviceEndpoints`, `did.governingChain`; `ecosystem.ownedSchemas`, `ecosystem.participantsByRole`, `ecosystem.governanceDocs`; `schema.credentials`, `schema.participantsByRole`; `corporation.ownedDids`, `corporation.controlledEcosystems`, `corporation.governanceDocs`; `participant.validatorChain`; `credential.issuer`, `credential.holder`; `path.shortest`.

### VS Agent

`flow.listFlows`, `getFlow`, `editCredentialClaims`, `sendOobLink`, `startValidation`, `validateFlow`, `rejectFlow`; `se.listServiceEndpoints`, `addServiceEndpoint`, `updateServiceEndpoint`, `deleteServiceEndpoint`.

### Cosmos (read)

`bank.getBalance`, `getAllBalances`; `auth.getAccount`; `tx.getTx`; `tendermint.getStatus`, `getBlock`; `group.listProposals`, `getProposal`, `listVotes`; `feegrant.listAllowances`; `authz.listGrants`.

### Wallet

`getAddress`, `getCorporation`, `listAuthorizations`, `listVSAgents`, `getStatus`.

## Resources

`verana://own/operator`, `corporation`, `authorizations`, `fee-grant`, `vs-agents`, `status`.

## Prompts

Operations: `diagnose-server`, `reconcile-transaction`. Governance: `bootstrap-corporation`, `delegate-operator`, `update-governance-framework`, `rotate-dids`, `audit-corporation`. Ecosystem: `create-ecosystem-with-schema`, `create-root-participant`, `manage-credential-schema`. Participants: `onboard-participant`, `manage-participant`, `validate-participants`. Discovery: `explore-network`, `check-trust-status`.

## Errors

One envelope with a stage (`validation`, `authorization`, `broadcast`, `confirmation`, `indexer`, `upstream`) and a code; `BCAST_TIMEOUT` and `VSA_AUTH_FAILED` are the two a client handles specially.

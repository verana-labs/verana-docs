---
title: Specifications
description: The normative documents behind the docs, and how the docs cite them.
---

# Specifications

Documentation explains and guides; the specifications decide. When a page here and a specification disagree, the specification wins and the page is wrong.

| Specification | Scope | Where |
|---|---|---|
| Verifiable Trust v4 | What a Verifiable Service and a Verifiable User Agent are, the Essential Credential Schemas, credential formats, trust resolution | [verana-labs.github.io/verifiable-trust-spec/versions/v4](https://verana-labs.github.io/verifiable-trust-spec/versions/v4/) |
| Verifiable Public Registry v4 | The registry data model and every module message and query | [verana-labs.github.io/verifiable-trust-vpr-spec/versions/v4](https://verana-labs.github.io/verifiable-trust-vpr-spec/versions/v4/) |
| VS Agent v4 | The agent runtime: configuration, public endpoints, Admin API v2, events, flows | [verana-spec/v4/vs-agent](https://github.com/verana-labs/verana-spec/blob/main/v4/vs-agent/spec.md) |
| vt-flow protocol 1.0 | The DIDComm protocol of onboarding and credential acquisition | [verana-spec/v4/vt-flow-protocol](https://github.com/verana-labs/verana-spec/blob/main/v4/vt-flow-protocol/spec.md) |
| Indexer v4 | Indexing, trust evaluation, REST and WebSocket API, TRQP | [verana-spec/v4/verana-indexer](https://github.com/verana-labs/verana-spec/blob/main/v4/verana-indexer/spec.md) |
| Graph v4 | Entities, edges, search and traversal | [verana-spec/v4/verana-graph](https://github.com/verana-labs/verana-spec/blob/main/v4/verana-graph/spec.md) |
| MCP server v4 | Tools, resources, prompts, authorization, transaction flow | [verana-spec/v4/mcp-server](https://github.com/verana-labs/verana-spec/blob/main/v4/mcp-server/spec.md) |
| Frontend v4 | The console: corporation context, pages, transaction model | [verana-spec/v4/verana-frontend](https://github.com/verana-labs/verana-spec/blob/main/v4/verana-frontend/spec.md) |
| Faucet v4 | The faucet service API | [verana-spec/v4/verana-faucet](https://github.com/verana-labs/verana-spec/blob/main/v4/verana-faucet/spec.md) |
| Playground | Site specification and the wallet integration guidelines | [verana-spec/playground](https://github.com/verana-labs/verana-spec/tree/main/playground) |
| Trust Registry Query Protocol | ToIP TRQP, served by the indexer | [trustoverip.github.io/tswg-trust-registry-protocol](https://trustoverip.github.io/tswg-trust-registry-protocol/) |

## Governance documents

The Verana Council maintains the governance documents of the network in [verana-council-gov](https://github.com/verana-labs/verana-council-gov). They are not specifications: where a governance document states a protocol fact, the specification prevails. They are drafts for co-authoring by the Council's Founding Members until ratification.

| Document | What it is | Where |
|---|---|---|
| Network Governance Framework | The rules every ecosystem and corporation on the network must respect: the Council's powers and limits, obligations of corporations and ecosystems, economics, sanctions | [network-gf](https://github.com/verana-labs/verana-council-gov/tree/main/network-gf) |
| ECS Ecosystem Governance Framework | The Council's own EGF for the five Essential Credential Schemas; the worked example of an EGF | [ecs-egf](https://github.com/verana-labs/verana-council-gov/tree/main/ecs-egf) |
| Template EGF | A scaffold for an ecosystem writing its governance framework. Optional; implies no Council endorsement | [template-egf](https://github.com/verana-labs/verana-council-gov/tree/main/template-egf) |
| Template CGF | A scaffold for the corporation governance framework every corporation anchors at creation, with a short form for corporations that control no ecosystem. Optional; implies no Council endorsement | [template-cgf](https://github.com/verana-labs/verana-council-gov/tree/main/template-cgf) |

## How the docs cite them

Requirement identifiers appear in the form the specifications use: `VS-REQ-3`, `TR-4`, `MOD-PP-MSG-1`, `VSA-ADM-AUTH`, `IDX-VT-QRY-1`, `TG-FCT-3`, `VMS-TOOLS-LEDGER`. Each guide ends with the clauses it rests on.

## Versions

| Docs version | Specifications | Network |
|---|---|---|
| v4 (current) | Verifiable Trust v4, VPR v4, component specs under `v4/` | testnet from 2026-10-13, devnet |
| v5 (next) | opened when v5 work starts | |
| v3 (old) | Verifiable Trust v3, VPR v3 | archived |

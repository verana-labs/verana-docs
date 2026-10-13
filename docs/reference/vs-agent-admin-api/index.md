---
title: VS Agent Admin API
sidebar_position: 0
---

# VS Agent Admin API v2

The Administration API is how a backend, the Verana MCP server or an operator console drives a VS Agent: DIDComm connections and protocols, OpenID4VC issuance and verification, AnonCreds artifacts, and the Verifiable Trust state of the agent (flows, service endpoints). It listens on the admin port, separate from the public listener that peers and wallets reach.

Every route is versioned under `/v2`. Authentication is either network based (trusted networks) or corporation based (an account signature exchanged for a bearer token); see [Admin API authentication](../../build/verifiable-services/index.md) in the guides.

The pages in this section are generated from the OpenAPI document published in the [vs-agent repository](https://github.com/verana-labs/vs-agent/blob/main/docs/api/openapi.json), exported from the agent with every optional scope enabled. The normative description is the [VS Agent v4 specification](https://github.com/verana-labs/verana-spec/blob/main/v4/vs-agent/spec.md), section Administration API; requirement identifiers in the form `VSA-ADM-*` refer to it.

| Scope | Prefix | What it operates on |
|---|---|---|
| Authentication | `/v2/auth` | Account challenge and bearer token |
| Agent | `/v2/agent` | Identity, liveness, readiness |
| DIDComm | `/v2/didcomm` | Connections, invitations, messages, presentations, credential exchanges |
| OpenID4VC | `/v2/openid4vc` | Credential offers, presentation requests, signing certificates |
| AnonCreds | `/v2/anoncreds` | Credential definitions, revocation registries, revocation |
| Verifiable Trust | `/v2/vt` | Credential acquisition flows, service endpoints |

---
title: Glossary
description: The v4 vocabulary of Verana, in plain words.
---

# Glossary

**Accreditation.** The audience word for a participant entry: an ecosystem's recognition that a corporation may act in a role (issuer, verifier, grantor, holder) for one credential schema, between two dates.

**Active participant.** A participant entry whose effective window contains now and that is neither revoked nor slashed. Only active entries count in trust resolution.

**Applicant.** The corporation (through its operator or its agent) that starts an onboarding process to obtain a participant entry.

**Corporation.** The actor of the registry: a legal or organizational entity, realized on chain as a group of accounts with a decision policy. Its policy address signs for it, directly through proposals or through authorized operators. It controls zero or more ecosystems and owns zero or more participant entries.

**Corporation governance framework (CGF).** The versioned documents that govern a corporation itself.

**Credential schema.** A registry entry owned by an ecosystem: a JSON schema plus the policy that governs it (onboarding modes per role, validity periods, pricing asset, digest algorithm). Immutable except for the validity periods.

**Delegable message.** A transaction executed on behalf of a corporation by an authorized operator. Nearly every message is delegable.

**Digest.** A content hash anchored on chain with its block time. Used to give a W3C credential an objective issuance time, and to prove a document existed unchanged.

**DIDComm.** The messaging protocol over which Verifiable Services and wallets connect, exchange credentials and run flows. The mandatory bootstrap channel of a Verifiable Service.

**Ecosystem.** A registry entry controlled by a corporation: a DID, a governance framework, credential schemas, and the tree of participants accredited for them. The Verana word for what other communities call a trust registry.

**Ecosystem governance framework (EGF).** The versioned documents that state the rules of an ecosystem: who may join, how, at what price, what is slashed.

**ECS ecosystem.** The ecosystem that publishes the five Essential Credential Schemas on a network and accredits their issuers. The trust root of every Proof-of-Trust.

**Essential Credential Schemas (ECS).** Service, Organization, Persona, User Agent, Badge: the five schemas that make a minimum trust resolution possible.

**Exchange rate.** A governance-owned on-chain rate between two assets, used to convert fees priced in trust units or fiat into the native coin at transaction time.

**Fee grant.** Authorization for an operator or an agent to pay transaction fees from the corporation's account, bounded by message types, amounts and periods.

**Grantor (issuer grantor, verifier grantor).** An ecosystem operator accredited to onboard issuers or verifiers for a schema, so the ecosystem does not validate every applicant itself.

**Holder.** The entity that holds a credential. For some schemas holders have a participant entry (so the issuer can track and revoke); for permissionless schemas they do not.

**Indexer.** The service that replays the chain, resolves DIDs, evaluates trust and serves queries, subscriptions and the TRQP endpoint. In v4 it includes trust resolution.

**Linked verifiable presentation.** A presentation published at a URL and declared in a DID Document, so anyone resolving the DID finds the credentials the controller chose to make public.

**MCP server (Verana).** The server that exposes the registry, the graph and a VS Agent to AI agents as Model Context Protocol tools.

**Onboarding modes.** How a role is obtained for a schema: `OPEN` (self-create), `ECOSYSTEM_ONBOARDING_PROCESS` (the ecosystem validates), `GRANTOR_ONBOARDING_PROCESS` (a grantor validates); for holders, `ISSUER_ONBOARDING_PROCESS` or `PERMISSIONLESS`.

**Onboarding process.** The applicant and validator interaction that turns a pending participant entry into a validated one: on-chain start, off-chain evidence over vt-flow, on-chain validation.

**Operator.** An account a corporation has authorized to sign specific message types on its behalf.

**Participant entry.** The registry record of an accreditation: corporation, DID, schema, role, validator, effective window, fees, onboarding state, deposit. The audience says accreditation; the protocol says participant.

**Participant session.** The on-chain record of a credential issuance or verification that triggers pay-per-issuance or pay-per-verification fees.

**Participant tree.** The validator chain of a schema: ecosystem root, grantors, issuers and verifiers, holders.

**Pricing asset.** The unit a schema prices its fees in: the native coin or another on-chain coin (`COIN`), trust units (`TU`), or a fiat currency settled off chain (`FIAT`). Trust deposits are always in the native coin.

**Proof-of-Trust.** What a wallet or service shows about a DID after trust resolution: trust status, the service, who operates it, the other credentials it presents, and the chain behind each.

**Trust deposit.** The per-corporation stake that grows with every fee paid or received, cannot be withdrawn in v4, and can be slashed by an ecosystem or by network governance.

**Trust graph.** The query layer over the indexed network: faceted search and traversal queries over DIDs, ecosystems, corporations, schemas and endpoints.

**Trust resolution.** The recursive verification of a DID: its linked presentations, each credential, each VTJSC, the issuer's accreditation at the right time, then the issuer itself, down to the ecosystem DID.

**Trust unit (TU).** A value-stable unit of account for fees, converted to the native coin at transaction time. Not a token.

**TRQP.** The ToIP Trust Registry Query Protocol, served by the indexer: authorization and recognition queries about DIDs and schemas.

**Validator.** The participant (ecosystem, grantor or issuer) that runs an onboarding process with an applicant and validates its entry.

**Verifiable Service (VS).** A service identified by a resolvable DID whose DID Document presents its Essential Credentials as linked presentations and declares a DIDComm endpoint, and which verifies its peers before serving them.

**Verifiable Trust Credential (VTC).** A credential, in any of the three formats, that references a VTJSC and therefore an ecosystem and a schema on the registry.

**Verifiable Trust JSON Schema Credential (VTJSC).** The credential an ecosystem DID issues about one of its credential schemas, binding the on-chain schema to the ecosystem. Every VTC points at one.

**Verifiable User Agent (VUA).** A wallet, browser or agent acting for a person that resolves trust before connecting and presents a Proof-of-Trust.

**VS Agent.** Verana's agent runtime: it holds a service's DID and credentials, speaks DIDComm and OpenID4VC, runs vt-flow, resolves trust, and operates on the registry for its corporation.

**VS operator authorization.** The authorization a corporation gives its agent's account for one participant entry and a fixed set of message types, optionally with a fee grant.

**Verifiable Public Registry (VPR).** The public ledger that holds ecosystems, schemas, participants, deposits and the business model. The Verana network is one.

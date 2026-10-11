---
title: Message catalog
description: Every message of the Verifiable Public Registry, its signer model and the surface through which you normally send it.
---

# Message catalog

Almost every message executes on behalf of a corporation: the corporation's policy address and an authorized operator sign together, or a VS Agent signs under a VS operator authorization scoped to one participant entry. A few messages belong to network governance or are internal module calls.

Surfaces: **FE** the Verana Frontend, **Agent** the VS Agent on its own, **MCP** the Verana MCP server (every delegable message, as an operator), **CLI** `veranad`, **Gov** a governance proposal.

## Corporation (`co`)

| Spec | Message | Signer | Surface |
|---|---|---|---|
| MOD-CO-MSG-1 | `MsgCreateCorporation` | any account; creates the group, the policy and the corporation | FE, MCP |
| MOD-CO-MSG-2 | `MsgUpdateCorporation` (DID) | corporation + operator | FE, MCP |
| MOD-CO-MSG-3 | `MsgUpdateParams` | governance | Gov |

## Ecosystem (`ec`)

| Spec | Message | Signer | Surface |
|---|---|---|---|
| MOD-ES-MSG-1 | `MsgCreateEcosystem` | corporation + operator | FE, MCP |
| MOD-ES-MSG-2 | `MsgUpdateEcosystem` (DID) | corporation + operator | FE, MCP |
| MOD-ES-MSG-3 | `MsgArchiveEcosystem` (archive or unarchive) | corporation + operator | FE, MCP |
| MOD-ES-MSG-4 | `MsgUpdateParams` | governance | Gov |

## Governance framework (`gf`)

Polymorphic: with `ecosystem_id` the message edits an ecosystem governance framework (the corporation must control the ecosystem), without it the corporation's own governance framework.

| Spec | Message | Signer | Surface |
|---|---|---|---|
| MOD-GF-MSG-1 | `MsgAddGovernanceFrameworkDocument` | corporation + operator | FE, MCP |
| MOD-GF-MSG-2 | `MsgIncreaseActiveGovernanceFrameworkVersion` | corporation + operator | FE, MCP |

## Credential schema (`cs`)

| Spec | Message | Signer | Surface |
|---|---|---|---|
| MOD-CS-MSG-1 | `MsgCreateCredentialSchema` | corporation + operator (controller of the ecosystem) | FE, MCP |
| MOD-CS-MSG-2 | `MsgUpdateCredentialSchema` (validity periods only) | corporation + operator | FE, MCP |
| MOD-CS-MSG-3 | `MsgArchiveCredentialSchema` | corporation + operator | FE, MCP |
| MOD-CS-MSG-4 | `MsgUpdateParams` | governance | Gov |

## Participant (`pp`)

| Spec | Message | Signer | Surface |
|---|---|---|---|
| MOD-PP-MSG-1 | `MsgStartParticipantOP` | corporation + operator, or the applicant's agent | FE, Agent, MCP |
| MOD-PP-MSG-2 | `MsgRenewParticipantOP` | corporation + operator, or the agent | FE, Agent, MCP |
| MOD-PP-MSG-3 | `MsgSetParticipantOPToValidated` | validator corporation + operator, or the validator's agent | FE, Agent, MCP |
| MOD-PP-MSG-6 | `MsgCancelParticipantOPLastRequest` | corporation + operator | FE, MCP |
| MOD-PP-MSG-7 | `MsgCreateRootParticipant` | ecosystem controller + operator | FE, MCP |
| MOD-PP-MSG-8 | `MsgSetParticipantEffectiveUntil` | validator or owner + operator | FE, MCP |
| MOD-PP-MSG-9 | `MsgRevokeParticipant` | ancestor validator, owner or ecosystem controller + operator | FE, MCP |
| MOD-PP-MSG-10 | `MsgCreateOrUpdateParticipantSession` | the agent (VS operator) or an operator | Agent, MCP |
| MOD-PP-MSG-11 | `MsgUpdateParams` | governance | Gov |
| MOD-PP-MSG-12 | `MsgSlashParticipantTrustDeposit` | ancestor validator or ecosystem controller + operator | FE, MCP |
| MOD-PP-MSG-13 | `MsgRepayParticipantSlashedTrustDeposit` | owner + operator | FE, MCP |
| MOD-PP-MSG-14 | `MsgSelfCreateParticipant` (OPEN mode) | corporation + operator | FE, MCP |
| MOD-PP-MSG-15 | `MsgTriggerResolver` | corporation + operator, or the agent for its own DID | Agent, FE, MCP |

## Trust deposit (`td`)

| Spec | Message | Signer | Surface |
|---|---|---|---|
| MOD-TD-MSG-1 | Adjust trust deposit | module call | internal |
| MOD-TD-MSG-2 | `MsgReclaimTrustDepositYield` | corporation + operator | MCP (not offered by the v4 frontend; yield is a v5 topic) |
| MOD-TD-MSG-4 | `MsgUpdateParams` | governance | Gov |
| MOD-TD-MSG-5 | `MsgSlashTrustDeposit` (network level) | governance | Gov |
| MOD-TD-MSG-6 | `MsgRepaySlashedTrustDeposit` | corporation + operator | FE, MCP |
| MOD-TD-MSG-7 | Burn ecosystem slashed deposit | module call | internal |

## Delegation (`de`)

| Spec | Message | Signer | Surface |
|---|---|---|---|
| MOD-DE-MSG-1, 2 | Grant or revoke fee allowance | module call, from the operator authorization messages | internal |
| MOD-DE-MSG-3 | `MsgGrantOperatorAuthorization` | corporation through a group proposal, or an authorized operator | FE, MCP |
| MOD-DE-MSG-4 | `MsgRevokeOperatorAuthorization` | same | FE, MCP |
| MOD-DE-MSG-5, 6, 9 | Grant, revoke, sync VS operator authorization | module call, from the participant messages that declare a VS operator | internal |

## Digest (`di`)

| Spec | Message | Signer | Surface |
|---|---|---|---|
| MOD-DI-MSG-1 | `MsgStoreDigest` | corporation + operator, or a module (the agent anchors each W3C credential it issues) | Agent, MCP |

## Exchange rate (`xr`)

| Spec | Message | Signer | Surface |
|---|---|---|---|
| MOD-XR-MSG-1 | `MsgCreateExchangeRate` | governance | Gov |
| MOD-XR-MSG-2 | `MsgUpdateExchangeRate` | authorized rate operator | CLI, MCP |
| MOD-XR-MSG-3 | `MsgSetExchangeRateState` | governance | Gov |
| MOD-XR-MSG-4, 5 | Grant or revoke exchange rate authorization | governance | Gov |

## The authorization checks behind every delegable message

1. The signing corporation account must be the policy address of a registered corporation.
2. An operator authorization must exist for that corporation, that operator and that message type, within its expiration and spend limit. For an agent, a VS operator authorization record for the participant entry in play replaces it, and the entry must be active.
3. Fees are paid by the operator, or by the corporation when the transaction names its policy address as fee granter and a fee grant covers the message type.

Details: VPR specification, section `AUTHZ-CHECK`.

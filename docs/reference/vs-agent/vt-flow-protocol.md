---
title: vt-flow protocol
description: The DIDComm protocol that runs onboarding processes and credential acquisition between an applicant agent and a validator agent.
---

# vt-flow protocol

`vt-flow` 1.0 is the DIDComm protocol through which an applicant agent and a validator agent run an onboarding process or a direct credential issuance. The on-chain part (participant entries) is done on the registry; `vt-flow` carries the off-chain part: the request, evidence collection, out-of-band steps, validation, and the credential issuance that follows. Normative source: the [vt-flow protocol specification](https://github.com/verana-labs/verana-spec/blob/main/v4/vt-flow-protocol/spec.md) and the flow sections of the VS Agent specification.

## Two flows

| Flow | When | On-chain anchor |
|---|---|---|
| Onboarding process | The schema's onboarding mode for the requested role is an onboarding process (ecosystem or grantor). | The applicant creates the participant entry in `PENDING` (`StartParticipantOP`) before connecting; the validator sets it to `VALIDATED`. A credential is issued only when the validated role is `HOLDER`. |
| Direct issuance | The applicant already holds the participant entry (or the schema is permissionless for holders) and asks an authorized issuer for the credential. | None beyond the issuer's accreditation. |

In OPEN mode nothing runs over `vt-flow`: the applicant self-creates its participant entry on chain.

## Messages

| Message | Direction | Purpose |
|---|---|---|
| `onboarding-request` | applicant to validator | Names the pending participant entry (`participant_session_id`) and proposes claims. Resent unchanged after a reconnection. |
| `issuance-request` | applicant to validator | Asks for a credential of a schema the applicant is entitled to. |
| `oob-link` | validator to applicant | A link the applicant completes out of band (forms, documents, identity checks). Puts the flow in `OOB_PENDING`. |
| `validating` | validator to applicant | The validator resumed off-chain validation. |
| Issue Credential 2.0 | validator to applicant | The credential, once the entry is validated or the issuance request accepted. |
| `CRED_STATE_CHANGE` | validator to applicant | A later update, today `REVOKED`: the applicant removes the linked presentation and deletes the credential. |

The validator accepts a connection from a not-yet-verifiable applicant only when a pending participant entry on an ECS schema names the validator, so the purpose is established from the registry and not from the peer's claim.

## Flow states

| State | Side | Meaning |
|---|---|---|
| `AWAITING_OP` | applicant | Waiting for `StartParticipantOP` or `RenewParticipantOP` on chain |
| `OR_SENT`, `IR_SENT` | applicant | Request sent |
| `AWAITING_OR`, `AWAITING_IR` | validator | Request expected, or last one rejected |
| `OOB_PENDING` | both | An out-of-band step is open |
| `VALIDATING` | both | Off-chain validation in progress |
| `AWAITING_VALIDATION_TX`, `VALIDATION_TX_SUBMITTED`, `VALIDATION_TX_FAILED` | validator | Refinements of validating around the `SetParticipantOPToValidated` transaction; the applicant sees none of them |
| `VALIDATED` | both | Entry validated on chain; terminal unless the role is `HOLDER` |
| `VALIDATED_PENDING_CLAIMS` | validator | Validated, role `HOLDER`, claims missing or invalid; waits for `editCredentialClaims` then `validateFlow` |
| `CRED_OFFERED` | both | Issue Credential 2.0 in flight |
| `COMPLETED` | both | Credential accepted; the connection stays open for updates; a renewal re-enters from here |
| `CRED_REVOKED`, `PARTICIPANT_REVOKED`, `PARTICIPANT_SLASHED` | both | Post-issuance outcomes |
| `TERMINATED_BY_VALIDATOR`, `TERMINATED_BY_APPLICANT`, `ERROR` | both | Terminal |

Connection state is tracked separately: `NOT_CONNECTED`, `ESTABLISHED`, `TERMINATED`. After a reconnection the applicant resends its request with the same `participant_session_id` and the validator reassigns the flow to the new connection.

## Where the Admin API drives it

Validator side: `listFlows`, `getFlow`, `editCredentialClaims`, `sendOobLink`, `startValidation`, `validateFlow`, `rejectFlow` under `/v2/vt/flows`. Applicant side: the agent runs the flow itself once the on-chain entry exists, and reports through `vt.flows.state-updated` events.

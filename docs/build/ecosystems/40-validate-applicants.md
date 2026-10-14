---
title: Validate applicants
description: "Pending tasks in the frontend, the evidence conversation your anchor's agent runs, validation with fees and end date, rejection."
sidebar_position: 40
persona: ecosystem-builder
surface: frontend, admin-api
verified_on: 2026-10-14 (testnet v0.10.6, frontend 0.18; agent side pending, VS Agent 2.0)
---

# Validate applicants

When a corporation applies for an accreditation that names your ecosystem (or one of your grantors) as validator, two things happen: a pending entry appears on the registry, and the applicant's agent connects to your validator agent to run the evidence conversation. You decide, then validate on chain.

## Where it shows

- **Pending Tasks** in the frontend lists every pending application for your corporation, grouped by ecosystem and schema, with the applicant's trust state, role and onboarding state. The navigation badge counts them.
- Your validator agent lists the flows with their state; the evidence it collected, and the out-of-band links it sent, are there. See [Act as validator](../verifiable-services/63-validator-issue-after-validation.mdx) for the agent's routes.

<Screenshot name="validate/pending-tasks" alt="Pending Tasks with one application pending approbation" />

## Steps

1. Select the application. Its participant card opens below: the granted service and its provider, the key metadata (DID, corporation, ecosystem, VS operator, deposit), the onboarding process with the fees and deposit escrowed, and the activity.

<Screenshot name="validate/task-card" alt="The participant card of a pending application" />

2. Review the applicant: its Proof-of-Trust (is it a trusted Verifiable Service, who operates it), the governance framework acceptance, the evidence your process requires. Send an out-of-band link from the agent when you need a form or documents.
3. Decide. **Accept and Set Validated**: set the end date within the schema's validity period (empty takes the longest allowed), confirm or adjust the fees the applicant will charge below it (in uvna), and the digest of your onboarding summary if you keep one. **Confirm**, then confirm the transaction. Or **reject** from the agent with a reason; the applicant may cancel and recover its escrow.

<StepThrough>
<Step title="Accept and Set Validated" shot="validate/accept-form">

The validation form: end date, fees the participant will charge, and the optional onboarding summary digest.

</Step>
<Step title="Confirm" shot="validate/accept-confirm">

The confirmation dialog, with the network fee and who pays it.

</Step>
<Step title="Validated" shot="participants/card-validated">

The participant is **active**, its onboarding process **validated**, with its effective window. The activity timeline records each step.

</Step>
</StepThrough>

4. For a holder role on a schema with issuer onboarding process, the agent issues the credential after validation, with the claims you set.

When your agent holds the VS operator authorization covering validation, `validate` on the agent signs the transaction itself; otherwise the frontend's pending task is where an operator signs it.

## Later

From the participant card: move the end date, revoke, or slash (irreversible, with a reason) when the governance framework is breached. See [Revoke, slash and repay](./41-revoke-slash-repay.md).

## Verify

The entry is active in the tree (tick **Unresolvable services** if its DID does not resolve yet); the applicant's agent reports `VALIDATED` or `COMPLETED`.

<Screenshot name="participants/tree-issuer" alt="The participant tree with the validated issuer under the root" />

## Outlook

A headless onboarding service that holds applications, evidence and decisions, with its own case review in the frontend, is specified in draft; until it ships, evidence lives in your agent or your own portal, and the frontend shows what is on chain.

## Next

- [Revoke, slash and repay](./41-revoke-slash-repay.md).
- Specification: VPR v4, `MOD-PP-MSG-3`; VS Agent v4, validator gates; Frontend v4, `VFE-PAGE-PENDING`.

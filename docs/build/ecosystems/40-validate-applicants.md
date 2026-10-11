---
title: Validate applicants
description: "Pending tasks in the frontend, the evidence conversation your anchor's agent runs, validation with fees and end date, rejection."
sidebar_position: 40
persona: ecosystem-builder
surface: frontend, admin-api
verified_on: pending (testnet v4, VS Agent 2.0)
---

# Validate applicants

When a corporation applies for an accreditation that names your ecosystem (or one of your grantors) as validator, two things happen: a pending entry appears on the registry, and the applicant's agent connects to your validator agent to run the evidence conversation. You decide, then validate on chain.

## Where it shows

- **Pending tasks** in the frontend lists every pending application for your corporation, grouped by ecosystem and schema, with the applicant's Proof-of-Trust and the on-chain actions.
- Your validator agent lists the flows with their state; the evidence it collected, and the out-of-band links it sent, are there. See [Act as validator](../verifiable-services/63-validator-issue-after-validation.mdx) for the agent's routes.

## Steps

1. Review the applicant: its Proof-of-Trust (is it a trusted Verifiable Service, who operates it), the governance framework acceptance, the evidence your process requires. Send an out-of-band link from the agent when you need a form or documents.
2. Decide. **Validate** from the participant card: confirm or adjust the fees the applicant will charge below it, set an end date within the schema's validity period, sign. Or **reject** from the agent with a reason; the applicant may cancel and recover its escrow.
3. For a holder role on a schema with issuer validation, the agent issues the credential after validation, with the claims you set.

When your agent holds the VS operator authorization covering validation, `validate` on the agent signs the transaction itself; otherwise the frontend's pending task is where an operator signs it.

## Later

From the participant card: move the end date, revoke, slash (irreversible, with a reason) when the governance framework is breached, and accept repayment.

## Verify

The entry is `ACTIVE` in the tree; the applicant's agent reports `VALIDATED` or `COMPLETED`.

## Outlook

A headless onboarding service that holds applications, evidence and decisions, with its own case review in the frontend, is specified in draft; until it ships, evidence lives in your agent or your own portal, and the frontend shows what is on chain.

## Next

- [Revoke, slash and repay](./41-revoke-slash-repay.md).
- Specification: VPR v4, `MOD-PP-MSG-3`; VS Agent v4, validator gates; Frontend v4, `VFE-PAGE-PENDING`.

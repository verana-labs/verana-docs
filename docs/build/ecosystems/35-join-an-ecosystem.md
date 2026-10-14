---
title: Join an ecosystem
description: "Find an ecosystem in Discover & Join, then use the join wizard to apply for a role: schema, role, governance framework, validator, service DID and the agent's delegation."
sidebar_position: 35
persona: ecosystem-builder
surface: frontend
verified_on: 2026-10-14 (testnet v0.10.6, frontend 0.18 with the join wizard of frontend#503)
---

# Join an ecosystem

This is the other side of the tree: your corporation applies to issue or verify an ecosystem's credential. The ecosystem (or one of its grantors) validates the application from its [Pending Tasks](./40-validate-applicants.md); for an open role the participant exists at once.

## Prerequisites

- A corporation acting in the frontend, with an operator authorization covering the participant messages. See [Create a corporation](./10-create-corporation.md).
- The DID of the service that will hold the accreditation: your Verifiable Service's agent, already deployed.
- The account of that agent, if it will act for the accreditation itself (the VS operator, below).
- Enough VNA for the validation fees the validator charges, the trust deposit, and the network fee. The wizard shows them before you sign.

## Find the ecosystem

**Discover & Join** lists every ecosystem on the network with its controller, its active schemas and its figures. Search by name or DID, sort, hide the ecosystems you own or already take part in, and open the governance framework with **EGF** before you commit. Each schema card shows its onboarding modes and validity periods.

<Screenshot name="join/discover" alt="Discover & Join listing an ecosystem with its credential schema" />

**Join** opens the wizard for that ecosystem.

## The join wizard

<StepThrough>
<Step title="Review the ecosystem" shot="join/step-review">

Who controls the ecosystem, its DID and trust state, and its figures. Continue when you are on the right one.

</Step>
<Step title="Pick the schema" shot="join/step-schema">

The ecosystem's active credential schemas. Pick the credential you will issue or verify.

</Step>
<Step title="Pick your role" shot="join/step-role">

Issuer, verifier, or a grantor role when the schema has one, each with what it means. Holders do not onboard on chain when the schema is permissionless for holders: the wizard says so and links to the accredited issuers instead.

</Step>
<Step title="Accept the governance framework" shot="join/step-egf">

The ecosystem governance framework in force, in the language you choose, with its on-chain digest. **Verified** means the document the frontend fetched matches the digest; if it does not, you cannot accept it. Read it, then tick the acceptance.

</Step>
<Step title="Pick the validator" shot="join/step-validator">

The participants that may validate your application for this role, with their fees. For an open role, this is the participant your entry will sit under.

</Step>
<Step title="Confirm and submit" shot="join/step-confirm">

The summary (schema, role, onboarding transaction, validator, validation fees, trust deposit), then the **Service DID** that will hold the accreditation. For an open role you also set the start, the end and your own fees. **Join Ecosystem**.

</Step>
</StepThrough>

### The agent's delegation

**Advanced: VS operator delegation** lets your Verifiable Service's agent act for this accreditation without an operator of the corporation in the loop: the **VS operator account** (the agent's account), the messages it may run for this participant, an optional spend limit per period, and whether the corporation pays the agent's network fees, with a budget. It is frozen at creation: changing it later means revoking the participant and creating it again. Leave it empty if your operators sign for the participant from the frontend.

:::warning Use the agent's own account
The VS operator must not be an account that already holds an operator authorization of your corporation; the chain refuses the pair. Give the agent its own account.
:::

## Sign

The confirmation dialog shows the onboarding transaction, the network fee, the validation fees escrowed for the validator and the trust deposit, before the wallet asks you to sign.

<Screenshot name="join/confirm-dialog" alt="The confirmation dialog of an onboarding process start" />

## After you submit

- For a role that needs validation, your participant is created with its onboarding process **pending approbation**. The validator sees it in its Pending Tasks, and its agent and yours run the evidence conversation. See [Validate applicants](./40-validate-applicants.md).
- While it is pending, **Cancel Request** on your participant card cancels it and returns the escrowed fees.
- Once validated, the participant is **active** until its end date. **Renew Onboarding Process** before the end starts a renewal with the same validator.
- For an open role, the participant is effective from its start; no validation is needed.

<Screenshot name="participants/card-own" alt="The participant card of an active issuer, seen by its own corporation" />

## Verify

```bash
curl -s 'https://idx.testnet.verana.network/v4/participant/list?schema_id=<schema id>&did=<service did>' | jq '.participants[] | {id, role, op_state, vs_operator, effective_from, effective_until}'
```

## Next

- [Validate applicants](./40-validate-applicants.md), the validator's side.
- For the agent's side of the same flow: [Join an onboarding process](../verifiable-services/42-join-onboarding-process.mdx).
- Specification: VPR v4, `MOD-PP-MSG-1`, `MOD-PP-MSG-2`, `MOD-PP-MSG-14`; Frontend v4, `VFE-PAGE-DISCOVER`.

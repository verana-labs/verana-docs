---
title: Join an ecosystem
description: "Find the ecosystem, open the schema's participant tree, join under the participant that will validate you, accept the governance framework, fill the form and sign."
sidebar_position: 35
persona: ecosystem-builder
surface: frontend
verified_on: 2026-10-16 (testnet v0.10.6, frontend 0.18 with frontend#549 and frontend#550)
---

# Join an ecosystem

This is the other side of the tree: your corporation applies to issue, verify or hold an ecosystem's credential. You join from the schema's participant tree, under the participant you want as validator. When the role needs an onboarding process, that participant validates your application from its [Pending Tasks](./40-validate-applicants.md); when the role is open, your participant exists at once.

## Prerequisites

- A corporation acting in the frontend, with an operator authorization covering the participant messages. See [Create a corporation](./10-create-corporation.md). A holder of a permissionless schema needs neither, see [Holders](#holders).
- The DID of the service that will hold the accreditation: your Verifiable Service's agent, already deployed.
- Enough VNA. The validation fees and the trust deposit come from the corporation's account, the network fee from the account that signs. The form and the confirmation dialog show them before you sign.

## Find the ecosystem

**Discover & Join** lists every ecosystem on the network with its controller, its active schemas and its figures. Search by name or DID, sort, hide the ecosystems you own or already take part in, and open the governance framework with **EGF** before you commit. Each schema card shows its onboarding modes and validity periods. **View Ecosystem** opens the ecosystem page.

<Screenshot name="join/discover" alt="Discover & Join listing an ecosystem with its credential schema" />

**Ecosystems** lists only the ecosystems your corporation controls or already takes part in, which is the quicker way back to one.

## Open the participant tree

On the ecosystem page, the **Participants** action of a schema card opens that schema's participant tree; the schema page has the same **Participants** button.

The tree starts at the ecosystem's root participant. Under each participant sit folders for the roles that can join below it: **Issuers** and **Verifiers** under the root, or **Issuer Grantors** and **Verifier Grantors** when the schema uses grantors, then **Holders** under each issuer. Each folder shows its onboarding mode, **onboarding process** or **open**, and a **join** action.

<Screenshot name="join/tree" alt="The participant tree of a schema with its role folders, their onboarding mode and the join action" />

Where you join is your choice of validator. The folder you pick sits under one participant, and that participant validates your application, or anchors your entry for an open role. To join as issuer under a grantor rather than under the ecosystem, open the grantor's node and join its **Issuers** folder. Tick **Business Rules** to compare the fees of the candidates, and **Unresolvable services** to show participants whose DID does not resolve yet.

**join** is offered under an active participant only. Without a wallet it asks you to connect; without an acting corporation it is disabled and its tooltip says why. Its icon says how it will run: a lightning bolt when your operator authorization covers the message, a gavel when it opens a proposal for the corporation's members.

## Join

<StepThrough>
<Step title="Accept the governance framework" shot="join/tree-egf">

The join dialog opens on the ecosystem governance framework in force, in the language you choose, with its on-chain digest. **Verified** means the document the frontend fetched matches the digest; if it does not, you cannot accept it. Read it, tick the acceptance, **Continue**.

</Step>
<Step title="Onboarding process: your DID" shot="join/tree-op-form">

For a role with an onboarding process, enter the **DID** that will hold the accreditation. The form shows what the transaction needs on top of the network fee: the validator's validation fees, escrowed until it decides, and your trust deposit. **Confirm & Start Onboarding Process**.

</Step>
<Step title="Open role: DID, window and fees" shot="join/tree-self-create">

For an open role you create the participant yourself: the **DID**, the effective window (an empty start means now, an empty end means no end date) and, for an issuer, the fees you will charge, in uvna. **Confirm & Self Create Participant**.

</Step>
</StepThrough>

## Sign

The confirmation dialog shows the transaction, the network fee and who pays it, the validation fees escrowed for the validator and the trust deposit, before the wallet asks you to sign.

<Screenshot name="join/confirm-dialog" alt="The confirmation dialog of an onboarding process start" />

## After you submit

- For a role with an onboarding process, your participant appears in the tree under the validator, its onboarding process pending. Pending entries always show, whatever the filters. The validator finds it in its Pending Tasks, and its agent and yours run the evidence conversation. See [Validate applicants](./40-validate-applicants.md).
- While it is pending, **Cancel Request** on your participant card cancels it and returns the escrowed fees.
- Once validated, the participant is **active** until its end date. **Renew Onboarding Process** before the end starts a renewal with the same validator.
- For an open role, the participant exists at once and is effective from its start; no validation is needed. Tick **Unresolvable services** if its DID does not resolve yet.

<Screenshot name="participants/card-own" alt="The participant card of an active issuer, seen by its own corporation" />

The join form does not set a VS operator: an accreditation created from the tree has none, so your agent cannot sign for it under a VS operator authorization. See [Let the agent pay with corporation funds](../verifiable-services/81-pay-with-corporation-funds.mdx) for how to declare one.

## Holders

The **Holders** folder under an issuer follows the schema's holder onboarding mode.

- **Issuer onboarding process**: the issuer is your validator. Join its **Holders** folder like any other role with an onboarding process: an acting corporation is required, then the governance framework, your DID and the confirmation. The issuer validates you, then issues the credential.
- **Permissionless**: there is no on-chain onboarding and nothing to sign, no wallet or corporation needed. **join** opens a dialog that reads the issuer's DID document and sends you to the issuer: **Visit the issuer's website** when it publishes one, **Email the issuer** when it publishes a contact email.

<Screenshot name="join/holder-website" alt="The holder dialog of a permissionless schema, linking to the issuer's website" />

When the issuer publishes neither, the dialog asks you to get in touch with the issuer to find out how to get a credential issued.

<Screenshot name="join/holder-contact" alt="The holder dialog when the issuer publishes no website or email" />

## Verify

```bash
curl -s 'https://idx.testnet.verana.network/v4/participant/list?schema_id=<schema id>&did=<service did>' | jq '.participants[] | {id, role, op_state, validator_participant_id, effective_from, effective_until}'
```

## Next

- [Validate applicants](./40-validate-applicants.md), the validator's side.
- For the agent's side of the same flow: [Join an onboarding process](../verifiable-services/42-join-onboarding-process.mdx).
- Specification: VPR v4, `MOD-PP-MSG-1`, `MOD-PP-MSG-2`, `MOD-PP-MSG-14`; Frontend v4, `VFE-PAGE-DISCOVER`.

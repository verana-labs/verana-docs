---
title: Create a corporation
description: "Members, weights, decision policy, DID, language and the first governance framework document; fund the policy address; grant the first operator."
sidebar_position: 10
persona: ecosystem-builder
surface: frontend
verified_on: 2026-10-14 (testnet v0.10.6, frontend 0.18)
---

# Create a corporation

Every resource on the registry belongs to a corporation. Creating one is the first thing any organisation does, whether it will control ecosystems or only hold accreditations.

## Prerequisites

- A browser wallet connected to the frontend on testnet, with a little balance from the faucet (**Account**, **Get VNA**). See [Get started](./05-get-started.md).
- A DID for the corporation. Its anchor agent's DID is the natural choice; any resolvable DID you control works.
- A first corporation governance framework document (how your organisation reaches decisions and who may sign for it) at a stable URL. The Verana Council's [Template CGF](https://github.com/verana-labs/verana-council-gov/tree/main/template-cgf) is a scaffold with a short form; for a first corporation on testnet a one-page document is enough.

## Steps

With no corporation to act for, the frontend offers **Create your corporation** on the dashboard and **Create new Corporation** in the corporation selector; the Corporation, Ecosystems, Agents and Pending Tasks pages stay hidden until you act for one. The wizard has four steps.

<StepThrough>
<Step title="Identity" shot="corporation/wizard-identity">

The corporation DID, the language of its governance framework, and the URL of the framework document. The frontend fetches the document and computes its digest; the URL must be reachable from the browser.

</Step>
<Step title="Members" shot="corporation/wizard-members">

The member accounts and their voting weights (your account is the first member), the **decision policy**, a threshold of weight or a percentage of the total weight, the **voting period** and the **minimum execution period**, in seconds. The hint under the fields says how many members must agree. A single member with threshold one is fine to start; you can change members and policy later by proposal.

</Step>
<Step title="Review" shot="corporation/wizard-review">

Everything you entered, the reminder that the creating account keeps no privilege (governance belongs to the group), and the **Policy funding** in uvna: coins sent to the corporation's policy address in the same transaction. Fund it now if the corporation will pay fees for its operators or agents. **Sign & create corporation**.

</Step>
<Step title="Confirm" shot="corporation/wizard-confirm">

The confirmation dialog shows the transaction, the network fee and who pays it. Confirm, then approve in the wallet.

</Step>
<Step title="Operator grant" shot="corporation/wizard-grant">

The corporation exists. The last step offers the guided first proposal: **Grant me operator authorization**, so your account can act for the corporation without a vote for every transaction. With threshold one it executes at once. You can skip it and do it later from the Corporation page; see [Operators, proposals and fee grants](./11-operators-proposals.md).

</Step>
</StepThrough>

1 VNA is 1,000,000 uvna. Amounts typed in fields labelled uvna are in base units.

## Verify

The Corporation page shows the id, DID, policy address, members and policy, the first governance framework version active, and the activity of the corporation. The selector in the header now acts for it.

<Screenshot name="corporation/overview" alt="The Corporation page overview after creation" />

The indexer lists it:

```bash
curl -s 'https://idx.testnet.verana.network/v4/corporation/list?did=<your did>' | jq
```

## Next

- [Operators, proposals and fee grants](./11-operators-proposals.md).
- Specification: VPR v4, `MOD-CO-MSG-1`; Frontend v4, `VFE-CORP-CREATE`.

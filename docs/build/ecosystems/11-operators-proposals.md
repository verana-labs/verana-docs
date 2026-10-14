---
title: Operators, proposals and fee grants
description: "Grant and revoke operator authorizations, scope them by message type, vote and execute group proposals, let the corporation pay fees."
sidebar_position: 11
persona: ecosystem-builder
surface: frontend
verified_on: 2026-10-14 (testnet v0.10.6, frontend 0.18)
---

# Operators, proposals and fee grants

A corporation acts in two ways. Members submit and vote **proposals** on the group, which the policy address executes; that is how members, policy and operator grants change. **Operators** then sign day-to-day transactions directly, within the message types the corporation listed for them.

## Every action shows its mode

Each action button carries an icon: a lightning bolt for operator mode (you hold the authorization, the transaction executes at once) and a gavel for proposal mode (the action is submitted as a proposal for the members to vote). Hover it to read which. The chain stays authoritative; a rejection on chain is shown as such.

## Grant an operator

Corporation page, **Operators**. The list shows the active operators with the number of message types each holds; expand one to see them. Below it, **Grant operator authorization**:

1. Paste the operator's account.
2. Pick the message types. They are grouped by module (corporation, ecosystem, governance framework, credential schema, participant, trust deposit); **Select all** and **Clear** help. The counter says how many are selected.
3. Optionally open **Expiration, spend limits and fee grant**: an expiry date, a spend limit per period, and a fee grant so the corporation pays the operator's network fees, with its own budget.
4. **Grant**.

<Screenshot name="corporation/operator-grant-form" alt="The operator grant form with three message types selected" />

Granting operators is itself a governance action, so the common case opens a proposal. The confirmation dialog says so, and lets you edit the proposal title and summary before you submit. If the grantee already holds an authorization, the form starts from its current message types and limits, so a re-grant does not widen it by accident.

<Screenshot name="corporation/operator-grant-confirm" alt="The confirmation dialog of an operator grant submitted as a governance proposal" />

**Revoke** next to an operator removes its authorization, the same way.

## Proposals

Corporation page, **Proposals**: the list with status, filters and the tally against the threshold; expand a proposal to see the messages it executes and the votes. Vote yes or no, execute an accepted proposal, or withdraw your own. The navigation badge counts proposals awaiting your vote.

<Screenshot name="corporation/tab-proposals" alt="The Proposals tab with an accepted proposal" />

The **Members** tab shows the members and their weights, the threshold and the voting period in force.

<Screenshot name="corporation/tab-members" alt="The Members tab" />

**New proposal** opens the composer. It covers operator grants and revocations, member changes, decision policy changes and the corporation's DID rotation.

<StepThrough>
<Step title="Operator grant" shot="corporation/proposal-composer">

The same grant form as on the Operators tab, as a proposal.

</Step>
<Step title="Members" shot="corporation/proposal-members">

**Update group members**: list the accounts and their weights. A weight of zero removes a member; members you leave out keep their weight.

</Step>
<Step title="Decision policy" shot="corporation/proposal-policy">

**Update decision policy**: the threshold and the voting period.

</Step>
</StepThrough>

With threshold one and a single member, a proposal you submit executes at once. With more members it waits for the votes, then anyone can execute it.

## Agents are different

An agent's authorization is not granted here. It is declared on each accreditation when you create or apply for it, as the VS operator with its message types and optional fee grant. The Operators tab's **Agent Authorizations** section and the **Agents** page show them read only. See [Join an ecosystem](./35-join-an-ecosystem.md) and [Pay with corporation funds](../verifiable-services/81-pay-with-corporation-funds.mdx).

<Screenshot name="corporation/tab-operators-agents" alt="The Operators tab with an operator and an agent authorization" />

## Verify

```bash
curl -s 'https://idx.testnet.verana.network/v4/delegation/operator-authorizations?corporation_id=<id>&only_active=true' | jq
curl -s 'https://idx.testnet.verana.network/v4/group/proposals?corporation_id=<id>' | jq '.proposals[] | {id, status, tally}'
```

## Next

- [Create an ecosystem](./20-create-ecosystem.md).
- Specification: VPR v4, Delegation module, `MOD-DE-MSG-3`; Frontend v4, `VFE-CORP-PROP`, `VFE-TX-FALLBACK`.

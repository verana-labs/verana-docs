---
title: Operators, proposals and fee grants
description: "Grant and revoke operator authorizations, scope them by message type, vote and execute group proposals, let the corporation pay fees."
sidebar_position: 11
persona: ecosystem-builder
surface: frontend
verified_on: pending (testnet v4)
---

# Operators, proposals and fee grants

A corporation acts in two ways. Members submit and vote **proposals** on the group, which the policy address executes; that is how members, policy and operator grants change. **Operators** then sign day-to-day transactions directly, within the message types the corporation listed for them.

## Grant an operator

Corporation page, **Operator authorizations**, **Grant operator**. Choose the account, pick the message types (the frontend groups them by module: ecosystems and governance frameworks, schemas, participants, trust deposit), optionally a spend limit per period and an expiry, and whether the corporation pays the operator's network fees (a fee grant, with its own limit). If your account already holds the authorization message type you execute directly; otherwise, the common case for the first grant, the frontend wraps it in a proposal.

## Proposals

Corporation page, **Proposals**: the list with status and tally, a composer for members, and a detail view that decodes exactly what will execute. Vote yes, no, abstain or veto; execute when accepted; withdraw as a proposer. The navigation badge counts proposals awaiting your vote.

The composer covers: operator grants and revocations, member changes, decision policy changes, the corporation's DID rotation, governance framework documents and activation, and any delegable message for corporations that prefer a vote per action.

## Every action shows its mode

Each action button in the frontend carries an icon: operator mode (you hold the authorization, the transaction executes at once) or proposal mode (the action opens the proposal composer). The chain stays authoritative; a rejection on chain is shown as such.

## Agents are different

An agent's authorization is not granted here. It is declared on each accreditation when you create or apply for it, as the VS operator with its message types and optional fee grant. The Corporation page's **Agent authorizations** section and the **Agents** page show them read-only. See [Pay with corporation funds](../verifiable-services/81-pay-with-corporation-funds.mdx).

## Verify

```bash
curl -s 'https://idx.testnet.verana.network/v4/delegation/operator-authorizations?corporation_id=<id>&only_active=true' | jq
curl -s 'https://idx.testnet.verana.network/v4/group/proposals?corporation_id=<id>' | jq '.proposals[] | {id, status, tally}'
```

## Next

- [Create an ecosystem](./20-create-ecosystem.md).
- Specification: VPR v4, Delegation module, `MOD-DE-MSG-3`; Frontend v4, `VFE-CORP-PROP`.

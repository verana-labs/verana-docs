---
title: Revoke, slash and repay
description: "When and how an ecosystem revokes or slashes an accreditation, what it does to the participant's credentials, and repayment."
sidebar_position: 41
persona: ecosystem-builder
surface: frontend
verified_on: 2026-10-14 (testnet v0.10.6, frontend 0.18)
---

# Revoke, slash and repay

Your governance framework says what a participant must do and what happens when it does not. The registry gives you two instruments.

## Revoke

Any ancestor in the tree, the owner, or the ecosystem controller can revoke an accreditation. The entry stops counting at once; credentials that depended on it are no longer accepted by verifiers, and the participant's agent removes them from its DID Document. Participant card, **Revoke Participant**. The dialog warns that it cannot be undone.

<Screenshot name="participants/revoke-modal" alt="The Revoke Participant dialog" />

## Slash

Slashing takes from the participant's trust deposit the part that corresponds to its activity in your ecosystem, and suspends the accreditation until the amount is repaid. It is irreversible and public; the frontend asks for a reason and warns. Your governance framework should state the process: assess harm, give the participant a chance to make amends, then slash. Participant card, **Slash Deposit**: the amount in uvna and the reason. The frontend simulates the slash first and refuses an amount above the participant's deposit.

<Screenshot name="participants/slash-modal" alt="The Slash Deposit dialog" />

## Repay

The participant's corporation repays the exact slashed amount from the participant card, **Repay Slashed Deposit**, which restores the deposit and the accreditation. The slash stays in its history.

A slash of the corporation's own trust deposit by the network is different: it is repaid from the Corporation page, **Trust Deposit**, **Repay Slashed Deposit**. V4 trust deposits are not withdrawable.

<Screenshot name="corporation/tab-trust-deposit" alt="The Trust Deposit tab of a corporation" />

## Verify

```bash
curl -s https://idx.testnet.verana.network/v4/participant/get/<id> | jq '{participant_state, revoked, slashed_deposit, repaid_deposit}'
```

Specification: VPR v4, `MOD-PP-MSG-9`, `MOD-PP-MSG-12`, `MOD-PP-MSG-13`.

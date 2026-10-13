---
title: Design the fee model
description: "Validation, issuance and verification fees along the tree, discounts, beneficiaries preview, pricing assets, and what the deposit does to every fee."
sidebar_position: 50
persona: ecosystem-builder
surface: frontend, indexer
verified_on: pending (testnet v4)
---

# Design the fee model

Fees are set on accreditations, not on the ecosystem: the root sets what the ecosystem charges, each grantor what it charges in its branch, each issuer what it charges holders and verifiers of its credentials. The registry sums them along the tree at payment time.

## The three fees

| Fee | Set on | Paid by | When |
|---|---|---|---|
| Validation | the validator's accreditation | the applicant | at application, released on validation |
| Issuance | every accreditation above the issuer | the issuer | per credential issued |
| Verification | every accreditation above the verifier, plus the issuer of the credential | the verifier | per credential verified |

Validators may grant a discount on issuance and verification fees to an applicant when validating it.

## What is added on top

Every fee paid adds a network-defined share to the payer's trust deposit, and a share of every amount received goes to the recipient's deposit. When a wallet takes part, two further shares reward the wallet and the user agent. So a fee of 15 costs the payer about 18.75 at today's rates, and leaves a recipient with 95 percent liquid.

## Preview the distribution

```bash
curl -s 'https://idx.testnet.verana.network/v4/participant/beneficiaries?issuer_participant_id=<id>' | jq
```

The frontend shows the same on the participant detail card.

## Pricing asset

The schema fixes it at creation. The native coin is what the frontend supports for paid actions today. Trust units protect an ecosystem against coin price swings and need an exchange rate maintained by network governance; fiat records the obligation and settles off chain. Both are browsable in the frontend but not yet payable there.

## Change fees

Fees on an accreditation are set at validation (or self-creation). To change the root's fees, validate again with a renewal, or create a new root for a new window.

## Next

- Understand: [The business model](../../understand/ecosystems/business-model.md).
- Specification: VPR v4, Participant sessions, `MOD-PP-QRY-4`, Exchange Rate module.

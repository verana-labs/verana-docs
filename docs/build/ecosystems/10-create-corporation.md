---
title: Create a corporation
description: "Members, weights, decision policy, DID, language and the first governance framework document; fund the policy address; grant the first operator."
sidebar_position: 10
persona: ecosystem-builder
surface: frontend
verified_on: pending (testnet v4)
---

# Create a corporation

Every resource on the registry belongs to a corporation. Creating one is the first thing any organisation does, whether it will control ecosystems or only hold accreditations.

## Prerequisites

- A browser wallet for Cosmos chains (Keplr or Leap) connected to the frontend on testnet, with a little balance from the faucet (Account page, **Get VNA**).
- A DID for the corporation. Its anchor agent's DID is the natural choice; any resolvable DID you control works.
- A first corporation governance framework document (how your organisation reaches decisions) at a stable URL. For a first corporation a one-page document is enough.

## Steps

1. Connect the wallet. With no corporation to act for, the frontend offers **Create new corporation**; it is also in the corporation selector and on the Corporation page.
2. **Identity**: the DID, the primary language, the governance framework document URL. The frontend computes the document's digest from the URL.
3. **Members and policy**: the member accounts and their voting weights, and the decision policy: a threshold of weight or a percentage, a voting period, a minimum execution delay. A single member with threshold one is fine to start; you can change it later by proposal.
4. **Review**: the cost preview, and the reminder that the creating account keeps no privilege: governance belongs to the group. Sign.
5. The frontend re-discovers your corporations and offers the guided next step: propose an operator authorization for your own account, so you can act without a vote for every transaction. Accept it; see [Operators, proposals and fee grants](./11-operators-proposals.md).

## Fund the policy address

The corporation pays nothing itself until it grants fees to operators or agents, but it is good practice to send the policy address some coins now. The Corporation page shows the address with a copy button.

## Verify

The Corporation page shows the id, DID, policy address, members and policy, and the first governance framework version active. The indexer lists it:

```bash
curl -s 'https://idx.testnet.verana.network/v4/corporation/list?did=<your did>' | jq
```

## Next

- [Operators, proposals and fee grants](./11-operators-proposals.md).
- Specification: VPR v4, `MOD-CO-MSG-1`; Frontend v4, `VFE-CORP-CREATE`.

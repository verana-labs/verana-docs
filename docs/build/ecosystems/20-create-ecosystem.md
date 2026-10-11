---
title: Create an ecosystem and publish its governance framework
description: "The ecosystem entry: DID, language, governance framework version one, activation, later versions, archiving."
sidebar_position: 20
persona: ecosystem-builder
surface: frontend
verified_on: pending (testnet v4)
---

# Create an ecosystem and publish its governance framework

## Prerequisites

- A corporation with an operator authorization covering the ecosystem and governance framework messages, or members ready to vote.
- The ecosystem's DID: the DID of its [anchor agent](./21-ecosystem-anchor.md), deployed and trusted.
- The ecosystem governance framework version one, published at a stable URL.

## Steps

1. **Ecosystems** page, **Create ecosystem**. Enter the DID, the primary language, and the governance framework document URL; the frontend computes its digest. Review the cost, sign (or propose).
2. The ecosystem appears in your list as controlled. Its page shows the governance framework with version one active, the empty schema list, and configuration actions.
3. **Later versions**: in the governance framework section, add documents to the next version, one per language, then activate. The active version is frozen; participants are bound by it.
4. **Rotate the DID** if the anchor moves: the ecosystem's DID can be updated by its controller.
5. **Archive** when the ecosystem retires: it stays readable, existing accreditations run to their end, nobody new can join. Unarchive is possible.

## Verify

```bash
curl -s 'https://idx.testnet.verana.network/v4/ecosystem/get/<id>?gf_data=true' | jq '{id, did, active_version, gf: .gf_data}'
```

The [trust graph](https://search.testnet.verana.network) lists the ecosystem once the indexer has resolved its DID.

## Next

- [Run the ecosystem anchor](./21-ecosystem-anchor.md), then [define credential schemas](./30-credential-schemas.md).
- Specification: VPR v4, `MOD-ES-MSG-1` to `MOD-ES-MSG-3`, Governance Framework module.

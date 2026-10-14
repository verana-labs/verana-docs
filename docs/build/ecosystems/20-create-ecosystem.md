---
title: Create an ecosystem and publish its governance framework
description: "The ecosystem entry: DID, language, governance framework version one, activation, later versions, archiving."
sidebar_position: 20
persona: ecosystem-builder
surface: frontend
verified_on: 2026-10-14 (testnet v0.10.6, frontend 0.18)
---

# Create an ecosystem and publish its governance framework

## Prerequisites

- A corporation with an operator authorization covering the ecosystem and governance framework messages, or members ready to vote.
- The ecosystem's DID: the DID of its [anchor agent](./21-ecosystem-anchor.md), deployed and trusted.
- The ecosystem governance framework version one, published at a stable URL. The Verana Council's [Template EGF](https://github.com/verana-labs/verana-council-gov/tree/main/template-egf) is a scaffold for writing it, and the [ECS ecosystem's framework](https://github.com/verana-labs/verana-council-gov/tree/main/ecs-egf) is a worked example; see the [builder's path](./00-path.md).

## Steps

1. **Ecosystems** page, **Create Ecosystem**. Enter the DID, the primary language, and the governance framework document URL; the frontend computes its digest. **Create Ecosystem**, review the cost in the confirmation dialog, sign (or propose).

<Screenshot name="ecosystems/create-form" alt="The Create Ecosystem form" />

2. The frontend opens the new ecosystem. Its page shows the basic information, the DID, the governance framework with version one active, the empty schema list, and the configuration actions.

<Screenshot name="ecosystems/detail" alt="A new ecosystem page" />

3. **Later versions**: in **EGF Documents**, **Add New EGF Document** for the next version, one per language, then **Increase Active EGF**. The active version is frozen; participants are bound by it.

<Screenshot name="ecosystems/egf-add-form" alt="The form to add an ecosystem governance framework document" />

4. **Edit Configuration** changes the DID if the anchor moves: the ecosystem's DID can be updated by its controller.

<Screenshot name="ecosystems/edit-config" alt="The Edit Configuration form of an ecosystem" />

5. **Archive** when the ecosystem retires: it stays readable, existing accreditations run to their end, nobody new can join. **Unarchive** is possible.

The **Ecosystems** page lists the ecosystems your corporation controls, with their schemas and figures.

<Screenshot name="ecosystems/list" alt="The Ecosystems page listing the corporation's ecosystem" />

## Verify

```bash
curl -s 'https://idx.testnet.verana.network/v4/ecosystem/get/<id>?gf_data=true' | jq '{id, did, active_version, gf: .gf_data}'
```

The [trust graph](https://search.testnet.verana.network) lists the ecosystem once the indexer has resolved its DID.

## Next

- [Run the ecosystem anchor](./21-ecosystem-anchor.md), then [define credential schemas](./30-credential-schemas.md).
- Specification: VPR v4, `MOD-ES-MSG-1` to `MOD-ES-MSG-3`, Governance Framework module; Frontend v4, `VFE-PAGE-ES`.

---
title: Corporation governance framework
description: "Versions and documents of the corporation's own governance framework, and how to activate a new version."
sidebar_position: 12
persona: ecosystem-builder
surface: frontend
verified_on: 2026-10-14 (testnet v0.10.6, frontend 0.18)
---

# Corporation governance framework

The corporation's governance framework states how the organisation decides and who represents it. Version one is created with the corporation. Later versions are prepared, then activated.

1. Corporation page, **Governance**: the versions, each with its documents per language, URL and digest, and the period each version was active.
2. **Add New CGF Document**: target the next version (the active one plus one), choose the language, paste the URL; the frontend computes the digest. Add one document per language.
3. **Increase Active CGF**: the next version becomes active once it has a document in the corporation's primary language; until then the button says which language is missing. Only future versions are editable; the active one is frozen.

<Screenshot name="corporation/tab-governance" alt="The Governance tab with version one active" />

<Screenshot name="corporation/cgf-add-form" alt="The form to add a governance framework document" />

The same two operations, on an ecosystem page, maintain an [ecosystem's governance framework](./20-create-ecosystem.md).

Specification: VPR v4, `MOD-GF-MSG-1`, `MOD-GF-MSG-2`.

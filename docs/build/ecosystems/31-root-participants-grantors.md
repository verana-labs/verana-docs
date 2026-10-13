---
title: Root participants and grantors
description: "Create the root of each schema's tree with its fees, accredit grantors, set effective windows."
sidebar_position: 31
persona: ecosystem-builder
surface: frontend
verified_on: pending (testnet v4)
---

# Root participants and grantors

A schema's participant tree starts with a root: the ecosystem's own accreditation, which carries the fees the ecosystem charges and validates the first level below it. Without a root nobody can join a schema that requires validation.

## Create the root

Schema page or participants view, **Create root participant**: the ecosystem DID, the effective window (a start in the near future, an optional end), and the three fees the ecosystem charges at the root: validation (what a grantor or direct applicant pays to be validated by the ecosystem), issuance and verification (what issuers and verifiers below pay per operation). Zero means free. Sign.

## Accredit grantors

When a schema uses grantor onboarding process, grantors apply like any participant: a corporation starts an onboarding process for the grantor role with the root as validator, and your operator validates it from **Pending tasks** ([validate applicants](./40-validate-applicants.md)). A grantor then validates issuers or verifiers in its branch and sets its own fees.

## Effective windows

Every accreditation has a window. The validator (or the owner) can move the end date, shortening or extending it. An ended accreditation keeps its history and stops counting.

## Verify

The schema's participants view shows the tree: root, grantor directories, issuer and verifier directories, holders. The indexer:

```bash
curl -s 'https://idx.testnet.verana.network/v4/participant/list?schema_id=<id>&role=ECOSYSTEM' | jq '.participants[] | {id, did, effective_from, effective_until, validation_fees, issuance_fees, verification_fees}'
```

## Next

- [Validate applicants](./40-validate-applicants.md).
- Specification: VPR v4, `MOD-PP-MSG-7`, `MOD-PP-MSG-8`.

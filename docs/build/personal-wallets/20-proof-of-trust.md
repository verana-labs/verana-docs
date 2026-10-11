---
title: Render the Proof-of-Trust
description: "The five blocks, the states, the wording, and the playground UI kit you can copy."
sidebar_position: 20
persona: wallet-vendor
surface: wallet UI
verified_on: n/a
---

# Render the Proof-of-Trust

Every integrated wallet shows trust the same way, so people learn to read it once. Wallets keep their own look; the order, the states, the wording patterns and the icon semantics are the contract.

## Five blocks, in this order

1. **Status band**: the verdict (green check for trusted, red cross for untrusted, grey question for could not verify with a retry), the service DID (truncated, copyable), the evaluation time or block, and a network chip on non-production networks.
2. **Service**: name, type, logo, description from the ECS Service credential. If absent, say so.
3. **Operated by**: legal name, country flag, registry identifier, address from the ECS Organization credential, or name and country from the ECS Persona credential. If absent, say so.
4. **Other credentials**: every additional credential the service or its operator presents, each with schema, issuer, ecosystem and its own validity mark.
5. **Trust chain and failures**: per credential, an expandable chain issuer to grantor to ecosystem with each link's status and links to the registry entries; when untrusted, the failed credentials and their reasons as first-class content.

## On offers and requests

The consent screen shows the status band plus the Q2 or Q3 verdict in words: "Accredited Issuer is an authorized issuer of DemoCredential in Playground Ecosystem", or the red equivalent. On failure the accept or share action is disabled or demoted behind an explicit unsafe step.

## Rules

- Only claims from verified credentials are rendered as facts.
- No invented signals: no stars, no scores beyond what resolution returned.
- First contact requires an explicit accept before any exchange.

## The kit

The playground renders this card for every demo service with a self-contained component you can copy: [ProofOfTrust.tsx](https://github.com/verana-labs/playground/blob/main/app/components/ProofOfTrust.tsx), with its resolver client. See it live at [playground.testnet.verana.network/integrate](https://playground.testnet.verana.network/integrate).

## Next

- [Test and get listed](./30-test-and-get-listed.md).
- Specification: the guideline's `PW-POT` section.

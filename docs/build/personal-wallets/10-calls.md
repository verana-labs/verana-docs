---
title: The calls your wallet makes
description: "Resolve a DID, check an issuer or verifier accreditation, cache by expiry, where TRQP fits."
sidebar_position: 10
persona: wallet-vendor
surface: indexer
verified_on: pending (testnet v4)
---

# The calls your wallet makes

Everything a wallet needs is one indexer, public or self-hosted.

## Q1: resolve the service

```bash
curl -s -X POST https://idx.testnet.verana.network/v4/verifiable-trust/resolve -H 'content-type: application/json' \
  -d '{"did":"did:webvh:…","ecsCredentials":true,"presentations":{"includeInvalid":true},"participations":{"states":["ACTIVE"]}}'
```

Read `trusted`, `evaluatedAtTime`, `expiresAtTime`; the Service and Organization or Persona claims from `ecsCredentials[]`; the other credentials from `presentations[]` with their invalid and unresolvable ids; the accreditations from `participations[]`.

## Q2 and Q3: the accreditation for the schema

The credential's schema is known from the offer or request (the schema credential id for OpenID4VC type metadata or JSON-LD, the credential definition for AnonCreds, which names the schema credential). Check that the service holds an active accreditation of the right role for that schema:

```bash
curl -s 'https://idx.testnet.verana.network/v4/participant/list?did=<service did>&role=ISSUER&schema_id=<id>&participant_state=ACTIVE'
```

Or read `participations[]` from the resolve response, which answers Q2 and Q3 for every schema at once.

## Caching

Cache a verdict until its `expiresAtTime`, then resolve again. Show the evaluation time with a cached verdict. If a previously trusted service resolves untrusted on a later interaction, re-surface the Proof-of-Trust and require fresh acknowledgment.

## Self-hosting

A wallet vendor that wants to depend on nobody runs its own indexer against a node; the computation is deterministic. See [Run the indexer](../run-infrastructure/20-indexer.md).

## TRQP

The indexer also answers the ToIP Trust Registry Query Protocol. Wallets that already integrate trust registries through TRQP can use it for Q2 and Q3; the resolve endpoint remains richer for Q1.

## Next

- Reference: [Indexer API](../../reference/indexer-api/index.md).

---
title: Test and get listed
description: "The six DemoCredential scenarios, the conformance profiles, and the pull request that lists your wallet on the playground."
sidebar_position: 30
persona: wallet-vendor
surface: playground
verified_on: n/a
---

# Test and get listed

## The acceptance loop

The playground runs a demo cast on testnet: an accredited issuer, an unaccredited issuer, an accredited verifier, an unaccredited verifier, and an untrusted service, all under one demo ecosystem with one DemoCredential. Six scenarios, with each credential format your wallet claims (AnonCreds over DIDComm, SD-JWT over OpenID4VC):

1. Accredited issuer: trusted, Q2 passes, you receive the DemoCredential.
2. Unaccredited issuer: trusted, Q2 fails, accept is blocked.
3. Untrusted service as issuer: untrusted, no connection.
4. Accredited verifier: trusted, Q3 passes, you present the credential.
5. Unaccredited verifier: trusted, Q3 fails, sharing is blocked.
6. Untrusted service as verifier: untrusted.

Record one uncut run; it is the evidence and the source of your page's captures.

## Conformance profiles

Listed wallets have a machine-readable profile in the playground repository: rails, builds, promises, quirks. The conformance harness reads it and checks, on every change of the playground, what still works against the deployed cast. Your pull request adds the profile with the listing.

## The pull request

To [verana-labs/playground](https://github.com/verana-labs/playground): your entry in `personal-wallets.yaml` (id, name, vendor, formats tested, download link or store link when Verana support is built in, repository, OSI licence), your icon under `wallets/<id>/`, optional captures per scenario and one video with a note on editing, and your conformance profile. Requirements: open source, obtainable from the tile.

Listed wallets may use the "Runs on the Verana open trust layer" badge.

## Next

- The normative guideline: [personal-wallet-integration.md](https://github.com/verana-labs/verana-spec/blob/main/playground/guidelines/personal-wallet-integration.md); the conformance guideline in verana-spec.

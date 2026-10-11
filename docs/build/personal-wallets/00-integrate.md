---
title: Integrate Verana in a personal wallet
description: "What changes in a wallet: three questions, two tracks, resolvable DIDs only. A summary of the normative guideline."
sidebar_position: 0
persona: wallet-vendor
surface: wallet code
verified_on: n/a
---

# Integrate Verana in a personal wallet

A Verana-integrated wallet asks the network three questions at the right moments and shows the person the answer before they act. The normative text is the [personal wallet integration guideline](https://github.com/verana-labs/verana-spec/blob/main/playground/guidelines/personal-wallet-integration.md) in verana-spec; this page is its summary and the entry to the calls.

## The three questions

| | Question | When | Must |
|---|---|---|---|
| Q1 | Is this service a trusted Verifiable Service, and who operates it? | on every new connection, and on every offer or request | resolve before the connection is used; show the Proof-of-Trust |
| Q2 | Is it accredited to issue this credential? | on every credential offer | block or demote accept on failure |
| Q3 | Is it accredited to request this credential? | on every presentation request | never share by default on failure |

Four states: resolving, trusted, untrusted, could not verify. The last is neither trusted nor untrusted and offers a retry.

## Two tracks

**Native**: the wallet speaks DIDComm; it resolves the service DID from the invitation before connecting, receives AnonCreds or W3C credentials, presents with selective disclosure.

**Bridge**: the wallet is built on OpenID4VCI and OpenID4VP and keeps its flows; it resolves the issuer DID when an offer arrives and the verifier DID when a request arrives, and renders the Proof-of-Trust inside its consent screen above the fold.

Only resolvable DID methods qualify: `did:web` and `did:webvh`. A key-only identifier (`did:key`, `did:jwk`) has no DID Document, so no linked presentations, so no trust: render it untrusted and say why.

## Configuration

The wallet keeps a list of networks (resolver, indexer and RPC endpoints, a production flag) and a list of trusted ECS ecosystem DIDs. Non-production networks are labelled on every verdict.

## Next

- [The calls your wallet makes](./10-calls.md).
- [Render the Proof-of-Trust](./20-proof-of-trust.md).
- [Test and get listed](./30-test-and-get-listed.md).

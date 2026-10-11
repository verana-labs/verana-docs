---
title: The three connection flows
description: "Service to service, wallet to service, wallet to wallet: what each side verifies before the first message."
sidebar_position: 7
---

# The three connection flows

Every connection on Verana starts with a verification, and the verification differs by who is on each side.

## Service to service

```mermaid
sequenceDiagram
  participant A as Service A
  participant R as Indexer
  participant B as Service B
  A->>R: resolve B's DID
  R-->>A: trusted
  A->>B: DIDComm connection request
  B->>R: resolve A's DID
  R-->>B: trusted
  B-->>A: connection accepted
  Note over A,B: offers and requests, each checked against accreditations
```

Both sides resolve the other's DID and connect only on a trusted verdict. The one exception is a validator receiving an applicant that is not yet verifiable, because the purpose of the connection is to make it so: the validator then requires that a pending accreditation on an ECS schema, recorded on the registry, names it as validator. Once connected, a service that wants to issue or verify must be accredited for the schema, and the other side checks.

## Wallet to service

```mermaid
sequenceDiagram
  participant P as Person
  participant W as Wallet
  participant R as Indexer
  participant S as Service
  W->>R: resolve the service DID
  R-->>W: trusted, claims, accreditations
  W->>P: Proof-of-Trust
  P-->>W: accept
  W->>S: connect
  S->>W: request the user agent credential (specified, not yet enforced)
  W-->>S: present it, unlinkably
  Note over W,S: offers checked for Q2, requests for Q3
```

The wallet resolves the service, shows the Proof-of-Trust, and connects only after the person accepts. The service, in turn, asks the wallet to present its ECS User Agent credential before serving anything, and may additionally ask for a Badge to identify the person and whom they represent. Offers and requests that follow are checked against the service's accreditations.

## Wallet to wallet

```mermaid
sequenceDiagram
  participant W1 as Wallet 1
  participant W2 as Wallet 2
  W1->>W2: connect
  W2->>W1: request the user agent credential
  W1-->>W2: present it
  W1->>W2: request the user agent credential
  W2-->>W1: present it
  Note over W1,W2: channel opens once both verified (specified, not yet enforced)
```

Two user agents each request the other's user agent credential, and the channel opens only when both have verified. No service is involved; what each side learns is which software it talks to, not who the person is.

:::warning Not yet enforced
The user agent credential exchanges in the wallet-to-service and wallet-to-wallet flows are specified but not enforced today; see [Verifiable Services](./verifiable-services.md#what-a-verifiable-service-does).
:::

## Over OpenID4VC

```mermaid
sequenceDiagram
  participant P as Person
  participant W as OpenID4VC wallet
  participant R as Indexer
  participant S as Issuer or verifier
  S->>W: credential offer, or presentation request
  W->>R: resolve the issuer or verifier DID
  R-->>W: trusted, accreditation for the schema
  W->>P: Proof-of-Trust in the consent screen
  P-->>W: accept, or share
  W->>S: OpenID4VCI or OpenID4VP flow, unchanged
```

Wallets on the bridge track have no DIDComm connection to resolve before. They resolve the issuer's DID when a credential offer arrives and the verifier's DID when a presentation request arrives, and show the Proof-of-Trust inside their consent screen before the person can accept.

## Where next

- [Verifiable AI agents](./verifiable-ai-agents.md): the same flows between agents.
- Build: [Verify a peer before you connect](../../build/verifiable-services/index.md).
- Specification: Verifiable Trust v4, `VS-CONN-VS`, `VS-CONN-VUA`, `VUA-CONN-VS`, `VUA-CONN-VUA`.

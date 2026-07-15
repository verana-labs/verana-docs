# Introduction

A **Verifiable User Agent (VUA)** is an application — a wallet, an AI agent, a browser
extension — that acts *on behalf of a user* and can prove it is trustworthy to the
Verifiable Services and other agents it talks to. This section is for **VUA builders**:
teams who want their agent to participate in the Verana trust layer.

A VUA builder's job spans two specifications:

- The **[Verifiable Trust (VT) specification](https://verana-labs.github.io/verifiable-trust-spec/)**
  defines what a VUA *is* off-chain: how it holds and presents credentials, the
  User Agent Essential Credential Schema (ECS), Proof-of-Trust, and the
  trust-resolution protocol an agent runs to decide whether a peer is trustworthy.
- The **Verifiable Public Registry (VPR)** — the Verana chain documented here —
  provides the *on-chain* primitives a VUA relies on: the registry of **Ecosystems**,
  **Participants** and **credential schemas**, the trust-resolution lookup
  (`find-participants-with-did` / `trigger-resolver`), **participant sessions** for
  pay-per-issuance / pay-per-verification, and the trust-deposit economics that reward
  user agents.

:::info VT spec vs VPR spec
Many of the concepts a VUA implements — the User Agent ECS, Proof-of-Trust, and the
trust-resolution / TRQP protocol itself — are **governed by the Verifiable Trust
specification, not by the VPR spec**. This section describes only the on-chain VPR
mechanics with real `veranad` commands, and links out to the VT spec for everything that
lives off-chain.
:::

## How a VUA relates to the VPR

On the VPR, a VUA is not a special entity type — it becomes a **Participant** (an
`ISSUER`, `VERIFIER`, or `HOLDER` entry) under one or more **Ecosystems**, controlled by a
**Corporation**. Concretely, a VUA builder:

1. **Resolves trust** — given a DID or credential presented by a peer, looks up the
   matching Participant + Ecosystem on-chain to decide whether to trust it.
2. **Gets the agent certified** — onboards the agent as a Participant (issuer / verifier /
   holder) under the relevant Ecosystem.
3. **Obtains User Agent credentials** — issues the User Agent Credential (defined by the
   User Agent ECS) to its running instances.
4. **Opens participant sessions** — records credential-exchange operations so
   pay-per-issuance / pay-per-verification fees are charged and distributed.
5. **Earns rewards** — receives a share of those fees, funded through the trust-deposit
   yield parameters.

## In this section

- **[Trust resolution](./trust-resolution)** — the on-chain lookup primitives
  (`find-participants-with-did`, `trigger-resolver`) a VUA uses to resolve a DID or
  credential to a Participant and Ecosystem.
- **[User Agent certification](./agent-certification)** — onboarding your agent as a
  Participant of a User Agent Ecosystem.
- **[User Agent credentials](./user-agent-credentials)** — issuing the User Agent
  Credential to your VUA instances via the ECS / credential-schema mechanism.
- **[Participant sessions](./permission-sessions)** — recording credential exchanges for
  pay-per-issuance / pay-per-verification.
- **[Ecosystem rewards](./ecosystem-rewards)** — how user-agent rewards are funded by the
  trust-deposit yield parameters.

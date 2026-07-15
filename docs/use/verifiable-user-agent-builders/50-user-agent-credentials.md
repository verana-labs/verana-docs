# User Agent Credentials

Once your agent is [certified](./agent-certification) as a Participant, it is a
**Verifiable User Agent (VUA)** and can issue **User Agent Credentials** to its running
instances. Each instance stores its credential and presents it to Verifiable Services or to
other agents so peers can run [trust resolution](./trust-resolution) against it.

:::info The User Agent ECS is governed by the Verifiable Trust spec
The **User Agent Essential Credential Schema (ECS)** — the exact claims, the credential
format, and the presentation rules for a User Agent Credential — is defined by the
**[Verifiable Trust specification](https://verana-labs.github.io/verifiable-trust-spec/)**,
not by the VPR spec. The VPR's role is to *register* that ECS as a **credential schema**
under an Ecosystem and to enforce the authorization and fee rules around issuing against it.
:::

## How it works on the VPR

The User Agent ECS is published on the VPR as a normal **credential schema** in the `cs`
module, owned by a User Agent Ecosystem. Issuing a User Agent Credential is therefore the
standard issuance flow, with your agent acting as the `ISSUER` Participant:

1. **The User Agent ECS is registered as a credential schema.** The Ecosystem that governs
   the User Agent ECS creates it once:

   ```bash
   veranad tx cs create-credential-schema [ecosystem-id] [json-schema] \
     [issuer-mode] [verifier-mode] [holder-onboarding-mode] \
     [pricing-asset-type] [pricing-asset] [digest-algorithm] --corporation [corporation]
   ```

   See [Create a credential schema](../ecosystems/credential-schemas/create-a-credential-schema).
   You can inspect the resulting schema and its onboarding modes with
   [get-schema](../ecosystems/credential-schemas/get-a-credential-schema) and render the
   raw JSON Schema with
   [render-json-schema](../ecosystems/credential-schemas/render-json-schema).

2. **Your agent is an authorized ISSUER Participant** for that schema — the outcome of
   [certification](./agent-certification).

3. **Issue the credential to each instance.** The credential is issued off-chain by your
   agent (per the VT spec); the VPR enforces the schema's issuer authorization and charges
   the schema's **issuance fee**. When the peer is itself a VUA, the exchange is recorded in
   a [participant session](./permission-sessions) so pay-per-issuance fees and
   [rewards](./ecosystem-rewards) are distributed.

## What an instance does with its credential

Per the [VT spec](https://verana-labs.github.io/verifiable-trust-spec/), each VUA instance:

- **stores** its User Agent Credential, and
- **presents** it to Verifiable Services or to other VUA instances (which need not be
  instances of the same VUA).

The receiving party then resolves the presented credential back to your `ISSUER`
Participant and Ecosystem using [find-participants-with-did](./trust-resolution).

## Related

- [User Agent certification](./agent-certification)
- [Credential schemas](../ecosystems/credential-schemas/list-credential-schemas)
- [Participant sessions](./permission-sessions)

# Introduction

:::info Specs v4
This section documents the **Specs v4** implementation of the Verana Verifiable Public Registry. See the [full specification](https://verana-labs.github.io/verifiable-trust-vpr-spec/) for reference.
:::

Ecosystems are the entities that define credential schemas, governance frameworks, and participation rules in Verana. Every Ecosystem is owned and governed by a **Corporation** — the on-chain, group-backed entity that controls the Ecosystem's resources and authorizes operators to act on its behalf.

➡️ **Learn the basics first** in the [Learn section](../../learn/verifiable-public-registry/onboarding-participants).

## Key Concepts in Specs v4

In Specs v4, most module operations follow a **delegable** pattern:
- A **Corporation** (group-backed account) controls resources. Its `policy_address` is threaded as the `corporation` argument to nearly every module command.
- An **operator** executes transactions on behalf of the Corporation.
- Operators must be authorized via the [Delegation module](../corporation/delegation/intro).

## Create Your Own Ecosystem

1. **Create a Corporation**
   - [Create a Corporation](../corporation/create-a-corporation) — the group-backed entity that will own your Ecosystem.

2. **Grant operator authorization**
   - [Grant operator authorization](../corporation/delegation/grant-operator-authorization) so your operator account can execute transactions on behalf of the Corporation.

3. **Publish an Ecosystem Governance Framework (EGF)**
   - For fast setup you can use our EGF template.
   - EGF must outline Ecosystem mission, Credential Schema(s), rules for joining the Ecosystem, fee model, compliance, and slashing rules.
   - Make the document publicly reachable (e.g., IPFS / GitHub) and register its digest on-chain.

4. **Create your Ecosystem in Verana**
    - [Create the Ecosystem](../ecosystems/ecosystem/create-an-ecosystem)
    - [Create the credential schema(s)](../ecosystems/credential-schemas/create-a-credential-schema) you defined in your EGF, and the [root participant(s)](../ecosystems/participants/create-a-root-participant)
    - Notify potential interested participants
    - Start onboarding!

## Join an Existing Ecosystem: Issuer, Verifier, Grantor

[Search existing ecosystems](../ecosystems/ecosystem/list-ecosystems) and look at their [credential schemas](../ecosystems/credential-schemas/list-credential-schemas).

If you want to work with credentials governed by an existing Ecosystem:

1. **Review & accept** its EGF.
2. **Choose** the Credential Schema relevant to your business case.
3. **Request the right participant role**:
   - *Issuer Grantor* or *Verifier Grantor* → operate an Ecosystem branch.
   - *Issuer* → issue credentials.
   - *Verifier* → request presentations.
4. Depending on schema rules, either:
   - [Self-create your participant](../ecosystems/participants/self-create-a-participant) (`OPEN` mode), or
   - [Run an onboarding process](../ecosystems/participants/run-an-onboarding-process-to-obtain-a-participant) with a Grantor or the Ecosystem Corporation (`GRANTOR_VALIDATION_PROCESS` / `ECOSYSTEM_VALIDATION_PROCESS`).

## Join as a Holder

1. **Accept** the Ecosystem's EGF.
2. **Pick** the Credential Schema you need.
3. **Select an authorized Issuer** (or self-issue if you already have Issuer rights).
4. Receive your Verifiable Credential and store it in your wallet.

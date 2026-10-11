---
rework: legacy
---

# User Agent Certification

Before your agent can issue or present User Agent Credentials, it must be **certified** —
that is, onboarded as a **Participant** of the Ecosystem that governs the User Agent
Essential Credential Schema (ECS). Certification is the on-chain step that turns an
application into a **Verifiable User Agent (VUA)**.

:::info Governed by the Verifiable Trust spec
*What* a User Agent must implement to be certifiable — the User Agent ECS, the behavioural
requirements, Proof-of-Trust — is defined by the
**[Verifiable Trust specification](https://verana-labs.github.io/verifiable-trust-spec/)**.
This page covers only the **on-chain onboarding** on the VPR: becoming a Participant.
:::

## The certification flow

Certification uses the standard **Participant onboarding** mechanics of the `pp` module.
The path depends on the User Agent schema's onboarding mode (`OPEN`,
`ISSUER_VALIDATION_PROCESS`, `GRANTOR_VALIDATION_PROCESS`, or
`ECOSYSTEM_VALIDATION_PROCESS`), which the Ecosystem sets on the credential schema.

1. **Have a Corporation.** Every Participant is controlled by a Corporation
   (`policy_address`). This is the on-chain identity your agent onboards under.

2. **Onboard as a Participant of the User Agent schema.** Choose the role you need —
   typically `ISSUER` (to issue User Agent Credentials to your instances), and/or
   `VERIFIER` / `HOLDER` depending on how your agent participates.

   - **Open schemas** — self-onboard directly:

     ```bash
     veranad tx pp self-create-participant [role] [validator-participant-id] [did] \
       --corporation [corporation]
     ```

     See [Self-create a participant](../../../reference/cli/how-tos/ecosystems/50-participants/25-self-create-a-participant.md).

   - **Onboarding-process schemas** — request onboarding through a validator, who validates
     it:

     ```bash
     veranad tx pp start-participant-op [role] [validator-participant-id] [did]
     ```

     Then the validator runs
     [set-participant-op-validated](../../../reference/cli/how-tos/ecosystems/50-participants/28-set-participant-to-validated.md).
     See [Run an onboarding process](../../../reference/cli/how-tos/ecosystems/50-participants/27-run-an-onboarding-process-to-obtain-a-participant.md).

3. **Confirm the Participant is validated.** Once onboarding completes, the entry's
   `op_state` becomes `VALIDATED` and it is effective between its `effective_from` and
   `effective_until` timestamps:

   ```bash
   veranad query pp get-participant [id]
   ```

Your agent is now certified — a Participant that trust resolvers will find via
[find-participants-with-did](./20-trust-resolution.md) and that can issue
[User Agent Credentials](./50-user-agent-credentials.md).

## Related

- [Participants — overview and how-tos](../../../reference/cli/how-tos/ecosystems/50-participants/10-intro.md)
- [Create a root participant](../../../reference/cli/how-tos/ecosystems/50-participants/20-create-a-root-participant.md) (for the
  Ecosystem that governs the User Agent schema)
- [Credential schemas](../../../reference/cli/how-tos/ecosystems/40-credential-schemas/10-list-credential-schemas.md)

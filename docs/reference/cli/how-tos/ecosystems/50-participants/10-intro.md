---
rework: legacy
---

# Participants

A **Participant** is an on-chain entry in the Participant (`pp`) module that authorizes a Verifiable Service to act under a Credential Schema — as an **Issuer**, **Verifier**, **Issuer-Grantor**, **Verifier-Grantor**, **Ecosystem** (root), or **Holder**. The `pp` module is the v4 replacement for the retired Permission (`perm`) module: every "permission" is now a "participant", and the old **Validation Process (VP)** is now the **onboarding process (OP)**.

Participants are owned and controlled by a [Corporation](../../corporation/10-create-a-corporation.md). All `pp` transactions are **delegable**: they are signed by an authorized `operator` (`--from`) and executed on behalf of a Corporation whose `policy_address` is passed with the `--corporation` flag.

## Before you start

- Read the [learn section](../../../../../understand/ecosystems/participant-tree-and-accreditation.md) for background on onboarding participants.
- Create and register a [Corporation](../../corporation/10-create-a-corporation.md).
- Grant your operator authorization for the relevant `pp` message type-URLs — see [Grant Operator Authorization](../../corporation/20-delegation/20-grant-operator-authorization.md).

## Pages in this section

| Page | Command |
|------|---------|
| [List Participants](./15-list-participants.md) | `q pp list-participants` |
| [Find Participants with DID](./17-find-participants-with-did.md) | `q pp find-participants-with-did` |
| [Create a Root Participant](./20-create-a-root-participant.md) | `tx pp create-root-participant` |
| [Self-Create a Participant](./25-self-create-a-participant.md) | `tx pp self-create-participant` |
| [Run an Onboarding Process](./27-run-an-onboarding-process-to-obtain-a-participant.md) | `tx pp start-participant-op` |
| [Set Participant to Validated](./28-set-participant-to-validated.md) | `tx pp set-participant-op-validated` |
| [Adjust a Participant](./30-adjust-participant.md) | `tx pp set-participant-effective-until` |
| [Renew a Participant](./50-renewal.md) | `tx pp renew-participant-op` |
| [Cancel a Pending OP Request](./70-cancel-op-pending-action.md) | `tx pp cancel-participant-op-request` |
| [Revoke a Participant](./45-participant-revocation.md) | `tx pp revoke-participant` |
| [Slash a Participant Deposit](./60-slash-a-participant.md) | `tx pp slash-participant-td` |
| [Repay a Slashed Participant Deposit](./65-repay-a-slashed-participant-deposit.md) | `tx pp repay-participant-slashed-td` |
| [Trigger a Resolver](./75-trigger-resolver.md) | `tx pp trigger-resolver` |

> For the full `pp` CLI reference (every message and query with real output), see the [Participant Module reference](../../../modules/40-participant.md).

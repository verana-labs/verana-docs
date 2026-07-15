# Participants

A **Participant** is an on-chain entry in the Participant (`pp`) module that authorizes a Verifiable Service to act under a Credential Schema — as an **Issuer**, **Verifier**, **Issuer-Grantor**, **Verifier-Grantor**, **Ecosystem** (root), or **Holder**. The `pp` module is the v4 replacement for the retired Permission (`perm`) module: every "permission" is now a "participant", and the old **Validation Process (VP)** is now the **onboarding process (OP)**.

Participants are owned and controlled by a [Corporation](../../corporation/create-a-corporation). All `pp` transactions are **delegable**: they are signed by an authorized `operator` (`--from`) and executed on behalf of a Corporation whose `policy_address` is passed with the `--corporation` flag.

## Before you start

- Read the [learn section](../../../learn/verifiable-public-registry/onboarding-participants) for background on onboarding participants.
- Create and register a [Corporation](../../corporation/create-a-corporation).
- Grant your operator authorization for the relevant `pp` message type-URLs — see [Grant Operator Authorization](../../corporation/delegation/grant-operator-authorization).

## Pages in this section

| Page | Command |
|------|---------|
| [List Participants](./list-participants) | `q pp list-participants` |
| [Find Participants with DID](./find-participants-with-did) | `q pp find-participants-with-did` |
| [Create a Root Participant](./create-a-root-participant) | `tx pp create-root-participant` |
| [Self-Create a Participant](./self-create-a-participant) | `tx pp self-create-participant` |
| [Run an Onboarding Process](./run-an-onboarding-process-to-obtain-a-participant) | `tx pp start-participant-op` |
| [Set Participant to Validated](./set-participant-to-validated) | `tx pp set-participant-op-validated` |
| [Adjust a Participant](./adjust-participant) | `tx pp set-participant-effective-until` |
| [Renew a Participant](./renewal) | `tx pp renew-participant-op` |
| [Cancel a Pending OP Request](./cancel-op-pending-action) | `tx pp cancel-participant-op-request` |
| [Revoke a Participant](./participant-revocation) | `tx pp revoke-participant` |
| [Slash a Participant Deposit](./slash-a-participant) | `tx pp slash-participant-td` |
| [Repay a Slashed Participant Deposit](./repay-a-slashed-participant-deposit) | `tx pp repay-participant-slashed-td` |
| [Trigger a Resolver](./trigger-resolver) | `tx pp trigger-resolver` |

> For the full `pp` CLI reference (every message and query with real output), see the [Participant Module reference](../../../run/network/modules/participant).

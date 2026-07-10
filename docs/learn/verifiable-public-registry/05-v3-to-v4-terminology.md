# v3 → v4 Terminology

Verifiable Public Registry **v4** restructured and renamed several modules. If you are coming from the v3 documentation (still available under the `v3` version), this table maps the old names to the new ones.

## Modules

| v3 | v4 | Notes |
|---|---|---|
| Trust Registry (`tr`) | **Ecosystem** (`ec`) + **Corporation** (`co`) + **Governance Framework** (`gf`) | A Trust Registry was split into three modules: the Ecosystem (the registry entity), the Corporation that owns and governs it, and the Governance Framework documents. |
| Permission (`perm`) | **Participant** (`pp`) | Renamed and substantially expanded (roles, onboarding process, sessions, slashing). |
| DID Directory (`dd`) | **Digest** (`di`) | The DID-lifecycle feature (add/renew/remove/touch DID with deposits and expiry) was **removed**. `di` is a minimal content-digest store. DID indexing is now derived from the Participant registry. |
| — | **Exchange Rate** (`xr`) | New module. Provides the pricing oracle that converts Trust Units (TU) and fiat to on-chain `uvna` for fees. |
| Credential Schema (`cs`) | Credential Schema (`cs`) | Retained; added Schema Authorization Policies and per-role validity periods. |
| Trust Deposit (`td`) | Trust Deposit (`td`) | Retained; now keyed by `corporation_id` and gained yield. |
| Delegation (`de`) | Delegation (`de`) | Retained; operator authorizations and VS operator authorizations. |

## Concepts and commands

| v3 | v4 |
|---|---|
| `veranad tx tr …` / `q tr …` | `veranad tx ec …` / `tx gf …` / `q ec …` / `q gf …` |
| `veranad tx perm …` / `q perm …` | `veranad tx pp …` / `q pp …` |
| `veranad tx dd …` / `q dd …` | `veranad tx di store-digest` / `q di get-digest` |
| authority (owner) / `--authority` | corporation (`policy_address`) / `--corporation` |
| trust-registry-id / `tr-id` | ecosystem-id |
| Validation Process (VP) / `-vp` | onboarding process (OP) / `-op` |
| permission session | participant session |
| `MsgCreateTrustRegistry`, `MsgCreateRootPermission`, … | `MsgCreateEcosystem`, `MsgCreateRootParticipant`, … |
| Trust deposit keyed by account | Trust deposit keyed by `corporation_id` |

## The Corporation model

The largest conceptual change: on-chain resources are no longer owned by a plain "authority" account. They are owned by a **Corporation** — a Cosmos SDK `x/group` policy whose `policy_address` is passed to nearly every command, with transactions executed by authorized **operators**. See [Corporations](./corporations) and, for the hands-on flow, [Create a Corporation](../../use/ecosystems/corporation).

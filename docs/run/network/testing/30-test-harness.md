# Verana Test Harness

## Overview

The Verana test harness is an end-to-end testing framework that exercises every Verana module through realistic, multi-step user journeys. Each journey drives a complete workflow — from account and Corporation setup through operator-authorized module operations — against a running Verana node.

The harness is **part of the `verana-node` repository** (there is no separate repo to clone). It lives under [`testharness/`](https://github.com/verana-labs/verana-node/tree/main/testharness) and validates the v4 authority/operator model, in which delegable transactions execute on behalf of a Corporation via AUTHZ-CHECK delegation.

## Prerequisites

- **Go 1.26.4+**
- A running Verana node (local or remote) — see [Run an Isolated Local Node](../run-a-node/local-node-isolated)
- The `veranad` binary on your `PATH`
- Test accounts created in the `test` keyring (see below)

## Setup

The harness ships inside the node repository, so no separate installation is required.

```bash
git clone https://github.com/verana-labs/verana-node.git
cd verana-node/testharness

# Ensure dependencies are available
go mod tidy
```

### Create test accounts

The journeys expect a fixed set of keyring accounts (faucet `cooluser`, controller, issuer, verifier, credential holder, etc.). Bootstrap them with the provided script:

```bash
./scripts/setup_accounts.sh
```

This recovers each account into the `test` keyring from its known seed phrase and lists the results. The faucet account `cooluser` (`verana16mzeyu9l6kua2cdg9x0jk5g6e7h0kk8q6uadu4`) funds the other accounts during the journeys, so make sure it holds `uvna` — on an isolated local node it is funded at genesis by `setup_primary_validator.sh`.

## Configuration

The harness is configured through environment variables (read by `testharness/lib/client.go`):

| Variable | Default | Description |
|----------|---------|-------------|
| `ADDRESS_PREFIX` | `verana` | Bech32 address prefix |
| `HOME_DIR` | `~/.verana` | Node home / keyring directory |
| `NODE_RPC` | `tcp://localhost:26657` | CometBFT RPC endpoint of the target node |
| `GAS` | `auto` | Gas setting (`auto` estimates with a 1.5x adjustment) |
| `FEES` | `750000uvna` | Transaction fees |

### Local node

```bash
export ADDRESS_PREFIX="verana"
export HOME_DIR="$HOME/.verana"
export NODE_RPC="http://localhost:26657"
export GAS="auto"
export FEES="750000uvna"
```

For devnet or testnet, point `NODE_RPC` at the corresponding public endpoint (for example `http://node1.testnet.verana.network:26657`).

## Running Journeys

Run a single journey by its numeric ID:

```bash
# From the testharness/ directory
go run cmd/main.go <journey_id>

# Examples
go run cmd/main.go 1     # Create Corporation (Corp A) + bootstrap operator authz
go run cmd/main.go 20    # Create Ecosystem (ec-alpha) + EC queries
go run cmd/main.go 304   # Participant: create root participant with operator authorization
```

Run the full suite (journeys are executed in dependency order):

```bash
./scripts/run_all.sh
```

Journey results are written to `testharness/journey_results/` as JSON. Later journeys load results from earlier ones (for example the Corporation `policy_address`, the operator address, and the ecosystem id), so within a module group journeys must be run in order.

## Available Journeys

The journeys are grouped by module and follow the spec-v4 module names: Corporation (`co`), Ecosystem (`ec`), Governance Framework (`gf`), Credential Schema (`cs`), Participant (`pp`), Delegation (`de`), Trust Deposit (`td`), Digest (`di`), and Exchange Rate (`xr`). The authoritative list is the switch statement in [`testharness/cmd/main.go`](https://github.com/verana-labs/verana-node/blob/main/testharness/cmd/main.go).

### Corporation (CO)

| ID | Journey |
|----|---------|
| 1 | CreateCorporation (Corp A) + bootstrap operator authz |
| 2 | UpdateCorporation + CO queries |
| 3 | Corp CGF: AddGovernanceFrameworkDocument + IncreaseGFV + GF queries |

### Ecosystem (EC) & Governance Framework (GF)

| ID | Journey |
|----|---------|
| 20 | CreateEcosystem (ec-alpha) + EC queries |
| 21 | EC AddGovernanceFrameworkDocument for ec-alpha |
| 22 | EC IncreaseActiveGovernanceFrameworkVersion for ec-alpha |
| 23 | UpdateEcosystem for ec-alpha |
| 24 | ArchiveEcosystem for ec-alpha (archive + unarchive) |
| 25 | EC + GF query coverage |

### Ecosystem operator authorization

| ID | Journey |
|----|---------|
| 101 | EC Operator Authorization Setup (group + fund) |
| 102 | EC Operations with Operator Authorization (fail-then-pass) |
| 110 | AUTHZ-CHECK-5 negative: delegable Msg from an unregistered corporation |

### Credential Schema (CS)

| ID | Journey |
|----|---------|
| 201 | CS Operator Authorization Setup (group + fund) |
| 202 | CS Operations with Operator Authorization (fail-then-pass) |

### Participant (PP)

| ID | Journey |
|----|---------|
| 301 | Participant Operator Authorization Setup (group + fund) |
| 302 | Participant Operations with Operator Authorization (fail-then-pass) |
| 303 | Cancel participant onboarding-process last request |
| 304 | Create root participant |
| 305 | Adjust participant (set effective-until) |
| 306 | Revoke participant |
| 307 | CreateOrUpdateParticipantSession with VS operator authorization |
| 308 | Slash participant trust deposit |
| 309 | Repay slashed trust deposit |
| 310 | Self-create participant |
| 311 | Trigger resolver (MOD-PP-MSG-15) via ancestor-validator authorization |
| 312 | Operator spend-limit enforcement (AUTHZ-CHECK-1) |
| 313 | Delegation fee grant → `x/feegrant` allowance create/revoke (AUTHZ-CHECK-2) |
| 314 | Record spend/fee enforcement in participant session (AUTHZ-CHECK-3 / CHECK-4) |

### Trust Deposit (TD)

| ID | Journey |
|----|---------|
| 401 | ReclaimYield + RepaySlashed with operator authorization |

### Digest (DI)

| ID | Journey |
|----|---------|
| 501 | Store Digest with operator authorization |

### Exchange Rate (XR)

| ID | Journey |
|----|---------|
| 601 | Create exchange rate via governance |
| 602 | Update exchange rate with operator authorization |
| 603 | Get-price query |
| 604 | Grant exchange-rate authorization via governance |
| 605 | Revoke exchange-rate authorization via governance |

## Journey Pattern

Most operator-authorization journeys follow the same fail-then-pass shape:

1. **Fail without auth** — the operator attempts the operation without delegation (expected to fail).
2. **Grant auth** — the Corporation's group members propose and vote to grant the operator authorization for the specific `Msg` type-URLs.
3. **Succeed with auth** — the operator retries the operation and it succeeds.
4. **Verify** — on-chain state is queried and checked.
5. **Unauthorized operator** — a different operator attempts the operation (expected to fail).

## Troubleshooting

**"Account does not exist on chain"** — run `./scripts/setup_accounts.sh` and ensure the accounts are funded from `cooluser`.

**"Connection refused"** — verify the node is running and `NODE_RPC` points at its RPC endpoint.

**"Insufficient fees"** — raise `FEES` or top up the signing account.

# Reputation Computation

In Verana, **reputation is not a stored score** — there is no on-chain "reputation" field or rating transaction. Instead, reputation is **computed off-chain from publicly observable trust deposit and activity data**. Because every Corporation's trust deposit, slashing history, and credential activity is transparent, any party can derive a trust score or star rating and use it for trust-based decisions.

This page describes the on-chain signals the model is built from and how to read them. For the conceptual framing, see [Trust Deposit and Reputation](../../learn/verifiable-public-registry/trust-deposit-and-reputation) in the Learn section.

## The Underlying Model

Reputation is anchored in the trust deposit economics:

- A trust deposit is keyed by **`corporation_id`** and **grows automatically** as the Corporation performs trust operations (onboarding processes, credential issuance and verification, participant registration). Each trust fee adds `trust_deposit_rate` (default 5%) to the executing Corporation's deposit.
- A trust deposit is **non-withdrawable** and earns **yield**: `trust_deposit_share_value` starts at 1 and increases every block as block-reward yield is distributed (capped by `trust_deposit_max_yield_rate`). A larger, longer-held deposit therefore signals sustained, rule-abiding participation.
- **Slashing** subtracts from the deposit and is permanently recorded (`slashed_deposit`, `slash_count`, `last_slashed`), acting as a negative signal until repaid.

Because these quantities can only be grown through genuine activity and can only be reduced through penalties, the trust deposit is a **hard-to-fake, skin-in-the-game** proxy for trustworthiness.

## On-Chain Reputation Signals

All signals below are read directly from chain state — no special query is needed beyond the standard module queries.

| Signal | Source | Interpretation |
|--------|--------|----------------|
| **Deposit size** | `td get-trust-deposit [corporation-id]` → `deposit` | Total value staked; higher = more skin in the game. |
| **Share appreciation** | `share × trust_deposit_share_value` vs `deposit` | Accrued yield; reflects how long value has been locked and contributing. |
| **Slash history** | `slashed_deposit`, `slash_count`, `last_slashed` | Any non-zero value is a negative signal; `repaid_deposit` shows whether it was cured. |
| **Ecosystem-specific history** | Participant entries via `pp list-participants` / `pp get-participant [id]` | Per-ecosystem standing; each ecosystem's slice of a Corporation's deposit is visible separately. |
| **Credential activity** | Participant sessions and pay-per-issuance/verification counts (`pp` module) | Volume of credentials issued/verified per ecosystem. |
| **Behavioral accountability** | Slash events (`slash_participant_trust_deposit`, `burn_ecosystem_slashed_trust_deposit`) | Malicious activity remains permanently associated with the Corporation. |

## Reading the Core Values

Fetch a Corporation's trust deposit:

```bash
veranad q td get-trust-deposit $CORP_ID --node $NODE_RPC --output json
```

```json
{
  "trust_deposit": {
    "share": "45999999850000003749999907",
    "deposit": "46000000",
    "corporation_id": "6"
  }
}
```

Fetch the live share value:

```bash
veranad q td params --node $NODE_RPC -o json | jq -r .params.trust_deposit_share_value
```

### Deriving Accrued Yield

The accrued (claimable) yield — a proxy for how much a deposit has appreciated through participation — is:

```
yield = share × trust_deposit_share_value − deposit
```

where `share` and `trust_deposit_share_value` are the high-precision decimals returned above (both are 18-decimal `LegacyDec` values). A positive, growing `yield` over time indicates an active, well-behaved Corporation.

:::info Interpreting `share`
`share` is stored at high precision because it tracks a fraction of the whole trust deposit pool at the current `trust_deposit_share_value`. It is **not** a raw `uvna` amount — always multiply by `trust_deposit_share_value` before comparing to `deposit`.
:::

## Composing a Reputation Score

A reputation score or star rating is an **off-chain computation** — the protocol deliberately leaves the weighting to each consumer. A typical composition:

1. **Positive base** from deposit size and accrued yield (staked value and time-in-system).
2. **Activity bonus** from credential issuance/verification volume per ecosystem.
3. **Penalty** from slash history — weighting `slash_count`, the unrepaid fraction (`slashed_deposit − repaid_deposit`), and recency (`last_slashed`).
4. **Scope** — compute per-ecosystem where relevant, since each ecosystem can only slash the deposit slice tied to its own activity.

Because the inputs are all public and verifiable, independent parties computing the same weights arrive at the same score, making the reputation portable and auditable across the network.

## See also

- [Trust Deposit Operations](./trust-deposit-operations)
- [Network Governance Slashing](./slashing)
- [Trust Deposit and Reputation (Learn)](../../learn/verifiable-public-registry/trust-deposit-and-reputation)

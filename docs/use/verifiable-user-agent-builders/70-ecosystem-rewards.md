# Ecosystem Rewards

When a credential is issued or verified through a [participant session](./permission-sessions),
the pay-per fee is split among beneficiaries — and a share is paid to the **Verifiable User
Agent** and its **wallet user agent** that took part in the exchange. These user-agent
rewards are configured as **trust-deposit parameters** and funded through the trust-deposit
**yield** mechanism, so a VUA builder earns an ongoing return for participating in the
network.

## The reward parameters

Two `td` (Trust Deposit) module parameters control the user-agent share of pay-per fees:

- **`user_agent_reward_rate`** — the fraction of the fee paid to the User Agent participant.
- **`wallet_user_agent_reward_rate`** — the fraction paid to the wallet User Agent
  participant.

These are the same participants recorded as `agent_participant_id` and
`wallet_agent_participant_id` on a session record (see
[Participant sessions](./permission-sessions)).

Read the live values with:

```bash
veranad query td params
```

```json
{
  "params": {
    "trust_deposit_reclaim_burn_rate": "0",
    "trust_deposit_share_value": "1000000025000000000",
    "trust_deposit_rate": "200000000000000000",
    "wallet_user_agent_reward_rate": "100000000000000000",
    "user_agent_reward_rate": "100000000000000000",
    "trust_deposit_max_yield_rate": "200000000000000000",
    "yield_intermediate_pool": "verana1wjnrmvjlgxvs098cnu3jaczzjjm4csmqep067h",
    "trust_deposit_block_reward_share": "200000000000000000"
  }
}
```

Rates are `LegacyDec` values scaled by 10^18, so `"100000000000000000"` = `0.1` (10%) and
`"200000000000000000"` = `0.2` (20%). In the snapshot above, both the user-agent and
wallet-user-agent reward rates are **10%**.

:::info Parameters are governance-controlled
`td` parameters are changed only through a governance `UpdateParams` proposal — see
[Update trust-deposit params](../trust-deposit-and-reputation/update-params). The values you
see on your network may differ from the example above.
:::

## How rewards are funded: trust-deposit yield

User-agent rewards, like other Participant returns, accrue into the Corporation's **trust
deposit** and grow through the trust-deposit **yield** mechanism rather than being paid out
per transaction:

- **`trust_deposit_rate`** — the fraction of each fee that is added to trust deposits.
- **`trust_deposit_block_reward_share`** — the fraction of block rewards routed to the
  **`yield_intermediate_pool`** to fund yield.
- **`trust_deposit_max_yield_rate`** — caps the annualized yield rate.
- **`trust_deposit_share_value`** — the per-share value that grows over time; a Corporation's
  deposit is accounted in shares, so a rising share value is how the yield is realized.

For the full yield model and how the intermediate pool is funded, see
[Yield funding](../trust-deposit-and-reputation/yield-funding). To inspect a Corporation's
own deposit balance (trust deposit is keyed by numeric `corporation_id`):

```bash
veranad query td get-trust-deposit [corporation-id]
```

See [Trust deposit operations](../trust-deposit-and-reputation/trust-deposit-operations)
for reclaiming accrued yield.

## Related

- [Participant sessions](./permission-sessions) — where the agent/wallet-agent participants
  are recorded
- [How PPI and PPV work](../ecosystems/pay-per-issuance-or-verification/how-ppi-and-ppv-work)
- [Yield funding](../trust-deposit-and-reputation/yield-funding)

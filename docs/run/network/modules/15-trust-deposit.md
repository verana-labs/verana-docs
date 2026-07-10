# Trust Deposit Module

The Trust Deposit (`td`) module manages the stakes Corporations lock when engaging in the Verana ecosystem. Trust deposits grow through the "Proof-of-Trust" mechanism as Corporations perform trust operations (onboarding processes, credential issuance, verification, participant registration) and earn **yield** from block rewards.

:::info Keyed by `corporation_id`
In VPR v4 a `TrustDeposit` is held **per Corporation**, identified by the numeric `corporation_id` — not by account address. Every `td` command targets a Corporation, either by its numeric id (queries) or by its `policy_address` (delegable transactions).
:::

Refer to the [Environments section](../environments/10-environments.md) for RPC endpoints, and set up [environment variables](../run-a-node/30-remote-cli.md) for your target network.

```bash
CORPORATION="verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu"   # Corporation policy_address
CORP_ID=6                          # Numeric corporation_id
OPERATOR_ACC="my-operator-key"     # Operator key (signer for delegable txs)
CHAIN_ID="vna-testnet-1"
NODE_RPC="https://rpc.testnet.verana.network"
```

## Transaction Messages

| Spec ID | Command | Type-URL | Description | Kind |
|---------|---------|----------|-------------|------|
| MOD-TD-MSG-1 | *(internal)* | — | Adjust trust deposit (keeper-only; called by `pp` during fee/escrow flows) | Internal |
| MOD-TD-MSG-2 | `reclaim-yield` | `/verana.td.v1.MsgReclaimTrustDepositYield` | Reclaim earned yield for a Corporation | **Delegable** |
| MOD-TD-MSG-4 | *(no CLI)* | `/verana.td.v1.MsgUpdateParams` | Update module parameters | **Governance-only** |
| MOD-TD-MSG-5 | `slash-trust-deposit` | `/verana.td.v1.MsgSlashTrustDeposit` | Slash a Corporation's trust deposit | **Governance-only** |
| MOD-TD-MSG-6 | `repay-slashed-td` | `/verana.td.v1.MsgRepaySlashedTrustDeposit` | Repay an outstanding slashed trust deposit | **Delegable** |
| MOD-TD-MSG-7 | *(internal)* | — | Burn ecosystem-slashed trust deposit (keeper-only) | Internal |

:::note Removed command
There is **no `reclaim-deposit`** command in the node. Earlier drafts exposed a way to withdraw freed (`refunded`) principal subject to a burn rate; the CLI now exposes only `reclaim-yield`, `repay-slashed-td`, and `slash-trust-deposit`. The `trust_deposit_reclaim_burn_rate` parameter still exists for internal deposit recycling.
:::

The two **delegable** messages execute on behalf of a Corporation. The signer (`--from`) must be an **operator** granted authorization for the message's type-URL via `de grant-operator-authorization`. See the [Delegation module](./20-delegation.md).

---

### `reclaim-yield` — Reclaim Trust Deposit Yield

Delegable. Drains the full claimable yield (`share × trust_deposit_share_value − deposit`) for the Corporation. No amount argument.

**Signature:**
```bash
veranad tx td reclaim-yield [corporation] \
  --from <operator> --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --gas auto --node $NODE_RPC
```

**Example:**
```bash
veranad tx td reclaim-yield $CORPORATION \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --gas auto --node $NODE_RPC
```

Response (`MsgReclaimTrustDepositYieldResponse`): `{ "claimed_amount": "<uvna>" }`.

---

### `repay-slashed-td` — Repay Slashed Trust Deposit

Delegable. The `deposit` amount must **exactly equal** the outstanding slashed amount (`slashed_deposit − repaid_deposit`); partial repayments are rejected.

**Signature:**
```bash
veranad tx td repay-slashed-td [corporation] [deposit] \
  --from <operator> --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --gas auto --node $NODE_RPC
```

**Example:**
```bash
veranad tx td repay-slashed-td $CORPORATION 1000000 \
  --from $OPERATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --gas auto --node $NODE_RPC
```

---

### `slash-trust-deposit` — Slash Trust Deposit (Governance-only)

The message signer is the x/gov module account (`authority`), so a normal key cannot sign it — it must be submitted as a governance proposal. The direct CLI form exists but is only usable by governance:

**Signature (flags map onto the `MsgSlashTrustDeposit` fields):**
```bash
veranad tx td slash-trust-deposit \
  --corporation-id <id> --deposit <uvna> --reason <text> \
  --from <gov-authority> --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

In practice, wrap it in `gov submit-proposal`:
```json
{
  "@type": "/verana.td.v1.MsgSlashTrustDeposit",
  "authority": "<gov-module-address>",
  "corporation_id": "6",
  "deposit": "1000000",
  "reason": "Verified fraudulent activity"
}
```

See the [Use guide: Network Governance Slashing](../../../use/trust-deposit-and-reputation/slashing) for the full proposal, voting, and verification flow. (Field 2, the old account-string `corporation`, is reserved — slashing is corporation-id-keyed in v4.)

---

### `update-params` — Update Module Parameters (Governance-only)

Not exposed as a direct CLI command. Submit `/verana.td.v1.MsgUpdateParams` via `gov submit-proposal`. All parameter fields must be supplied. The live `trust_deposit_share_value` is preserved across updates (audit finding **TD-CRIT-1**, fixed). See the [Use guide: Update Trust Deposit Params](../../../use/trust-deposit-and-reputation/update-params).

---

## Queries

| Spec ID | Command | Description |
|---------|---------|-------------|
| MOD-TD-QRY-1 | `get-trust-deposit [corporation-id]` | Get the trust deposit for a Corporation |
| MOD-TD-QRY-2 | `params` | Get module parameters |

### `get-trust-deposit` — Get Trust Deposit

Takes the **numeric** `corporation_id` (not an account address).

```bash
veranad q td get-trust-deposit $CORP_ID --node $NODE_RPC --output json
```

**Example output:**
```json
{
  "trust_deposit": {
    "share": "45999999850000003749999907",
    "deposit": "46000000",
    "corporation_id": "6"
  }
}
```

Zero-valued fields (`slashed_deposit`, `repaid_deposit`, `refunded`, `slash_count`, `last_slashed`, `last_repaid`) are omitted from JSON until set.

### `params` — Get Module Parameters

```bash
veranad q td params --node $NODE_RPC --output json
```

**Example output** (live testnet values):
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

All rate values are 18-decimal fixed-point integers (`200000000000000000` = 0.20). See the [Use guide: Trust Deposit Operations](../../../use/trust-deposit-and-reputation/trust-deposit-operations) for per-parameter descriptions.

---

## Related

- **Ecosystem-level slashing** — a Corporation's ecosystem-scoped deposit is slashed/repaid through the [Participant module](./participant) with `pp slash-participant-td [id] [amount] [reason]` and `pp repay-participant-slashed-td [id] --corporation [corporation]`.
- **Yield funding** — the Yield Intermediate Pool is replenished via a protocol-pool continuous fund; see [Use guide: Yield Funding Setup](../../../use/trust-deposit-and-reputation/yield-funding).

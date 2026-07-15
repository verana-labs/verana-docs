import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Trust Deposit Operations

A **Trust Deposit** is trust value locked as a stake for participating in the Verana ecosystem. Trust deposits grow automatically as a Corporation performs trust operations — running onboarding processes, creating ecosystems and participants, issuing and verifying credentials.

:::info Trust Deposit is keyed by `corporation_id`
In VPR v4 a `TrustDeposit` is held **per Corporation**, identified by the numeric `corporation_id` — **not** per account address and **not** per Participant entry. Every query and transaction on this page targets a Corporation. See [Trust Deposit and Reputation](../../learn/verifiable-public-registry/trust-deposit-and-reputation) in the Learn section for the conceptual model.
:::

## Environment Setup

```bash
CORPORATION="verana1n64en27u7qckklkk4twkkun5h6v5dsur7g6l4pfmfhydvfru9upq5w4nlu"   # Corporation policy_address
CORP_ID=6                                                                          # Numeric corporation_id
OPERATOR_ACC="my-operator-key"    # Operator key name in keyring (signer)
CHAIN_ID="vna-testnet-1"
NODE_RPC="https://rpc.testnet.verana.network"
```

*These variables target the correct environment (testnet, mainnet, or local). Adjust values accordingly.*

> **Prerequisite:** Ensure the `veranad` binary is installed and up to date.
> See [Install or Update Veranad Binary](/docs/next/run/network/run-a-node/prerequisites).

---

## Trust Deposit Structure

A Corporation's trust deposit record (`TrustDeposit`) has the following fields:

| Field | Description |
|-------|-------------|
| `corporation_id` | Numeric id of the Corporation that owns this deposit (primary key). |
| `share` | The Corporation's share of the trust deposit pool, in `trust_deposit_share_value` units (high-precision decimal). |
| `deposit` | Current deposited amount, in `uvna`. |
| `refunded` | Amount freed and eligible to be recycled/reused before drawing additional funds. |
| `slashed_deposit` | Amount that has been slashed. |
| `repaid_deposit` | Amount repaid after slashing. |
| `last_slashed` | Timestamp of the most recent slash. |
| `last_repaid` | Timestamp of the most recent repayment. |
| `slash_count` | Number of times the deposit has been slashed. |

**Key concepts:**
- **Yield calculation** — `yield = share × trust_deposit_share_value − deposit` (spec `MOD-TD-MSG-2`).
- **Share value** — `trust_deposit_share_value` starts at 1 and increases over time as block-reward yield is produced, so a deposit appreciates automatically.
- **Non-withdrawable** — there is no CLI command to withdraw principal from a trust deposit. Value locked as a trust deposit stays locked; only earned **yield** can be reclaimed (see below).

---

## View a Trust Deposit

Query the trust deposit for a given Corporation (spec `MOD-TD-QRY-1`).

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q td get-trust-deposit [corporation-id] --node <rpc-endpoint> --output json
```

### Parameters

| Name             | Description                          | Mandatory |
|------------------|--------------------------------------|-----------|
| `corporation-id` | Numeric `corporation_id` to query    | yes       |

### Example

```bash
veranad q td get-trust-deposit $CORP_ID --node $NODE_RPC --output json
```

**Example Output:**
```json
{
  "trust_deposit": {
    "share": "45999999850000003749999907",
    "deposit": "46000000",
    "corporation_id": "6"
  }
}
```

Zero-valued fields (`slashed_deposit`, `repaid_deposit`, `refunded`, `slash_count`) are omitted from JSON output. They appear once the deposit has been slashed or partially freed.

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

### Check the Current Share Value

To estimate available yield, read the live `trust_deposit_share_value` from the module parameters:

```bash
veranad q td params --node $NODE_RPC --output json
```

---

## Reclaim Trust Deposit Yield

Reclaim the earned interest (yield) accrued on a Corporation's trust deposit (spec `MOD-TD-MSG-2`). Yield is generated as block-reward funds are distributed to trust deposit holders, increasing `trust_deposit_share_value` over time. The **entire** claimable yield is drained — there is no amount argument.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) — see [Create a Corporation](../corporation/create-a-corporation).
2. The Corporation's trust deposit must have claimable yield (`share × trust_deposit_share_value − deposit > 0`).
3. An **operator** granted authorization for `/verana.td.v1.MsgReclaimTrustDepositYield` via [Grant Operator Authorization](../corporation/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the Corporation as the `[corporation]` positional argument.
:::

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx td reclaim-yield [corporation] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node <rpc-endpoint>
```

### Message Parameters

| Name          | Description                                                 | Mandatory |
|---------------|-------------------------------------------------------------|-----------|
| `corporation` | Corporation `policy_address` that owns the trust deposit     | yes       |
| `--from`      | Operator account signing the transaction                    | yes       |

### Example

```bash
veranad tx td reclaim-yield $CORPORATION \
  --from $OPERATOR_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

**Response shape** (proto `MsgReclaimTrustDepositYieldResponse`):

```json
{
  "claimed_amount": "1250000"
}
```

**What happens** (spec `MOD-TD-MSG-2`):
1. Computes claimable yield: `yield = share × trust_deposit_share_value − deposit`.
2. Reduces the Corporation's `share` accordingly.
3. Transfers the yield amount to the Corporation.
4. If the truncated claimable yield is `0`, the operation is rejected ("no claimable yield").

#### Verify the Claim

```bash
veranad q td get-trust-deposit $CORP_ID --node $NODE_RPC --output json
```

---

## Repay a Slashed Trust Deposit

If a Corporation's trust deposit has been slashed (see [Network Governance Slashing](./slashing)), the outstanding slashed amount must be repaid before the Corporation can fully participate again. Repayment is done on behalf of the Corporation (spec `MOD-TD-MSG-6`).

:::warning[Exact Amount Required]
The `deposit` argument **must exactly equal** the outstanding slashed amount (`slashed_deposit − repaid_deposit`). Partial repayments are rejected.
:::

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) with an outstanding slashed trust deposit — see [Create a Corporation](../corporation/create-a-corporation).
2. An **operator** granted authorization for `/verana.td.v1.MsgRepaySlashedTrustDeposit` via [Grant Operator Authorization](../corporation/delegation/grant-operator-authorization).
3. Sufficient balance to cover the repayment amount plus fees.

Sign with `--from <operator>` and pass the Corporation as the `[corporation]` positional argument.
:::

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx td repay-slashed-td [corporation] [deposit] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node <rpc-endpoint>
```

### Message Parameters

| Name          | Description                                                             | Mandatory |
|---------------|-------------------------------------------------------------------------|-----------|
| `corporation` | Corporation `policy_address` that owns the slashed trust deposit         | yes       |
| `deposit`     | Repayment amount in `uvna` (must equal the outstanding slashed amount)   | yes       |
| `--from`      | Operator account signing the transaction                                | yes       |

### Example

```bash
# First, read the outstanding slashed amount (slashed_deposit − repaid_deposit)
veranad q td get-trust-deposit $CORP_ID --node $NODE_RPC --output json

# Repay the exact outstanding amount
veranad tx td repay-slashed-td $CORPORATION 1000000 \
  --from $OPERATOR_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

**What happens** (spec `MOD-TD-MSG-6`):
1. Verifies the operator authorization (AUTHZ-CHECK).
2. Validates that `deposit` exactly matches the outstanding slashed amount.
3. Increases `deposit` and `repaid_deposit` by the repayment amount.
4. Increases `share` proportionally at the current `trust_deposit_share_value`.
5. Updates `last_repaid`.

Once `repaid_deposit` equals `slashed_deposit`, the Corporation is restored to good standing.

:::info No `reclaim-deposit` command
Earlier drafts exposed a `reclaim-deposit` command to withdraw freed (`refunded`) balance, subject to a burn rate. **That command does not exist in the node.** The `trust_deposit_reclaim_burn_rate` parameter still exists (see [Query Module Parameters](#query-module-parameters)) and governs how freed deposit is recycled internally, but there is no user-facing CLI to withdraw principal.
:::

---

## Query Module Parameters

View the current trust deposit module parameters (spec `MOD-TD-QRY-2`).

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q td params --node <rpc-endpoint> --output json
```

### Example

```bash
veranad q td params --node $NODE_RPC --output json
```

**Example Output** (live testnet values):
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

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

### Parameter Descriptions

All rate values are encoded as 18-decimal fixed-point integers (`200000000000000000` = 0.20 = 20%).

| Parameter | Description |
|-----------|-------------|
| `trust_deposit_reclaim_burn_rate` | Fraction burned when freed deposit is recycled. |
| `trust_deposit_share_value` | Live value of one share, in `uvna`. Starts at 1 and increases per block as yield accrues. |
| `trust_deposit_rate` | Fraction of trust fees added to the executing Corporation's trust deposit. |
| `wallet_user_agent_reward_rate` | Reward rate for wallet user agents. |
| `user_agent_reward_rate` | Reward rate for user agents. |
| `trust_deposit_max_yield_rate` | Maximum annualized yield a trust deposit can earn from block rewards. |
| `yield_intermediate_pool` | Bech32 address of the Yield Intermediate Pool module account. |
| `trust_deposit_block_reward_share` | Target fraction of block rewards directed to trust deposit yield. |

:::info Share value is preserved across param updates
`trust_deposit_share_value` is a **live, per-block value**, not a static setting. Governance parameter updates no longer reset it (audit finding **TD-CRIT-1**, fixed). See [Update Trust Deposit Params](./update-params).
:::

---

## See also

- [Network Governance Slashing](./slashing)
- [Update Trust Deposit Params](./update-params)
- [Yield Funding Setup](./yield-funding)
- [Reputation Computation](./reputation-computation)

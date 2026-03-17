import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Trust Deposit Operations

Trust deposits are used to lock trust value as a stake for participating in the Verana ecosystem. When you create trust registries, credential schemas, or permissions, a trust deposit is required and held in the trust deposit module.

Make sure you've read [the Learn section](../../learn/verifiable-public-registry/trust-deposit-and-reputation) to understand how trust deposits work in the ecosystem.

### Environment Setup

#### Set Environment Variables

```bash
AUTHORITY_ACC="verana1groupaccountaddress..."   # Group account (authority)
OPERATOR_ACC="my-operator-key"                  # Operator key name in keyring
CHAIN_ID="vna-testnet-1"
NODE_RPC=https://rpc.testnet.verana.network
```

*These variables are required to target the correct environment (testnet, mainnet, or local). Adjust values accordingly.*

> **Prerequisite:** Ensure the `veranad` binary is installed and up-to-date.
> See [Install or Update Veranad Binary](/docs/next/run/network/run-a-node/prerequisites).

---

## Trust Deposit Structure

Understanding your trust deposit structure is essential for managing operations effectively:

| Field | Description |
|-------|-------------|
| `account` | Your account address |
| `amount` | Current deposited amount in uvna |
| `share` | Number of shares you own in the trust deposit pool |
| `claimable` | Freed deposit amount available for reclaim |
| `slashed_deposit` | Amount that has been slashed |
| `repaid_deposit` | Amount repaid after slashing |
| `last_slashed` | Timestamp of most recent slash |
| `last_repaid` | Timestamp of most recent repayment |
| `slash_count` | Number of times account has been slashed |
| `last_repaid_by` | Account that made the last repayment |

**Key Concepts:**
- **Yield Calculation**: `yield = share × share_value - deposit`
- **Share Value**: Increases over time as fees are distributed to trust deposit holders
- **Burn Rate**: When reclaiming freed deposits, a percentage is burned to discourage early withdrawal

---

## View your Trust Deposit

Use this query to view your current trust deposit information, including deposited amounts, shares, claimable balances, and yield calculations.

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad q td get-trust-deposit [account] --node <rpc-endpoint> --output json
```

### Parameters

| Name        | Description                   | Mandatory |
|-------------|-------------------------------|-----------|
| `account`   | Account address to query      | yes       |

### Examples

View your own trust deposit:
```bash
veranad q td get-trust-deposit $AUTHORITY_ACC --node $NODE_RPC --output json
```

**Example Output:**
```json
{
  "trust_deposit": {
    "account": "verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0",
    "amount": 10000000,
    "share": 8695652,
    "claimable": 2000000,
    "slashed_deposit": 0,
    "repaid_deposit": 0,
    "last_slashed": null,
    "last_repaid": null,
    "slash_count": 0,
    "last_repaid_by": ""
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

### Calculate Your Available Yield

To understand your potential yield, check the current share value:

```bash
veranad q td params --node $NODE_RPC --output json
```

---

## Reclaim Trust Deposit Yield

Reclaim earned interest (yield) from your trust deposits. Yield is generated when transaction fees are distributed to trust deposit holders, increasing the share value over time.

This is a **delegable** message — it requires an `authority` (group account) and can be executed by an authorized `operator`.

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx td reclaim-yield [authority] \
  --from <operator-account> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Message Parameters

| Name         | Description                                                          | Mandatory |
|--------------|----------------------------------------------------------------------|-----------|
| `authority`  | The group account (authority) that owns the trust deposit            | yes       |
| `--from`     | Operator account authorized to execute this message                  | yes       |

### Example

```bash
veranad tx td reclaim-yield $AUTHORITY_ACC \
  --from $OPERATOR_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

**Prerequisites:**
- You must have a trust deposit with available yield
- Your deposit must not be slashed (or must be fully repaid)
- The operator must have a valid `OperatorAuthorization` for `/verana.td.v1.MsgReclaimTrustDepositYield`
- Sufficient balance for transaction fees

**What Happens:**
1. System verifies operator authorization (AUTHZ-CHECK)
2. Calculates your available yield: `yield = share × share_value - deposit`
3. Reduces your share count accordingly
4. Transfers yield amount to the authority account
5. Updates your trust deposit record

#### Verify Yield Claim

Check your updated trust deposit after claiming:
```bash
veranad q td get-trust-deposit $AUTHORITY_ACC --node $NODE_RPC --output json
```

---

## Reclaim Freed Trust Deposit

Reclaim a specified amount from your claimable trust deposit balance. This is used when you have freed deposits (from terminated permissions, etc.) that you want to withdraw.

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx td reclaim-deposit [amount] \
  --from <user> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

### Message Parameters

| Name      | Description                                              | Mandatory |
|-----------|----------------------------------------------------------|-----------|
| `amount`  | Amount to reclaim in uvna (must be ≤ claimable balance)  | yes       |

### Examples

Reclaim 1,000,000 uvna from claimable balance:
```bash
RECLAIM_AMOUNT=1000000
veranad tx td reclaim-deposit $RECLAIM_AMOUNT \
  --from $OPERATOR_ACC --chain-id $CHAIN_ID --keyring-backend test --fees 600000uvna --gas auto --node $NODE_RPC
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

:::warning[Burn Rate Applied]
**Discouraged Operation**: To discourage frequent withdrawals, a portion of your reclaimed amount will be burned according to the `trust_deposit_reclaim_burn_rate` (default 60%). Only the remaining amount will be transferred to your account.

**Example**: If you reclaim 1,000,000 uvna with a 60% burn rate:
- Burned: 600,000 uvna
- Transferred to you: 400,000 uvna
:::

**Prerequisites:**
- You must have claimable balance > 0
- Claimed amount must be ≤ claimable balance
- Sufficient balance for transaction fees

**What Happens:**
1. Reduces your claimable balance by the claimed amount
2. Reduces your deposited amount by the claimed amount
3. Reduces your share count proportionally
4. Burns the burn rate percentage of claimed amount
5. Transfers the remaining amount to your account

#### How to Find Your Transaction Hash

```bash
TX_HASH=<Tx_Hash>
veranad q tx $TX_HASH \
  --node $NODE_RPC --output json \
| jq '.events[] | select(.type == "trust_deposit_reclaimed") | .attributes | map({(.key): .value}) | add'
```

Replace with the correct transaction hash.

---

## Query Module Parameters

View the current trust deposit module parameters, including share values and burn rates.

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

**Example Output:**
```json
{
  "params": {
    "trust_deposit_reclaim_burn_rate": "600000000000000000",
    "trust_deposit_share_value": "1000000000000000000",
    "trust_deposit_rate": "200000000000000000",
    "wallet_user_agent_reward_rate": "200000000000000000",
    "user_agent_reward_rate": "200000000000000000",
    "trust_deposit_max_yield_rate": "150000000000000000",
    "yield_intermediate_pool": "verana1..."
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

| Parameter | Description | Default Value |
|-----------|-------------|---------------|
| `trust_deposit_reclaim_burn_rate` | Percentage burned when reclaiming freed deposits | 0.60 (60%) |
| `trust_deposit_share_value` | Current value of one share (increases over time) | 1.0 (initial) |
| `trust_deposit_rate` | Rate for calculating deposits from fees | 0.20 (20%) |
| `wallet_user_agent_reward_rate` | Reward rate for wallet user agents | 0.20 (20%) |
| `user_agent_reward_rate` | Reward rate for user agents | 0.20 (20%) |
| `trust_deposit_max_yield_rate` | Maximum annual yield percentage | 0.15 (15%) |
| `yield_intermediate_pool` | Address of the yield intermediate pool account | (module account) |

---

## See also

- [Network Governance Slashing](./slashing)
- [Update Trust Deposit Params](./update-params)
- [Yield Funding Setup](./yield-funding)

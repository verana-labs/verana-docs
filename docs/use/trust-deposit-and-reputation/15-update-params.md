import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update Trust Deposit Params (Governance)

This guide shows how to update Trust Deposit module parameters through a governance proposal wrapping `/verana.td.v1.MsgUpdateParams` (spec `MOD-TD-MSG-4`).

:::info Governance-only
`td update-params` is **not** exposed as a direct CLI command. The message signer is the x/gov module account, so parameter changes must be submitted as a `gov submit-proposal`.
:::

## Environment Setup

```bash
USER_ACC="my-user-account"
CHAIN_ID="vna-testnet-1"
NODE_RPC="https://rpc.testnet.verana.network"
```

## Step 1: Get the Governance Authority Address

```bash
GOV_AUTH=$(veranad q auth module-accounts --node $NODE_RPC --output json \
| jq -r '.accounts[] | select(.value.name=="gov") | .value.address')
```

## Step 2: Fetch Current Params

`MsgUpdateParams` replaces the whole `params` object, so **all** fields must be supplied. Start from the current values:

```bash
veranad q td params --node $NODE_RPC --output json
```

Capture the fields you want to preserve verbatim (Bech32 pool address, and the live share value — see the warning below):

```bash
YIELD_INTERMEDIATE_POOL=$(veranad q td params --node $NODE_RPC -o json | jq -r .params.yield_intermediate_pool)
SHARE_VALUE=$(veranad q td params --node $NODE_RPC -o json | jq -r .params.trust_deposit_share_value)
```

## Step 3: Build the Proposal JSON

Edit only the values you intend to change; keep every field present.

```bash
cat > trust_deposit_params_proposal.json <<JSON
{
  "messages": [
    {
      "@type": "/verana.td.v1.MsgUpdateParams",
      "authority": "${GOV_AUTH}",
      "params": {
        "trust_deposit_reclaim_burn_rate": "0",
        "trust_deposit_share_value": "${SHARE_VALUE}",
        "trust_deposit_rate": "50000000000000000",
        "wallet_user_agent_reward_rate": "100000000000000000",
        "user_agent_reward_rate": "100000000000000000",
        "trust_deposit_max_yield_rate": "200000000000000000",
        "yield_intermediate_pool": "${YIELD_INTERMEDIATE_POOL}",
        "trust_deposit_block_reward_share": "200000000000000000"
      }
    }
  ],
  "metadata": "ipfs://CID",
  "deposit": "10000000uvna",
  "title": "Update Trust Deposit Params",
  "summary": "Updates trust deposit parameters.",
  "expedited": false
}
JSON
```

### Parameter Descriptions

| Parameter | Description |
|-----------|-------------|
| `trust_deposit_reclaim_burn_rate` | Fraction burned when freed deposit is recycled. |
| `trust_deposit_share_value` | Live value of one share (see warning below). |
| `trust_deposit_rate` | Fraction of trust fees added to the executing Corporation's trust deposit. |
| `wallet_user_agent_reward_rate` | Reward rate for wallet user agents. |
| `user_agent_reward_rate` | Reward rate for user agents. |
| `trust_deposit_max_yield_rate` | Maximum annualized yield a trust deposit can earn from block rewards. |
| `yield_intermediate_pool` | Bech32 address of the Yield Intermediate Pool module account. |
| `trust_deposit_block_reward_share` | Target fraction of block rewards directed to trust deposit yield. |

:::warning Rate encoding
All rate values are encoded as 18-decimal fixed-point integers. `200000000000000000` = 0.20 (20%); `100000000000000000` = 0.10 (10%); `0` = 0%.
:::

:::info `trust_deposit_share_value` is preserved (TD-CRIT-1, fixed)
`trust_deposit_share_value` is a **live, per-block value** mutated by the module's BeginBlocker as yield accrues — it behaves as protocol state, not a static setting. In an earlier build (audit finding **TD-CRIT-1**), any `MsgUpdateParams` wholesale-replaced the params and reset this live share price to whatever was drafted in the proposal, retroactively corrupting every holder's yield.

This is **fixed**: parameter updates no longer reset `trust_deposit_share_value`. Even though the field must be present in the proposal JSON, the live per-block value is preserved. As a safe practice, pass the **current** value through unchanged (as `$SHARE_VALUE` above) rather than hardcoding an old constant.
:::

## Step 4: Submit the Proposal

```bash
veranad tx gov submit-proposal trust_deposit_params_proposal.json \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID \
  --fees 750000uvna --gas auto --node $NODE_RPC
```

## Step 5: Track and Vote

```bash
veranad q gov proposals --node $NODE_RPC
```

```bash
PROPOSAL_ID=1
veranad tx gov vote $PROPOSAL_ID yes \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID \
  --fees 650000uvna --gas auto --node $NODE_RPC
```

## Step 6: Verify the Update

```bash
veranad q td params --node $NODE_RPC --output json
```

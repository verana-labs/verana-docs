# Update Trust Deposit Params (Governance)

This guide shows how to update Trust Deposit module parameters using a governance proposal. The transaction used is:

`/verana.td.v1.MsgUpdateParams`

## Environment Setup

```bash
USER_ACC="my-user-account"
USER_ACC_LIT="verana1example0123456789abcdefghijklmnopqrstuv"
CHAIN_ID="vna-testnet-1"
NODE_RPC="http://node1.testnet.verana.network:26657"
```

## Step 1: Get the Governance Authority Address

```bash
veranad q auth module-accounts --node $NODE_RPC --output json \
| jq -r '.accounts[] | select(.name=="gov") | .base_account.address'
```

Set it:

```bash
GOV_AUTH="verana10d07y265gmmuvt4z0w9aw880jnsr700j22m4w8"
```

## Step 2: Fetch Current Params

You must provide **all** fields in `params`. Start from the current values:

```bash
veranad q td params --node $NODE_RPC --output json
```

Extract the current `yield_intermediate_pool` into a variable (use `-r` to avoid quotes):

```bash
YIELD_INTERMEDIATE_POOL=$(veranad q td params --node $NODE_RPC -o json | jq -r .params.yield_intermediate_pool)
```

## Step 3: Build the Proposal JSON

Edit the values you want to change, but keep all fields present:

```bash
cat > trust_deposit_params_proposal.json <<JSON
{
  "messages": [
    {
      "@type": "/verana.td.v1.MsgUpdateParams",
      "authority": "${GOV_AUTH}",
      "params": {
        "trust_deposit_reclaim_burn_rate": "0.6",
        "trust_deposit_share_value": "1.0",
        "trust_deposit_rate": "0.2",
        "wallet_user_agent_reward_rate": "0.2",
        "user_agent_reward_rate": "0.2",
        "trust_deposit_max_yield_rate": "0.15",
        "yield_intermediate_pool": "${YIELD_INTERMEDIATE_POOL}"
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

Replace:
- `GOV_AUTH_PLACEHOLDER` with the governance authority address.
- `yield_intermediate_pool` with the desired module account address (bech32).
- Any rate values you want to change, keeping the rest intact.

## Step 4: Submit the Proposal

```bash
veranad tx gov submit-proposal trust_deposit_params_proposal.json \
  --from $USER_ACC \
  --keyring-backend test \
  --chain-id $CHAIN_ID \
  --fees 750000uvna \
  --gas auto \
  --node $NODE_RPC
```

## Step 5: Track and Vote

```bash
veranad q gov proposals --node $NODE_RPC
```

Set the proposal ID and vote:

```bash
PROPOSAL_ID=1
veranad tx gov vote $PROPOSAL_ID yes \
  --from $USER_ACC \
  --keyring-backend test \
  --chain-id $CHAIN_ID \
  --fees 650000uvna \
  --gas auto \
  --node $NODE_RPC
```

## Step 6: Verify the Update

After the proposal passes and is executed:

```bash
veranad q td params --node $NODE_RPC --output json
```

# Yield Funding Setup (Governance)

Trust deposits earn **yield** from block rewards. Concretely, the module's BeginBlocker each block moves funds from the **Yield Intermediate Pool** (`yield_intermediate_pool`) to trust deposit holders, capped by `trust_deposit_max_yield_rate`, which raises the live `trust_deposit_share_value`. The pool itself is replenished by a **continuous fund** from the protocol pool — this is how the spec's `trust_deposit_block_reward_share` target is realized on-chain (audit finding **TD-MAJ-3**).

This guide configures that continuous funding with a governance proposal wrapping:

`/cosmos.protocolpool.v1.MsgCreateContinuousFund`

## Environment Setup

```bash
USER_ACC="my-user-account"
CHAIN_ID="vna-testnet-1"
NODE_RPC="https://rpc.testnet.verana.network"
```

## Step 1: Get the Yield Intermediate Pool Address

The recipient of the continuous fund is the Trust Deposit module's `yield_intermediate_pool`:

```bash
YIELD_INTERMEDIATE_POOL=$(veranad q td params --node $NODE_RPC -o json | jq -r .params.yield_intermediate_pool)
```

## Step 2: Get the Governance Authority Address

```bash
GOV_AUTH=$(veranad q auth module-accounts --node $NODE_RPC --output json \
| jq -r '.accounts[] | select(.value.name=="gov") | .value.address')
```

## Step 3: Build the Proposal JSON

```bash
cat > td_yield_funding_proposal.json <<JSON
{
  "messages": [
    {
      "@type": "/cosmos.protocolpool.v1.MsgCreateContinuousFund",
      "authority": "${GOV_AUTH}",
      "recipient": "${YIELD_INTERMEDIATE_POOL}",
      "percentage": "0.005000000000000000",
      "expiry": null
    }
  ],
  "metadata": "ipfs://CID",
  "deposit": "10000000uvna",
  "title": "Fund Trust Deposit Yield (Continuous)",
  "summary": "Continuously fund the Yield Intermediate Pool to distribute TD yield.",
  "expedited": false
}
JSON
```

`percentage` is the fraction of protocol-pool inflows continuously streamed to the pool. The `trust_deposit_max_yield_rate` parameter still caps how much of the pool balance any deposit can actually earn per year, so over-funding the pool does not produce unbounded yield.

## Step 4: Submit the Proposal

```bash
veranad tx gov submit-proposal td_yield_funding_proposal.json \
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

## Step 6: Verify Funding

Check the Yield Intermediate Pool balance after the proposal passes:

```bash
veranad q bank balances $YIELD_INTERMEDIATE_POOL --node $NODE_RPC --output json
```

As blocks are produced, watch `trust_deposit_share_value` rise:

```bash
veranad q td params --node $NODE_RPC -o json | jq -r .params.trust_deposit_share_value
```

## See also

- [Trust Deposit Operations](./trust-deposit-operations)
- [Update Trust Deposit Params](./update-params)
- [Reputation Computation](./reputation-computation)

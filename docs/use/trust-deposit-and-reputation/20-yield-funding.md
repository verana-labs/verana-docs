# Yield Funding Setup (Governance)

This guide shows how to configure continuous funding for Trust Deposit yield using a governance proposal. It uses:

`/cosmos.protocolpool.v1.MsgCreateContinuousFund`

## Environment Setup

```bash
USER_ACC="my-user-account"
CHAIN_ID="vna-testnet-1"
NODE_RPC="http://node1.testnet.verana.network:26657"
```

## Step 1: Get the Yield Intermediate Pool Address

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

## Step 4: Submit the Proposal

```bash
veranad tx gov submit-proposal td_yield_funding_proposal.json \
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

## Step 6: Verify Funding

Check the Yield Intermediate Pool balance after the proposal passes:

```bash
veranad q bank balances $YIELD_INTERMEDIATE_POOL --node $NODE_RPC --output json
```

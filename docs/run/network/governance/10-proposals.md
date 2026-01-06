# Network Upgrade Guide

This guide explains the complete process for performing a software upgrade on the Verana network, including governance proposal steps, monitoring, and executing the upgrade.

---

## Overview

Upgrades in a Cosmos SDK-based chain require:
1. Submitting and passing a governance proposal.
2. Reaching the scheduled upgrade height.
3. Restarting all validators and full nodes with the new binary.

The upgrade process consists of:
- **Phase 1:** Prepare and submit the proposal.
- **Phase 2:** Monitor the proposal and upgrade height.
- **Phase 3:** Execute the upgrade on nodes.
- **Phase 4:** Verify the network health.

---

## Environment Variables

Example for the testnet environment:
```
FAUCET_ACC="faucet"
FAUCET_ACC_LIT=verana167vrykn5vhp8v9rng69xf0jzvqa3v79etmr0t2
CHAIN_ID="vna-testnet-1"
NODE_RPC=http://node1.testnet.verana.network:26657
VALIDATOR_ACC=validator
VALIDATOR_ACC_LIT=verana1z2epxhjn6qrg0uca6j0rq7llupe3n0nl0gjt7d
```

---

## Phase 1: Submitting the Upgrade Proposal

Note: For Trust Deposit yield funding, see the continuous funding proposal guide:
[yield-funding](/docs/next/use/trust-deposit-and-reputation/yield-funding).

### 1. Prepare the proposal JSON

Example `draft_proposal.json`:
```json
{
  "messages": [
    {
      "@type": "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade",
      "authority": "verana10d07y265gmmuvt4z0w9aw880jnsr700j22m4w8",
      "plan": {
        "name": "v0.9.1",
        "time": "0001-01-01T00:00:00Z",
        "height": "1195481",
        "info": "{\"binaries\":{\"darwin/arm64\":\"https://github.com/verana-labs/verana/releases/download/v0.9.1-dev.1/veranad-darwin-arm64\",\"darwin/amd64\":\"https://github.com/verana-labs/verana/releases/download/v0.9.1-dev.1/veranad-darwin-amd64\",\"linux/arm64\":\"https://github.com/verana-labs/verana/releases/download/v0.9.1-dev.1/veranad-linux-arm64\",\"linux/amd64\":\"https://github.com/verana-labs/verana/releases/download/v0.9.1-dev.1/veranad-linux-amd64\"}}",
         "upgraded_client_state": null
      }
    }
  ],
  "metadata": "",
  "deposit": "10000000uvna",
  "title": "Upgrade to Verana v0.9.1-dev.1",
  "summary": "Software upgrade to Verana v0.9.1-dev.1. We have updated the share field and the trustdeposit object from uint to LegacyDec",
  "expedited": false
}
```

**Note:** `authority` should be the governance module address. Check with:
```
veranad q auth module-accounts --node $NODE_RPC
```

### 2. Calculate Upgrade Height
- Use current height plus voting period margin. Testnet voting period = 10 mins (~160 blocks).
- Check with:
```
veranad q gov params --node $NODE_RPC
```
- Get current height:
```bash
veranad status --node $NODE_RPC | jq .sync_info.latest_block_height
```

### 3. Submit the Proposal
```bash
PROPOSER_ACC=mat-test-acc
veranad tx gov submit-proposal ./releases/testnet/proposals/upgrade_proposal_v9.1.json  --from $PROPOSER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

### 4. Query Proposals
```
veranad q gov proposals --node $NODE_RPC
```

This will return the ID of the proposal which you can use by setting the following variable used by the below commands.

```bash
PROP_ID=1
```

### 5. Proposal Funding (optional)

Sometimes the deposit needed for the proposal is not enough. The proposal will in that case be in `PROPOSAL_STATUS_DEPOSIT_PERIOD` state. In which case some account (which doesn't have to be the proposer account) will have to fund the proposal before it moves into `PROPOSAL_STATUS_VOTING_PERIOD`

```bash
PROPOSAL_FUNDING_ACC=proposal-investor
veranad tx gov deposit $PROP_ID 40000000uvna --from $PROPOSAL_FUNDING_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```


### 5. Vote
```bash
veranad tx gov vote $PROP_ID yes --from $VALIDATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 650000uvna --gas auto --node $NODE_RPC
```

Ensure your validator account has tokens. If not:
```bash
veranad tx bank send faucet $VALIDATOR_ACC 10000000uvna --from faucet --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

---

## Phase 2: Monitor Proposal & Upgrade Height
- Track proposal status:
```bash
veranad q gov tally $PROP_ID --output json --node $NODE_RPC
```
- Check block height until upgrade height is reached:
```bash
veranad status --node $NODE_RPC | jq .sync_info.latest_block_height
```

---

## Phase 3: Execute the Upgrade

### Stop the Validator
```
sudo systemctl stop veranad
```

### Upgrade the Binary
```
curl -s https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/$CHAIN_ID/binaries/manifest.json > manifest.json
BINARY_FILE=$(jq -r '.["linux-amd64"]' manifest.json)
wget https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/$CHAIN_ID/binaries/$BINARY_FILE
chmod +x $BINARY_FILE
sudo mv $BINARY_FILE /usr/local/bin/veranad
veranad version
```

### Restart the Validator
```
sudo systemctl start veranad
```

---

## Phase 4: Upgrade Snapshot Node (Kubernetes)
If you run a snapshot node in Kubernetes:
```
kubectl rollout restart -n $CHAIN_ID deployment snapshot-node-deployment
```

---

## Debugging & Verification
```
veranad q staking delegations $VALIDATOR_ACC --node $NODE_RPC
veranad q bank balance $VALIDATOR_ACC uvna --node $NODE_RPC
veranad keys list --keyring-backend test
journalctl -u veranad -f
```

---

**End of Guide**

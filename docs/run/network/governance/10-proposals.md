# Submitting Proposals


## Environment variables
Testnet environment
```
FAUCET_ACC="faucet"
FAUCET_ACC_LIT=verana167vrykn5vhp8v9rng69xf0jzvqa3v79etmr0t2
CHAIN_ID="vna-testnet-1"
NODE_RPC=http://node1.testnet.verana.network:26657
VALIDATOR_ACC=validator
VALIDATOR_ACC_LIT=verana1z2epxhjn6qrg0uca6j0rq7llupe3n0nl0gjt7d
```

To submit a software upgrade proposal:

## 1. Prepare the proposal JSON:
```json
{
  "messages": [
    {
      "@type": "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade",
      "authority": "verana10d07y265gmmuvt4z0w9aw880jnsr700j22m4w8",
      "plan": {
        "name": "v0.6",
        "time": "0001-01-01T00:00:00Z",
        "height": "1475093",
        "info": "",
        "upgraded_client_state": null
      }
    }
  ],
  "metadata": "ipfs://CID",
  "deposit": "10000000uvna",
  "title": "Software Upgrade v0.6: Specs Update to v2 and Package Rename",
  "summary": "This proposal initiates a comprehensive upgrade to version 0.6, which includes a major specification update to v2 and a full package rename across the codebase. The upgrade aims to improve maintainability, align with new standards, and enhance future development capabilities. All modules and dependencies will be updated accordingly, and the network will transition to the new package structure at the specified upgrade height.",
  "expedited": false
}
```


verana10d07y265gmmuvt4z0w9aw880jnsr700j22m4w8 should be the governance module address. You can check this information by running the following command:

```
veranad q auth module-accounts --node $NODE_RPC
```

Make sure you ajust the height to the existing one + number of height necessary to wait for the voting period. In testnet this is 160 height for 10 mins. There is one block every 5 seconds. Therefore 10 mins = 600 seconds / 5 + a bit of margin => 120+40 = 160. You can verify this value by running the following command:
```
veranad q gov params --node $NODE_RPC
```

The output should look like:
```
params:
[...]
  voting_period: 10m0s
```

You can find the height of the chain with this command:
```
veranad status --node $NODE_RPC | jq .sync_info.latest_block_height
```


## 2.	Submit the proposal:

```bash
veranad tx gov submit-proposal draft_proposal.json --from faucet --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

## 3. Query the government proposal

```
veranad q gov proposals --node $NODE_RPC
```

we should see something like this as a result:

```
pagination:
  total: "1"
proposals:
- deposit_end_time: "2025-07-13T17:09:25.13757769Z"
  final_tally_result:
    abstain_count: "0"
    no_count: "0"
    no_with_veto_count: "0"
    yes_count: "0"
  id: "1"
  messages:
  - type: /cosmos.upgrade.v1beta1.MsgSoftwareUpgrade
    value:
      authority: verana10d07y265gmmuvt4z0w9aw880jnsr700j22m4w8
      plan:
        height: "1475350"
        name: v0.6
        time: "0001-01-01T00:00:00Z"
  metadata: ipfs://CID
  proposer: verana16mzeyu9l6kua2cdg9x0jk5g6e7h0kk8q6uadu4
  status: PROPOSAL_STATUS_VOTING_PERIOD
  submit_time: "2025-07-11T17:09:25.13757769Z"
  summary: This proposal initiates a comprehensive upgrade to version 0.6, which includes
    a major specification update to v2 and a full package rename across the codebase.
    The upgrade aims to improve maintainability, align with new standards, and enhance
    future development capabilities. All modules and dependencies will be updated
    accordingly, and the network will transition to the new package structure at the
    specified upgrade height.
  title: 'Software Upgrade v0.6: Specs Update to v2 and Package Rename'
  total_deposit:
  - amount: "10000000"
    denom: uvna
  voting_end_time: "2025-07-11T17:19:25.13757769Z"
  voting_start_time: "2025-07-11T17:09:25.13757769Z"
  ```


## 4. Vote for the proposal

Vote for the proposal from an account you control.

```
veranad tx gov vote 1 yes --from $VALIDATOR_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 650000uvna --gas auto --node $NODE_RPC
```

Make sure the staking or validator account used has enough token. Otherwise send some from an account with tokens with this command:
```
veranad tx bank send faucet verana1z2epxhjn6qrg0uca6j0rq7llupe3n0nl0gjt7d 10000000uvna --from faucet --keyring-backend test --chain-id $CHAIN_ID --fees 600000uvna --node $NODE_RPC --yes
```

## 5. Stop the validator

```
sudo systemctl stop veranad
```

## 6. Upgrade the binary

```
# Fetch the binary manifest
curl -s https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/$CHAIN_ID/binaries/manifest.json > manifest.json

# Get the binary filename for your architecture
BINARY_FILE=$(jq -r '.["linux-amd64"]' manifest.json)

# Download the binary
wget https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/$CHAIN_ID/binaries/$BINARY_FILE

# Make it executable
chmod +x $BINARY_FILE

# Move to system path
sudo mv $BINARY_FILE /usr/local/bin/veranad

# Verify installation
veranad version
```

5. Start the validator

```
sudo systemctl start veranad
```

## Key Queries & Debugging

```
veranad q gov tally 1 --output json --node $NODE_RPC
veranad q staking delegations $VALIDATOR_ACC --node $NODE_RPC
veranad q bank balance $VALIDATOR_ACC uvna --node $NODE_RPC
veranad keys list --keyring-backend test
# View logs
journalctl -u veranad -f
```

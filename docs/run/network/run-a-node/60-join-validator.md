# Join as a Validator

This guide provides comprehensive instructions for joining the Verana testnet as a validator.

---

## Table of Contents

1. [What is a Validator?](#what-is-a-validator)
2. [Prerequisites](#prerequisites)
3. [Environment Parameters](#environment-parameters)
4. [Security Considerations](#security-considerations)
5. [Create Validator](#create-validator)
6. [Validator Operations](#validator-operations)
7. [System Configuration](#system-configuration)
8. [Maintenance](#maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## What is a Validator?

Validators are responsible for committing new blocks to the blockchain through an automated voting process. They participate in consensus by voting on blocks and are rewarded for their service. A validator's stake can be slashed if they:
- Become unavailable
- Sign blocks at the same height (double-signing)
- Violate network rules

---

## Prerequisites

> **Prerequisite:** Ensure the `veranad` binary is installed and up-to-date.  
> See [Install or Update Veranad Binary](./prerequisites#1-install-or-update-the-veranad-binary).

> **Tip:** If you have not created an account yet, see [Create and Fund an Account](   -> linking to /docs/next/run/network/run-a-node/prerequisites#create-and-fund-an-account).

- A running full node (see [Join Testnet](./50-join-testnet.md))
- At least 1,000,000 VNA tokens for self-delegation
- A secure server with the following specifications:
  - 32GB RAM
  - 4+ CPU cores
  - 1TB+ SSD storage
  - Reliable internet connection (100+ Mbps)
  - Static IP address
  - 99.9% uptime

---

## Environment Parameters

| Parameter | Value |
|-----------|-------|
| Chain ID | `vna-testnet-1` |
| API | `http://node1.testnet.verana.network:1317` |
| RPC | `http://node1.testnet.verana.network:26657` |
| Explorer | `https://explorer.testnet.verana.network` |
| Faucet | `https://faucet-vs.testnet.verana.network/invitation` |

---

## Security Considerations

### Sentry Node Architecture

**We strongly recommend implementing a sentry node architecture to protect your validator from DDoS attacks:**

```
                    +----------------+
                    |                |
                    |  Sentry Node 1 |
                    |                |
                    +----------------+
                           ^
                           |
                           v
+----------------+  +----------------+  +----------------+
|                |  |                |  |                |
|  Sentry Node 2 |->|  Validator     |<-|  Sentry Node 3 |
|                |  |                |  |                |
+----------------+  +----------------+  +----------------+
```

### Key Management

1. **Separate Keys:** Keep your validator key separate from your node.
2. **Hardware Security:** Use a hardware wallet for the validator key.
3. **Backup:** Regularly backup your keys and configuration.
4. **Access Control:** Implement strict access controls to your validator server.

---

## Create Validator

### 1. Create a New Account

```bash
# Create a new key
veranad keys add <key-name>
```
> **Note:** Save the mnemonic phrase securely. You'll need it to recover your account.

### 2. Get Testnet Tokens

Request testnet tokens from the [Verana Faucet](https://faucet-vs.testnet.verana.network/invitation).

### 3. Set Environment Variables

Set the following variables for convenience (replace values as needed):

```bash
export validatorName=<key-name>
export NODE_RPC=http://node1.testnet.verana.network:26657
export CHAIN_ID=vna-testnet-1
```

### 4. Prepare Validator Transaction

```bash
# Fetch the validator operator address
validatorOperatorAddress=$(veranad keys show $validatorName --keyring-backend test --bech val --address)

# Check if the validator exists
validatorStatus=$(veranad q staking validator $validatorOperatorAddress --node $NODE_RPC 2>&1)

# Use provided pubkey or fetch from local tendermint
pubkey_json=$(veranad tendermint show-validator)
pubkey=$(echo $pubkey_json | jq -r '.key')

# Create the JSON file for joining the validator
echo '{
"pubkey": {
   "@type": "/cosmos.crypto.ed25519.PubKey",
   "key": "'"$pubkey"'"
},
"amount": "990000000uvna",
"moniker": "'"${validatorName}"'",
"commission-rate": "0.1",
"commission-max-rate": "0.2",
"commission-max-change-rate": "0.01",
"min-self-delegation": "1000000"
}' > joiningvalidator.json
```

### 5. Create Validator Transaction

> **Note:** The `commission-max-change-rate` is the maximum percentage point change per day. For example, 1% to 2% is a 1 percentage point change.

```bash
# Execute the create-validator transaction
veranad tx staking create-validator ./joiningvalidator.json --from $validatorName --fees 600000uvna --chain-id $CHAIN_ID --node $NODE_RPC --keyring-backend test --yes
```

---

## Validator Operations

### 1. View Validator Information

```bash
# View validator details
veranad query staking validator $(veranad keys show $validatorName --bech val -a)

# Check voting power
veranad status | grep voting_power

# View signing information
veranad query slashing signing-info $(veranad tendermint show-validator)
```

### 2. Unjail Validator

If your validator gets jailed:

```bash
veranad tx slashing unjail --from=$validatorName --chain-id=$CHAIN_ID
```

---

## System Configuration

### 1. Configure Firewall

```bash
# Allow only necessary ports
sudo ufw allow 26656/tcp  # P2P
sudo ufw allow 26657/tcp  # RPC
sudo ufw allow 1317/tcp   # API
```

### 2. Set Up Monitoring

Install and configure monitoring tools:

```bash
# Install Prometheus
sudo apt-get install prometheus

# Install Node Exporter
sudo apt-get install prometheus-node-exporter

# Install Grafana
sudo apt-get install grafana
```

### 3. Configure System Limits

Create or edit `/etc/security/limits.conf`:

```
* soft nofile 65535
* hard nofile 65535
```

---

## Maintenance

### 1. Backup

Regularly backup your validator's state:

```bash
# Backup the validator state
tar -czf validator-backup.tar.gz ~/.verana

# Backup keys
veranad keys export $validatorName --unarmored-hex --unsafe > validator-key.txt
```

### 2. Updates

When network upgrades are announced:

1. Monitor the [Verana Discord](https://discord.gg/verana) for announcements.
2. Update your node software.
3. Restart your validator.

### 3. Graceful Shutdown

To halt your validator at a specific height:

```bash
veranad start --halt-height <height>
```

---

## Troubleshooting

### Common Issues

1. **Validator Not in Active Set**
   - Check if you have enough voting power.
   - Verify your commission rate is competitive.
   - Ensure your node is fully synced.
   - Check if you're in the top 100 validators by voting power.

2. **Node Not Syncing**
   - Check your internet connection.
   - Verify your peers are connected.
   - Check system resources (CPU, RAM, disk space).
   - Review logs for errors: `journalctl -u veranad -f`

3. **Validator Jailed**
   - Check for double-signing.
   - Verify uptime.
   - Check system time synchronization.
   - Review slashing parameters.

4. **High Resource Usage**
   - Monitor system resources.
   - Check for memory leaks.
   - Verify disk I/O performance.
   - Review network bandwidth usage.

---

## Best Practices

1. **Regular Maintenance**
   - Monitor system resources.
   - Check validator status.
   - Review logs for errors.
   - Update software regularly.

2. **Security**
   - Keep software updated.
   - Use strong passwords.
   - Implement firewall rules.
   - Regular security audits.

3. **Performance**
   - Monitor voting power.
   - Track missed blocks.
   - Check commission rates.
   - Review delegations.

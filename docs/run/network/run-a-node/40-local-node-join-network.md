# Running a Local Node That Joins a Network

You can set up a local node that joins the `vna-testnet-1` or `vna-mainnet-1` networks. This allows you to participate in the network and sync with the blockchain.

## Pre-Requisites

> **Prerequisite:** Ensure the `veranad` binary is installed and up-to-date.  
> See [Install or Update Veranad Binary](./prerequisites#1-install-or-update-the-veranad-binary).

Verify the installation:
```bash
veranad version
```



## Steps to Join a Kubernetes/S3 deployed network

1. Main installation script

```bash

# Choose the environmnet to join
CHAIN_ID=vna-devnet-1

# Initialize the Node
veranad init "my-testnet-node" --chain-id $CHAIN_ID

# Configure minimum gas price
sed -i 's/minimum-gas-prices = ""/minimum-gas-prices = "0.0025uvna"/' ~/.verana/config/app.toml

# Download and Validate Genesis File ---
echo "Downloading genesis file..."
curl -o genesis.json https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/$CHAIN_ID/config/genesis.json
mv genesis.json ~/.verana/config/
veranad validate-genesis

# Update Network Configuration ---
echo "Fetching and updating persistent peers and seeds..."
PEERS=$(curl -s https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/$CHAIN_ID/persistent_peers/persistent_peers.json | jq -r '.persistent_peers')

sed -i.bak "s|^persistent_peers *=.*|persistent_peers = \"$PEERS\"|" ~/.verana/config/config.toml
sed -i.bak "s|^seeds *=.*|seeds = \"$PEERS\"|" ~/.verana/config/config.toml
sed -i.bak "s|^external_address *=.*|external_address = \"$EXTERNAL_IP:26656\"|" ~/.verana/config/config.toml
sed -i.bak "s|^laddr *= \"tcp://127.0.0.1:26657\"|laddr = \"tcp://0.0.0.0:26657\"|" ~/.verana/config/config.toml
sed -i.bak 's/^pex *=.*/pex = false/' ~/.verana/config/config.toml

sed -i.bak "s/experimental_max_gossip_connections_to_persistent_peers = .*/experimental_max_gossip_connections_to_persistent_peers = 10/" ~/.verana/config/config.toml
sed -i.bak "s/experimental_max_gossip_connections_to_non_persistent_peers = .*/experimental_max_gossip_connections_to_non_persistent_peers = 10/" ~/.verana/config/config.toml

echo "Updated persistent peers, seeds, external address, and RPC listener"
echo "Updated mempool settings with recommended values"

# Set peer limits for P2P connections
sed -i 's/^max_num_inbound_peers = .*/max_num_inbound_peers = 40/' ~/.verana/config/config.toml
sed -i 's/^max_num_outbound_peers = .*/max_num_outbound_peers = 20/' ~/.verana/config/config.toml

# Enable API and Swagger UI ---
echo "Configuring API and Swagger..."
sed -i 's/^enable = false/enable = true/' ~/.verana/config/app.toml
sed -i 's/^swagger = false/swagger = true/' ~/.verana/config/app.toml
sed -i 's/^address = "tcp:\/\/localhost:1317"/address = "tcp:\/\/0.0.0.0:1317"/' ~/.verana/config/app.toml

# Download and Extract Snapshot ---
SNAPSHOT_MANIFEST="/tmp/verana-snapshot-manifest.json"
wget https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/${CHAIN_ID}/snapshots/manifest.json -O "$SNAPSHOT_MANIFEST" || true


latest_snapshot=$(jq -r '.latestSnapshot' $SNAPSHOT_MANIFEST)
echo "Latest snapshot: $latest_snapshot"

wget -O $HOME/.${CONFIG_FILE_NAME}/data.tar.gz https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/${ENVIRONMENT}/snapshots/$latest_snapshot
tar -xzvf $HOME/.${CONFIG_FILE_NAME}/data.tar.gz -C $HOME/.${CONFIG_FILE_NAME}


# Start the Node ---
exec /usr/local/bin/${BINARY_NAME} start --home $HOME/.${CONFIG_FILE_NAME}
```

2. Setup Verana as a systemd Service

```bash
# --- Step 12: Setup Verana as a systemd Service ---
echo "Setting up veranad as a systemd service..."
sudo tee /etc/systemd/system/veranad.service > /dev/null <<EOF
[Unit]
Description=Verana Daemon
After=network-online.target

[Service]
User=$USER
ExecStart=$(which veranad) start
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable veranad
sudo systemctl start veranad

# --- Step 13: Post-Installation Instructions ---
echo "Installation complete."
echo "Use the following commands to monitor the node:"
echo "  veranad status"
echo "  veranad status 2>&1 | jq .SyncInfo"
echo "  veranad status 2>&1 | jq .NodeInfo"
echo "  journalctl -u veranad -f"
echo "  journalctl -u veranad -f | grep ERROR"
echo "  htop / iotop for system monitoring"
```



## Steps to Join vna-mainnet-1

Note: Mainnet is not deployed yet, so the following might not work yet.

1.	Follow the same steps as above but replace vna-testnet-1 with vna-mainnet-1.
2.	Download the vna-mainnet-1 genesis file:

```bash
curl -o ~/.verana/config/genesis.json https://raw.githubusercontent.com/verana-labs/networks/main/vna-mainnet-1/genesis.json
```

## How to promote node as validator ?

Read [Promote node as validator](./join-validator) 
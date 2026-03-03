# Join an Ephemeral Network (Betanet / Branch Environments)

This guide is for developers or testers who want to join a short-lived, branch-based Kubernetes environment (including betanet). These environments are ephemeral and may be offline at any time.

## Pre-Requisites

> **Prerequisite:** Ensure the `veranad` binary is installed and up-to-date.  
> See [Install or Update Veranad Binary](./prerequisites#1-install-or-update-the-veranad-binary).

Verify the installation:
```bash
veranad version
```

## Remote CLI (no local node)

If you only want to query or send transactions without running a node locally, point your CLI to the environment RPC endpoint:

```bash
CHAIN_ID="vna-devnet-feature-foo"
NODE_RPC="https://rpc.${CHAIN_ID}.devnet.verana.network"

veranad q bank balances <address> --node "$NODE_RPC"
```



## How namespaces and endpoints are derived

Ephemeral environments are created by GitHub Actions and use a namespace derived from the branch name:
- Default namespace: `vna-devnet-<VERANA_BRANCH>` (slashes replaced with `-`)
- If the branch is `main`, the default becomes `vna-devnet-main`
- This namespace is also the **chain ID** and the **S3 path prefix**

**RPC/API pattern**
- RPC: `https://rpc.<NAMESPACE>.devnet.verana.network`
- API: `https://api.<NAMESPACE>.devnet.verana.network`

Example for branch `feature/foo`:
- Namespace / chain ID: `vna-devnet-feature-foo`
- RPC: `https://rpc.vna-devnet-feature-foo.devnet.verana.network`
- API: `https://api.vna-devnet-feature-foo.devnet.verana.network`

Betanet example (simplified, stable name):
- Namespace / chain ID: `vna-betanet-1`
- RPC: `https://rpc.vna-betanet-1.devnet.verana.network`
- API: `https://api.vna-betanet-1.devnet.verana.network`
- This is used when a specific branch is deployed but the environment is forced to a stable betanet name to avoid exposing branch-specific namespace complexity.

## Steps to Join an Ephemeral Environment

```bash
# Set the namespace/chain-id you want to join
CHAIN_ID="vna-devnet-feature-foo"

# Initialize the node
veranad init "local-ephemeral-node" --chain-id "$CHAIN_ID"

# Minimum gas price
sed -i 's/minimum-gas-prices = ""/minimum-gas-prices = "0.0025uvna"/' ~/.verana/config/app.toml

# Download and validate genesis
curl -o ~/.verana/config/genesis.json \
  "https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/${CHAIN_ID}/config/genesis.json"
veranad validate-genesis

# Fetch persistent peers
PEERS=$(curl -s "https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/${CHAIN_ID}/persistent_peers/persistent_peers.json" \
  | jq -r '.persistent_peers')

sed -i.bak "s|^persistent_peers *=.*|persistent_peers = \"$PEERS\"|" ~/.verana/config/config.toml
sed -i.bak "s|^seeds *=.*|seeds = \"$PEERS\"|" ~/.verana/config/config.toml

# Optional: enable API locally
sed -i 's/^enable = false/enable = true/' ~/.verana/config/app.toml
sed -i 's/^swagger = false/swagger = true/' ~/.verana/config/app.toml
sed -i 's/^address = "tcp:\/\/localhost:1317"/address = "tcp:\/\/0.0.0.0:1317"/' ~/.verana/config/app.toml

# Start the node
veranad start
```

## Running as a Service (optional)

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



## Notes
- These environments are ephemeral and may be offline at any time.
- Do not use this guide for public testnet or mainnet. Use the dedicated Join Testnet guide instead.

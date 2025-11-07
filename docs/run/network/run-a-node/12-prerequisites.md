# Prerequisites for Running a Node

Before you start running Verana CLI commands or setting up a node, make sure you have installed the required components and configured your environment.

---

## 1. Install or Update the Veranad Binary

You have two options to install the `veranad` binary:

### **Option A: Download the Latest Binary**
If you prefer the easiest approach, download the precompiled binary:

```bash
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

### **Option B: Build from Source**
If you want to build from source, clone the repository and compile:

```bash
# Make sure that Go 1.22+ is installed.

go version

git clone https://github.com/verana-labs/verana-blockchain.git
cd verana-blockchain
make install

#Verify installation
veranad version

#If you get "veranad: command not found" when executing the command, make sure the binary is in your PATH. By default, the binary is installed in ~/go/bin. You can use the following command to locate the binary if it is in another directory

find / -name veranad

# Make sure this directory is included in your PATH
export PATH=$PATH:~/go/bin
veranad version
```

See [Run an Isolated Local Node](20-local-node-isolated.md) for detailed instructions on using helper scripts and building from source.

> **Tip:** Skip this step if the `veranad` binary is already installed and up-to-date.

---

## 2. Configure Environment Variables

Set environment variables to target the correct network (testnet, mainnet, or local):

```bash
USER_ACC="your-account-name"
USER_ACC_LIT="verana1..."  #Refer to step 3 to obtain this parameter.
CHAIN_ID="vna-testnet-1"
NODE_RPC="http://node1.testnet.verana.network:26657"
```

---

## 3. Create and Fund an Account

Before you can send transactions or interact with the network, you need an account with tokens.

### Create a New Account
```bash
veranad keys add $USER_ACC --keyring-backend test
```

If you already have a passphrase (mnemonic), restore the account:
```bash
SEED_PHRASE_USER_ACC="pink glory help gown abstract eight nice crazy forward ketchup skill cheese"
echo "$SEED_PHRASE_USER_ACC" | veranad keys add $USER_ACC --recover --keyring-backend test
```

### List Accounts
```bash
veranad keys list --keyring-backend test
```

### Fund Your Account
Use the faucet to request tokens (available for testnet and devnet):
```
/to verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0
```
*(Replace the address with your account address. You can use the command `veranad keys list --keyring-backend test` to find your address.)*

### Check Account Balance
```bash
veranad q bank balance $USER_ACC_LIT uvna --node $NODE_RPC
```
---

You are now ready to proceed with node setup and other CLI operations.
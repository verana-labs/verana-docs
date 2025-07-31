# Running an Isolated Local Node

Running a local node in isolation is useful for testing and development purposes without interacting with a public network.


## Getting Started

1. **Clone the Repository**

To access the helper scripts, clone the `verana-blockchain` repository:

```bash
git clone https://github.com/verana-labs/verana-blockchain.git
cd verana-blockchain
```

2. **Install the Veranad Binary**

You have two options to install the `veranad` binary:

- **Option A: Download the Latest Binary**
  > See [Install or Update Veranad Binary](12-prerequisites.md#install-or-update-the-veranad-binary).

- **Option B: Build from Source**
  If you prefer to build from source:
  ```bash
  make install
  ```

## Steps to Set Up an Isolated Node (with a script)


Follow these steps to set up your Verana blockchain.


Run the setup script:

```bash
./scripts/setup_primary_validator.sh
```

This script initializes the chain and starts the node. After this step, the blockchain should be running locally. You’re ready to interact with the chain using the CLI.

## Setting Up Multiple Validators (with a script)

To create a multi-validator network, follow these steps:

1. Clean up existing data:
```bash
rm -rf ~/.verana ~/.verana2
```

2.	Start the primary validator:

```bash
./scripts/setup_primary_validator.sh
```

3.	Start a secondary validator:

```bash
./scripts/setup_additional_validator.sh 2
```


Now your network has multiple validators running locally. You can use the CLI to interact with either validator by specifying their --node RPC URL.


## Test your local node

Your node is now running locally! Use the CLI to interact with it:

```bash
veranad q bank balances $(veranad keys show cooluser -a --keyring-backend test)
```

Create a Trust Registry:
```bash
veranad tx trustregistry create-trust-registry \
    did:example:123456789abcdefghi en \
    https://example.com/framework.pdf "sha256-315f5bdb76d078c43b8ac00641b2a6ea241e27fcb60e23f9e6acfa2c05b9e36a" \
    --from cooluser --keyring-backend test --chain-id vna-local-1 --fees 600000uvna
```

List Trust Registries:
```bash
veranad q trustregistry list-trust-registries
```
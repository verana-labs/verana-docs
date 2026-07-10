# Developer Local Node (Build From Source)

This page is for developers who want to build and run a Verana node from source for debugging, feature development, or protocol work. If you just want to run a node or connect to a public network, use the other guides that download a prebuilt binary.


## Getting Started

1. **Clone the Repository**

To access the helper scripts, clone the `verana-node` repository:

```bash
git clone https://github.com/verana-labs/verana-node.git
cd verana-node
```

2. **Build the Veranad Binary (from source)**

Build the binary locally:
```bash
make install
```

## Steps to Set Up an Isolated Node (with a script)


Follow these steps to set up your Verana blockchain.


Run the setup script:

```bash
./scripts/setup_primary_validator.sh
```

This script initializes the chain (chain ID `vna-testnet-1`, default denom `uvna`) and starts the node. It also creates and funds the validator key `cooluser`. After this step, the blockchain should be running locally. You’re ready to interact with the chain using the CLI.

The node exposes:

- **RPC**: `http://localhost:26657`
- **REST API**: `http://localhost:1317`
- **gRPC**: `localhost:9090`

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

Your node is now running locally! Use the CLI to interact with it.

Check the balance of the funded validator key:

```bash
veranad q bank balances $(veranad keys show cooluser -a --keyring-backend test)
```

Run a smoke-test transaction — a simple bank send from `cooluser` to itself confirms the node accepts and commits transactions:

```bash
COOL=$(veranad keys show cooluser -a --keyring-backend test)

veranad tx bank send "$COOL" "$COOL" 1000uvna \
    --from cooluser --keyring-backend test \
    --chain-id vna-testnet-1 --node http://localhost:26657 \
    --gas auto --gas-adjustment 1.4 --fees 750000uvna -y
```

A successful broadcast returns a `txhash` with `code: 0`:

```json
{
  "code": 0,
  "txhash": "0AEC5560DE453515E4795E04BC0230CCD29E963B1037F1921D4995C61AD8DD31"
}
```

To exercise a Verana module, query the Ecosystem module (`ec`), which replaces the former Trust Registry module:

```bash
veranad q ec list-ecosystems
```

On a freshly initialized chain this returns an empty set. To create ecosystems, participants, and credential schemas, see the [module reference](../modules/ecosystem). Most module transactions are executed on behalf of a Corporation, so start there.

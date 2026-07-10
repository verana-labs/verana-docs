# Environments

This section lists all the available environments for the Verana blockchain, including their entry points and attributes.


| Environment Name         | Chain ID     | API Endpoint                 | RPC Endpoint                |
|--------------------------|--------------|------------------------------|-----------------------------|
| Local Development Environment  | `vna-local-1`  | `http://localhost:1317` | `http://localhost:26657` |
| devnet Environment  | `vna-devnet-1`  | `http://node1.devnet.verana.network:1317` | `http://node1.devnet.verana.network:26657` |
| Testnet Environment         | `vna-testnet-1` | `https://api.testnet.verana.network` | `https://rpc.testnet.verana.network` |
| Production Environment   | `vna-mainnet-1` | `https://api.verana.network`        | `https://rpc.verana.network`        |

**Attribute Descriptions**:

- **Environment Name**: The name of the environment (e.g., Development, Test, Production).
- **Chain ID**: The unique identifier for the blockchain network.
- **API Endpoint**: The REST API endpoint for the environment.
- **RPC Endpoint**: The Tendermint RPC endpoint for the environment.

:::note Local chain ID
`vna-local-1` is the conventional label for a local development chain, but the helper script `scripts/setup_primary_validator.sh` initializes the isolated local node with chain ID **`vna-testnet-1`**. When interacting with a node started by that script, pass `--chain-id vna-testnet-1`. See [Run an Isolated Local Node](../run-a-node/local-node-isolated).
:::

Use these attributes to configure your CLI or client applications to interact with the appropriate Verana blockchain environment.

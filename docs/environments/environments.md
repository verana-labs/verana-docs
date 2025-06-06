# Environments

This section lists all the available environments for the Verana blockchain, including their entry points and attributes.

| Environment Name         | Chain ID     | API Endpoint                 | RPC Endpoint                |
|--------------------------|--------------|------------------------------|-----------------------------|
| Local Development Environment  | `vna-local-1`  | `http://localhost:1317` | `http://localhost:26657` |
| betanet Environment  | `vna-betanet-1`  | `https://api.vna-betanet-1.devnet.verana.network` | `https://rpc.vna-betanet-1.devnet.verana.network` |
| devnet Environment  | `vna-devnet-main`  | `https://api.vna-devnet-main.devnet.verana.network` | `https://rpc.vna-devnet-main.devnet.verana.network` |
| Test Environment         | `vna-testnet-1` | `https://api.testnet.verana.network` | `https://rpc.testnet.verana.network` |
| Production Environment   | `vna-mainnet-1` | `https://api.verana.network`        | `https://rpc.verana.network`        |

---

### **3. Attribute Descriptions**

- **Environment Name**: The name of the environment (e.g., Development, Test, Production).
- **Chain ID**: The unique identifier for the blockchain network.
- **API Endpoint**: The REST API endpoint for the environment.
- **RPC Endpoint**: The Tendermint RPC endpoint for the environment.
- **gRPC Endpoint**: The gRPC endpoint for advanced client interaction.

Use these attributes to configure your CLI or client applications to interact with the appropriate Verana blockchain environment.


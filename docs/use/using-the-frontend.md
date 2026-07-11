# Using the Frontend

The **Verana Frontend** is the web interface for everything in this section. On the [components overview](https://verana.io/page/developers/components/) it is referred to as the "Ledger Interface": it lets you create and join ecosystems, manage trust registries, register credential schemas, and administer DID directory entries without touching the CLI.

- **Live testnet frontend:** [app.testnet.verana.network](https://app.testnet.verana.network/dashboard)
- **Run it yourself:** see [Deploy the Frontend](../run/other-component-deployment/frontend).

Throughout this section, each action shows a **CLI** tab and a **Frontend** tab. The Frontend tab documents the same operation through this interface.

:::note Naming
In the frontend, a trust registry is created and managed as an **Ecosystem**. Wherever the docs say "trust registry", the frontend UI says "Ecosystem".
:::

## Connect your wallet

The frontend signs transactions with [Keplr](https://www.keplr.app/). Read-only browsing (Discover, viewing ecosystems and schemas) works without a wallet; anything that writes to the ledger needs one.

1. Install the Keplr browser extension.
2. Open the frontend and click **Connect Wallet** on the Dashboard (or **Connect** in the navbar).
3. Approve the connection in Keplr. Once connected, the Dashboard shows **Connected** and the active **Network** under **Connection Details**.

To submit transactions you also need some **VNA** for fees. On testnet, use the faucet from the **Account** page ("Get VNA Tokens").

![Connected frontend dashboard](/img/frontend/dashboard-connected.png)

## Getting around

| Page | What it's for |
|------|----------------|
| **Dashboard** | Network status, wallet connection details, block height, and totals (ecosystems, schemas, trust deposit). |
| **Discover & Join** | Browse existing ecosystems and their credential schemas, then join. |
| **Ecosystems** | Create and manage your own trust registries, credential schemas, and permissions. |
| **DID Directory** | Register and manage your DIDs. |
| **Account** | Your wallet, balance, trust deposit, and the testnet faucet. |
| **Pending Tasks** | Actions waiting on you and on your grantees across every ecosystem. |

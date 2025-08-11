# Environment Setup

:::tip
🙌🏻 The "**Use**" section is **Work in Progress**!
A [Verana Frontend](https://github.com/verana-labs/verana-frontend) is under active development. In the meantime, it is required to use the command line in order to interact with the Verana Verifiable Trust Network testnet.
:::

## Using the CLI

>Use the CLI to query the ledger, and execute transactions that modify the ledger.

> **Prerequisite:** Ensure the `veranad` binary is installed and up-to-date.  
> See [Install or Update Veranad Binary](/docs/next/run/network/run-a-node/prerequisites).

Set the following environment variables in order to be able to interact with the Verana Verifiable Trust Network:

```bash
USER_ACC="mat-test-acc"
USER_ACC_LIT=verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0
CHAIN_ID="vna-testnet-1"
NODE_RPC=http://node1.testnet.verana.network:26657
```

*These variables are required to target the correct environment (testnet, mainnet, or local). Adjust values accordingly.*

## Using the API

>Use the API to query the ledger only.

For querying the ledger, you can use the API. An openapi.yml is available with its swagger-ui for all network environments. Example, for testnet: [https://api.testnet.verana.network/](https://api.testnet.verana.network/)

:::info
You cannot use the API with the swagger-ui to execute transactions that modify the ledger state. These actions require signing the messages using wallet software which is not possible using the API with the swagger-ui.
:::

## Using the Indexer

>Use the Indexer to perform advanced queries that cannot be done with the API.

:::tip[TODO]
@mjfelis
:::

## Using the Frontend

>Use the frontend to query the ledger, and execute transactions that modify the ledger.

The frontend is experimental and, for the testnet, is available here [https://app.testnet.verana.network/](https://app.testnet.verana.network/).

If you prefer, you can deploy your own instance of the frontend. See the [frontend deployment documentation](/next/run/other-component-deployment/frontend) for more information.

:::tip
This is pre-alpha software and not all features are implemented yet.
:::

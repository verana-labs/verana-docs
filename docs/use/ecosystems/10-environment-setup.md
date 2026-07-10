# Environment Setup

:::tip
🙌🏻 The "**Use**" section is **Work in Progress**!
A [Verana Frontend](https://github.com/verana-labs/verana-frontend) is under active development. In the meantime, it is required to use the command line in order to interact with the Verana Verifiable Trust Network.
:::

## Using the CLI

>Use the CLI to query the ledger, and execute transactions that modify the ledger.

> **Prerequisite:** Ensure the `veranad` binary is installed and up-to-date.
> See [Install or Update Veranad Binary](../../run/network/run-a-node/prerequisites).

Set the following environment variables in order to target the correct network:

```bash
# --- Network ---
CHAIN_ID="vna-testnet-1"
NODE_RPC="https://rpc.testnet.verana.network"   # local: http://localhost:26657
DENOM="uvna"
FEES="750000uvna"
GAS="auto"
KEYRING="test"                                   # use "os" or "file" for real keys

# --- Your identities (see the Corporation & Delegation model below) ---
OPERATOR_ACC="my-operator-key"                   # the key you sign with (--from)
CORPORATION="verana1..."                         # the policy_address of your Corporation
```

*Adjust `NODE_RPC`/`CHAIN_ID` for testnet, mainnet, or a local node.*

## The Corporation & Delegation model (read this first)

In spec v4, on-chain resources (Ecosystems, Credential Schemas, Participants, …) are **not** owned by a plain account. They are owned by a **Corporation** — an on-chain entity backed by a [Cosmos SDK `x/group`](https://docs.cosmos.network/main/build/modules/group) policy. Almost every transaction is executed *on behalf of* a Corporation using a **delegation** pattern:

:::info Corporation → Operator → Transaction
- A **Corporation** is created with `MsgCreateCorporation` and is identified on-chain by its **`policy_address`** (a group policy address). This address is the `corporation` argument passed to nearly every module command.
- An **Operator** is an account that has been **granted authorization** by the Corporation to submit specific message types on its behalf. You sign transactions with the operator key (`--from`).
- A transaction therefore has two roles: the **corporation** (the resource owner, authenticated via its group policy) and the **operator** (the signer). Both are enforced on-chain by the [Delegation module](./delegation/grant-operator-authorization) (AUTHZ-CHECK).
:::

Before you can run any resource-creating command you must, once:

1. **[Create a Corporation](./corporation)** — this returns its `policy_address`.
2. **Fund the `policy_address`** with `uvna` so it can pay fees.
3. **[Grant an operator authorization](./delegation/grant-operator-authorization)** for the message types you intend to use.

:::note Governance-only messages
A few messages are **not** delegable and can only be executed through an on-chain **governance proposal** — every module's `update-params`, plus `td slash-trust-deposit`, `ec update-params`, and the `xr` create/state/authorization messages. These are called out on their respective pages.
:::

## A note on the `corporation` argument

The way the Corporation is passed **differs per module** — always follow the exact form shown on each command's page:

| Modules | Form |
|---|---|
| `cs`, `de`, `pp` | `--corporation <policy_address>` flag |
| `ec`, `gf`, `td` | `[corporation]` positional argument |
| `di` | `[authority]` positional argument |

## Using the API

>Use the API to query the ledger only.

An `openapi.yml` with a swagger-ui is available for every network environment. Example, for testnet: [https://api.testnet.verana.network/](https://api.testnet.verana.network/)

:::info
You cannot use the swagger-ui to execute transactions that modify the ledger. Those require signing messages with wallet software.
:::

## Using the Frontend

>Use the frontend to query the ledger, and execute transactions that modify the ledger.

The frontend is experimental and, for the testnet, is available here: [https://app.testnet.verana.network/](https://app.testnet.verana.network/).

You can also deploy your own instance — see the [frontend deployment documentation](../../run/other-component-deployment/frontend).

:::tip
This is pre-alpha software and not all features are implemented yet.
:::

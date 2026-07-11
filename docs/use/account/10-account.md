# Account

The **Account** page is where you fund your wallet, read your balances, and claim trust-deposit yield. Open it from **Account** in the frontend navigation once your wallet is [connected](../using-the-frontend).

## Balances

Two cards summarize your position, each with its approximate USD value:

- **Main Balance** — your spendable VNA.
- **Trust Deposit** — the total VNA you have locked as trust deposit across your ecosystems, credential schemas, and permissions.

## Account Actions

- **Get VNA Tokens** — on testnet, opens the faucet so you can fund your wallet with VNA for fees and deposits. This is the quickest way to get started after connecting.
- **Claim Yield** — claims the yield accrued on your trust deposit (`MsgReclaimTrustDepositYield`). Confirm and approve in Keplr; on success you'll see a "Yield successfully claimed" notification. If you have no claimable yield, the action stays disabled. See [Trust Deposit operations](../trust-deposit-and-reputation/trust-deposit-operations) for the underlying mechanics and the CLI equivalent.

## Account Information

- **Wallet Address** — your connected `verana…` address.
- **Network** — the chain you're connected to (e.g. `vna-testnet-1`).
- **DIDs Managed** — number of DIDs registered by this account.
- **Transactions Sent** — total transactions this account has broadcast.
- **Slashing Events** — number of times a deposit tied to this account has been slashed.

![Account page in the frontend](/img/frontend/account.png)

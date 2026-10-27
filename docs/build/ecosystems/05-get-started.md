---
title: Get started with the frontend
description: "Connect a wallet, get testnet VNA, pick the corporation you act for, and find your way around the frontend."
sidebar_position: 5
persona: ecosystem-builder
surface: frontend
verified_on: 2026-10-27 (testnet v0.10.6, frontend 0.19.1)
---

# Get started with the frontend

The Verana Frontend runs at [app.testnet.verana.network](https://app.testnet.verana.network) for testnet and [app.devnet.verana.network](https://app.devnet.verana.network) for devnet. It talks to the chain through your browser wallet and reads everything else from the indexer. Nothing is stored on a Verana server: your keys stay in the wallet, your choices (language, theme, acting corporation) stay in the browser.

:::tip Screenshots follow your theme
Every screenshot on these pages switches with the docs theme (the toggle at the top right), so you see the frontend the way you use it. Click any screenshot to enlarge it.
:::

## Connect a wallet

You need a Cosmos browser wallet, [Keplr](https://www.keplr.app) or [Leap](https://www.leapwallet.io). Without a wallet the frontend is read only: you can browse the dashboard and **Discover & Join**.

<Screenshot name="tour/dashboard-guest" alt="The dashboard before a wallet is connected" caption="Before connecting: network figures and the public pages only." />

Click **Connect** at the top right and pick your wallet. The wallet asks you to approve the Verana chain the first time.

<Screenshot name="tour/connect-wallet" alt="The wallet selection dialog" />

Once connected, the header shows the network (`vna-testnet-1`), the corporation you act for, the settings, the theme toggle and your account. A fresh account has no corporation yet, so the dashboard offers to create one.

<Screenshot name="tour/dashboard-connected" alt="The dashboard of a connected account without a corporation" />

## Get VNA

Every transaction costs a small network fee in VNA, and some actions lock a trust deposit. On testnet and devnet the **Account** page tops your account up from the faucet. It also shows your address (with a QR code and an explorer link), your balance, and the corporations you belong to.

<Screenshot name="tour/account" alt="The Account page of a new account" />

<StepThrough>
<Step title="Open Get VNA" shot="tour/get-vna-panel">

**Account**, **Get VNA Tokens**. The panel shows the network, the default amount and the hourly and daily limits of the faucet.

</Step>
<Step title="Choose the amount" shot="tour/get-vna-amount">

Change the amount if you need more, up to the hourly limit, then **Request VNA**. The wallet asks you to sign a short login message; it is not a transaction and costs nothing.

</Step>
<Step title="Received" shot="tour/get-vna-received">

The faucet sends the coins and the frontend shows the transaction hash, linked to the explorer. The balance updates at once.

</Step>
</StepThrough>

The faucet limits are per account: 10 VNA by default, 50 VNA per hour, 300 VNA per day on testnet. There is no faucet on mainnet.

## Act for a corporation

On Verana every resource belongs to a **corporation**, a group of member accounts that decides by proposal and lets operators act for it. Your account can be a member or an operator of several corporations; the frontend always acts for one of them, the **acting corporation**.

- With no corporation, the dashboard offers **Create your corporation** and the selector **Create new Corporation**; the pages that need a corporation stay hidden until then. See [Create a corporation](./10-create-corporation.md).
- With several, the frontend asks which one to act for the first time you connect.

<Screenshot name="tour/choose-corporation" alt="The corporation chooser shown when the account operates several corporations" />

Switch at any time from the selector in the header. It lists your corporations with your role in each (operator, member and your voting weight) and their pending tasks and votes, and refreshes the list after you create or join one. Switching resets any open form, so nothing you typed is sent for the wrong corporation.

<Screenshot name="tour/corporation-selector" alt="The acting corporation selector in the header" />

## Find your way around

The navigation follows what the acting corporation can do.

| Page | What it is for |
|---|---|
| **Dashboard** | Network figures and the shortcuts to start building or joining. |
| **Account** | Your balance, Get VNA, and the corporations you belong to. |
| **Corporation** | Members, governance framework, trust deposit, operators and proposals of the acting corporation. |
| **Ecosystems** | The ecosystems your corporation owns or joined, their governance frameworks, schemas and participant trees. |
| **Agents** | The Verifiable Services your corporation operates and their accreditations. |
| **Discover & Join** | Every ecosystem on the network. You join one from a schema's participant tree. See [Join an ecosystem](./35-join-an-ecosystem.md). |
| **Pending Tasks** | Applications waiting for your validation and proposals waiting for your vote. The badge counts both. See [Validate applicants](./40-validate-applicants.md). |
| **Settings** | Language, theme and the endpoints the frontend uses. |

<Screenshot name="tour/dashboard" alt="The dashboard of a corporation operator" />

The **Agents** page lists the agents behind your corporation and the ecosystems they are accredited in, with their DID and Proof-of-Trust.

<Screenshot name="tour/agents" alt="The Agents page" />

Every action button carries a small icon that says how it will run: a lightning bolt when you hold an operator authorization and the transaction executes at once, a gavel when it opens a governance proposal for the members to vote. Before anything is signed, a confirmation dialog shows the message, the network fee, who pays it and any deposit or fee it moves. See [Operators, proposals and fee grants](./11-operators-proposals.md).

## Settings

**Settings** sets the language (English or Spanish) and the theme (system, light or dark), and shows the chain and the endpoints this frontend talks to, the graph included. The footer shows the versions of the network, the indexer, the graph and the frontend, each with its state: synced, syncing, indexing, stalled, down or unreachable.

<Screenshot name="tour/settings" alt="The Settings page" />

## Next

- [Create a corporation](./10-create-corporation.md).
- Joining someone else's ecosystem instead? [Join an ecosystem](./35-join-an-ecosystem.md).
- Specification: Frontend v4, `VFE-WALLET`, `VFE-PAGE-ACCT`, `VFE-CORP-SEL`, `VFE-PAGE-NAV`, `VFE-PAGE-SET`.

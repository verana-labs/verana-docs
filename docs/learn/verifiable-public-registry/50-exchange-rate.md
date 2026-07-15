# Exchange Rate & Trust Units

## Why trust units?

Trust fees — validation fees, pay-per-issuance, pay-per-verification — are denominated on each credential schema through its `pricing_asset_type`. One of the available options is the **trust unit (TU)**.

A **trust unit** is a *fake denom*: it cannot be transferred or used to pay for transactions directly. It exists only to **define fees in a value-stable way**. Because the native token's market value fluctuates, an ecosystem that priced a validation at, say, 1000 units of the native token would see the real cost of onboarding swing with the token price. Denominating the same fee in **1000 TUs** insulates the ecosystem from that volatility: TUs are converted to native denom **at transaction time**, using a live exchange rate.

## Pricing asset types

A credential schema's `pricing_asset_type` selects how its business fees are expressed:

| `pricing_asset_type` | `pricing_asset` example | Meaning |
|---|---|---|
| `TU` | `"tu"` | Trust units — value-stable, converted to native denom via the Exchange Rate oracle at execution time. |
| `COIN` | `"uvna"`, `"ufoo"`, `"ibc/…"` | A token available on the VPR chain; fees are charged directly in that token. |
| `FIAT` | `"USD"`, `"GBP"` | A fiat currency; the chain is used for settlement only and payment happens off-chain. |

Regardless of the chosen `pricing_asset_type`, **trust deposits are always handled in native denom**.

(Spec: `CredentialSchema.pricing_asset_type` / `pricing_asset`, and the `trust unit` terminology.)

## The Exchange Rate oracle

An **`ExchangeRate`** is an on-chain entry representing the rate between two assets — for example `TU → uvna`. It stores:

- the `base_asset` and `quote_asset` (each with its `PricingAssetType`);
- a fixed-point `rate` plus a `rate_scale` (the number of decimal digits scaling `rate`);
- a `validity_duration`, an `updated` timestamp, and an `expires` timestamp;
- a `state` flag (enabled / disabled).

Conversion is done through the **Get Price** query: `quote_amount = floor(base_amount × rate / 10^rate_scale)`, using integer arithmetic and rounding down. **An expired or disabled rate MUST NOT be used** — the conversion fails, which in turn aborts any fee-charging transaction that depends on it.

Because exchange rates feed protocol-level pricing (trust-deposit accounting and fees) consumed across the whole network, an `ExchangeRate` is **owned by network governance, not by any single Corporation**.

## Governance-authorized operators

Prices must be refreshed frequently, but a full governance vote for every update would be impractical. The protocol therefore splits the two concerns:

- **Governance** creates an `ExchangeRate`, sets its state, and grants or revokes authorizations — all through governance proposals (`MOD-XR-MSG-1`, `MOD-XR-MSG-3`, `MOD-XR-MSG-4`, `MOD-XR-MSG-5`).
- A designated **operator**, holding an **`ExchangeRateAuthorization`**, may push fresh values via **Update Exchange Rate** (`MOD-XR-MSG-2`) without a vote — but only within guardrails:
  - an `expiration` after which the authorization is dead;
  - an optional `min_interval` anti-spam guard between successive updates;
  - an optional `max_deviation_bps` circuit breaker — an update whose relative change exceeds the configured basis points is rejected and requires a fresh governance action.

This keeps the oracle both **responsive** (an operator can track the market) and **safe** (governance bounds how far and how fast a single operator can move a rate).

:::info How this connects to the rest of the registry
When a schema prices its fees in TUs, every fee shown in the [Onboarding Participants](./onboarding-participants) and [Credential Monetization](./credential-monetization) pages is a TU amount that is converted to native denom at execution time through this oracle. If the relevant rate is missing or expired, the fee-charging transaction fails rather than charging an unknown amount.
:::

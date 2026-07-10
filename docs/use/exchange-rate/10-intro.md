# Exchange Rate

Make sure you've read [Exchange Rate & Trust Units](../../learn/verifiable-public-registry/exchange-rate) in the Learn section.

The **Exchange Rate** (`xr`) module is the VPR's on-chain **pricing oracle**. It converts fees expressed in **Trust Units (TU)** or **FIAT** into the native on-chain COIN (`uvna`) at the moment a fee is charged, so that value-stable pricing set by ecosystems resolves to a concrete `uvna` amount.

## Why the module exists

Business fees on the VPR — validation/onboarding fees, pay-per-issuance (PPI) and pay-per-verification (PPV) — are defined on each credential schema through its `pricing_asset_type`. One of the choices is the **Trust Unit**, a *value-stable, non-transferable* accounting unit. Because the native token's market value fluctuates, an ecosystem that priced onboarding directly in `uvna` would see the real cost drift with the token price. Denominating the same fee in TU insulates the ecosystem from that volatility — but the chain still has to charge a real token amount when the transaction runs.

The `xr` module closes that gap. It stores **exchange rates** between asset pairs (for example `TU → uvna`) and exposes a [Get Price](./get-price) query that any fee-charging code path calls to convert an amount at execution time.

## Pricing asset types

Assets in the `xr` module are typed with the `PricingAssetType` enum (shared with the `cs` module):

| Enum | Value | `asset` example | Meaning |
|---|---|---|---|
| `TU` | 1 | `"tu"` | Trust Unit — value-stable; converted to COIN via this oracle at execution time. |
| `COIN` | 2 | `"uvna"` | A token available on the VPR chain; charged directly. |
| `FIAT` | 3 | `"USD"` | A fiat currency; the chain is used for settlement only (payment happens off-chain). |

`PRICING_ASSET_TYPE_UNSPECIFIED` (0) is the default/invalid sentinel and is never a valid asset type for a live rate.

:::info CLI enum spelling
On the command line the enum is written in its **lower-case short form** — `tu`, `coin`, `fiat` (and `unspecified`). The upper-case proto names (`TU`) and the integer values (`1`) are **not** accepted by the CLI argument parser. See [Get Price](./get-price) for a worked example.
:::

## How a fee resolves through `get-price`

When a schema prices a fee in TU, the fee amount stored on the schema is a TU quantity. At charge time the protocol calls the [`get-price`](./get-price) query with the schema's TU amount as the `base` and `uvna` as the `quote`, and the returned COIN amount is what is actually debited (and split across beneficiaries / trust deposit). If the relevant rate is **missing, disabled, or expired**, the conversion fails and the fee-charging transaction is aborted rather than charging an unknown amount. This is what ties the `xr` oracle into the [Credential Monetization](../../learn/verifiable-public-registry/credential-monetization) and [pay-per-issuance / verification](../ecosystems/pay-per-issuance-or-verification/how-ppi-and-ppv-work) flows.

Conversion uses integer, round-down arithmetic:

```
quote_amount = floor(base_amount × rate / 10^rate_scale)
```

## An exchange rate entry

Each `ExchangeRate` record holds:

| Field | Description |
|---|---|
| `id` | Auto-increment numeric identifier. |
| `base_asset_type` / `base_asset` | The asset being priced, e.g. `TU` / `"tu"`. |
| `quote_asset_type` / `quote_asset` | The asset it is priced in, e.g. `COIN` / `"uvna"`. |
| `rate` | Fixed-point rate value (a decimal string). |
| `rate_scale` | Number of decimal digits scaling `rate` (divisor is `10^rate_scale`). |
| `validity_duration` | How long a fresh value stays valid before it expires. |
| `expires` | Timestamp after which the rate MUST NOT be used. |
| `state` | `true` = enabled, `false` = disabled. |
| `updated` | Timestamp of the last successful value push. |

## Ownership: governance vs. operators

Because exchange rates feed protocol-level pricing consumed network-wide, an `ExchangeRate` is **owned by network governance, not by any single Corporation**. The module splits the two concerns:

- **Governance** creates a rate, toggles its state, and grants or revokes operator authorizations — all through governance proposals. These messages have **no direct CLI command**; they are submitted with `gov submit-proposal`. See [Manage Exchange Rates](./manage-exchange-rates).
- A designated **operator**, holding an `ExchangeRateAuthorization` granted by governance, pushes fresh values with [`update-exchange-rate`](./manage-exchange-rates#update-an-exchange-rate-operator) — the module's **only** direct CLI transaction — signing with its own key, without a vote, but bounded by optional guardrails (`expiration`, `min_interval` anti-spam, `max_deviation_bps` circuit breaker).

:::info Not the same as `de` operator delegation
The operator authorization here is **specific to the `xr` module** (an `ExchangeRateAuthorization`, granted by governance, keyed by `(xr_id, operator)`). It is unrelated to the Corporation-scoped operator delegation granted through the [Delegation (`de`) module](../ecosystems/delegation/grant-operator-authorization). An `xr` operator signs `update-exchange-rate` directly with its own key.
:::

## In this section

- **[Get Price](./get-price)** — convert an amount between two assets (the query fee code paths use).
- **[List and Get Exchange Rates](./list-and-get-exchange-rates)** — read the rate registry.
- **[Manage Exchange Rates](./manage-exchange-rates)** — governance create / set-state / grant / revoke, plus operator `update-exchange-rate`.

# Exchange Rate Module

The Exchange Rate (`xr`) module is the VPR's on-chain **pricing oracle**. It stores exchange rates between asset pairs — Trust Units (`TU`), native COIN (`uvna`), and FIAT — and converts fee amounts between them at execution time, so that value-stable fees defined on credential schemas resolve to a concrete `uvna` amount when charged. See the [usage guide](../../../use/exchange-rate/intro) and the [Exchange Rate & Trust Units](../../../learn/verifiable-public-registry/exchange-rate) learn page.

Assets are typed with the `PricingAssetType` enum (shared with `cs`): `TU` (1), `COIN` (2), `FIAT` (3), plus the invalid sentinel `PRICING_ASSET_TYPE_UNSPECIFIED` (0). On the CLI the enum is written in **lower-case short form** — `tu`, `coin`, `fiat` — for both positional arguments and `--*-asset-type` flags; the upper-case proto names and integer values are rejected.

Refer to the [Environments section](../environments/10-environments.md) for RPC endpoints, and [set up environment variables](../run-a-node/30-remote-cli.md) for the target network.

## Roles: governance-only vs. operator

The module has six write messages. Their signer is fixed by the proto `(cosmos.msg.v1.signer)` option:

- **Governance-only** (signer `authority` = `x/gov` module account) — `MsgCreateExchangeRate`, `MsgSetExchangeRateState`, `MsgGrantExchangeRateAuthorization`, `MsgRevokeExchangeRateAuthorization`, `MsgUpdateParams`. These have **no autocli command**; submit them with `gov submit-proposal`.
- **Operator** (signer `operator`) — `MsgUpdateExchangeRate`, the **only** message exposed as a `veranad tx xr` subcommand. The operator must first be granted an `ExchangeRateAuthorization` by governance.

:::warning The `xr` tx CLI exposes only one command
`veranad tx xr --help` lists exactly one subcommand: `update-exchange-rate`. The four governance messages and `update-params` are **not** in the CLI (their signer is the gov module account) and must be routed through `veranad tx gov submit-proposal` with a proposal JSON that wraps the `@type` payload. This mirrors the module's design, not a missing feature.
:::

## Transaction Messages

| Spec ID | Message | Signer | CLI command | How to run |
|---|---|---|---|---|
| MOD-XR-MSG-1 | `MsgCreateExchangeRate` | `authority` (gov) | — | `gov submit-proposal` |
| MOD-XR-MSG-2 | `MsgUpdateExchangeRate` | `operator` | `update-exchange-rate [id] [rate]` | `veranad tx xr …` |
| MOD-XR-MSG-3 | `MsgSetExchangeRateState` | `authority` (gov) | — | `gov submit-proposal` |
| MOD-XR-MSG-4 | `MsgGrantExchangeRateAuthorization` | `authority` (gov) | — | `gov submit-proposal` |
| MOD-XR-MSG-5 | `MsgRevokeExchangeRateAuthorization` | `authority` (gov) | — | `gov submit-proposal` |
| — | `MsgUpdateParams` | `authority` (gov) | — | `gov submit-proposal` |

Type URLs are `/verana.xr.v1.Msg<Name>` (e.g. `/verana.xr.v1.MsgCreateExchangeRate`).

### Update Exchange Rate (operator)

The only direct CLI transaction (`MOD-XR-MSG-2`). An operator holding a valid `ExchangeRateAuthorization` pushes a new `rate` for a rate `id`. The signer (`--from`) maps to the message's `operator` field.

```bash
veranad tx xr update-exchange-rate [id] [rate] \
  --from <operator> --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

Example:

```bash
veranad tx xr update-exchange-rate 1 1050000 \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

Guardrails (from the operator's `ExchangeRateAuthorization`): the update is rejected if the authorization is missing/expired, violates `min_interval`, or exceeds `max_deviation_bps`. `MsgUpdateExchangeRate` returns an empty response (`tx.proto`):

```proto
message MsgUpdateExchangeRateResponse {}
```

### Governance messages (proposal JSON)

Resolve the gov authority once, then wrap each message in a `gov submit-proposal` payload:

```bash
GOV_AUTH=$(veranad q auth module-accounts --node $NODE_RPC --output json \
  | jq -r '.accounts[] | select(.value.name=="gov") | .value.address')
```

**Create** (`MOD-XR-MSG-1`) — returns the new `id`:

```json
{
  "@type": "/verana.xr.v1.MsgCreateExchangeRate",
  "authority": "${GOV_AUTH}",
  "base_asset_type": "TU", "base_asset": "tu",
  "quote_asset_type": "COIN", "quote_asset": "uvna",
  "rate": "1000000", "rate_scale": 0,
  "validity_duration": "31536000s", "state": true
}
```

**Set state** (`MOD-XR-MSG-3`) — enable/disable:

```json
{ "@type": "/verana.xr.v1.MsgSetExchangeRateState", "authority": "${GOV_AUTH}", "id": "1", "state": false }
```

**Grant authorization** (`MOD-XR-MSG-4`) — authorize an operator for a rate, keyed by `(xr_id, operator)`:

```json
{
  "@type": "/verana.xr.v1.MsgGrantExchangeRateAuthorization",
  "authority": "${GOV_AUTH}", "xr_id": "1", "operator": "${OPERATOR}",
  "expiration": "2027-01-01T00:00:00Z", "min_interval": "3600s", "max_deviation_bps": 500
}
```

`expiration`, `min_interval`, and `max_deviation_bps` (basis points, `(0, 10000]`) are optional guardrails.

**Revoke authorization** (`MOD-XR-MSG-5`):

```json
{ "@type": "/verana.xr.v1.MsgRevokeExchangeRateAuthorization", "authority": "${GOV_AUTH}", "xr_id": "1", "operator": "${OPERATOR}" }
```

Submit any of the above:

```bash
veranad tx gov submit-proposal proposal.json \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC
```

The full usage guide, including field tables and the shared proposal wrapper, is on the [Manage Exchange Rates](../../../use/exchange-rate/manage-exchange-rates) page.

## Queries

| Spec ID | Command | Signature | Description |
|---|---|---|---|
| MOD-XR-QRY-1 | `get-exchange-rate` | `[id]` (or asset-pair flags) | Get one rate + its operator authorizations |
| MOD-XR-QRY-2 | `list-exchange-rates` | — (optional filters) | List rates |
| MOD-XR-QRY-3 | `get-price` | `[base_asset_type] [base_asset] [quote_asset_type] [quote_asset] [amount]` | Convert an amount between two assets |
| — | `params` | — | Module parameters |

### Get Price (`MOD-XR-QRY-3`)

Converts `amount` of the base asset into the quote asset using `price = floor(amount × rate / 10^rate_scale)`.

```bash
veranad query xr get-price [base_asset_type] [base_asset] [quote_asset_type] [quote_asset] [amount] \
  --node $NODE_RPC --output json
```

Example (captured live against the genesis-seeded `TU → uvna` rate, `rate = 1000000`, `rate_scale = 0`):

```bash
veranad query xr get-price tu tu coin uvna 1 --node $NODE_RPC --output json
```

```json
{
  "price": "1000000"
}
```

`1 TU = 1000000 uvna`; `... uvna 5` returns `"5000000"`. The enum argument must be lower-case (`tu`, not `TU` or `1`), and a `TU` base requires `base_asset == "tu"`. A pair with no rate returns `NotFound`; a disabled/expired rate is treated as unusable.

### Get / List Exchange Rates (`MOD-XR-QRY-1`, `MOD-XR-QRY-2`)

```bash
veranad query xr get-exchange-rate 1 --node $NODE_RPC --output json
veranad query xr list-exchange-rates --node $NODE_RPC --output json
```

:::info CLI renders these records with fields omitted
Against the seeded rate, both `get-exchange-rate` and `list-exchange-rates` currently print the entry with **every field omitted** (a client-side encoding quirk, in both `-o json` and `-o text`):

```json
{ "exchange_rate": {} }
```
```json
{ "exchange_rates": [ {} ] }
```

The record is intact — the REST / gRPC-gateway endpoint shows it in full (captured live from `GET /verana/xr/v1/get?id=1`):

```json
{
  "exchange_rate": {
    "id": "1", "base_asset_type": "TU", "base_asset": "tu",
    "quote_asset_type": "COIN", "quote_asset": "uvna",
    "rate": "1000000", "rate_scale": 0,
    "validity_duration": "31536000s", "expires": "2100-01-01T00:00:00Z",
    "state": true, "updated": "2024-01-01T00:00:00Z"
  },
  "authorizations": []
}
```

Use `get-price` or the REST endpoint when you need the actual stored values.
:::

`get-exchange-rate` also accepts an asset pair instead of `[id]` (all four flags required): `--base-asset-type`, `--base-asset`, `--quote-asset-type`, `--quote-asset`; both queries accept `--state` (`active`/`inactive`) and an expiry timestamp filter. `list-exchange-rates` additionally accepts `--response-max-size` (default 64, max 1024).

Response shapes (`query.proto`):

```proto
message QueryGetExchangeRateResponse {
  ExchangeRate exchange_rate = 1;
  repeated ExchangeRateAuthorization authorizations = 2; // MOD-XR-QRY-1
}
message QueryListExchangeRatesResponse { repeated ExchangeRate exchange_rates = 1; }
```

### Module Parameters

```bash
veranad query xr params --node $NODE_RPC --output json
```

```json
{
  "params": {
    "max_validity_duration": "8760h0m0s"
  }
}
```

`max_validity_duration` (here 365 days; `31536000s` over REST) caps the `validity_duration` allowed when a rate is created or updated. It is changed only via a governance `MsgUpdateParams` proposal.

# List and Get Exchange Rates

`MOD-XR-QRY-1` · `MOD-XR-QRY-2`

Two read-only queries expose the rate registry: `get-exchange-rate` returns one entry (and its operator authorizations), and `list-exchange-rates` returns many with optional filters. Neither requires a signer, corporation, or fee.

## Get an exchange rate

Look up a single rate by numeric `id`, **or** by fully specifying an asset pair (`MOD-XR-QRY-1`). The response also carries the list of operators authorized to update the rate.

### Usage

```bash
veranad query xr get-exchange-rate [id] \
  --node <rpc-endpoint> --output json
```

Instead of the `[id]` positional you may identify the rate by asset pair with flags — **all four** are required together:

```bash
veranad query xr get-exchange-rate \
  --base-asset-type tu --base-asset tu \
  --quote-asset-type coin --quote-asset uvna \
  --node <rpc-endpoint> --output json
```

Optional filters: `--state` (`unspecified | active | inactive`) and `--expire-ts` (RFC 3339). Enum flags use the same lower-case short form as elsewhere (`tu`, `coin`, `fiat`).

Omitting both the `id` and a complete asset pair is an error (captured live):

```
rpc error: code = InvalidArgument desc = must provide id or all of base_asset_type, base_asset, quote_asset_type, quote_asset: invalid request
```

A non-existent id returns `NotFound`:

```
rpc error: code = NotFound desc = exchange rate not found: key not found
```

### A note on the CLI output (sparse JSON)

Against the genesis-seeded rate, the CLI currently renders the record with **every field omitted** — both `-o json` and `-o text`:

```bash
veranad query xr get-exchange-rate 1 --node $NODE_RPC --output json
```

```json
{
  "exchange_rate": {}
}
```

This is a **client-side encoding quirk**, not an empty record. The same entry retrieved over the REST / gRPC-gateway endpoint shows every field populated (captured live):

```bash
curl -s "$NODE_REST/verana/xr/v1/get?id=1"
```

```json
{
  "exchange_rate": {
    "id": "1",
    "base_asset_type": "TU",
    "base_asset": "tu",
    "quote_asset_type": "COIN",
    "quote_asset": "uvna",
    "rate": "1000000",
    "rate_scale": 0,
    "validity_duration": "31536000s",
    "expires": "2100-01-01T00:00:00Z",
    "state": true,
    "updated": "2024-01-01T00:00:00Z"
  },
  "authorizations": []
}
```

`authorizations` lists the `ExchangeRateAuthorization` entries (empty here — no operator has been granted for the seeded rate). Prefer the REST endpoint (or `get-price`, which computes correctly regardless of the CLI display quirk) when you need to read the actual stored values.

### Response shape

```proto
// QueryGetExchangeRateResponse is the response type for Query/GetExchangeRate.
message QueryGetExchangeRateResponse {
  ExchangeRate exchange_rate = 1;
  repeated ExchangeRateAuthorization authorizations = 2; // MOD-XR-QRY-1
}
```

## List exchange rates

List rates with optional filters (`MOD-XR-QRY-2`).

### Usage

```bash
veranad query xr list-exchange-rates \
  --node <rpc-endpoint> --output json
```

Optional filters (all may be combined):

| Flag | Meaning |
|---|---|
| `--base-asset-type` / `--base-asset` | Filter by base asset (`tu`, `coin`, `fiat` + asset string). |
| `--quote-asset-type` / `--quote-asset` | Filter by quote asset. |
| `--state` | `unspecified` \| `active` \| `inactive`. |
| `--expire` | RFC 3339 timestamp filter. |
| `--response-max-size` | Cap the number of returned entries (default 64, max 1024). |

### Example (captured live)

The seeded chain has one rate. As with `get-exchange-rate`, the CLI prints the entry with fields omitted:

```bash
veranad query xr list-exchange-rates --node $NODE_RPC --output json
```

```json
{
  "exchange_rates": [
    {}
  ]
}
```

The single `{}` is the seeded `TU → uvna` rate; the REST endpoint shows it in full:

```bash
curl -s "$NODE_REST/verana/xr/v1/list"
```

```json
{
  "exchange_rates": [
    {
      "id": "1",
      "base_asset_type": "TU",
      "base_asset": "tu",
      "quote_asset_type": "COIN",
      "quote_asset": "uvna",
      "rate": "1000000",
      "rate_scale": 0,
      "validity_duration": "31536000s",
      "expires": "2100-01-01T00:00:00Z",
      "state": true,
      "updated": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Response shape

```proto
// QueryListExchangeRatesResponse is the response type for Query/ListExchangeRates.
message QueryListExchangeRatesResponse {
  repeated ExchangeRate exchange_rates = 1;
}
```

## Module parameters

The `xr` module exposes a single parameter, `max_validity_duration` — the maximum `validity_duration` a rate may be created or updated with.

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

(`8760h` = 365 days; the REST endpoint renders the same value as `31536000s`.)

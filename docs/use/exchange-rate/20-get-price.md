# Get Price

`MOD-XR-QRY-3`

`get-price` converts an `amount` of one asset into another using a stored, **active, non-expired** exchange rate. This is the read path the protocol's fee logic uses to turn a TU-denominated fee into a concrete `uvna` amount. It is a read-only query — no signer, corporation, or fee is required.

## Conversion formula

```
price = floor(amount × rate / 10^rate_scale)
```

`amount` is expressed in the **base** asset's units; the returned `price` is expressed in the **quote** asset's smallest denomination.

## Usage

```bash
veranad query xr get-price [base_asset_type] [base_asset] [quote_asset_type] [quote_asset] [amount] \
  --node <rpc-endpoint> --output json
```

The five positional arguments are all mandatory.

:::warning Enum argument spelling matters
`base_asset_type` and `quote_asset_type` must be the **lower-case short enum form**: `tu`, `coin`, or `fiat`. The upper-case proto name (`TU`) and the integer value (`1`) are rejected by the CLI parser:

```
invalid argument "TU" for "--0" flag: TU is not a valid value for enum verana.cs.v1.PricingAssetType
```

For a `TU` base, the `base_asset` string must be `"tu"` (the module enforces `base_asset == "tu"` when the type is `TU`); for a `COIN` quote, the asset is the denom, e.g. `"uvna"`.
:::

## Example (captured live)

Converting **1 TU → uvna** against the genesis-seeded `TU → uvna` rate (id `1`, `rate = 1000000`, `rate_scale = 0`):

```bash
veranad query xr get-price tu tu coin uvna 1 --node $NODE_RPC --output json
```

```json
{
  "price": "1000000"
}
```

So `1 TU = 1000000 uvna`. Scaling the amount scales the result linearly — `... coin uvna 5` returns `"5000000"`. With `rate_scale = 0` the formula is `1 × 1000000 / 10^0 = 1000000`.

## Errors

Querying a pair that has no rate returns `NotFound` (captured live — only the `TU → uvna` direction is seeded, so the reverse fails):

```bash
veranad query xr get-price coin uvna tu tu 1000000 --node $NODE_RPC --output json
```

```
rpc error: code = NotFound desc = exchange rate not found: key not found
```

Passing a `base_asset` inconsistent with its type is an `InvalidArgument` (captured live):

```
rpc error: code = InvalidArgument desc = base_asset must equal "tu" when base_asset_type is TRUST_UNIT: invalid request
```

A rate that exists but is **disabled** (`state = false`) or **expired** (past its `expires` timestamp) is treated as unusable and the conversion fails — which is what aborts any fee-charging transaction that depends on it.

## Response shape

`get-price` returns a single string field (from `query.proto`):

```proto
// QueryGetPriceResponse is the response type for Query/GetPrice.
message QueryGetPriceResponse {
  string price = 1;
}
```

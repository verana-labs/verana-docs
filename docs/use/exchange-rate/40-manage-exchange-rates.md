# Manage Exchange Rates

`MOD-XR-MSG-1` · `MOD-XR-MSG-2` · `MOD-XR-MSG-3` · `MOD-XR-MSG-4` · `MOD-XR-MSG-5`

Writing to the `xr` module is split across **two roles** (see [Ownership](./intro#ownership-governance-vs-operators)):

- **Governance** creates a rate, toggles its state, and grants/revokes operator authorizations. These four messages are signed by the `authority` (the `x/gov` module account) and have **no direct CLI command** — they are submitted with `gov submit-proposal`.
- An authorized **operator** pushes fresh values with `update-exchange-rate` — the module's **only** direct CLI transaction — signing with its own key.

| Spec ID | Message | Signer | How to run |
|---|---|---|---|
| `MOD-XR-MSG-1` | `MsgCreateExchangeRate` | `authority` (gov) | governance proposal |
| `MOD-XR-MSG-2` | `MsgUpdateExchangeRate` | `operator` | `veranad tx xr update-exchange-rate` |
| `MOD-XR-MSG-3` | `MsgSetExchangeRateState` | `authority` (gov) | governance proposal |
| `MOD-XR-MSG-4` | `MsgGrantExchangeRateAuthorization` | `authority` (gov) | governance proposal |
| `MOD-XR-MSG-5` | `MsgRevokeExchangeRateAuthorization` | `authority` (gov) | governance proposal |

---

## Update an exchange rate (Operator) {#update-an-exchange-rate-operator}

`MOD-XR-MSG-2` — the only `xr` transaction with a direct CLI command. It lets an operator that holds a valid `ExchangeRateAuthorization` push a new `rate` value for a given rate `id`, without a governance vote.

:::warning Prerequisites
The signer must hold an active `ExchangeRateAuthorization` for the target rate `id`, **granted by governance** via [Grant Exchange Rate Authorization](#grant-exchange-rate-authorization-governance). This is **not** the Corporation/`de` operator delegation — the operator signs directly with its own key. The update is rejected if the authorization is missing/expired, if it violates the `min_interval` anti-spam window, or if the relative change exceeds the `max_deviation_bps` circuit breaker.
:::

### Usage

```bash
veranad tx xr update-exchange-rate [id] [rate] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees 750000uvna --gas auto --node <rpc-endpoint>
```

The `operator` signer is taken from `--from` (it maps to the message's `operator` field). `id` is the numeric rate to update; `rate` is the new fixed-point rate value.

### Example

```bash
veranad tx xr update-exchange-rate 1 1050000 \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

`MsgUpdateExchangeRate` returns an empty response — success is signalled by `code: 0`, and the new value is read back with [`get-exchange-rate`](./list-and-get-exchange-rates) / [`get-price`](./get-price). The response shape (from `tx.proto`) is:

```proto
// MsgUpdateExchangeRateResponse defines the response for MsgUpdateExchangeRate.
message MsgUpdateExchangeRateResponse {}
```

---

## Governance operations

The remaining four messages are executed by the `x/gov` module account. Each is wrapped in a proposal message and submitted with `gov submit-proposal`; the flow below is identical for all four — only the `messages[0]` payload changes.

### Shared proposal flow

```bash
# 1. Resolve the governance authority address (the message signer):
GOV_AUTH=$(veranad q auth module-accounts --node $NODE_RPC --output json \
  | jq -r '.accounts[] | select(.value.name=="gov") | .value.address')

# 2. Write proposal.json (see each message below for the messages[0] payload).

# 3. Submit:
veranad tx gov submit-proposal proposal.json \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID \
  --fees 750000uvna --gas auto --node $NODE_RPC

# 4. Vote once it is live:
veranad tx gov vote <proposal-id> yes \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID \
  --fees 650000uvna --gas auto --node $NODE_RPC
```

Every proposal JSON wraps its message like this (only `messages` differs per operation):

```json
{
  "messages": [ /* one xr message, see below */ ],
  "metadata": "ipfs://CID",
  "deposit": "10000000uvna",
  "title": "…",
  "summary": "…",
  "expedited": false
}
```

### Create an exchange rate (Governance)

`MOD-XR-MSG-1` — `/verana.xr.v1.MsgCreateExchangeRate`. Creates a new rate entry and returns its auto-assigned `id`.

```json
{
  "@type": "/verana.xr.v1.MsgCreateExchangeRate",
  "authority": "${GOV_AUTH}",
  "base_asset_type": "TU",
  "base_asset": "tu",
  "quote_asset_type": "COIN",
  "quote_asset": "uvna",
  "rate": "1000000",
  "rate_scale": 0,
  "validity_duration": "31536000s",
  "state": true
}
```

| Field | Description | Mandatory |
|---|---|---|
| `authority` | Governance module address (the signer). | yes |
| `base_asset_type` / `base_asset` | Asset being priced (e.g. `TU` / `"tu"`). | yes |
| `quote_asset_type` / `quote_asset` | Asset it is priced in (e.g. `COIN` / `"uvna"`). | yes |
| `rate` | Fixed-point rate value (decimal string). | yes |
| `rate_scale` | Decimal scale; divisor is `10^rate_scale`. | yes |
| `validity_duration` | How long a value stays valid; must be ≤ `params.max_validity_duration`. | yes |
| `state` | `true` = enabled on creation. | yes |

Response (`tx.proto`): `MsgCreateExchangeRateResponse { uint64 id = 1; }` — the new rate's numeric id.

### Set exchange rate state (Governance)

`MOD-XR-MSG-3` — `/verana.xr.v1.MsgSetExchangeRateState`. Enables or disables an existing rate. A disabled rate cannot be used by `get-price`.

```json
{
  "@type": "/verana.xr.v1.MsgSetExchangeRateState",
  "authority": "${GOV_AUTH}",
  "id": "1",
  "state": false
}
```

| Field | Description | Mandatory |
|---|---|---|
| `authority` | Governance module address. | yes |
| `id` | Numeric rate to toggle. | yes |
| `state` | `true` = enable, `false` = disable. | yes |

Returns an empty `MsgSetExchangeRateStateResponse`.

### Grant exchange rate authorization (Governance) {#grant-exchange-rate-authorization-governance}

`MOD-XR-MSG-4` — `/verana.xr.v1.MsgGrantExchangeRateAuthorization`. Authorizes an `operator` to push values for a rate via `update-exchange-rate`, with optional guardrails. Keyed by `(xr_id, operator)`.

```json
{
  "@type": "/verana.xr.v1.MsgGrantExchangeRateAuthorization",
  "authority": "${GOV_AUTH}",
  "xr_id": "1",
  "operator": "${OPERATOR}",
  "expiration": "2027-01-01T00:00:00Z",
  "min_interval": "3600s",
  "max_deviation_bps": 500
}
```

| Field | Description | Mandatory |
|---|---|---|
| `authority` | Governance module address. | yes |
| `xr_id` | Rate the operator may update. | yes |
| `operator` | Account authorized to push values. | yes |
| `expiration` | When the authorization expires (must be in the future). | optional |
| `min_interval` | Minimum time between successful updates (anti-spam). | optional |
| `max_deviation_bps` | Max allowed relative change per update, in basis points, `(0, 10000]` (circuit breaker). | optional |

Returns an empty `MsgGrantExchangeRateAuthorizationResponse`. After it passes, the granted operator can run [`update-exchange-rate`](#update-an-exchange-rate-operator); the authorization then appears in the `authorizations` array of [`get-exchange-rate`](./list-and-get-exchange-rates).

### Revoke exchange rate authorization (Governance)

`MOD-XR-MSG-5` — `/verana.xr.v1.MsgRevokeExchangeRateAuthorization`. Removes an operator's authorization for a rate.

```json
{
  "@type": "/verana.xr.v1.MsgRevokeExchangeRateAuthorization",
  "authority": "${GOV_AUTH}",
  "xr_id": "1",
  "operator": "${OPERATOR}"
}
```

| Field | Description | Mandatory |
|---|---|---|
| `authority` | Governance module address. | yes |
| `xr_id` | Rate the authorization is for. | yes |
| `operator` | Account whose authorization is revoked. | yes |

Returns an empty `MsgRevokeExchangeRateAuthorizationResponse`.

:::info Module parameters are also governance-only
`max_validity_duration` is changed with `/verana.xr.v1.MsgUpdateParams` (signer `authority`), submitted through the same proposal flow. It has no direct CLI command; read the current value with [`veranad query xr params`](./list-and-get-exchange-rates#module-parameters).
:::

---
title: Faucet API
description: "The faucet service routes, the challenge and token exchange, quotas and error codes."
---

# Faucet API

Base path `/v1`. Bodies are JSON; amounts are base-denom integers as strings (1 VNA is 1 000 000 uvna). Source: Faucet v4 specification and the [verana-faucet](https://github.com/verana-labs/verana-faucet) README.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/v1/info` | none | Chain id, faucet address and balance, limits, default amount, global remaining, availability, auth parameters |
| `POST` | `/v1/auth/challenge` | none | `{ account }` returns `{ nonce, expiresAt }` |
| `POST` | `/v1/auth/token` | none | `{ account, pubKey, signature, nonce }` returns `{ token, expiresAt, account }`; the signature is over `verana-faucet-auth:<nonce>` (ADR-036) |
| `GET` | `/v1/quota` | bearer | Hour, day and global windows for the token's account, `nextAmount` |
| `POST` | `/v1/faucet` | bearer | `{ amount? }` sends to the token's account; `200` confirmed with `txHash`, `height`, `amount`, `quota`; `202` when inclusion is still pending |
| `GET` | `/health`, `/metrics` | none | Liveness; Prometheus |

Errors use one envelope `{ "error": { "code", "message", "details" } }`:

| Code | Status | Meaning |
|---|---|---|
| `INVALID_REQUEST`, `INVALID_ACCOUNT` | 400 | Malformed body or address |
| `AUTH_FAILED`, `UNAUTHORIZED` | 401 | Challenge verification failed; token missing or expired |
| `RATE_LIMITED` | 429 | Per-IP budget exceeded, `Retry-After` set |
| `QUOTA_EXCEEDED` | 429 | Per-account or global quota; `details.window` names the binding window |
| `TX_FAILED`, `NODE_ERROR` | 502 | Transaction failed on chain; node error |
| `FAUCET_UNAVAILABLE` | 503 | Low balance or node unreachable |

The public testnet faucet is listed on [Environments and endpoints](../build/run-infrastructure/environments/10-environments.md).

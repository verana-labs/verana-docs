---
title: Run the faucet
description: "The faucet service for a test network: a funded account, chain-derived quotas, no database."
sidebar_position: 23
persona: operator
surface: docker
verified_on: pending (testnet v4)
---

# Run the faucet

The faucet dispenses test coins to accounts that prove control of their key: the requester signs a challenge with the wallet key of the account to fund, exchanges it for a short-lived token, and asks for coins. Quotas are derived from the chain's own transaction index, so the service keeps no database. The frontend's **Get VNA** action calls it.

## Configuration

| Variable | Required | Meaning |
|---|---|---|
| `CHAIN_ID` | yes | Checked against both endpoints at start |
| `RPC_ENDPOINT`, `API_ENDPOINT` | yes | A node with the transaction indexer enabled |
| `FAUCET_MNEMONIC` | yes | The funded faucet account; secret |
| `DEFAULT_AMOUNT`, `MAX_AMOUNT_PER_HOUR`, `MAX_AMOUNT_PER_DAY`, `MAX_GLOBAL_AMOUNT_PER_DAY`, `MIN_BALANCE` | no | Base-denom integers; defaults 10, 50, 300, 5000 and 100 VNA |
| `CORS_ORIGINS` | for browsers | The frontend's origin |
| `RATE_LIMIT_PER_MINUTE`, `TRUST_PROXY` | no | Per-IP budget; read the client IP from the proxy header |

```bash
docker run -d -p 3000:3000 --env-file .env veranalabs/verana-faucet:<version>
curl -s http://localhost:3000/v1/info | jq '{chainId, faucetAddress, available, defaultAmount}'
```

One instance per faucet account: dispenses are serialised and the quota overlay is in memory.

## Next

- Reference: [Faucet API](../../reference/faucet-api.md). Specification: Faucet v4.

# Sentry Architecture and Connectivity (Testnet)

This guide is for partners who want to run their own validator (optionally with their own sentries) and connect safely to Verana testnet.

## Why sentries
- Protect your validator from DDoS by keeping it off the public internet.
- Control and limit inbound peers to a known, trusted set.
- Keep RPC/API usage on public endpoints or your own sentries instead of validator hosts.

## Recommended patterns

## Verana testnet sentry peers (P2P)
Use these peer IDs when connecting to Verana sentries:
- `ecc3e46c37da5bc4c8a1e691dbb8237844a7ea38@sentry1.testnet.verana.network:26656`
- `0db8a040a40d9eaacce8f1a030bfd19b50cbf761@sentry2.testnet.verana.network:26656`
- `a15f404f7a5c4bae791f75886cad45001957c6c3@sentry3.testnet.verana.network:26656`

### Pattern A: Validator only (no partner sentries)
Your validator connects directly to Verana sentries for P2P.

**Validator P2P settings**
```toml
[p2p]
pex = false
persistent_peers = "<verana-sentry-peers>"
```

**How to get Verana sentry peers**
```bash
curl -s https://utc-public-bucket.s3.bhs.io.cloud.ovh.net/vna-testnet-1/persistent_peers/sentry_peers.json \
  | jq -r '.persistent_peers' \
  | tr ',' '\n' \
  | grep -E 'sentry[123]\\.testnet\\.verana\\.network:26656' \
  | paste -sd ',' -
```

Use the output as `persistent_peers`. Keep `pex = false` on validators.

### Pattern B: Validator + partner sentries (recommended)
Your validator peers only with your own sentries. Your sentries peer with Verana sentries.

**Validator P2P settings**
```toml
[p2p]
pex = false
persistent_peers = "<your-sentry-peers>"
```

**Sentry P2P settings**
```toml
[p2p]
pex = true
persistent_peers = "<verana-sentry-peers>"
```

Use the same Verana sentry peer list command above to populate `<verana-sentry-peers>`.

## RPC/API usage for client apps
- **Preferred (canonical):**
  - `https://rpc.testnet.verana.network`
  - `https://api.testnet.verana.network`
- **Sentry pool (fallback):**
  - `https://rpc-test.testnet.verana.network`
  - `https://api-test.testnet.verana.network`

The canonical endpoints are intended for bootstrap and public testing. They may be traffic-shaped to protect network stability. For long-term production-like usage, partners are encouraged to run their own full stack (validator + sentries + client apps like visualizer/resolver/front-end).

## Operational checklist
1. Fetch `persistent_peers` from S3 and prefer Verana sentry hostnames for P2P.
2. Keep validators off public RPC/API; expose RPC/API only via sentries or your own stack.
3. Use canonical RPC/API endpoints for client apps until your own stack is available.

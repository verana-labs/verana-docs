

# Verana Devnet

**Chain ID:** `vna-devnet-1`  
**Status:** Live  
**Token:** VNA

## Endpoints

| Endpoint Type | URL(s) |
|---------------|--------|
| **RPC** | https://rpc.devnet.verana.network |
| **REST API** | https://api.devnet.verana.network |
| **Indexer** | https://idx.devnet.verana.network |
| **Trust graph** | https://graph.devnet.verana.network |
| **Search** | https://search.devnet.verana.network |
| **Faucet** | https://faucet.devnet.verana.network |
| **ECS ecosystem DID** | `did:web:ecs-ecosystem.devnet.verana.network` |
| **Explorer** | https://explorer.devnet.verana.network |
| **Frontend** | https://app.devnet.verana.network |

## Consensus Parameters

| Parameter | Value |
|-----------|-------|
| Average Block Time | ~5 seconds |
| Max Block Size | 22,020,096 bytes |
| Max Gas Per Block | Unlimited (-1) |

## Economic Parameters

| Parameter | Value |
|-----------|-------|
| Current Inflation Rate | 13% |
| Min Inflation Rate | 7% |
| Max Inflation Rate | 20% |
| Rate Change | 13% |
| Goal Bonded | 67% |
| Blocks Per Year | 6,311,520 |

## Staking Parameters

| Parameter | Value |
|-----------|-------|
| Bond Denom | uvna (micro-VNA) |
| Unbonding Time | 21 days (1,814,400s) |
| Min Commission Rate | 0% |
| Max Validators | 100 |

## Distribution Parameters

| Parameter | Value |
|-----------|-------|
| Community Tax | 2% |
| Base Proposer Reward | 0% |
| Bonus Proposer Reward | 0% |

## Governance Parameters

| Parameter | Value |
|-----------|-------|
| Min Deposit | 10,000,000 uvna |
| Expedited Min Deposit | 50,000,000 uvna |
| Voting Period | 1209600s (14 days) |
| Expedited Voting Period | 24 hours (86400s) |
| Deposit Period | 259200s (3 days) |
| Quorum | 33.4% |
| Threshold | 50% |
| Veto Threshold | 33.4% |
| Min Deposit Ratio | 1% |

## Slashing Parameters

| Parameter | Value |
|-----------|-------|
| Signed Blocks Window | 100 |
| Min Signed Per Window | 50% |
| Downtime Jail Duration | 10 minutes (600s) |
| Double Sign Slash | 5% |
| Downtime Slash | 1% |

## Registry parameters

Read from the indexer: `/v4/trust-deposit/params`, `/v4/credential-schema/params`, `/v4/participant/params` on `https://idx.devnet.verana.network`. Devnet runs v4 and is reset without notice.

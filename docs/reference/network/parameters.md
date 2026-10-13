---
title: Network parameters
description: The global parameters of the registry and where to read their live values.
rework: draft
---

# Network parameters

Module parameters are set by governance and read from the indexer or the node. The table names the parameters that matter to users of the network; the live values per environment are read, not copied, because they change by proposal. This page is completed with the testnet values after the v4 upgrade.

| Parameter | Module | Meaning |
|---|---|---|
| `trust_deposit_rate` | td | Share of each trust fee added to the payer's trust deposit (5% at the time of writing) |
| `trust_deposit_share_value` | td | Value of one share of the deposit pool, grows with yield |
| `wallet_user_agent_reward_rate`, `user_agent_reward_rate` | td | Share of a fee that rewards the wallet and the user agent in a credential exchange |
| `trust_deposit_max_yield_rate`, `trust_deposit_block_reward_share` | td | Bounds of the yield mechanism (deferred to v5 in the frontend) |
| `credential_schema_schema_max_size` | cs | Maximum size of a JSON schema |
| `*_validation_validity_period_max_days` | cs | Upper bound of each role's validity period |
| `validation_term_requested_timeout_days` | pp | How long a pending onboarding request may stay open |
| `vs_operator_fee_period` | de | Period of the aggregate fee allowance of a VS operator |

Read them:

```bash
# any module: /v4/<module>/params on the indexer
curl -s https://idx.testnet.verana.network/v4/trust-deposit/params | jq
curl -s https://idx.testnet.verana.network/v4/credential-schema/params | jq
curl -s https://idx.testnet.verana.network/v4/participant/params | jq
```

Chain-level parameters (block time, staking, governance quorum, slashing) are on the [environment pages](../../build/run-infrastructure/environments/10-environments.md).

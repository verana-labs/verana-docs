#!/usr/bin/env bash
# Resolves the agent's DID on the testnet indexer and prints the trust verdict.
# Usage: check-trusted.sh <did> [indexer base url]
set -euo pipefail
DID="${1:?did}"
IDX="${2:-https://idx.testnet.verana.network}"
curl -sS -X POST "$IDX/v4/verifiable-trust/resolve" \
  -H 'content-type: application/json' \
  -d "{\"did\":\"$DID\",\"ecsCredentials\":true,\"participations\":{\"states\":[\"ACTIVE\"]}}" \
  | jq '{did, trusted, evaluatedAtTime, expiresAtTime,
         ecs: [.ecsCredentials[]? | {schema: .ecsSchema, name: .credentialSubject.name}],
         accreditations: [.participations[]? | {role, credentialSchemaId, ecosystemId, state}]}'

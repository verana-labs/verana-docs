#!/usr/bin/env bash
# Resolves one DID and fails unless the verdict matches the expectation.
# Usage: resolve.sh <did> <trusted|untrusted> [indexer base url]
set -euo pipefail
DID="${1:?did}"; EXPECT="${2:?trusted|untrusted}"; IDX="${3:-${VERANA_INDEXER:-https://idx.testnet.verana.network}}"
body=$(curl -sS --max-time 30 -X POST "$IDX/v4/verifiable-trust/resolve" -H 'content-type: application/json' \
  -d "{\"did\":\"$DID\",\"ecsCredentials\":true,\"participations\":{\"states\":[\"ACTIVE\"]}}")
trusted=$(echo "$body" | jq -r '.trusted')
case "$EXPECT:$trusted" in
  trusted:true|untrusted:false) echo "ok   $DID trusted=$trusted"; exit 0 ;;
  *) echo "FAIL $DID expected $EXPECT, got trusted=$trusted"; echo "$body" | jq -c '{evaluatedAtTime, expiresAtTime, invalid: [.presentations[]?.invalidCredentialIds[]?]}'; exit 1 ;;
esac

#!/usr/bin/env bash
# Pull the OpenAPI documents the Reference section is generated from.
# Each source is the main branch of its component repository.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p openapi
curl -sfL -o openapi/indexer.json https://raw.githubusercontent.com/verana-labs/verana-indexer/main/docs/api/openapi.json
curl -sfL -o openapi/node.yml   https://raw.githubusercontent.com/verana-labs/verana-node/main/docs/static/openapi.yml
# vs-agent and verana-graph: added when their repositories publish a file (see plan step 2, section 7).
echo "fetched:"; ls -la openapi

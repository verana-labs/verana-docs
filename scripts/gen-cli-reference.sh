#!/usr/bin/env bash
# Generates docs/reference/cli/veranad/<module>.md from the help output of a veranad binary.
# Usage: scripts/gen-cli-reference.sh <path to veranad>
set -euo pipefail
BIN="${1:?path to veranad}"
cd "$(dirname "$0")/.."
OUT=docs/reference/cli/veranad
mkdir -p "$OUT"
VERSION=$("$BIN" version 2>&1 | tail -1)
declare -A NAMES=([co]="Corporation" [ec]="Ecosystem" [gf]="Governance framework" [cs]="Credential schema" [pp]="Participant" [td]="Trust deposit" [de]="Delegation" [di]="Digest" [xr]="Exchange rate")
ORDER=(co ec gf cs pp td de di xr)
subcommands() { "$BIN" "$1" "$2" --help 2>/dev/null | sed -n '/Available Commands/,/^Flags/p' | grep -E '^  [a-z]' | awk '{print $1}'; }
i=0
for m in "${ORDER[@]}"; do
  i=$((i+1)); f="$OUT/$(printf '%02d' $i)-$m.md"
  {
    echo "---"; echo "title: \"${NAMES[$m]} ($m)\""; echo "description: \"veranad tx $m and veranad query $m, from the help output of veranad $VERSION.\""; echo "---"; echo
    echo "# ${NAMES[$m]} module (\`$m\`)"; echo
    echo "Generated from \`veranad --help\` of version \`$VERSION\` by \`scripts/gen-cli-reference.sh\`. Every transaction below executes on behalf of a corporation and is signed by an authorized operator; see the [message catalog](../../network/message-catalog.md) for the signer model and the surface that normally sends each message."; echo
    for kind in tx query; do
      subs=$(subcommands "$kind" "$m" || true)
      [ -z "$subs" ] && continue
      echo "## veranad $kind $m"; echo
      for sc in $subs; do
        echo "### \`$sc\`"; echo; echo '```text'
        "$BIN" "$kind" "$m" "$sc" --help 2>/dev/null | sed -n '1,/^Global Flags/p' | sed '/^Global Flags/d' | sed -e :a -e '/^\n*$/{$d;N;ba' -e '}'
        echo '```'; echo
      done
    done
  } > "$f"
  echo "wrote $f"
done
cat > "$OUT/index.md" <<EOT
---
title: veranad command line
sidebar_position: 0
---

# veranad command line

The command line of the Verana node, one page per registry module, generated from the help output of \`veranad $VERSION\`. In v4 these commands are the reference, not the daily surface: corporations administer through the [Frontend](../../../build/ecosystems/index.md), services act through [VS Agent](../../../build/verifiable-services/index.md), and AI agents through the [MCP server](../../mcp-server.md). Each transaction is signed by an operator and executes on behalf of a corporation; the [message catalog](../../network/message-catalog.md) gives the signer model per message.

Shared flags for every transaction: \`--from <operator key> --chain-id vna-testnet-1 --node https://rpc.testnet.verana.network --gas auto --gas-adjustment 1.5 --fees <amount>uvna\`. Install the binary per [Prerequisites for running a node](../../../build/run-infrastructure/run-a-node/12-prerequisites.md).

| Module | Page |
|---|---|
$(i=0; for m in "${ORDER[@]}"; do i=$((i+1)); echo "| ${NAMES[$m]} | [\`$m\`](./$(printf '%02d' $i)-$m.md) |"; done)
EOT
echo "wrote $OUT/index.md"

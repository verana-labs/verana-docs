# Debugging CLI and Nodes

Key commands for debugging:

### View Logs

Start the node in the foreground; it streams logs to stdout. `veranad start` runs the local node and does not take a `--node` flag:

```bash
veranad start
```

If the node runs under `systemd`, follow its logs with:

```bash
journalctl -u veranad -f
```

### Query Balances

```bash
veranad q bank balances <address> --node $NODE_RPC
```

### Inspect Transactions

```bash
veranad q txs --query "tx.height=57" --node $NODE_RPC
```
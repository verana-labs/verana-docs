# Debugging CLI and Nodes

Key commands for debugging:

### View Logs
```bash
veranad start --node $NODE_RPC
```

### Query Balances

```bash
veranad q bank balances <address> --node $NODE_RPC
```

### Inspect Transactions

```bash
veranad q txs --query "tx.height=57" --node $NODE_RPC
```
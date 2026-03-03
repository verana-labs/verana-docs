# Common Issues and Solutions

- Ensure all required parameters are provided; missing parameters will cause command failures.
- The `--id` or `--trust-registry-id` must correspond to an existing trust registry.
- The `--admin` address must be a valid account address on the chain.
- The `--archive` parameter only accepts `true` or `false`.
- Always confirm you have sufficient balance for transaction fees.
- Use `--yes` to skip confirmation prompts; omit it to review before submitting.
- Network errors or invalid node URLs will cause commands to fail; verify `NODE_RPC`.
- If you encounter permission errors, ensure your account has the necessary privileges for the action.
- For governance framework documents, make sure the digest-sri of EGF documents are properly calculated, else the verana indexer would discard the trust registry.
- Version numbers for ecosystem governance frameworks must be sequential integers (e.g., 1, 2, 3).

For further assistance, refer to the documentation or contact support on discord (see link at the bottom of this page).

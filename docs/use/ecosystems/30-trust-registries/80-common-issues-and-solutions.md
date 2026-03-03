# Common Issues and Solutions

- Ensure all required parameters are provided; missing parameters will cause command failures.
- The trust registry ID must correspond to an existing trust registry.
- The `authority` address must be a valid group account address on the chain that controls the trust registry.
- The operator (specified via `--from`) must be authorized by the authority to execute the transaction. See the [Delegation module](../delegation/grant-operator-authorization) for how to set up operator authorization.
- The `archive` parameter only accepts `true` or `false`.
- Always confirm you have sufficient balance for transaction fees.
- Use `--yes` to skip confirmation prompts; omit it to review before submitting.
- Network errors or invalid node URLs will cause commands to fail; verify `NODE_RPC`.
- If you encounter permission errors, ensure the operator account has the necessary authorization from the authority.
- For governance framework documents, make sure the digest-sri of EGF documents are properly calculated, else the verana indexer would discard the trust registry.
- Version numbers for ecosystem governance frameworks must be sequential integers (e.g., 1, 2, 3).
- A GovernanceFrameworkVersion with `version = active_version + 1` must exist (with a document in the primary language) before calling `increase-active-gf-version`.

For further assistance, refer to the documentation or contact support on discord (see link at the bottom of this page).

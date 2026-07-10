# Common Issues and Solutions

- **`operator authorization not found for this corporation/operator pair`** — the account passed to `--from` has not been granted authorization for this message type on behalf of the `[corporation]`. Grant it via the [Delegation module](../delegation/grant-operator-authorization), allow-listing the exact `Msg` type-URL (e.g. `/verana.ec.v1.MsgCreateEcosystem`).
- **`corporation not registered`** — the address passed as `[corporation]` is not a registered Corporation `policy_address`. Create one first (see [Create a Corporation](../corporation)).
- The `[corporation]` argument is a **positional** value (the Corporation's `policy_address`), not a `--corporation` flag.
- The ecosystem `id` must correspond to an existing ecosystem controlled by the signing corporation.
- **DID consistency** — all ecosystems sharing the same `did` must be controlled by the same Corporation. Creating or rotating to a `did` already held by an ecosystem controlled by a different Corporation is rejected (`MOD-ES-MSG-1-2-1`, `MOD-ES-MSG-2-2-1`).
- `archive` only accepts `true` or `false`, and the message aborts if the ecosystem is already in the requested archive state.
- Governance Framework documents live in the separate [Governance Framework](../governance-framework/list-governance-framework-versions) module (`gf`) — create-ecosystem only seeds version 1.
- Make sure the `doc-digest-sri` of Governance Framework documents is correctly calculated; otherwise the Verana indexer will discard the ecosystem.
- Always confirm the fee payer (the operator or a fee-granter) has sufficient `uvna` balance for transaction fees.
- Network errors or invalid node URLs will cause commands to fail; verify `NODE_RPC`.

For further assistance, refer to the documentation or contact support on Discord (see link at the bottom of this page).

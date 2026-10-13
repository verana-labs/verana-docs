# Examples and nightly checks

Every code sample shown in a guide lives here, in a folder named after the guide id (step 2 of the docs plan, for example `vs-00-quickstart/`). Guides include these files; they never carry hand-typed commands.

`checks/` holds the Verify blocks of the write guides as scripts. A nightly workflow runs them against testnet using:

- a standing VS Agent, `docs-check.testnet.verana.network`, which plays the reader's agent;
- the playground demo cast, which plays the other side (ECS issuer, accredited issuer and verifier);
- a dedicated testnet corporation, "Docs Checks", and one operator account.

Repository secrets and variables used by the checks:

| Name | Kind | Purpose |
|---|---|---|
| `DOCS_CHECK_OPERATOR_MNEMONIC` | secret | Operator account of the Docs Checks corporation; also signs the VS Agent admin challenge |
| `DOCS_CHECK_CORPORATION` | variable | Policy address of the Docs Checks corporation |
| `DOCS_CHECK_AGENT_URL` | variable | Admin API origin of the standing VS Agent |
| `DOCS_CHECK_AGENT_DID` | variable | DID of the standing VS Agent, expected trusted |
| `DEMO_UNTRUSTED_DID` | variable | DID of the playground's untrusted demo service, expected untrusted |
| `VERANA_CHAIN_ID`, `VERANA_RPC`, `VERANA_INDEXER` | variables | Network endpoints |

A failing check marks its guide with a banner until fixed.

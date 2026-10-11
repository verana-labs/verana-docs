# Checks

Scripts the nightly workflow runs against testnet. Each prints one line per check and exits non-zero on failure.

| Script | Guide | What it proves |
|---|---|---|
| `resolve.sh <did> trusted` | VS-00, VS-23 | The standing docs-check agent still resolves as trusted |
| `resolve.sh <did> untrusted` | VS-30 | The playground's untrusted demo service still resolves as untrusted |

Write checks that create state (issue, verify, onboard) are added with the standing agent and the Docs Checks corporation; see `../README.md` for the secrets they need.

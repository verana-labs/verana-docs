# Verana CLI Cheat-Sheet (spec v4)

A single-page command reference for every `veranad` module in the VPR v4 protocol:
**Ecosystem (`ec`)**, **Corporation (`co`)**, **Governance Framework (`gf`)**,
**Credential Schema (`cs`)**, **Participant (`pp`)**, **Delegation (`de`)**,
**Trust Deposit (`td`)**, **Exchange Rate (`xr`)** and **Digest (`di`)**.

Every command below is copied verbatim from `veranad tx <module> <cmd> --help` /
`veranad query <module> <cmd> --help`. Positional arguments are shown in `[brackets]`;
required delegation flags are shown inline.

:::info Replaces the old `tr` reference
The v3 "Trust Registry" module (`tr`) no longer exists. Its responsibilities were split
into **`ec`** (ecosystem lifecycle), **`gf`** (governance-framework documents) and **`co`**
(the owning Corporation). The v3 `perm` module is now **`pp`** (Participant) and
`diddirectory` is now **`di`** (Digest).
:::

## Shared setup

All examples assume the local test chain and the `test` keyring:

```bash
export CHAIN_ID="vna-testnet-1"
export DENOM="uvna"
export FEES="750000uvna"
export NODE_RPC="tcp://localhost:26657"
export KEYRING="test"

# common flag bundle reused throughout this page
COMMON="--chain-id $CHAIN_ID --keyring-backend $KEYRING --fees $FEES --node $NODE_RPC --gas auto --gas-adjustment 1.3 --yes"
```

List / fund keys:

```bash
veranad keys list --keyring-backend test
veranad q bank balances <address> --node $NODE_RPC
```

## Corporation + operator delegation

Almost every transaction in v4 executes **on behalf of a Corporation** — never a bare account.

- A **Corporation** is an `x/group` policy created by `MsgCreateCorporation` (module `co`,
  **no CLI** — see below). Its returned **`policy_address`** is the on-chain identity you pass
  as the corporation argument to the other modules.
- **Delegable** transactions can be signed either by the corporation's `policy_address`
  (via an `x/group` proposal) or by an **operator** the corporation has authorized with
  `veranad tx de grant-operator-authz`. The grant allow-lists the exact `Msg` type-URLs the
  operator may run (see the [Delegation module page](docs/run/network/modules/20-delegation.md)).
- **Governance-only** messages can only be executed by the chain governance account
  (a normal key cannot sign them): every `update-params`, `td slash-trust-deposit`,
  and the `xr` exchange-rate lifecycle. They are marked <sub>**GOV**</sub> below and must be
  submitted as `gov` proposals.

**The corporation argument is spelled differently per module** — always copy the exact form:

| Form | Modules | Example |
|---|---|---|
| `--corporation` flag | `cs`, `de`, `pp` | `... --corporation $CORP` |
| `[corporation]` positional | `ec`, `gf`, `td` | `create-ecosystem $CORP ...` |
| `[authority]` positional | `di` | `store-digest $AUTH ...` |

Example identities used below (journey001):

```bash
export CORP="verana1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsh3z8fv"  # policy_address
export OPERATOR="verana16xkw85ecwlh5pwy0uhutq3y6ddw0ycv4tnl6h6"                    # authorized operator
```

Legend: <sub>**GOV**</sub> = governance-only · <sub>**DELEGABLE**</sub> = runnable by an authorized operator.

---

## `ec` — Ecosystem

Manages the ecosystem lifecycle (formerly the Trust Registry). An ecosystem is created and
governed *on behalf of a Corporation*; its `doc-url` / `doc-digest-sri` seed v1 of the
ecosystem's Governance Framework.

**Transactions** (corporation is the first positional argument):

```bash
# Create — DELEGABLE (/verana.ec.v1.MsgCreateEcosystem)
veranad tx ec create-ecosystem [corporation] [did] [language] [doc-url] [doc-digest-sri] [flags]

# Rotate the ecosystem DID — DELEGABLE (/verana.ec.v1.MsgUpdateEcosystem)
veranad tx ec update-ecosystem [corporation] [id] [did] [flags]

# Archive (true) / unarchive (false) — DELEGABLE (/verana.ec.v1.MsgArchiveEcosystem)
veranad tx ec archive-ecosystem [corporation] [id] [archive] [flags]

# Update module params — GOV
veranad tx ec update-params [flags]
```

Example:

```bash
veranad tx ec create-ecosystem $CORP did:example:acme en \
  https://acme.example/gf sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 \
  --from $OPERATOR $COMMON
```

**Queries:**

```bash
veranad query ec get-ecosystem [id] [flags]          # nested governance-framework data
veranad query ec list-ecosystems [flags]             # --corporation-id, --active-gf-only, --modified-after, --preferred-language, --response-max-size
veranad query ec params [flags]
```

---

## `co` — Corporation

The foundational v4 actor that owns ecosystems, participants and schemas, and holds the
trust deposit. **The `co` module has no CLI** (`veranad tx co` / `veranad query co` are absent).

- Create/update a Corporation by broadcasting a signed tx built from JSON —
  `MsgCreateCorporation` (any signer) and `MsgUpdateCorporation` (delegable,
  `/verana.co.v1.MsgUpdateCorporation`). `MsgUpdateParams` is <sub>**GOV**</sub>.
- Inspect a Corporation through the standard `x/group` queries:

```bash
veranad query group group-policy-info <policy_address> --node $NODE_RPC
veranad query group group-members <group_id> --node $NODE_RPC
```

See the how-to: [Create a Corporation](docs/run/network/modules/12-corporation.md).

---

## `gf` — Governance Framework

Publishes governance-framework documents and activates GF versions for an ecosystem
(or for the corporation's own CGF). Both commands run *on behalf of a Corporation*
and take `[corporation] [operator]` as their first two positional arguments.

**Transactions:**

```bash
# Add a GF document — DELEGABLE (/verana.gf.v1.MsgAddGovernanceFrameworkDocument)
veranad tx gf add-governance-framework-document [corporation] [operator] [doc-language] [doc-url] [doc-digest-sri] [version] [flags]

# Activate the next GF version — DELEGABLE (/verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion)
#   --ecosystem-id <id>  target an Ecosystem; omit to target the Corporation's own CGF
veranad tx gf increase-active-gf-version [corporation] [operator] [flags]
```

**Queries:**

```bash
veranad query gf get-governance-framework-version [id] [flags]
veranad query gf list-governance-framework-versions [flags]
veranad query gf params [flags]
```

---

## `cs` — Credential Schema

Credential schemas and their **Schema Authorization Policies (SAP)**. The corporation is
supplied with the `--corporation` flag.

**Transactions:**

```bash
# Create a credential schema — DELEGABLE (/verana.cs.v1.MsgCreateCredentialSchema)
veranad tx cs create-credential-schema [ecosystem-id] [json-schema] [issuer-mode] [verifier-mode] [holder-onboarding-mode] [pricing-asset-type] [pricing-asset] [digest-algorithm] [flags]

# Update validity periods — DELEGABLE (/verana.cs.v1.MsgUpdateCredentialSchema)
#   --issuer-validation-validity-period / --verifier-... / --holder-... / --issuer-grantor-... / --verifier-grantor-... (days; 0 = never expires)
veranad tx cs update [id] [flags]

# Archive (true) / unarchive (false) — DELEGABLE (/verana.cs.v1.MsgArchiveCredentialSchema)
veranad tx cs archive [id] [archive] [flags]

# Schema Authorization Policy — flags: --corporation --schema-id --role (issuer|verifier) --url --digest-sri
veranad tx cs create-schema-authorization-policy [flags]
veranad tx cs increase-active-schema-authorization-policy-version [flags]   # --corporation --schema-id --role
veranad tx cs revoke-schema-authorization-policy [flags]                    # --corporation --schema-id --role --version
```

Example:

```bash
veranad tx cs create-credential-schema 1 schema.json 2 2 1 tu sha256 \
  --issuer-grantor-validation-validity-period 365 \
  --verifier-grantor-validation-validity-period 365 \
  --corporation $CORP --from $OPERATOR $COMMON
```

:::note SAP messages are not operator-delegable
`create/increase/revoke-schema-authorization-policy` accept `--corporation` but the SAP
message type-URLs are **not** part of the `de` delegable allow-list, so they must be signed
by the corporation's `policy_address` directly (group proposal), not by an operator.
:::

**Queries:**

```bash
veranad query cs get-schema [id] [flags]
veranad query cs list-schemas [flags]              # --ecosystem_id, --modified_after, --response_max_size, --only-active, mode filters
veranad query cs get-sap [id] [flags]
veranad query cs list-sap [schema-id] [role] [flags]
veranad query cs render-json-schema [id] [flags]
veranad query cs params [flags]
```

---

## `pp` — Participant

Participant lifecycle and onboarding processes (OP) — formerly the `perm` module.
The corporation is supplied with the `--corporation` flag; delegable operations run on its behalf.

**Transactions:**

```bash
# Root & self creation
veranad tx pp create-root-participant [schema-id] [did] [validation-fees] [issuance-fees] [verification-fees] [flags]   # --corporation — DELEGABLE
veranad tx pp self-create-participant [role] [validator-participant-id] [did] --corporation [corporation] [flags]        # DELEGABLE

# Onboarding process (OP)
veranad tx pp start-participant-op [role] [validator-participant-id] [did] [flags]      # --corporation — DELEGABLE
veranad tx pp renew-participant-op [id] [flags]                                          # --corporation — DELEGABLE
veranad tx pp set-participant-op-validated [id] [flags]                                  # --corporation — DELEGABLE
veranad tx pp cancel-participant-op-request [id] [flags]                                 # DELEGABLE

# Lifecycle
veranad tx pp set-participant-effective-until [id] [effective-until] [flags]             # DELEGABLE
veranad tx pp revoke-participant [id] [flags]                                            # DELEGABLE
veranad tx pp create-or-update-participant-session [id] [flags]                          # DELEGABLE
veranad tx pp slash-participant-td [id] [amount] [reason] [flags]                        # DELEGABLE
veranad tx pp repay-participant-slashed-td [id] --corporation [corporation] [flags]      # DELEGABLE

# Resolver — runs as an operator on behalf of the corporation
veranad tx pp trigger-resolver [id] --corporation [corporation] --operator [operator] [flags]
```

**Queries:**

```bash
veranad query pp get-participant [id] [flags]
veranad query pp list-participants [flags]                              # --role, --schema-id, --op-state, --did, --only-valid/slashed/repaid, ...
veranad query pp find-participants-with-did [did] [role] [schema-id] [flags]
veranad query pp find-beneficiaries [flags]
veranad query pp get-participant-session [id] [flags]
veranad query pp list-participant-sessions [flags]
veranad query pp params [flags]
```

---

## `de` — Delegation

Grants and revokes operator authorizations that let an operator run delegable messages
on behalf of a Corporation. The corporation is supplied with the `--corporation` flag.
Full reference: [Delegation module](docs/run/network/modules/20-delegation.md).

**Transactions:**

```bash
# Grant — --corporation --msg-types "<url>,<url>" [--with-feegrant --authz-spend-limit ... --expiration ...]
veranad tx de grant-operator-authz [grantee] [flags]

# Revoke — --corporation
veranad tx de revoke-operator-authz [grantee] [flags]
```

**Queries:**

```bash
veranad query de list-operator-authorizations [flags]        # --corporation-id, --operator, --limit
veranad query de list-vs-operator-authorizations [flags]     # --corporation-id, --vs-operator, --limit
veranad query de get-operator-authorization [id] [flags]
veranad query de get-vs-operator-authorization [id] [flags]
veranad query de params [flags]
```

---

## `td` — Trust Deposit

Trust deposits are keyed by numeric `corporation_id`. `reclaim-yield` and `repay-slashed-td`
take `[corporation]` as their first positional argument. There is **no** `reclaim-deposit`
and **no** `update-params` in the `td` CLI.

**Transactions:**

```bash
veranad tx td reclaim-yield [corporation] [flags]                 # reclaim earned interest
veranad tx td repay-slashed-td [corporation] [deposit] [flags]    # deposit must match the outstanding slashed amount
veranad tx td slash-trust-deposit [flags]                         # GOV — --corporation-id --deposit --reason
```

**Queries:**

```bash
veranad query td get-trust-deposit [corporation-id] [flags]
veranad query td params [flags]
```

---

## `xr` — Exchange Rate

New in v4. Resolves Trust Unit (TU) values to `uvna` and other assets. The only CLI
transaction is `update-exchange-rate`, signed by the authorized operator; the exchange-rate
*lifecycle* messages (create / set-state / grant / revoke) are <sub>**GOV**</sub> and are not
exposed as CLI commands.

**Transactions:**

```bash
veranad tx xr update-exchange-rate [id] [rate] [flags]           # signed by the authorized operator
```

**Queries:**

```bash
veranad query xr get-exchange-rate [id] [flags]                 # or --base-asset(-type)/--quote-asset(-type)/--state
veranad query xr get-price [base_asset_type] [base_asset] [quote_asset_type] [quote_asset] [amount] [flags]
veranad query xr list-exchange-rates [flags]
veranad query xr params [flags]
```

---

## `di` — Digest

Content-digest registry (formerly the DID Directory — the DID-lifecycle feature is
**removed**, not renamed). `store-digest` runs *on behalf of a Corporation*, passed as the
`[authority]` positional argument.

**Transactions:**

```bash
veranad tx di store-digest [authority] [digest] [flags]         # signed by an operator on behalf of the authority (corporation)
```

**Queries:**

```bash
veranad query di get-digest [digest] [flags]
veranad query di params [flags]
```

---

## See also

- [Delegation module](docs/run/network/modules/20-delegation.md) — full operator / VS-operator authorization reference.
- [Corporation module](docs/run/network/modules/12-corporation.md) — creating and inspecting Corporations (no CLI).
- [Ecosystem](docs/run/network/modules/10-ecosystem.md) · [Governance Framework](docs/run/network/modules/14-governance-framework.md) · [Credential Schema](docs/run/network/modules/30-credential-schema.md) · [Participant](docs/run/network/modules/40-participant.md) · [Trust Deposit](docs/run/network/modules/15-trust-deposit.md) · [Digest](docs/run/network/modules/50-digest.md)
</content>

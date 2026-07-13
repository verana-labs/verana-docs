# Delegation Module

The Delegation (DE) module manages **operator authorizations** — the mechanism that lets a **Corporation** delegate on-chain transaction execution to one or more **operator** accounts.

In Spec v4, nearly every module operation is **delegable**: it is executed *on behalf of* a Corporation rather than signed directly by an owner key. This applies across the Ecosystem (`ec`), Governance Framework (`gf`), Corporation (`co`), Credential Schema (`cs`), and Participant (`pp`) modules. The pattern is:

- A **Corporation** — an `x/group` policy created via `MsgCreateCorporation` — owns the resources (ecosystems, governance framework documents, credential schemas, participants). Its on-chain identity is its **`policy_address`**, threaded as the `corporation` argument to delegable commands.
- An **operator** (a regular account) submits transactions on behalf of the Corporation.
- The operator must hold an **OperatorAuthorization** granted by the Corporation, allow-listing the exact `Msg` type-URLs it may execute.

:::info Terminology
The v3 docs called the controlling entity the "authority". In v4 this is the **Corporation** (`corporation`), and its owner field on-chain is `corporation`, not `authority`.
:::

## How Delegation Works

1. The Corporation's group members grant an operator authorization by submitting `MsgGrantOperatorAuthorization` **through a group proposal** (the corporation's group policy is the granter). The grant allow-lists specific `Msg` type-URLs — see [Grant Operator Authorization](./grant-operator-authorization).
2. The operator can then execute the allow-listed transactions (create an ecosystem, add a governance framework document, create a credential schema, manage participants, …) on behalf of the Corporation, signing with `--from <operator>` and passing `--corporation <policy_address>`.
3. A grant may include an authz spend limit, an expiration, and an optional fee grant.
4. The Corporation can revoke a grant at any time via [Revoke Operator Authorization](./revoke-operator-authorization).

## Two kinds of authorization

The DE module tracks **two** distinct authorization types:

### Operator Authorizations

General-purpose delegation for the delegable messages of `ec`, `gf`, `co`, `cs`, and `pp`. Granted and revoked explicitly with the `de` transactions above, and queried with `list-operator-authorizations` / `get-operator-authorization`.

### VS Operator Authorizations (VSOA)

A **Verifiable Service (VS) operator** is the account authorized to run a specific Participant's on-chain session activity — creating and updating **participant sessions** for pay-per-issuance / pay-per-verification. VS Operator Authorizations **are implemented** and are central to Participant sessions.

Unlike Operator Authorizations, a VSOA is **not** created with a standalone `de` transaction. It is granted implicitly by the Participant (`pp`) flow: passing the `--vs-operator` and `--vs-operator-authz-msg-types` flags to `create-root-participant`, `self-create-participant`, or `start-participant-op` creates a VSOA record for that participant (spec `MOD-DE-MSG-5/6/9`). The resulting records are then queryable through the DE module with `list-vs-operator-authorizations` / `get-vs-operator-authorization`.

:::info Previously documented as "not implemented"
Earlier docs stated that VS operator authorizations were "not yet implemented". That is no longer correct — the node exposes both `list-vs-operator-authorizations` and `get-vs-operator-authorization`, and the VSOA is what a Participant's session operator relies on. See [List Operator Authorizations](./list-operator-authorizations) for the query commands.
:::

## Available Operations

| Spec ID          | Operation                          | Description                                                          |
|------------------|------------------------------------|---------------------------------------------------------------------|
| MOD-DE-MSG-3     | Grant Operator Authorization       | Allow-list `Msg` type-URLs an operator may execute for a corporation |
| MOD-DE-MSG-4     | Revoke Operator Authorization      | Remove an operator's authorization                                  |
| MOD-DE-MSG-5/6/9 | Grant / update / revoke VSOA       | Managed implicitly via the `pp` participant flow (`--vs-operator*`) |
| MOD-DE-QRY-1     | List Operator Authorizations       | List operator authorizations, optionally filtered                   |
| MOD-DE-QRY-2     | List VS Operator Authorizations    | List VS operator authorizations, optionally filtered                |
| MOD-DE-QRY-3     | Get Operator Authorization         | Fetch a single operator authorization by id                         |
| MOD-DE-QRY-4     | Get VS Operator Authorization      | Fetch a single VS operator authorization by id                      |

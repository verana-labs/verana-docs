# Delegation Module

The Delegation (DE) module manages operator authorizations, allowing group accounts (authorities) to delegate transaction execution to operator accounts.

In Specs v4, all module operations (TR, CS, PERM, etc.) follow a **delegable** pattern where:
- An **authority** (group account) controls the resources (trust registries, credential schemas, permissions, etc.)
- An **operator** (regular account) executes transactions on behalf of the authority
- The operator must have an active **OperatorAuthorization** granted by the authority

## How Delegation Works

1. The authority grants an operator authorization using `grant-operator-authz`
2. The operator can then execute transactions (e.g., create trust registries, manage schemas) on behalf of the authority
3. The authorization can include spend limits, expiration dates, and fee grants
4. The authorization can be revoked at any time using `revoke-operator-authz`

## Available Operations

| Spec ID        | Operation                        | Description                                    |
|----------------|----------------------------------|------------------------------------------------|
| MOD-DE-MSG-3   | Grant Operator Authorization     | Authorize an operator to act on behalf of authority |
| MOD-DE-MSG-4   | Revoke Operator Authorization    | Remove an operator's authorization             |
| MOD-DE-QRY-1   | List Operator Authorizations     | Query existing operator authorizations         |

:::info
Additional DE operations defined in the spec (fee allowances, VS operator authorizations, exchange rate authorizations) are not yet implemented.
:::

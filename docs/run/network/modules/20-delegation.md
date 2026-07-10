# Delegation Module (`de`)

The **Delegation** module (`x/de`, spec `MOD-DE`) records the authorizations that let an
**operator** execute delegable messages *on behalf of a Corporation*. Instead of a
corporation having to sign every transaction through an `x/group` proposal, it grants an
operator a scoped, revocable authorization that names the exact `Msg` type-URLs the operator
may run.

Refer to the [Environments section](../environments/10-environments.md) for RPC endpoints,
and [Remote CLI](../run-a-node/30-remote-cli.md) for setting the `$NODE_RPC` / `$CHAIN_ID`
environment variables used below.

## Two kinds of authorization

| | Operator authorization | VS operator authorization |
|---|---|---|
| Granted by | `MsgGrantOperatorAuthorization` (`grant-operator-authz`) | Created as a side-effect of participant onboarding / session setup |
| Scope | A **Corporation** (`corporation_id`) → one operator | A **participant validation session**: a `vs_operator` plus per-`participant_id` records |
| Allow-list | `msg_types` — corporation-management type-URLs | Session message types (e.g. `/verana.pp.v1.MsgCreateOrUpdateParticipantSession`) |
| Limits | Optional `spend_limit` / `expiration` / `period` | Per-record `spend_limit`, `fee_spend_limit`, `with_feegrant`, `expiration` |
| Queries | `list-operator-authorizations`, `get-operator-authorization` | `list-vs-operator-authorizations`, `get-vs-operator-authorization` |

**Operator authorizations** are the general corporation-scoped grants an ecosystem
administrator hands to a day-to-day operator key (`MOD-DE-MSG-3` grant / `MOD-DE-MSG-4`
revoke). **VS (validation-session) operator authorizations** are narrower,
participant-scoped grants that back the participant session flow; they carry spend and
fee-grant limits per participant and are established, updated and cleared by the
validation-session messages (`MOD-DE-MSG-5`, `MOD-DE-MSG-6`, `MOD-DE-MSG-9`) rather than a
dedicated CLI transaction — inspect them with the `*-vs-operator-authorization` queries below.

## The grant flow (group proposal)

A grant is always made *on behalf of a Corporation*. The signer (`--from`) is the operator on
the group-proposal path — either the corporation's `policy_address`, or an already-authorized
operator (`[MOD-DE-MSG-3]`):

1. Build the `MsgGrantOperatorAuthorization` as a group proposal whose executor is the
   corporation's `policy_address`.
2. The proposal names the `grantee` (the operator account being authorized) and the
   `--msg-types` allow-list.
3. On execution, the module writes an `operator_authorization` entry keyed by
   `corporation_id` + `operator`, optionally with a spend limit and/or fee grant.

## Delegable message type-URLs

Only these `Msg` type-URLs may appear in a grant's `--msg-types` allow-list (the VPR
delegable set). A grant that names any other type-URL is rejected:

```text
/verana.co.v1.MsgUpdateCorporation
/verana.cs.v1.MsgArchiveCredentialSchema
/verana.cs.v1.MsgCreateCredentialSchema
/verana.cs.v1.MsgCreateSchemaAuthorizationPolicy
/verana.cs.v1.MsgIncreaseActiveSchemaAuthorizationPolicyVersion
/verana.cs.v1.MsgRevokeSchemaAuthorizationPolicy
/verana.cs.v1.MsgUpdateCredentialSchema
/verana.de.v1.MsgGrantOperatorAuthorization
/verana.de.v1.MsgRevokeOperatorAuthorization
/verana.di.v1.MsgStoreDigest
/verana.ec.v1.MsgArchiveEcosystem
/verana.ec.v1.MsgCreateEcosystem
/verana.ec.v1.MsgUpdateEcosystem
/verana.gf.v1.MsgAddGovernanceFrameworkDocument
/verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion
/verana.pp.v1.MsgCancelParticipantOPLastRequest
/verana.pp.v1.MsgCreateOrUpdateParticipantSession
/verana.pp.v1.MsgCreateRootParticipant
/verana.pp.v1.MsgRenewParticipantOP
/verana.pp.v1.MsgRepayParticipantSlashedTrustDeposit
/verana.pp.v1.MsgRevokeParticipant
/verana.pp.v1.MsgSelfCreateParticipant
/verana.pp.v1.MsgSetParticipantEffectiveUntil
/verana.pp.v1.MsgSetParticipantOPToValidated
/verana.pp.v1.MsgSlashParticipantTrustDeposit
/verana.pp.v1.MsgStartParticipantOP
/verana.pp.v1.MsgTriggerResolver
/verana.td.v1.MsgReclaimTrustDepositYield
/verana.td.v1.MsgRepaySlashedTrustDeposit
/verana.xr.v1.MsgUpdateExchangeRate
```

:::note
This is the complete delegable set (`x/de` `VPRDelegableMsgTypes`, 30 messages), including the
Schema Authorization Policy messages and `MsgStoreDigest`. Governance-only messages (every
`update-params`, `td slash-trust-deposit`, and the `xr` exchange-rate lifecycle) are **not**
delegable and must go through a governance proposal.
:::

## Transactions

| Spec ID | Command | Description |
|---|---|---|
| `MOD-DE-MSG-3` | `grant-operator-authz [grantee]` | Grant an operator authorization on behalf of a corporation |
| `MOD-DE-MSG-4` | `revoke-operator-authz [grantee]` | Revoke an operator authorization for a corporation/grantee pair |

:::warning Prerequisites
These are **delegable** transactions executed on behalf of a Corporation. Before running one you need:

1. A **Corporation** (`policy_address`) — see [Create a Corporation](../../../use/ecosystems/corporation).
2. The policy funded with `uvna` for fees.
3. A signer (`--from`) that is either the corporation's `policy_address` (group-proposal path) or an operator the corporation has already authorized.

Pass the corporation with the `--corporation` flag.
:::

### Grant Operator Authorization

`[MOD-DE-MSG-3]` — the `grantee` receives authorization to execute the listed message types
on behalf of the corporation. Optionally attaches a fee grant (`--with-feegrant`) and/or an
authz spend limit.

```bash
veranad tx de grant-operator-authz $OPERATOR_ACC \
  --corporation $CORP \
  --msg-types "/verana.ec.v1.MsgCreateEcosystem,/verana.ec.v1.MsgUpdateEcosystem,/verana.ec.v1.MsgArchiveEcosystem,/verana.gf.v1.MsgAddGovernanceFrameworkDocument,/verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion,/verana.co.v1.MsgUpdateCorporation" \
  --with-feegrant \
  --from $CORP --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --node $NODE_RPC --yes
```

Useful optional flags:

- `--authz-spend-limit <coin>` / `--authz-spend-limit-period <duration>` — cap the operator's spend.
- `--expiration <RFC3339>` — set an authorization expiry.
- `--feegrant-spend-limit <coin>` / `--feegrant-spend-limit-period <duration>` — only with `--with-feegrant`.

### Revoke Operator Authorization

`[MOD-DE-MSG-4]` — removes the authorization entry and any associated fee grant for the given
corporation/grantee pair.

```bash
veranad tx de revoke-operator-authz $OPERATOR_ACC \
  --corporation $CORP \
  --from $CORP --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --node $NODE_RPC --yes
```

## Queries

| Spec ID | Command | Description |
|---|---|---|
| `MOD-DE-QRY-1` | `list-operator-authorizations` | List operator authorizations, optionally filtered by corporation / operator |
| `MOD-DE-QRY-2` | `list-vs-operator-authorizations` | List VS operator authorizations, optionally filtered by corporation / vs-operator |
| `MOD-DE-QRY-3` | `get-operator-authorization [id]` | Get a single operator authorization by id |
| `MOD-DE-QRY-4` | `get-vs-operator-authorization [id]` | Get a single VS operator authorization (with its records) by id |
| — | `params` | Module parameters |

### List Operator Authorizations

`[MOD-DE-QRY-1]` — filter with `--corporation-id` and/or `--operator`; `--limit` bounds the
result count (1-1024, default 64).

```bash
veranad query de list-operator-authorizations \
  --corporation-id 1 \
  --node $NODE_RPC --output json
```

```json
{
  "operator_authorizations": [
    {
      "id": "1",
      "corporation_id": "1",
      "operator": "verana16xkw85ecwlh5pwy0uhutq3y6ddw0ycv4tnl6h6",
      "msg_types": [
        "/verana.ec.v1.MsgCreateEcosystem",
        "/verana.ec.v1.MsgUpdateEcosystem",
        "/verana.ec.v1.MsgArchiveEcosystem",
        "/verana.gf.v1.MsgAddGovernanceFrameworkDocument",
        "/verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion",
        "/verana.co.v1.MsgUpdateCorporation"
      ],
      "spend_limit": [],
      "remaining_spend": [],
      "expiration": null,
      "period": null
    }
  ]
}
```

An authorization with a spend limit populates `spend_limit` / `remaining_spend`, e.g. a grant
capped at `100000000uvna` with `86000000uvna` still available:

```json
{
  "id": "5",
  "corporation_id": "6",
  "operator": "verana1aesnnc4fvar4wyaryvj9y4sty9vsw69hgymw7q",
  "msg_types": [
    "/verana.ec.v1.MsgCreateEcosystem",
    "/verana.cs.v1.MsgCreateCredentialSchema",
    "/verana.pp.v1.MsgCreateRootParticipant",
    "/verana.pp.v1.MsgStartParticipantOP",
    "/verana.pp.v1.MsgSetParticipantOPToValidated",
    "/verana.pp.v1.MsgSlashParticipantTrustDeposit",
    "/verana.pp.v1.MsgRepayParticipantSlashedTrustDeposit"
  ],
  "spend_limit": [{ "denom": "uvna", "amount": "100000000" }],
  "remaining_spend": [{ "denom": "uvna", "amount": "86000000" }],
  "expiration": null,
  "period": null
}
```

### Get Operator Authorization

`[MOD-DE-QRY-3]` — look up a single authorization by its numeric `id`.

```bash
veranad query de get-operator-authorization 1 --node $NODE_RPC --output json
```

```json
{
  "operator_authorization": {
    "id": "1",
    "corporation_id": "1",
    "operator": "verana16xkw85ecwlh5pwy0uhutq3y6ddw0ycv4tnl6h6",
    "msg_types": [
      "/verana.ec.v1.MsgCreateEcosystem",
      "/verana.ec.v1.MsgUpdateEcosystem",
      "/verana.ec.v1.MsgArchiveEcosystem",
      "/verana.gf.v1.MsgAddGovernanceFrameworkDocument",
      "/verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion",
      "/verana.co.v1.MsgUpdateCorporation"
    ],
    "spend_limit": [],
    "remaining_spend": [],
    "expiration": null,
    "period": null
  }
}
```

### List VS Operator Authorizations

`[MOD-DE-QRY-2]` — filter with `--corporation-id` and/or `--vs-operator`; `--limit` bounds the
result count. Each authorization holds a list of per-`participant_id` `records`, each with its
own message allow-list, spend limit and optional fee grant.

```bash
veranad query de list-vs-operator-authorizations \
  --corporation-id 6 \
  --node $NODE_RPC --output json
```

```json
{
  "vs_operator_authorizations": [
    {
      "id": "1",
      "corporation_id": "6",
      "vs_operator": "verana16mzeyu9l6kua2cdg9x0jk5g6e7h0kk8q6uadu4",
      "records": [
        {
          "participant_id": "6",
          "msg_types": ["/verana.pp.v1.MsgCreateOrUpdateParticipantSession"],
          "spend_limit": [],
          "remaining_spend": [],
          "fee_spend_limit": [],
          "remaining_fee_spend": [],
          "with_feegrant": false,
          "expiration": "2027-07-10T08:09:18.445255Z",
          "period": null
        },
        {
          "participant_id": "22",
          "msg_types": ["/verana.pp.v1.MsgCreateOrUpdateParticipantSession"],
          "spend_limit": [{ "denom": "uvna", "amount": "1000000000" }],
          "remaining_spend": [{ "denom": "uvna", "amount": "1000000000" }],
          "fee_spend_limit": [{ "denom": "uvna", "amount": "3000000" }],
          "remaining_fee_spend": [{ "denom": "uvna", "amount": "3000000" }],
          "with_feegrant": true,
          "expiration": "2026-07-10T08:20:59.660284Z",
          "period": null
        }
      ]
    }
  ]
}
```

### Get VS Operator Authorization

`[MOD-DE-QRY-4]` — fetch a single VS operator authorization, including all of its records, by id.

```bash
veranad query de get-vs-operator-authorization 1 --node $NODE_RPC --output json
```

### Module Parameters

```bash
veranad query de params --node $NODE_RPC --output json
```

```json
{
  "params": {}
}
```

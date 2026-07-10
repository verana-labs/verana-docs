# List and Get Operator Authorizations

`MOD-DE-QRY-1` · `MOD-DE-QRY-2` · `MOD-DE-QRY-3` · `MOD-DE-QRY-4`

Query the authorizations tracked by the Delegation module. Two families of records exist:

- **Operator authorizations** — general delegation for the delegable messages of `ec`, `gf`, `co`, `cs`, and `pp`.
- **VS operator authorizations (VSOA)** — the per-Participant grants that let a Verifiable Service operator run participant sessions. These are created through the `pp` participant flow (see below).

## Operator Authorizations

### List operator authorizations

`MOD-DE-QRY-1` — list operator authorizations, optionally filtered by the granting corporation and/or the operator that received the grant.

| Flag                | Description                                                    | Mandatory |
|---------------------|----------------------------------------------------------------|-----------|
| `--corporation-id`  | Filter by the corporation id (numeric) that granted the authorization | no |
| `--operator`        | Filter by the operator account that received the authorization | no        |
| `--limit`           | Maximum number of results (1–1024, default 64)                 | no        |

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

#### Usage

```bash
veranad query de list-operator-authorizations \
  [--corporation-id <id>] \
  [--operator <address>] \
  [--limit <n>] \
  --node $NODE_RPC --output json
```

#### Example: all authorizations granted by a corporation

```bash
veranad query de list-operator-authorizations \
  --corporation-id 1 \
  --node $NODE_RPC --output json
```

#### Example: all authorizations received by an operator

```bash
veranad query de list-operator-authorizations \
  --operator verana16xkw85ecwlh5pwy0uhutq3y6ddw0ycv4tnl6h6 \
  --node $NODE_RPC --output json
```

#### Example Response

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
    },
    {
      "id": "3",
      "corporation_id": "3",
      "operator": "verana1kv85wkhf0dejl7jvlavcx8ed7a7udk4qd683sd",
      "msg_types": [
        "/verana.ec.v1.MsgArchiveEcosystem"
      ],
      "spend_limit": [],
      "remaining_spend": [],
      "expiration": null,
      "period": null
    },
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
      "spend_limit": [
        {
          "denom": "uvna",
          "amount": "100000000"
        }
      ],
      "remaining_spend": [
        {
          "denom": "uvna",
          "amount": "86000000"
        }
      ],
      "expiration": null,
      "period": null
    }
  ]
}
```

> Response trimmed to representative records. Each authorization has a numeric `id`, the granting `corporation_id`, the `operator` (grantee), the allow-listed `msg_types`, and optional `spend_limit` / `remaining_spend` / `expiration` / `period`. When no spend limit is set, `spend_limit` and `remaining_spend` are empty and `expiration`/`period` are `null`.

  </TabItem>

  <TabItem value="api" label="API">

```bash
curl -X GET "https://api.testnet.verana.network/verana/de/v1/operator_authorizations?corporation_id=1" \
  -H "accept: application/json" | jq
```

[Find the API doc here](https://api.testnet.verana.network/#/)

  </TabItem>
  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

### Get an operator authorization

`MOD-DE-QRY-3` — fetch a single operator authorization by its numeric id.

```bash
veranad query de get-operator-authorization 1 \
  --node $NODE_RPC --output json
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

## VS Operator Authorizations

VS operator authorizations (VSOA) are created implicitly by the Participant (`pp`) flow — passing `--vs-operator` together with `--vs-operator-authz-msg-types` to `create-root-participant`, `self-create-participant`, or `start-participant-op` records a VSOA for that participant. They are then queryable through the DE module.

### List VS operator authorizations

`MOD-DE-QRY-2` — list VS operator authorizations, optionally filtered by corporation and/or VS operator.

| Flag                | Description                                                | Mandatory |
|---------------------|------------------------------------------------------------|-----------|
| `--corporation-id`  | Filter by the corporation id (numeric) that granted the VSOA | no      |
| `--vs-operator`     | Filter by the VS operator account                          | no        |
| `--limit`           | Maximum number of results (1–1024, default 64)             | no        |

```bash
veranad query de list-vs-operator-authorizations \
  [--corporation-id <id>] \
  [--vs-operator <address>] \
  [--limit <n>] \
  --node $NODE_RPC --output json
```

Each record carries a numeric VSOA id (`vsoa_id`), the granting `corporation_id`, the `vs_operator` account, the `participant_id` it authorizes sessions for, and the allow-listed VSOA message types.

### Get a VS operator authorization

`MOD-DE-QRY-4` — fetch a single VS operator authorization (with its records) by its numeric id.

```bash
veranad query de get-vs-operator-authorization 1 \
  --node $NODE_RPC --output json
```

:::info Where VSOA comes from
See [Delegation overview](./intro) for how operator authorizations and VS operator authorizations differ, and the Participant docs for the `--vs-operator*` flags that create a VSOA when a participant is created or onboarded.
:::

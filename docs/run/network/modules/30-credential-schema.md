# Credential Schema Module

The Credential Schema (CS) module defines and manages schemas for verifiable credentials owned by an [Ecosystem](./ecosystem), and the versioned **Schema Authorization Policies (SAP)** attached to each schema role.

Refer to the [Environments section](../environments/10-environments.md) for RPC endpoints, and [Remote CLI](../run-a-node/30-remote-cli.md) for setting the environment variables (`$CHAIN_ID`, `$NODE_RPC`, keys) used below.

:::warning Delegable transactions
Every `cs` transaction below is **delegable** — it is executed on behalf of a **Corporation** and signed by an authorized **operator**. Before running them:

1. A **Corporation** (`policy_address`) controls the Ecosystem that owns the schema — see [Corporation](./corporation).
2. An **operator** is granted authorization for the specific `Msg` type-URL via [Delegation → grant-operator-authz](./delegation).

Sign with `--from <operator>` and pass the Corporation with the `--corporation` flag. The delegable CS message type-URLs are:

- `/verana.cs.v1.MsgCreateCredentialSchema`
- `/verana.cs.v1.MsgUpdateCredentialSchema`
- `/verana.cs.v1.MsgArchiveCredentialSchema`
- `/verana.cs.v1.MsgCreateSchemaAuthorizationPolicy`
- `/verana.cs.v1.MsgIncreaseActiveSchemaAuthorizationPolicyVersion`
- `/verana.cs.v1.MsgRevokeSchemaAuthorizationPolicy`

All six carry a `corporation` field and are `operator`-signed, so each must be individually allow-listed on the operator's grant. `MsgUpdateParams` is governance-only (signed by the `x/gov` module account).
:::

## Transaction Messages

| Spec ID       | Command                                                 | Description                                        |
|---------------|---------------------------------------------------------|----------------------------------------------------|
| MOD-CS-MSG-1  | `create-credential-schema`                              | Create a new credential schema                     |
| MOD-CS-MSG-2  | `update`                                                | Update a credential schema's validity periods      |
| MOD-CS-MSG-3  | `archive`                                               | Archive or unarchive a credential schema           |
| MOD-CS-MSG-5  | `create-schema-authorization-policy`                    | Create a new (pending) schema authorization policy |
| MOD-CS-MSG-6  | `increase-active-schema-authorization-policy-version`   | Activate the newest SAP version for a role          |
| MOD-CS-MSG-7  | `revoke-schema-authorization-policy`                    | Revoke a specific SAP version                       |

### Create a Credential Schema

Signature:

```
veranad tx cs create-credential-schema [ecosystem-id] [json-schema] [issuer-mode] [verifier-mode] [holder-onboarding-mode] [pricing-asset-type] [pricing-asset] [digest-algorithm]
```

- `issuer-mode` / `verifier-mode`: `1`=OPEN, `2`=ECOSYSTEM_VALIDATION_PROCESS, `3`=GRANTOR_VALIDATION_PROCESS
- `holder-onboarding-mode`: `1`=ISSUER_VALIDATION_PROCESS, `2`=PERMISSIONLESS
- `pricing-asset-type`: `1`=TU, `2`=COIN, `3`=FIAT — `pricing-asset` is `tu`, a denom (e.g. `uvna`), or an ISO-4217 code

:::note
The command's inline `--help` still shows the pre-v4 issuer/verifier legend (`2=GRANTOR_VALIDATION, 3=ECOSYSTEM`) and omits `holder-onboarding-mode`. The values above match the stored enums — confirm via `veranad query cs get-schema [id]`.
:::

```bash
cat > schema.json << 'EOF'
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "vpr:verana:VPR_CHAIN_ID/cs/v1/js/VPR_CREDENTIAL_SCHEMA_ID",
    "type": "object",
    "$defs": {},
    "properties": { "name": { "type": "string" } },
    "required": ["name"],
    "additionalProperties": false
}
EOF

veranad tx cs create-credential-schema \
  3 "$(cat schema.json)" \
  1 1 2 1 tu sha256 \
  --corporation $CORPORATION \
  --issuer-grantor-validation-validity-period '{"value":365}' \
  --verifier-grantor-validation-validity-period '{"value":365}' \
  --issuer-validation-validity-period '{"value":180}' \
  --verifier-validation-validity-period '{"value":180}' \
  --holder-validation-validity-period '{"value":90}' \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID \
  --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits a `create_credential_schema` event carrying the new `credential_schema_id`:

```yaml
- type: create_credential_schema
  attributes:
  - key: credential_schema_id
    value: "1"
  - key: ecosystem_id
    value: "3"
  - key: corporation
    value: verana1f6fyc0ptxh7padqr3hnrw6sm8wjfr93w6cgv39jwm00nd6kh08esdak22l
  - key: operator
    value: verana1qrdyvgf74jpu5kxufg0gczz5rfv0ws646t3kw4
```

### Update a Credential Schema

Signature: `veranad tx cs update [id]` — validity periods are supplied as flags. Only validity periods can be changed (not the JSON schema or onboarding modes).

```bash
veranad tx cs update 1 \
  --corporation $CORPORATION \
  --issuer-grantor-validation-validity-period '{"value":365}' \
  --verifier-grantor-validation-validity-period '{"value":365}' \
  --issuer-validation-validity-period '{"value":180}' \
  --verifier-validation-validity-period '{"value":180}' \
  --holder-validation-validity-period '{"value":90}' \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits an `update_credential_schema` event echoing the new periods (`issuer_grantor_validation_validity_period: 365`, `issuer_validation_validity_period: 180`, `holder_validation_validity_period: 90`, …).

### Archive a Credential Schema

Signature: `veranad tx cs archive [id] [archive]` — `true` to archive, `false` to unarchive.

```bash
veranad tx cs archive 1 true \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Emits an `archive_credential_schema` event with `archive_status: archived` (or `unarchived`). Unarchiving a schema that is not archived is rejected (`MOD-CS-MSG-3-3`).

### Create a Schema Authorization Policy

A SAP is a versioned policy document attached to a schema role. It is created **pending** (`effective_from`/`effective_until` are `null`) and activated separately.

```bash
veranad tx cs create-schema-authorization-policy \
  --schema-id 1 \
  --role issuer \
  --url https://example.com/schemas/1/issuer-policy-v1.json \
  --digest-sri sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26 \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Flags: `--schema-id` (uint), `--role` (`unspecified|issuer|verifier`), `--url`, `--digest-sri`, `--corporation`. Returns `MsgCreateSchemaAuthorizationPolicyResponse { uint64 id }`.

### Increase Active SAP Version

```bash
veranad tx cs increase-active-schema-authorization-policy-version \
  --schema-id 1 \
  --role issuer \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Flags: `--schema-id`, `--role`, `--corporation`. Returns an empty response. Activates the newest pending version and closes the previously active one.

### Revoke a Schema Authorization Policy

```bash
veranad tx cs revoke-schema-authorization-policy \
  --schema-id 1 \
  --role issuer \
  --version 1 \
  --corporation $CORPORATION \
  --from $OPERATOR --keyring-backend test --chain-id $CHAIN_ID --fees 750000uvna --gas auto --node $NODE_RPC --yes
```

Flags: `--schema-id`, `--role`, `--version` (uint32), `--corporation`. Returns an empty response.

:::info No captured SAP output
The three SAP transactions have no captured on-chain output yet; the response shapes above are taken from `proto/verana/cs/v1/tx.proto`.
:::

## Queries

| Spec ID       | Command              | Description                                             |
|---------------|----------------------|--------------------------------------------------------|
| MOD-CS-QRY-1  | `list-schemas`       | List credential schemas (optional filters)             |
| MOD-CS-QRY-2  | `get-schema`         | Get a credential schema by ID                          |
| MOD-CS-QRY-3  | `render-json-schema` | Render the JSON schema (`application/schema+json`)     |
| MOD-CS-QRY-4  | `params`             | Get module parameters                                  |
| MOD-CS-QRY-5  | `get-sap`            | Get a schema authorization policy by ID                |
| MOD-CS-QRY-6  | `list-sap`           | List SAPs for a `(schema-id, role)` pair               |

### List Credential Schemas

```bash
veranad query cs list-schemas \
  --ecosystem_id 3 \
  --modified_after "2024-01-01T00:00:00Z" \
  --response_max_size 100 \
  --only-active \
  --node $NODE_RPC --output json
```

Filter flags: `--ecosystem_id`, `--modified_after` (RFC 3339), `--response_max_size` (1-1024, default 64), `--only-active`, `--issuer-onboarding-mode`, `--verifier-onboarding-mode`, `--holder-onboarding-mode`.

### Get a Credential Schema

```bash
veranad query cs get-schema 3 --node $NODE_RPC --output json
```

```json
{
  "schema": {
    "id": "3",
    "created": "2025-10-06T07:14:58.914878265Z",
    "modified": "2025-10-20T12:15:27.945453876Z",
    "json_schema": "{ ... }",
    "issuer_grantor_validation_validity_period": 1,
    "verifier_grantor_validation_validity_period": 1,
    "issuer_validation_validity_period": 1,
    "verifier_validation_validity_period": 1,
    "holder_validation_validity_period": 1,
    "issuer_onboarding_mode": "ISSUER_ONBOARDING_MODE_OPEN",
    "verifier_onboarding_mode": "VERIFIER_ONBOARDING_MODE_OPEN"
  }
}
```

A v4 node additionally returns `ecosystem_id`, `pricing_asset_type`, `pricing_asset`, `digest_algorithm`, `holder_onboarding_mode`, and `archived` (when set); the example above is from a testnet node that predates those fields.

### Render JSON Schema

```bash
veranad query cs render-json-schema 3 --node $NODE_RPC --output json
```

Returns `{ "schema": "<resolved JSON Schema string>" }`; over REST (`/verana/cs/v1/js/{id}`) it is served as `application/schema+json`. The `VPR_CHAIN_ID` / `VPR_CREDENTIAL_SCHEMA_ID` placeholders are resolved to concrete values.

### Get / List Schema Authorization Policies

```bash
veranad query cs get-sap 1 --node $NODE_RPC --output json
veranad query cs list-sap 1 1 --node $NODE_RPC --output json   # role: 1=ISSUER, 2=VERIFIER
```

`get-sap` returns a single `SchemaAuthorizationPolicy`; `list-sap` returns a `policies` array ordered by ascending `version`. Fields: `id`, `schema_id`, `role`, `url`, `digest_sri`, `effective_from`, `effective_until`, `revoked`, `created`, `version` (from `proto/verana/cs/v1/types.proto`). No SAP exists on the public networks yet, so no live output is captured.

### Get Module Parameters

```bash
veranad query cs params --node $NODE_RPC --output json
```

```json
{
  "params": {
    "credential_schema_schema_max_size": "8192",
    "credential_schema_issuer_grantor_validation_validity_period_max_days": 3650,
    "credential_schema_verifier_grantor_validation_validity_period_max_days": 3650,
    "credential_schema_issuer_validation_validity_period_max_days": 3650,
    "credential_schema_verifier_validation_validity_period_max_days": 3650,
    "credential_schema_holder_validation_validity_period_max_days": 3650
  }
}
```

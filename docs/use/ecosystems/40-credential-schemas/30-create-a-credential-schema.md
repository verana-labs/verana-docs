# Create a Credential Schema

`MOD-CS-MSG-1`

Make sure you've read [the Learn section](../../../learn/verifiable-public-registry/credential-schema).

Post a message that creates a new credential schema attached to an [Ecosystem](../ecosystem/create-an-ecosystem), on behalf of a [Corporation](../../corporation/create-a-corporation). This operation is **delegable**.

:::warning Prerequisites
This is a **delegable** transaction executed on behalf of a Corporation. Before running it you need:

1. A **Corporation** (`policy_address`) — see [Create a Corporation](../../corporation/create-a-corporation).
2. The policy funded with `uvna` for fees.
3. An existing **Ecosystem** controlled by that Corporation — see [Create an Ecosystem](../ecosystem/create-an-ecosystem). Its numeric `id` is the `[ecosystem-id]` argument.
4. An **operator** granted authorization for `/verana.cs.v1.MsgCreateCredentialSchema` via [Grant Operator Authorization](../../corporation/delegation/grant-operator-authorization).

Sign with `--from <operator>` and pass the corporation's `policy_address` with the `--corporation` flag.
:::

## Message Parameters

The command signature is:

```
veranad tx cs create-credential-schema [ecosystem-id] [json-schema] [issuer-mode] [verifier-mode] [holder-onboarding-mode] [pricing-asset-type] [pricing-asset] [digest-algorithm]
```

| Positional               | Description                                                                 | Mandatory |
|--------------------------|-----------------------------------------------------------------------------|-----------|
| `ecosystem-id`           | Numeric ID of the Ecosystem that will own the schema (must be controlled by your Corporation) | yes |
| `json-schema`            | JSON schema — inline string or path to a file                               | yes       |
| `issuer-mode`            | Issuer onboarding mode (integer, see table below)                           | yes       |
| `verifier-mode`          | Verifier onboarding mode (integer, see table below)                         | yes       |
| `holder-onboarding-mode` | Holder onboarding mode (integer, see table below)                           | yes       |
| `pricing-asset-type`     | Pricing asset type (integer: `1`=TU, `2`=COIN, `3`=FIAT)                     | yes       |
| `pricing-asset`          | Pricing asset identifier (`tu` for TU, denom for COIN, ISO-4217 code for FIAT) | yes    |
| `digest-algorithm`       | Digest algorithm for credential integrity (`sha256`, `sha384`, `sha512`)    | yes       |

Validity periods are supplied as flags (each defaults to `0`, meaning *never expires*):

| Flag                                             | Description                                        |
|--------------------------------------------------|----------------------------------------------------|
| `--issuer-grantor-validation-validity-period`    | Days an issuer-grantor validation remains valid    |
| `--verifier-grantor-validation-validity-period`  | Days a verifier-grantor validation remains valid   |
| `--issuer-validation-validity-period`            | Days an issuer validation remains valid            |
| `--verifier-validation-validity-period`          | Days a verifier validation remains valid           |
| `--holder-validation-validity-period`            | Days a holder validation remains valid             |

Each flag takes the wrapped-integer form `'{"value":N}'`.

#### Issuer / Verifier onboarding modes

| Value | Mode                            | Description                                                        |
|-------|---------------------------------|-------------------------------------------------------------------|
| `1`   | `OPEN`                          | Anyone can self-create the permission without validation.         |
| `2`   | `ECOSYSTEM_VALIDATION_PROCESS`  | Requires an onboarding process validated by the Ecosystem.        |
| `3`   | `GRANTOR_VALIDATION_PROCESS`    | Requires an onboarding process validated by a Grantor.            |

#### Holder onboarding modes

| Value | Mode                        | Description                                                    |
|-------|-----------------------------|----------------------------------------------------------------|
| `1`   | `ISSUER_VALIDATION_PROCESS` | Holders onboard through the issuer's validation process.       |
| `2`   | `PERMISSIONLESS`            | Anyone can self-create a holder permission without validation. |

:::warning
The inline `--help` text for `create-credential-schema` still shows the pre-v4 issuer/verifier mode legend (`2=GRANTOR_VALIDATION, 3=ECOSYSTEM`) and omits `holder-onboarding-mode`. The values above are the ones the node actually stores — verify against `veranad query cs get-schema [id]`, whose `issuer_onboarding_mode` / `verifier_onboarding_mode` / `holder_onboarding_mode` fields report the enum names.
:::

#### Pricing asset types

| Value | Type   | `pricing-asset` value            | Description                             |
|-------|--------|----------------------------------|-----------------------------------------|
| `1`   | TU     | `tu`                             | Trust Unit (non-transferable token)     |
| `2`   | COIN   | denom (e.g., `uvna`)             | Native blockchain token or IBC asset    |
| `3`   | FIAT   | ISO-4217 code (e.g., `USD`)      | Fiat currency (off-chain settlement)    |

:::tip JSON schema placeholders
The `json-schema` supports placeholder replacement performed at creation time:

- `VPR_CREDENTIAL_SCHEMA_ID` — replaced with the generated schema ID.
- `VPR_CHAIN_ID` — replaced with the current chain ID.

Refer to the [specification](https://verana-labs.github.io/verifiable-trust-spec/#vt-json-schema-cred-verifiable-trust-json-schema-credential) for the required attributes.
:::

## Required Environment Variables

```bash
CORPORATION=verana1f6fyc0ptxh7padqr3hnrw6sm8wjfr93w6cgv39jwm00nd6kh08esdak22l
OPERATOR=verana1qrdyvgf74jpu5kxufg0gczz5rfv0ws646t3kw4
ECOSYSTEM_ID=3
CHAIN_ID=vna-testnet-1
NODE_RPC=https://rpc.testnet.verana.network
```

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx cs create-credential-schema [ecosystem-id] [json-schema] [issuer-mode] [verifier-mode] [holder-onboarding-mode] [pricing-asset-type] [pricing-asset] [digest-algorithm] \
  --corporation <policy_address> \
  [--issuer-grantor-validation-validity-period '{"value":N}'] \
  [--verifier-grantor-validation-validity-period '{"value":N}'] \
  [--issuer-validation-validity-period '{"value":N}'] \
  [--verifier-validation-validity-period '{"value":N}'] \
  [--holder-validation-validity-period '{"value":N}'] \
  --from <operator> --chain-id <chain-id> --keyring-backend test --fees <amount> --gas auto --node $NODE_RPC
```

The `--from` flag is the **operator** (transaction signer); `--corporation` is the `policy_address` of the Corporation that controls the ecosystem.

### Example (using a JSON file)

```bash
cat > schema.json << 'EOF'
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "vpr:verana:VPR_CHAIN_ID/cs/v1/js/VPR_CREDENTIAL_SCHEMA_ID",
    "title": "ExampleCredential",
    "description": "ExampleCredential using JsonSchema",
    "type": "object",
    "$defs": {},
    "properties": {
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" }
    },
    "required": ["name"],
    "additionalProperties": false
}
EOF

veranad tx cs create-credential-schema \
  $ECOSYSTEM_ID "$(cat schema.json)" \
  1 1 2 1 tu sha256 \
  --corporation $CORPORATION \
  --issuer-grantor-validation-validity-period '{"value":365}' \
  --verifier-grantor-validation-validity-period '{"value":365}' \
  --issuer-validation-validity-period '{"value":180}' \
  --verifier-validation-validity-period '{"value":180}' \
  --holder-validation-validity-period '{"value":90}' \
  --from $OPERATOR --chain-id $CHAIN_ID --keyring-backend test --fees 750000uvna --gas auto --node $NODE_RPC
```

The positional modes above are: `issuer-mode=1` (OPEN), `verifier-mode=1` (OPEN), `holder-onboarding-mode=2` (PERMISSIONLESS), `pricing-asset-type=1` (TU), `pricing-asset=tu`, `digest-algorithm=sha256`.

### Example response

The transaction emits a `create_credential_schema` event carrying the new `credential_schema_id`:

```yaml
code: 0
events:
- type: message
  attributes:
  - key: action
    value: /verana.cs.v1.MsgCreateCredentialSchema
  - key: module
    value: cs
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
gas_used: "104298"
txhash: 3C5B0630497AB26A3034E2A69EB784074331F1F4F90E02D2FF1C05737DE9BCB5
```

:::tip How to find the id of the schema you just created
Read the `create_credential_schema` event from the transaction:

```bash
TX_HASH=3C5B0630497AB26A3034E2A69EB784074331F1F4F90E02D2FF1C05737DE9BCB5
veranad query tx $TX_HASH --node $NODE_RPC --output json \
| jq '.events[] | select(.type == "create_credential_schema") | .attributes | map({(.key): .value}) | add'
```
:::

If the operator is not authorized for this corporation, the transaction is rejected:

```
authorization check failed: operator authorization does not include requested message type: /verana.cs.v1.MsgCreateCredentialSchema
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    You can also use the [testnet frontend](https://app.testnet.verana.network) to create a credential schema using the web interface.
    :::
  </TabItem>
</Tabs>

## Publish your Credential Schema

When the credential schema has been created, you now self-issue a Verifiable Trust JSON Schema Credential with the DID of your ecosystem, as specified in the [verifiable trust spec](https://verana-labs.github.io/verifiable-trust-spec/#vt-json-schema-cred-verifiable-trust-json-schema-credential).

### Create and publish the JSON Schema Credential

Self-issue your credential and publish it at a publicly accessible URL.

### Add the JSON Schema Credential as a Linked-VP in your DID Document

Create and sign a presentation of your self-issued Verifiable Trust JSON Schema Credential with your DID and reference it in your DID Document as a `linked-vp`.

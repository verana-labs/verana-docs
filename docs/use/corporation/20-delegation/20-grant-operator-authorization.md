# Grant Operator Authorization

`MOD-DE-MSG-3`

Grant an operator account the authorization to execute delegable transactions on behalf of a **Corporation**, allow-listing the exact `Msg` type-URLs the operator may submit.

:::warning Prerequisites
This grant is made on behalf of a Corporation. Before running it you need:
1. A **Corporation** (`policy_address`) — an `x/group` policy created via `MsgCreateCorporation`. Its group members author and approve the grant.
2. The policy funded with `uvna` for fees.
3. The list of exact `Msg` **type-URLs** the operator should be allowed to execute (see [Supported message types](#supported-message-types)).

The message signer (`operator`) is the corporation's `policy_address` itself on the group-proposal path, so the first grant for a Corporation must be submitted **as a group proposal** — a group account cannot sign directly with `--from`. Once an operator is authorized, it may in turn submit further grants directly.
:::

## Message Parameters

The on-chain message is `/verana.de.v1.MsgGrantOperatorAuthorization`.

| Field                         | Description                                                                                  | Mandatory |
|-------------------------------|----------------------------------------------------------------------------------------------|-----------|
| corporation                   | `policy_address` of the Corporation granting the authorization                               | yes       |
| operator                      | Signer — the corporation's `policy_address` on the group-proposal path, or an authorized operator | yes       |
| grantee                       | Operator account receiving the authorization                                                 | yes       |
| msg_types                     | List of VPR delegable `Msg` type-URLs the grantee is authorized to execute                   | no        |
| expiration                    | Timestamp (RFC 3339) after which the authorization expires                                   | no        |
| authz_spend_limit             | Maximum spendable amount for authorized transactions                                         | no        |
| authz_spend_limit_period      | Reset period for the authz spend limit                                                       | no        |
| with_feegrant                 | Whether to also grant a fee allowance to the grantee                                         | no        |
| feegrant_spend_limit          | Maximum fee amount (ignored if `with_feegrant` is false)                                     | no        |
| feegrant_spend_limit_period   | Reset period for the fee-grant spend limit                                                   | no        |

### Supported message types

The `msg_types` field accepts full protobuf message type-URLs. These are the VPR **delegable** messages that can be allow-listed:

| Module | Message type-URL |
|--------|------------------|
| ec | `/verana.ec.v1.MsgCreateEcosystem` |
| ec | `/verana.ec.v1.MsgUpdateEcosystem` |
| ec | `/verana.ec.v1.MsgArchiveEcosystem` |
| gf | `/verana.gf.v1.MsgAddGovernanceFrameworkDocument` |
| gf | `/verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion` |
| co | `/verana.co.v1.MsgUpdateCorporation` |
| cs | `/verana.cs.v1.MsgCreateCredentialSchema` |
| cs | `/verana.cs.v1.MsgUpdateCredentialSchema` |
| cs | `/verana.cs.v1.MsgArchiveCredentialSchema` |
| pp | `/verana.pp.v1.MsgCreateRootParticipant` |
| pp | `/verana.pp.v1.MsgSelfCreateParticipant` |
| pp | `/verana.pp.v1.MsgStartParticipantOP` |
| pp | `/verana.pp.v1.MsgSetParticipantOPToValidated` |
| pp | `/verana.pp.v1.MsgSetParticipantEffectiveUntil` |
| pp | `/verana.pp.v1.MsgRenewParticipantOP` |
| pp | `/verana.pp.v1.MsgCancelParticipantOPLastRequest` |
| pp | `/verana.pp.v1.MsgRevokeParticipant` |
| pp | `/verana.pp.v1.MsgSlashParticipantTrustDeposit` |
| pp | `/verana.pp.v1.MsgRepayParticipantSlashedTrustDeposit` |
| pp | `/verana.pp.v1.MsgCreateOrUpdateParticipantSession` |
| pp | `/verana.pp.v1.MsgTriggerResolver` |
| cs | `/verana.cs.v1.MsgCreateSchemaAuthorizationPolicy` |
| cs | `/verana.cs.v1.MsgIncreaseActiveSchemaAuthorizationPolicyVersion` |
| cs | `/verana.cs.v1.MsgRevokeSchemaAuthorizationPolicy` |
| td | `/verana.td.v1.MsgReclaimTrustDepositYield` |
| td | `/verana.td.v1.MsgRepaySlashedTrustDeposit` |
| di | `/verana.di.v1.MsgStoreDigest` |
| xr | `/verana.xr.v1.MsgUpdateExchangeRate` |
| de | `/verana.de.v1.MsgRevokeOperatorAuthorization` |

:::tip
This is the complete set of delegable messages (spec `x/de` `VPRDelegableMsgTypes`). Grant only the type-URLs the operator actually needs. For example, an operator that only manages ecosystems and their governance framework needs just the `ec` and `gf` messages; an operator that onboards participants needs the relevant `pp` messages.
:::

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### CLI reference

```bash
veranad tx de grant-operator-authz [grantee] \
  --corporation <policy_address> \
  --msg-types <comma-separated-type-urls> \
  [--expiration <RFC3339>] \
  [--authz-spend-limit <coins>] [--authz-spend-limit-period <duration>] \
  [--with-feegrant] [--feegrant-spend-limit <coins>] [--feegrant-spend-limit-period <duration>] \
  --from <operator> --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 750000uvna --gas auto --gas-adjustment 1.5 -y --node $NODE_RPC
```

The signer (`--from`) is the operator: the corporation's `policy_address` on the group-proposal path, or an already-authorized operator. Because a group policy cannot sign directly, the **first** grant for a Corporation is made through a group proposal, as shown below.

### Submit as a group proposal

Set the Corporation policy address, one of its group members, and the operator you want to authorize:

```bash
export CORPORATION=verana1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsh3z8fv
export GROUP_MEMBER_ACC=$(veranad keys show cooluser -a --keyring-backend test)
export OPERATOR_ACC=verana16xkw85ecwlh5pwy0uhutq3y6ddw0ycv4tnl6h6
```

Create the proposal file. The group policy is the granter, so both `corporation` and `operator` are the Corporation's `policy_address`:

```bash
cat > grant_proposal.json << EOF
{
  "group_policy_address": "$CORPORATION",
  "proposers": ["$GROUP_MEMBER_ACC"],
  "metadata": "Grant operator authorization",
  "messages": [
    {
      "@type": "/verana.de.v1.MsgGrantOperatorAuthorization",
      "corporation": "$CORPORATION",
      "operator": "$CORPORATION",
      "grantee": "$OPERATOR_ACC",
      "msg_types": [
        "/verana.ec.v1.MsgCreateEcosystem",
        "/verana.ec.v1.MsgUpdateEcosystem",
        "/verana.ec.v1.MsgArchiveEcosystem",
        "/verana.gf.v1.MsgAddGovernanceFrameworkDocument",
        "/verana.gf.v1.MsgIncreaseActiveGovernanceFrameworkVersion",
        "/verana.co.v1.MsgUpdateCorporation"
      ],
      "with_feegrant": true
    }
  ],
  "title": "Grant operator authorization",
  "summary": "Authorize an operator for ec/gf/co operations on behalf of the Corporation"
}
EOF
```

Submit the proposal (any current group member can propose):

```bash
veranad tx group submit-proposal grant_proposal.json \
  --from $GROUP_MEMBER_ACC --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 750000uvna --gas auto --gas-adjustment 1.5 -y --node $NODE_RPC
```

Vote YES on the proposal (repeat for each member until the group's decision threshold is met):

```bash
PROPOSAL_ID=1
veranad tx group vote $PROPOSAL_ID $GROUP_MEMBER_ACC VOTE_OPTION_YES "" \
  --from $GROUP_MEMBER_ACC --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 600000uvna -y --node $NODE_RPC
```

:::tip Auto-execute on the final vote
Pass `--exec 1` on the vote that meets the threshold to execute the proposal in the same transaction:

```bash
veranad tx group vote $PROPOSAL_ID $GROUP_MEMBER_ACC VOTE_OPTION_YES "" \
  --exec 1 \
  --from $GROUP_MEMBER_ACC --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 600000uvna --gas auto --gas-adjustment 1.5 -y --node $NODE_RPC
```

Otherwise, execute the accepted proposal separately with `veranad tx group exec $PROPOSAL_ID --from $GROUP_MEMBER_ACC ...`.
:::

Confirm the grant with [List Operator Authorizations](./list-operator-authorizations):

```bash
veranad q de list-operator-authorizations \
  --operator $OPERATOR_ACC \
  --node $NODE_RPC --output json
```

### Grant with spend limit and expiration

Add the optional fields to the message in the proposal JSON:

```json
{
  "@type": "/verana.de.v1.MsgGrantOperatorAuthorization",
  "corporation": "$CORPORATION",
  "operator": "$CORPORATION",
  "grantee": "$OPERATOR_ACC",
  "msg_types": ["/verana.cs.v1.MsgCreateCredentialSchema"],
  "authz_spend_limit": [{"denom": "uvna", "amount": "100000000"}],
  "authz_spend_limit_period": "86400s",
  "expiration": "2026-12-31T23:59:59Z",
  "with_feegrant": true,
  "feegrant_spend_limit": [{"denom": "uvna", "amount": "500000"}]
}
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

# Grant Operator Authorization

`MOD-DE-MSG-3`

Grant an operator account the authorization to execute transactions on behalf of an authority (group account).

:::warning Important
Because the message signer is the **authority** (group account), this command must be submitted as a **group proposal**. It cannot be executed directly from the CLI with `--from`.
:::

## Message Parameters

| Name                       | Description                                                                 | Mandatory |
|----------------------------|-----------------------------------------------------------------------------|-----------|
| authority                  | Group account granting the authorization                                    | yes       |
| grantee                    | Operator account receiving the authorization                                | yes       |
| msg-types                  | List of message type URLs the operator is authorized to execute             | no        |
| expiration                 | Expiration timestamp for the authorization                                  | no        |
| authz-spend-limit          | Spend limit for authorized transactions                                     | no        |
| authz-spend-limit-period   | Period after which the spend limit resets                                   | no        |
| with-feegrant              | Whether to also grant fee allowance to the operator                         | no        |
| feegrant-spend-limit       | Spend limit for the fee grant                                               | no        |
| feegrant-spend-limit-period | Period after which the fee grant spend limit resets                         | no        |

### Supported Message Types

The `msg-types` parameter accepts full protobuf message type URLs. Common examples:

| Module | Message Type URL |
|--------|-----------------|
| TR     | `/verana.tr.v1.MsgCreateTrustRegistry` |
| TR     | `/verana.tr.v1.MsgUpdateTrustRegistry` |
| TR     | `/verana.tr.v1.MsgAddGovernanceFrameworkDocument` |
| TR     | `/verana.tr.v1.MsgIncreaseActiveGovernanceFrameworkVersion` |
| TR     | `/verana.tr.v1.MsgArchiveTrustRegistry` |
| CS     | `/verana.cs.v1.MsgCreateCredentialSchema` |
| CS     | `/verana.cs.v1.MsgUpdateCredentialSchema` |
| CS     | `/verana.cs.v1.MsgArchiveCredentialSchema` |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Submit as a Group Proposal

Since the authority is a group account, you must submit this as a group proposal. Create a JSON file with the proposal:

```bash
cat > grant_proposal.json << EOF
{
  "group_policy_address": "$AUTHORITY_ACC",
  "proposers": ["$GROUP_MEMBER_ACC"],
  "metadata": "Grant operator authorization",
  "messages": [
    {
      "@type": "/verana.de.v1.MsgGrantOperatorAuthorization",
      "authority": "$AUTHORITY_ACC",
      "grantee": "$OPERATOR_ACC",
      "msg_types": [
        "/verana.tr.v1.MsgCreateTrustRegistry",
        "/verana.tr.v1.MsgUpdateTrustRegistry",
        "/verana.tr.v1.MsgAddGovernanceFrameworkDocument",
        "/verana.tr.v1.MsgIncreaseActiveGovernanceFrameworkVersion",
        "/verana.tr.v1.MsgArchiveTrustRegistry",
        "/verana.cs.v1.MsgCreateCredentialSchema",
        "/verana.cs.v1.MsgUpdateCredentialSchema",
        "/verana.cs.v1.MsgArchiveCredentialSchema"
      ],
      "with_feegrant": true
    }
  ],
  "title": "Grant operator authorization",
  "summary": "Grant operator authorization for TR and CS modules"
}
EOF
```

Submit the proposal:
```bash
veranad tx group submit-proposal grant_proposal.json \
  --from $GROUP_MEMBER_ACC --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 750000uvna --gas auto --gas-adjustment 1.5 -y --node $NODE_RPC
```

Vote on the proposal (requires threshold number of votes):
```bash
PROPOSAL_ID=1
veranad tx group vote $PROPOSAL_ID $GROUP_MEMBER_ACC VOTE_OPTION_YES "" \
  --from $GROUP_MEMBER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna -y --node $NODE_RPC
```

:::tip
Use `--exec 1` on the final vote to automatically execute the proposal once the voting threshold is met:
```bash
veranad tx group vote $PROPOSAL_ID $GROUP_MEMBER2_ACC VOTE_OPTION_YES "" \
  --exec 1 \
  --from $GROUP_MEMBER2_ACC --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 600000uvna --gas auto --gas-adjustment 1.5 -y --node $NODE_RPC
```
:::

### Grant with spend limit and expiration

Add these fields to the message in the proposal JSON:
```json
{
  "@type": "/verana.de.v1.MsgGrantOperatorAuthorization",
  "authority": "$AUTHORITY_ACC",
  "grantee": "$OPERATOR_ACC",
  "msg_types": ["/verana.tr.v1.MsgCreateTrustRegistry"],
  "authz_spend_limit": [{"denom": "uvna", "amount": "1000000"}],
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

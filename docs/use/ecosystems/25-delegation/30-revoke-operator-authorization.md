# Revoke Operator Authorization

`MOD-DE-MSG-4`

Revoke a previously granted operator authorization. After revocation, the operator will no longer be able to execute transactions on behalf of the authority.

:::warning Important
Because the message signer is the **authority** (group account), this command must be submitted as a **group proposal**. It cannot be executed directly from the CLI with `--from`.
:::

## Message Parameters

| Name      | Description                                          | Mandatory |
|-----------|------------------------------------------------------|-----------|
| authority | Group account that granted the authorization         | yes       |
| grantee   | Operator account whose authorization is being revoked | yes       |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Submit as a Group Proposal

Create a JSON file with the revoke proposal:

```bash
cat > revoke_proposal.json << EOF
{
  "group_policy_address": "$AUTHORITY_ACC",
  "proposers": ["$GROUP_MEMBER_ACC"],
  "metadata": "Revoke operator authorization",
  "messages": [
    {
      "@type": "/verana.de.v1.MsgRevokeOperatorAuthorization",
      "authority": "$AUTHORITY_ACC",
      "grantee": "$OPERATOR_ACC"
    }
  ],
  "title": "Revoke operator authorization",
  "summary": "Revoke operator authorization for the specified grantee"
}
EOF
```

Submit the proposal:
```bash
veranad tx group submit-proposal revoke_proposal.json \
  --from $GROUP_MEMBER_ACC --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 750000uvna --gas auto --gas-adjustment 1.5 -y --node $NODE_RPC
```

Vote and execute (use `--exec 1` on the final vote to auto-execute):
```bash
PROPOSAL_ID=<proposal-id>
veranad tx group vote $PROPOSAL_ID $GROUP_MEMBER_ACC VOTE_OPTION_YES "" \
  --from $GROUP_MEMBER_ACC --chain-id ${CHAIN_ID} --keyring-backend test --fees 600000uvna -y --node $NODE_RPC

veranad tx group vote $PROPOSAL_ID $GROUP_MEMBER2_ACC VOTE_OPTION_YES "" \
  --exec 1 \
  --from $GROUP_MEMBER2_ACC --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 600000uvna --gas auto --gas-adjustment 1.5 -y --node $NODE_RPC
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

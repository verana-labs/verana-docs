# Revoke Operator Authorization

`MOD-DE-MSG-4`

Revoke a previously granted operator authorization. After revocation, the operator can no longer execute transactions on behalf of the **Corporation**, and any associated fee grant for that corporation/grantee pair is removed.

:::warning Prerequisites
This revoke is made on behalf of a Corporation. Before running it you need:
1. The **Corporation** (`policy_address`) that granted the authorization, and its group members to approve the revoke.
2. The policy funded with `uvna` for fees.
3. The **grantee** (operator) account whose authorization you want to remove.

The message signer (`operator`) is the corporation's `policy_address` itself on the group-proposal path, so a revoke made by the Corporation must be submitted **as a group proposal** — a group account cannot sign directly with `--from`. An already-authorized operator may instead revoke directly.
:::

## Message Parameters

The on-chain message is `/verana.de.v1.MsgRevokeOperatorAuthorization`.

| Field       | Description                                                                                   | Mandatory |
|-------------|-----------------------------------------------------------------------------------------------|-----------|
| corporation | `policy_address` of the Corporation revoking the authorization                                | yes       |
| operator    | Signer — the corporation's `policy_address` on the group-proposal path, or an authorized operator | yes       |
| grantee     | Operator account whose authorization is being revoked                                         | yes       |

## Post the Message

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cli" label="CLI" default>

### CLI reference

```bash
veranad tx de revoke-operator-authz [grantee] \
  --corporation <policy_address> \
  --from <operator> --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 750000uvna --gas auto --gas-adjustment 1.5 -y --node $NODE_RPC
```

The signer (`--from`) is the operator: the corporation's `policy_address` on the group-proposal path, or an already-authorized operator. Because a group policy cannot sign directly, a revoke made by the Corporation itself is submitted through a group proposal, as shown below.

### Submit as a group proposal

```bash
export CORPORATION=verana1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsh3z8fv
export GROUP_MEMBER_ACC=$(veranad keys show cooluser -a --keyring-backend test)
export OPERATOR_ACC=verana16xkw85ecwlh5pwy0uhutq3y6ddw0ycv4tnl6h6
```

Create the revoke proposal file. The group policy is the granter, so both `corporation` and `operator` are the Corporation's `policy_address`:

```bash
cat > revoke_proposal.json << EOF
{
  "group_policy_address": "$CORPORATION",
  "proposers": ["$GROUP_MEMBER_ACC"],
  "metadata": "Revoke operator authorization",
  "messages": [
    {
      "@type": "/verana.de.v1.MsgRevokeOperatorAuthorization",
      "corporation": "$CORPORATION",
      "operator": "$CORPORATION",
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

Vote and execute (use `--exec 1` on the vote that meets the group's decision threshold to auto-execute):

```bash
PROPOSAL_ID=<proposal-id>
veranad tx group vote $PROPOSAL_ID $GROUP_MEMBER_ACC VOTE_OPTION_YES "" \
  --exec 1 \
  --from $GROUP_MEMBER_ACC --chain-id ${CHAIN_ID} --keyring-backend test \
  --fees 600000uvna --gas auto --gas-adjustment 1.5 -y --node $NODE_RPC
```

Confirm the authorization is gone with [List Operator Authorizations](./list-operator-authorizations):

```bash
veranad q de list-operator-authorizations \
  --operator $OPERATOR_ACC \
  --node $NODE_RPC --output json
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: describe here
    :::
  </TabItem>
</Tabs>

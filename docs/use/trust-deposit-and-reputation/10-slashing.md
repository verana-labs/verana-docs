import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Network Governance Authority Slashing

In some very rare cases, slashing the trust deposit of a given Permission can be limited and may not provide a sufficient sanction, if committed fraud is considered very high.

## Slash Trust Deposit

This method can only be called by a governance proposal. A globally slashed account MUST repay the slashed deposit in order to continue to use the services provided by the VPR. When an account is slashed, and while slashed deposit has not been repaid, all account linked permissions MUST be considered non trustable.

This method is for network governance authority slash. For ecosystem slash, see [Slash a Permission](../ecosystems/permissions/slash-a-permission).

### Environment Setup

Set the following environment variables before running the CLI commands:

```bash
AUTHORITY_ACC="verana1groupaccountaddress..."   # Group account (authority)
OPERATOR_ACC="my-operator-key"                  # Operator key name in keyring
SLASHED_ACCOUNT="verana1example0123456789abcdefghijklmnopqrstuv"
CHAIN_ID="vna-testnet-1"
NODE_RPC="https://rpc.testnet.verana.network"
```

### Step 1: Prepare the Governance Proposal

Create a JSON file for the SlashTrustDepositProposal. This proposal will slash the trust deposit of a specified account.

**Example `slash_proposal.json`:**

```json
jq -n --arg acc "$SLASHED_ACCOUNT" \
'{
  messages: [
    {
      "@type": "/verana.td.v1.MsgSlashTrustDeposit",
      authority: "verana10d07y265gmmuvt4z0w9aw880jnsr700j22m4w8",
      account: $acc,
      amount: "1000000"
    }
  ],
  metadata: "ipfs://CID",
  deposit: "10000000uvna",
  title: "Slash Trust Deposit for Fraudulent Activity",
  summary: ("This proposal requests to slash 1,000,000 uvna from the trust deposit of account " + $acc + " due to verified fraudulent activity. The account will need to repay this slashed amount before being able to participate in the VPR again."),
  expedited: false
}' > slash_proposal.json
```

**Parameters:**
- `authority`: The governance module address (check with `veranad q auth module-accounts --node $NODE_RPC`)
- `account`: The account address to be slashed
- `amount`: Amount to slash in uvna
- `deposit`: Initial deposit for the proposal (minimum 10000000uvna)
- `title`: Clear title describing the proposal
- `summary`: Detailed explanation of the slashing reason

### Step 2: Submit the Governance Proposal

```bash
veranad tx gov submit-proposal slash_proposal.json \
  --from $OPERATOR_ACC \
  --keyring-backend test \
  --chain-id $CHAIN_ID \
  --fees 750000uvna \
  --gas auto \
  --node $NODE_RPC
```

### Step 3: Query the Proposal

After submission, check the proposal status:

```bash
veranad q gov proposals --node $NODE_RPC
```

Note the proposal ID from the output.

### Step 4: Vote on the Proposal

Validators and delegators can vote on the proposal. The voting period is typically 10 minutes on testnet.

**Vote Options:**
- `yes` - In favor of slashing
- `no` - Against slashing
- `no_with_veto` - Against and considers proposal malicious
- `abstain` - Neutral stance

**Cast Your Vote:**

```bash
PROPOSAL_ID=1  # Replace with actual proposal ID
veranad tx gov vote $PROPOSAL_ID yes \
  --from $VALIDATOR_ACC \
  --keyring-backend test \
  --chain-id $CHAIN_ID \
  --fees 650000uvna \
  --gas auto \
  --node $NODE_RPC
```

### Step 5: Monitor Proposal Status

Track the voting progress and tally:

```bash
# Check vote tally
veranad q gov tally $PROPOSAL_ID \
  --output json \
  --node $NODE_RPC

# Check detailed proposal status
veranad q gov proposal $PROPOSAL_ID \
  --output json \
  --node $NODE_RPC
```

### Step 6: Proposal Execution

If the proposal passes (reaches quorum and majority approval), it will be automatically executed at the end of the voting period. The trust deposit will be slashed from the specified account.

**Verify the slash:**

```bash
veranad q td get-trust-deposit $SLASHED_ACCOUNT \
  --node $NODE_RPC \
  --output json
```

The output will show:
- `slashed_deposit`: The amount that was slashed
- `slash_count`: Incremented by 1
- `last_slashed`: Updated with the slash timestamp

---

## Repay Slashed Trust Deposit

Repay a governance-slashed trust deposit to restore compliance.

This is a **non-delegable** message — the signer (`--from`) is the account paying for the repayment. Anyone can repay on behalf of a slashed account.

A slashed account cannot participate in the VPR until the slashed deposit is fully repaid. All permissions linked to the slashed account are considered non-trustable until repayment is complete.

:::warning[Exact Amount Required]
The repayment amount **must exactly match** the outstanding slashed amount (`slashed_deposit - repaid_deposit`). Partial repayments are not allowed.
:::

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad tx td repay-slashed-td [account] [amount] \
  --from <user-account> \
  --chain-id <chain-id> \
  --keyring-backend test \
  --fees <amount> \
  --gas auto \
  --node <rpc-endpoint>
```

### Message Parameters

| Name      | Description                                                          | Mandatory |
|-----------|----------------------------------------------------------------------|-----------|
| `account` | The account whose slashed deposit will be repaid                     | yes       |
| `amount`  | Repayment amount in uvna (must exactly match outstanding slash)      | yes       |
| `--from`  | Account signing and paying for the repayment                         | yes       |

### Example

```bash
# First, check the outstanding slashed amount
veranad q td get-trust-deposit $SLASHED_ACCOUNT \
  --node $NODE_RPC \
  --output json

# Repay the slashed amount (must be exact)
SLASHED_AMOUNT=1000000  # Replace with actual outstanding slashed amount
veranad tx td repay-slashed-td $SLASHED_ACCOUNT $SLASHED_AMOUNT \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --keyring-backend test \
  --fees 600000uvna \
  --gas auto \
  --node $NODE_RPC
```

  </TabItem>

  <TabItem value="frontend" label="Frontend">
    :::tip
    TODO: When available in the UI, link and screenshots will be added here.
    :::
  </TabItem>
</Tabs>

**Prerequisites:**
- The authority must have an existing trust deposit with outstanding slashed amount
- The operator must have a valid `OperatorAuthorization` for `/verana.td.v1.MsgRepaySlashedTrustDeposit`
- Repayment amount must exactly equal `slashed_deposit - repaid_deposit`
- Sufficient account balance to cover the repayment

**What Happens:**
1. System verifies operator authorization (AUTHZ-CHECK)
2. Validates that the amount exactly matches the outstanding slash
3. Increases `amount` (deposit) by the repayment amount
4. Increases `share` proportionally based on current share value
5. Increases `repaid_deposit` by the repayment amount
6. Updates `last_repaid` timestamp
7. Transfers the repayment amount from the authority account to the TD module

### Verify Repayment

After repayment, verify the trust deposit status:

```bash
veranad q td get-trust-deposit $AUTHORITY_ACC \
  --node $NODE_RPC \
  --output json
```

**Expected changes:**
- `amount`: Increased by the repaid amount
- `repaid_deposit`: Increased by the repaid amount
- `last_repaid`: Updated with repayment timestamp

Once `repaid_deposit` equals `slashed_deposit`, all account permissions become trustable again and the account can fully participate in the VPR.

---

## See also

- [Trust Deposit Operations](./trust-deposit-operations)
- [Slash a Permission (Ecosystem)](../ecosystems/permissions/slash-a-permission)
- [Repay a Slashed Permission Deposit](../ecosystems/permissions/repay-a-slashed-permission-deposit)

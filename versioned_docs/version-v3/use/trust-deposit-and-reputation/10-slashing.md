# Network Governance Authority Slashing

In some very rare cases, slashing the trust deposit of a given Permission can be limited and may not provide a sufficient sanction, if committed fraud is considered very high.

## Slash Trust Deposit

This method can only be called by a governance proposal. A globally slashed account MUST repay the slashed deposit in order to continue to use the services provided by the VPR. When an account is slashed, and while slashed deposit has not been repaid, all account linked permissions MUST be considered non trustable.

This method is for network governance authority slash. For ecosystem slash, see [Slash a Permission](../ecosystems/permissions/slash-a-permission).

### Environment Setup

Set the following environment variables before running the CLI commands:

```bash
USER_ACC="my-user-account"
USER_ACC_LIT="verana1sxau0xyttphpck7vhlvt8s82ez70nlzw2mhya0"
SLASHED_ACCOUNT="bad-user"
SLASHED_ACCOUNT_LIT="verana1example0123456789abcdefghijklmnopqrstuv"
CHAIN_ID="vna-testnet-1"
NODE_RPC="https://rpc.testnet.verana.network"
```

### Step 1: Prepare the Governance Proposal

Create a JSON file for the SlashTrustDepositProposal. This proposal will slash the trust deposit of a specified account.

**Example `slash_proposal.json`:**

```json
jq -n --arg acc "$SLASHED_ACCOUNT_LIT" \
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
- `slash_amount`: Amount to slash in uvna
- `deposit`: Initial deposit for the proposal (minimum 10000000uvna)
- `title`: Clear title describing the proposal
- `summary`: Detailed explanation of the slashing reason

### Step 2: Submit the Governance Proposal

```bash
veranad tx gov submit-proposal slash_proposal.json \
  --from $USER_ACC \
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
veranad q td get-trust-deposit $SLASHED_ACCOUNT_LIT \
  --node $NODE_RPC \
  --output json
```

The output will show:
- `slashed_deposit`: The amount that was slashed
- `slash_count`: Incremented by 1

---

## Repay Slashed Trust Deposit

Repay a governance-slashed trust deposit. This operation can be executed by any account on behalf of the slashed account.

A slashed account cannot participate in the VPR until the slashed deposit is fully repaid. All permissions linked to the slashed account are considered non-trustable until repayment is complete.

### Syntax

```bash
veranad tx td repay-slashed-td [account] [amount] \
  --from <user> \
  --chain-id <chain-id> \
  --keyring-backend test \
  --fees <amount> \
  --gas auto \
  --node <rpc-endpoint>
```

### Parameters

- `[account]`: The account address whose slashed deposit you want to repay (mandatory)
- `[amount]`: Amount to repay in uvna (mandatory, must be ≤ slashed_deposit)

### Example: Repay Your Own Slashed Deposit

```bash
# First, check your slashed deposit amount
veranad q td get-trust-deposit $SLASHED_ACCOUNT_LIT \
  --node $NODE_RPC \
  --output json

# Repay the slashed amount
SLASHED_AMOUNT=1000000  # Replace with actual slashed amount
veranad tx td repay-slashed-td $SLASHED_ACCOUNT_LIT $SLASHED_AMOUNT \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --keyring-backend test \
  --fees 600000uvna \
  --gas auto \
  --node $NODE_RPC
```

### Example: Repay on Behalf of Another Account

Any account can repay the slashed deposit for another account:

```bash
REPAY_AMOUNT=1000000

veranad tx td repay-slashed-deposit $SLASHED_ACCOUNT_LIT $REPAY_AMOUNT \
  --from $USER_ACC \
  --chain-id $CHAIN_ID \
  --keyring-backend test \
  --fees 600000uvna \
  --gas auto \
  --node $NODE_RPC
```

### Verify Repayment

After repayment, verify the trust deposit status:

```bash
veranad q td get-trust-deposit $SLASHED_ACCOUNT \
  --node $NODE_RPC \
  --output json
```

**Expected changes:**
- `slashed_deposit`: Reduced by the repaid amount
- `repaid_deposit`: Increased by the repaid amount
- `last_repaid`: Updated with repayment timestamp
- `last_repaid_by`: Shows the account that made the repayment

Once `slashed_deposit` reaches 0, all account permissions become trustable again and the account can fully participate in the VPR.

---

## Prerequisites for All Operations

- Sufficient balance for transaction fees
- For voting: Must have voting power (validator or delegator)
- For repayment: Must have sufficient uvna to cover the repayment amount
- Proposal submission requires minimum deposit (typically 10000000uvna)
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Network Governance Slashing

Slashing a Corporation's trust deposit is a **network-level penalty**, reserved for rare cases where fraud or a breach of the VPR governance framework is severe enough that ecosystem-level sanctions are insufficient.

Slashing operates at **two independent levels** (see the [Slash](../../learn/verifiable-public-registry/trust-deposit-and-reputation) section in Learn):

- **Network-level** — the VPR governance authority slashes a Corporation's trust deposit directly. This is the `td slash-trust-deposit` message documented on this page. It is **governance-only**.
- **Ecosystem-level** — an ecosystem slashes the portion of a Corporation's deposit tied to a specific Participant entry, using `pp slash-participant-td`. See [Slash a Participant](../ecosystems/participants/slash-a-participant).

A slashed Corporation MUST repay the slashed amount to return to good standing. While a slashed deposit is outstanding, all of the Corporation's Participant entries are considered non-trustable.

## Slash Trust Deposit (Governance)

`td slash-trust-deposit` can **only** be executed by the governance module — the message signer is `authority` (the x/gov module account), so a normal key cannot sign it. It is submitted as a governance proposal wrapping `/verana.td.v1.MsgSlashTrustDeposit` (spec `MOD-TD-MSG-5`).

The message targets a Corporation by its numeric `corporation_id` (field 2, the old account-string `corporation`, is reserved — slashing is corporation-keyed in v4).

:::info Direct CLI is governance-only
The binary exposes `veranad tx td slash-trust-deposit --corporation-id <id> --deposit <amount> --reason <text>`, but because the required signer is the gov module account, it must be routed through a `gov submit-proposal`. The flags map onto the proposal message fields shown below.
:::

### Environment Setup

```bash
USER_ACC="my-user-account"       # Proposer / voter key
CORP_ID=6                        # Numeric corporation_id to slash
CHAIN_ID="vna-testnet-1"
NODE_RPC="https://rpc.testnet.verana.network"
```

### Step 1: Get the Governance Authority Address

```bash
GOV_AUTH=$(veranad q auth module-accounts --node $NODE_RPC --output json \
| jq -r '.accounts[] | select(.value.name=="gov") | .value.address')
```

### Step 2: Build the Proposal JSON

```bash
cat > slash_proposal.json <<JSON
{
  "messages": [
    {
      "@type": "/verana.td.v1.MsgSlashTrustDeposit",
      "authority": "${GOV_AUTH}",
      "corporation_id": "${CORP_ID}",
      "deposit": "1000000",
      "reason": "Verified fraudulent activity"
    }
  ],
  "metadata": "ipfs://CID",
  "deposit": "10000000uvna",
  "title": "Slash Trust Deposit for Fraudulent Activity",
  "summary": "Requests to slash 1,000,000 uvna from the trust deposit of corporation_id 6 due to verified fraudulent activity. The corporation must repay this amount before participating in the VPR again.",
  "expedited": false
}
JSON
```

**Message fields** (proto `MsgSlashTrustDeposit`):

| Field | Description | Mandatory |
|-------|-------------|-----------|
| `authority` | Governance module address (the message signer). | yes |
| `corporation_id` | Numeric id of the Corporation whose deposit is slashed. | yes |
| `deposit` | Amount to slash, in `uvna`. | yes |
| `reason` | Human-readable reason for the slash (mandatory per spec `MOD-TD-MSG-5-1`). | yes |

### Step 3: Submit the Proposal

```bash
veranad tx gov submit-proposal slash_proposal.json \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID \
  --fees 750000uvna --gas auto --node $NODE_RPC
```

### Step 4: Track and Vote

```bash
veranad q gov proposals --node $NODE_RPC
```

```bash
PROPOSAL_ID=1  # Replace with the actual proposal ID
veranad tx gov vote $PROPOSAL_ID yes \
  --from $USER_ACC --keyring-backend test --chain-id $CHAIN_ID \
  --fees 650000uvna --gas auto --node $NODE_RPC
```

Vote options: `yes`, `no`, `no_with_veto`, `abstain`.

### Step 5: Verify the Slash

After the proposal passes and is executed, inspect the Corporation's trust deposit:

```bash
veranad q td get-trust-deposit $CORP_ID --node $NODE_RPC --output json
```

The response will show:
- `slashed_deposit` — increased by the slashed amount;
- `slash_count` — incremented by 1;
- `last_slashed` — updated with the slash timestamp.

---

## Repay a Slashed Trust Deposit

A network-slashed Corporation restores good standing by repaying the outstanding slashed amount with `td repay-slashed-td`. This is a delegable operation executed by an authorized operator on behalf of the Corporation.

See [Repay a Slashed Trust Deposit](./trust-deposit-operations#repay-a-slashed-trust-deposit) on the Trust Deposit Operations page for the full command, prerequisites, and exact-amount rule.

---

## Ecosystem-Level Slashing (Participants)

For slashing tied to a Corporation's activity within a specific ecosystem, the ecosystem's authority uses the Participant module rather than governance:

- `veranad tx pp slash-participant-td [id] [amount] [reason]` — slash the trust deposit backing a Participant entry (delegable; see [Slash a Participant](../ecosystems/participants/slash-a-participant)).
- `veranad tx pp repay-participant-slashed-td [id] --corporation [corporation]` — repay it (see [Repay a Slashed Participant Deposit](../ecosystems/participants/repay-a-slashed-participant-deposit)).

An ecosystem can only slash the portion of a Corporation's deposit that corresponds to activity within that ecosystem.

---

## See also

- [Trust Deposit Operations](./trust-deposit-operations)
- [Slash a Participant (Ecosystem)](../ecosystems/participants/slash-a-participant)
- [Repay a Slashed Participant Deposit](../ecosystems/participants/repay-a-slashed-participant-deposit)

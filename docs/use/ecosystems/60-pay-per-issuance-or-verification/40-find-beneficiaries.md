import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Find Beneficiaries

Compute the **beneficiary participants** — who gets paid trust fees — by traversing the participant tree for an issuer and/or verifier participant (`MOD-PP-QRY-4`). Run this **before** you create a [Participant Session](./create-or-update-participant-session) for Pay-Per-Issuance (PPI) or Pay-Per-Verification (PPV), so you know which participants share the fee and can fund your account accordingly.

:::info Full ancestor walk in v4
`find-beneficiaries` walks the **full participant ancestor chain** up to the root ECOSYSTEM participant (`MOD-PP-QRY-4-3`). The old `perm`-module OPEN-mode special case is **removed** — OPEN-mode flows now return the full ancestor beneficiary set like every other mode.
:::

## Query Parameters

At least one of `--issuer-participant-id` or `--verifier-participant-id` must be provided.

| Flag | Description |
|------|-------------|
| `--issuer-participant-id <uint>` | Issuer participant ID (issuance flow). |
| `--verifier-participant-id <uint>` | Verifier participant ID (verification flow). |

## Execute the Query

<Tabs>
  <TabItem value="cli" label="CLI" default>

### Usage

```bash
veranad query pp find-beneficiaries \
  [--issuer-participant-id <id>] [--verifier-participant-id <id>] \
  --node $NODE_RPC --output json
```

### Example — issuance

```bash
veranad query pp find-beneficiaries --issuer-participant-id 6 --node $NODE_RPC --output json
```

### Example — verification

```bash
veranad query pp find-beneficiaries --verifier-participant-id 6 --node $NODE_RPC --output json
```

  </TabItem>

  <TabItem value="api" label="API">
  Not exposed via REST yet. Use the CLI.
  </TabItem>
</Tabs>

## Example Output

Real testnet output for issuer participant `6` — the beneficiary is the root ECOSYSTEM participant (`5`) that ancestors it:

```json
{
  "participants": [
    {
      "id": "5",
      "schema_id": "5",
      "role": "ECOSYSTEM",
      "did": "did:example:18c0df437f002438f9574d5fb8b20c3b",
      "created": "2026-07-10T08:08:50.126122Z",
      "effective_from": "2026-07-10T08:08:58.425252Z",
      "effective_until": "2027-07-05T08:08:58.425252Z",
      "modified": "2026-07-10T08:08:50.126122Z",
      "op_state": "VALIDATED",
      "op_last_state_change": "2026-07-10T08:08:50.126122Z",
      "corporation_id": "6"
    }
  ]
}
```

Each returned participant carries its own `issuance_fees` / `verification_fees`, which the chain uses to enforce monetization when the session is created.

## Related

- [Create or Update Participant Session](./create-or-update-participant-session)
- [How PPI and PPV Work](./how-ppi-and-ppv-work)

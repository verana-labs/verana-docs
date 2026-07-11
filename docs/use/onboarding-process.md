# Onboarding Process

To participate in an ecosystem as an **issuer** or **verifier**, you obtain a permission for one of its credential schemas. When a schema requires validation (`GRANTOR_VALIDATION` or `TRUST_REGISTRY_VALIDATION`), you run an **Onboarding Process (OP)**: a request reviewed by a grantor or the ecosystem owner before your permission is granted. Schemas set to `OPEN` skip this, you self-create the permission directly.

Start it from an ecosystem you want to join (**Discover & Join** → **View Ecosystem** → **Join**), which opens the join wizard.

## Step 1 — Review Ecosystem Info

Confirm you're joining the right ecosystem: its name, DID, governance framework, active schemas, participants, and trust value.

![Review ecosystem info](/img/frontend/onboarding/1-review.png)

## Step 2 — Select Credential Schema

Pick the credential schema you want to participate in. Each shows its issuer and verifier validity periods and permission modes.

![Select credential schema](/img/frontend/onboarding/2-schema.png)

## Step 3 — Select Your Role

Choose your role for that schema: **Issuer**, **Verifier**, or a grantor role, depending on the schema's permission modes.

![Select your role](/img/frontend/onboarding/3-role.png)

## Step 4 — Review & Accept Governance Framework

Read the ecosystem's EGF and accept it to continue.

![Accept the governance framework](/img/frontend/onboarding/4-egf.png)

## Step 5 — Select Validator

Choose the validator (a grantor, or the ecosystem owner) who will process your request. Their DID, deposit, and fees are shown.

![Select a validator](/img/frontend/onboarding/5-validator.png)

## Step 6 — Confirm & Submit

Review your selections, enter your **Service DID**, and submit. This starts the Onboarding Process (`MsgStartPermissionVP`).

![Confirm and submit](/img/frontend/onboarding/6-confirm.png)

## After submitting

Your request is routed to the validator you chose. Connect to their validator service (via the QR code shown) to continue and complete validation.

![Onboarding request submitted](/img/frontend/onboarding/7-complete.png)

The Onboarding Process then appears in your [Pending Tasks](./pending-tasks) and on the permission's card, where you can **renew** it (`MsgRenewPermissionVP`) as its validity nears expiry, or **cancel** a pending request (`MsgCancelPermissionVPLastRequest`). Grantors and ecosystem owners handle the other side, reviewing and validating requests, from the [Permissions](./ecosystems/permissions/intro) section.

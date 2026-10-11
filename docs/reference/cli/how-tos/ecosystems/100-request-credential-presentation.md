---
rework: legacy
---

# Request Credential Presentation

In order to request the presentation of a credential of a given credential schema for a given ecosystem:

1. Make sure you joined the ecosystem and obtained a VERIFIER participant for this credential schema.

2. Check if a payment is needed for verifying a credential of this schema, by [checking the schema configuration](./40-credential-schemas/20-get-a-credential-schema.md), and by using the [find beneficiaries](./60-pay-per-issuance-or-verification/40-find-beneficiaries.md) method.

3. If a payment is needed, execute the corresponding transaction by calling the [create or update participant session](./60-pay-per-issuance-or-verification/80-create-or-update-participant-session.md) method.

4. Request the presentation of the credential with the DID that you registered in the VERIFIER participant.

5. Receive the credential.

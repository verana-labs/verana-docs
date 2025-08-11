# Request Credential Presentation

In order to request the presentation of a credential of a given credential schema for a given ecosystem:

1. Make sure you joined the ecosystem and obtained a VERIFIER permission for this credential schema.

2. Check if a payment is needed for verifying a credential of this schema, by [checking the schema configuration](../ecosystems/credential-schemas/get-a-credential-schema), and by using the [find beneficiaries](../ecosystems/pay-per-issuance-or-verification/find-beneficiaries) method.

3. If a payment is needed, execute the corresponding transaction by calling the [create or update permission session](../ecosystems/pay-per-issuance-or-verification/create-or-update-permission-session) method.

4. Request the presentation of the credential with the DID that you registered in the VERIFIER permission.

5. Receive the credential.

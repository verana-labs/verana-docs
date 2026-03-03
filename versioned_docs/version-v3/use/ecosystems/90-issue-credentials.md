# Issue Credentials

In order to issue a credential of a given credential schema for a given ecosystem:

1. Make sure you joined the ecosystem and obtained an ISSUER permission for this credential schema.

2. If needed, run a validation process with the HOLDER that is requesting the credential.

3. Check if a payment is needed for issuing a credential of this schema, by checking the schema configuration, and by using the [find beneficiaries] method.

4. If a payment is needed, execute the corresponding transaction by calling the [create or update permission session](pay-per-issuance-or-verification/create-or-update-permission-session) method.

5. Issue the credential with the DID that you registered in the ISSUER permission to the HOLDER. Make sure that your issued credential is a Verifiable Trust Credential, as explained in the [verifiable trust specification](https://verana-labs.github.io/verifiable-trust-spec/#vt-cred-verifiable-trust-credential)

6. Deliver the credential to the HOLDER.

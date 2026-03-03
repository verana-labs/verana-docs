# Issuing Credentials

Once the ecosystem has published its credential schema:

- Created its `Credential Schema` in the VPR
- Issued the corresponding **verifiable trust JSON schema credential**
- Properly configured the "service" section of its ecosystem DID Document

it is now possible for authorized issuers to issue **verifiable trust credentials** based on this schema.

Credentials that comply with the [verifiable trust specification](https://verana-labs.github.io/verifiable-trust-spec/) are referred to as **verifiable trust credentials (VTCs)**. These credentials must include, in their `credentialSchema` attribute, a reference to the corresponding **verifiable trust JSON schema credential** issued by the trust registry ecosystem DID. This linkage ensures cryptographic proof of the schema's origin and trustworthiness.

In our previous example, that would mean and ExampleCredential should look like this example:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2"
  ],
  "id": "did:example:holder",
  "type": ["VerifiableCredential", "VerifiableTrustCredential", "ExampleCredential"],
  "issuer": "did:example:authorized-issuer",
  "credentialSubject": {
     "id": "did:example:holder",
    ...
  },
  ...
  "credentialSchema": {
    "id": "https://ecosystem/schemas-example-jsc.json",
    "type": "JsonSchemaCredential"
  }
}

```

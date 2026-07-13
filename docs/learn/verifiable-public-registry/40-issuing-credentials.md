# Issuing Credentials

Once the ecosystem has published its credential schema:

- Created its `Credential Schema` in the VPR
- Issued the corresponding **Verifiable Trust JSON Schema Credential (VTJSC)**
- Properly configured the `service` section of its ecosystem DID Document

it is now possible for authorized issuers to issue **verifiable trust credentials** based on this schema.

Credentials that comply with the [verifiable trust specification](https://verana-labs.github.io/verifiable-trust-spec/) are referred to as **verifiable trust credentials (VTCs)**. These credentials must include, in their `credentialSchema` attribute, a reference to the corresponding **VTJSC** issued by the ecosystem DID. This linkage ensures cryptographic proof of the schema's origin and trustworthiness.

## W3C Verifiable Trust Credential

A W3C VTC must declare `VerifiableCredential` and `VerifiableTrustCredential` in its `type` (plus, optionally, one or more schema-specific types), be identified by a globally unique `id` (e.g. a `urn:uuid:`), be issued by the DID of an authorized issuer, and reference the ecosystem's VTJSC in `credentialSchema`.

In our previous example, that would mean an ExampleCredential should look like this example:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2"
  ],
  "id": "urn:uuid:7f3c9a2e-9c8e-4f6e-9c0b-1e3f2d8a91ab",
  "type": ["VerifiableCredential", "VerifiableTrustCredential", "ExampleCredential"],
  "issuer": "did:example:authorized-issuer",
  "validFrom": "2010-01-01T19:23:24Z",
  "validUntil": "2020-01-01T19:23:24Z",
  "credentialSubject": {
    "id": "did:example:holder"
    // ... attributes required by the referenced credential schema
  },
  "credentialSchema": {
    "id": "https://ecosystem/schemas-example-vtjsc.json",
    "type": "JsonSchemaCredential"
  }
}
```

Note that `credentialSchema.id` points at the **VTJSC** issued by the ecosystem DID (a JSON Schema Credential), not at the raw JSON schema: this is what lets a verifier walk back from the credential to the ecosystem that governs its schema.

:::tip Issuance time is not self-asserted
A VTC does not rely on an issuer-asserted `issuanceDate`. The issuer canonicalizes the credential ([JCS, RFC 8785](https://www.rfc-editor.org/rfc/rfc8785)), computes a digest with the `digest_algorithm` of the credential schema, and anchors it in the VPR. Verifiers recompute the digest and use the `created` timestamp of the matching [`Digest`](./digest) entry as the **effective issuance time**, then check that the issuer was authorized at that time.
:::

## Presenting credentials in a DID Document

Public VTCs are presented in the holder's DID Document as [linked verifiable presentations](https://identity.foundation/linked-vp/). A DID Document may present any number of them; each presentation must be signed by the DID controller and declared with a `LinkedVerifiablePresentation` service entry whose fragment **starts with `#vpr-schemas-` and ends with `-vtc-vp`**:

```json
"service": [
    {
      "id": "did:example:issuer#vpr-schemas-example-vtc-vp",
      "type": "LinkedVerifiablePresentation",
      "serviceEndpoint": ["https://example.com/vpr-schemas-example-vtc-vp.json"]
    }
    ...
  ]
```

The Essential Credential Schema VTCs use reserved fragments: `#vpr-schemas-service-vtc-vp` for the Service credential, `#vpr-schemas-org-vtc-vp` for the Organization credential, and `#vpr-schemas-persona-vtc-vp` for the Persona credential. See [Trust Resolution](../verifiable-trust/trust-resolution) for what a verifiable service must present.

:::note Private credentials stay out of DID Documents
The User Agent and Badge Essential Credentials are issued as AnonCreds credentials (they are held by user-agent instances and by humans) and **must not** be declared in a DID Document. They are presented over DIDComm with selective disclosure and unlinkable proofs.
:::

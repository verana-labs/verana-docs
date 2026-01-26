# Setting up your Organization VS Agent

The initial step is to get your own Organization Credential, and link it to your agent, so it will expose it in  properly show it. 

## Load the Organization Verifiable Trust Credential

To make your service *trustable*, it needs to present valid Verifiable Trust Credentials signed by a trusted entity.

Agent credentials are managed by a single REST endpoint `/vt/linked-credentials`, where you can add (POST), list (GET) or remove (DELETE) VTCs issued to your DID.

All credentials listed here will be exposed in agent's *DID Document*, in the form of Linked Verifiable Presentations.

So for example, suppose we have the contents of our organization credential, which is a JSON document with the format:

```
{
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "id": "did:webvh:QmezdSCEV9sgDi7ve5vMX67EUtxn682GUTHLt9YpqFobj5:dm.ecosystem...",
    "type": [
      "VerifiableCredential",
      "VerifiableTrustCredential"
    ],
    "issuer": "did:webvh:QmbL6mTMPaBsYCJq2mc2zu85hSDunvuESRt4WbrNU98rci:dm.trust-registry....",
    "issuanceDate": "2026-01-09T16:44:53.053Z",
    "expirationDate": "2036-01-07T16:44:53.053Z",
    "credentialSubject": {... },
    "credentialSchema": { ... },
    "proof": { ... }
  }
```

Now you can do a POST to `/v1/linked-credentials` to link it to your organization agent, with the following body:

```
{
  "schemaBaseId": "organization",
  "credential": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "id": "did:webvh:QmezdSCEV9sgDi7ve5vMX67EUtxn682GUTHLt9YpqFobj5:dm.ecosystem...",
    "type": [
      "VerifiableCredential",
      "VerifiableTrustCredential"
    ],
    "issuer": "did:webvh:QmbL6mTMPaBsYCJq2mc2zu85hSDunvuESRt4WbrNU98rci:...",
    "issuanceDate": "2026-01-09T16:44:53.053Z",
    "expirationDate": "2036-01-07T16:44:53.053Z",
    "credentialSubject": {
      "name": "My Organization",
      "logo": "https://myhost/logo.png",
      "registryId": "REG-123",
      "registryUrl": "https://registry.example.org",
      "address": "123 Main St, San Francisco, CA",
      "type": "PRIVATE",
      "countryCode": "US",
      "id": "did:webvh:Qmbqjd5ud1FjuGejL39tKsqjFTRLyrSoB5JXdwq3AYaYCw:myhost.ngrok-free.app"
    },
    "credentialSchema": {
      "id": "https://dm.trust-registry..../vt/schemas-organization-jsc.json",
      "type": "JsonSchemaCredential"
    },
    "proof": {
      "verificationMethod": "did:webvh:QmbL6mTMPaBsYCJq2mc2zu85hSDunvuESRt4WbrNU98rci:dm.trust-registry...io#z6MkqgdVMffbpjMhiZhhiYAyQjnMCpKxAJvz9sD5km4nJyJz",
      "type": "Ed25519Signature2020",
      "created": "2026-01-09T16:44:53Z",
      "proofPurpose": "assertionMethod",
      "proofValue": "zazbHCLe53vjpd47NpQ3VEbEc3LvdRtsMz4PKC1cdFtuKe8Qoce4mRooRVjB4419iMeoe2LhN6kppcrDSxWtPt9B"
    }
  }
}
```

Now, your organization agent will be discoverable and valid from Verifiable Trust specification point of view and it is able to issue Service VTCs.

## Issue your Service Verifiable Trust Credential

Service agents are similar to Organization agents, in the sense that they also need to link a valid VTC in order to be discoverable in a verifiable fashion. The difference is that now is your Organization agent who will be in charge of issuing a VTC for it. This is done through a POST to `/v1/vt/issue-credential` endpoint, with a body like this one:

```
{
  "format": "jsonld",
  "did": "did:webvh:QmQUBuaSJWQmW7bzSbhKCzPRZt64jzXecSLx45eFe11VUy:welcome.hologram.dev.2060.io",
  "jsonSchemaCredentialId": "https://dm.trust-registry..../vt/schemas-service-jsc.json",
  "claims": {
    "name": "My first service!",
    "logo": "https://service/logo.png",
    "type": "Information",
    "description": "My first Verifiable Service",
    "minimumAgeRequired": 1,
    "termsAndConditions": "https://example.com/terms",
    "privacyPolicy": "https://example.com/privacy",
    "id": "did:webvh:QmQUBuaSJWQmW7bzSbhKCzPRZt64jzXecSLx45eFe11VUy:myservice.com"
  }
}
```

Where `did` is your service's DID, and the JSON Schema Credential ID is the one corresponding to services in the ecosystem your organization is onboarded and has permissions to issue Service VTCs.

The response of this HTTP request will contain the JSON document you need to load in your service, which we'll see in the following section.
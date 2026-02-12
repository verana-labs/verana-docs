# Issuing and Verifying credentials

In this section we'll learn how we can use our Verifiable Service to issue and verify credentials, 

## Anonymous credential issuance

In previous sections, we have seen how we can issue VTC for other entities, in order to let them be discoverable and trusted. But what happens when we want to issue credentials for end users, where we may want to enforce privacy-preserving features such as avoiding correlation between presentations? For such cases, we can leverage the properties of *anonymous credentials* (AnonCreds).

Unlike other W3C-compatible credentials like the JSON-LD ones we use for entities, AnonCreds credentials do not have a subject DID: they are actually issued to users through a DIDComm connection where the user agent blindly provides key material that will it later will use to demonstrate the credential has been issued to it.

Such protocol requires some more complexities than regular W3C credentials, and therefore it is needed to do some previous steps to prepare agents to issue this kind of credentials.

### Creating a Credential Type

In VS Agent, we organize the different credentials the agent is capable of issuing in *types*. At the moment, we define types only for AnonCreds credentials. The process of creating a new type involves the creation of an AnonCreds Credential Definition as well as revocation registries (if the credentials are revocable). Once this is set-up, the agent can issue credentials of this type and other agents can use its *Credential Definition ID* to reference it, for either issuing or verifying credentials of this type.

To create a new credential type, we just need to specify the JSON Schema Credential ID the type is based on, so VS Agent can conform the corresponding schema  and link the Credential Definition to it. It will be important that your DID has the permissions to issue credentials based on this JSON Schema Credential: otherwise, the Verifiable Trust check will fail.

Suppose we are going to use https://dm.gov-id-tr.demos.2060.io/vt/schemas-gov-id-jsc.json as the base JSON Schema Credential ID. We simply perform a POST request to create it:

```
curl -X 'POST' \
  'http://localhost:3000/v1/credential-types' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "govid",
  "version": "1.0",
  "relatedJsonSchemaCredentialId": "https://dm.gov-id-tr.demos.2060.io/vt/schemas-gov-id-jsc.json",
}'
```

You will get a response like the following:

```
{
  "id": "did:webvh:Qmbqjd5ud1FjuGejL39tKsqjFTRLyrSoB5JXdwq3AYaYCw:myhost.ngrok-free.app/resources/zQmZihfs2uHkjgQW3sW9eijtyntDUN7v9CczGhTecg57943",
  "name": "gov-id",
  "version": "1.0",
  "attributes": [
    "birthDate",
    "credentialIssuanceDate",
    "documentExpirationDate",
    "documentIssuingState",
    "documentNumber",
    "documentType",
    "facePhoto",
    "firstName",
    "lastName",
    "mrzData",
    "nationality",
    "sex"
  ],
  "supportRevocation": true,
  "relatedJsonSchemaCredentialId": "https://dm.gov-id-tr.demos.2060.io/vt/schemas-gov-id-jsc.json"
}
``` 

The `id` corresponds to the AnonCreds Credential Definition, and it is the one you should use to refer to this credential type, either for issuance or for verification.

### Creating a credential offer

Now you have your anonymous credential type properly set up, you can start issuing credentials based on it. For that purpose, you can create a **Credential Offer**, which is an invitation for users to get their credential. This is a DIDComm invitation that is usually rendered in a QR code, to be scanned by a compatible application, such as [Hologram Messaging](https://hologram.zone).

In order to create your offer, you just need to POST to `/v1/invitation/credential-offer`:

```
curl -X 'POST' \
  'http://localhost:3000/v1/invitation/credential-offer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "credentialDefinitionId": "did:webvh:Qmbqjd5ud1FjuGejL39tKsqjFTRLyrSoB5JXdwq3AYaYCw:myhost.ngrok-free.app/resources/zQmZihfs2uHkjgQW3sW9eijtyntDUN7v9CczGhTecg57943",
  "claims": [
    {
      "name": "birthDate",
      "value": "010100"
    },
    {
      "name": "credentialIssuanceDate",
      "value": "010100"
    },
    {
      "name": "documentExpirationDate",
      "value": "010100"
    },
    {
      "name": "documentIssuingState",
      "value": "EE"
    },
    {
      "name": "documentNumber",
      "value": "ABC123456"
    },
    {
      "name": "documentType",
      "value": "P"
    },
    {
      "name": "facePhoto",
      "value": "None"
    },
    {
      "name": "firstName",
      "value": "John"
    },
    {
      "name": "lastName",
      "value": "Doe"
    },
    {
      "name": "mrzData",
      "value": "TBD"
    },
   {
      "name": "nationality",
      "value": "EE"
    },
   {
      "name": "sex",
      "value": "M"
    }
  ]
}'
```

 The response will have some contents like the following:

```
{
  "credentialExchangeId": "9235f80a-4514-4e51-9295-226ea669d803",
  "url": "https://hologram.zone/?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiIyYzk2ZWUyZC00N2ZhLTQ5YTgtODY5Yy00MTA0NDcxMjUxOTEiLCJsYWJlbCI6IlRlc3QgVl....TNOVFJtWVdWbE9UWmhJbjE5In19XX0",
  "shortUrl": "https://myhost.ngrok-free.app/s?id=2afff380-cee0-48df-b5b1-2826dfc3593e"
}
```

Here you'll see a long URL and a short one. You can use `shortUrl` to render a mobile-friendly QR code that can be scanned with Hologram. You'll be able to accept your credential to save it in Hologram wallet and use it later on to present to other services.

:::note 
TODO Add Hologram screenshots
:::

## Anonymous credential verification

If you want to get data from users holding an AnonCreds credential, you will need to create ea Proof Request. The process is similar to the one for offers: you create a DIDComm invitation, that is scanned by the user with their User Agent (in these examples Hologram), and once they accept the request, they share information with your service, which will be able to verify the authenticity of it.

An interesting feature of these credentials is the **Selective Disclosure**, which means that you can ask only for those fields you are interested in. This way, users can be more confident since they will reveal only those claims your service really needs.

Suppose you want to get the `firstName` and `lastName` of a valid GovId credential: you can create the invitation by performing a POST to `/v1/invitation/presentation-request` as follows:

```
curl -X 'POST' \
  'http://localhost:3000/v1/invitation/presentation-request' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "ref": "1234-5678",
  "callbackUrl": "http://localhost:4000/mycallbackurl",
  "requestedCredentials": [
    {
      "credentialDefinitionId": "did:webvh:Qmbqjd5ud1FjuGejL39tKsqjFTRLyrSoB5JXdwq3AYaYCw:myhost.ngrok-free.app/resources/zQmZihfs2uHkjgQW3sW9eijtyntDUN7v9CczGhTecg57943",
      "attributes": [
        "firstName", "lastName"
      ]
    }
  ]
}'
```

The response will follow this structure:

```
{
  "proofExchangeId": "afedce07-c8c4-4c45-828c-0a84d0ee2766",
  "url": "https://hologram.zone/?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YFp...B6WlRjMkxUUTNaR0l0T1RNell5MWpNakl6WVdWaU5qTmhaRGtpZlgwPSJ9fV19",
  "shortUrl": "https://myhost.ngrok-free.app/s?id=687e29c1-2a43-4774-845b-4878ad069359"
}
```

Again, use `shortUrl` to render a QR code that can be scanned by Hologram. Once the user accepts it, you'll get the data... but how, you may be wondering! This is where the optional fields `callbackUrl` and `ref` make sense:

VS Agent will perform an HTTP POST to the callback URL you specified, using the following structure:

```
{
  "ref": "1234-5678",
  "presentationRequestId": "unique identifier for the flow",
  "status": "PresentationStatus",
  "claims": [
    { "name": "attribute-1", "value": "value-1" },
    { "name": "attribute-2", "value": "value-2" }
  ]
}
```

This way, you can very easily interface VS Agent for a verifier with any existing backend.




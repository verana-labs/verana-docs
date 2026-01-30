# Issuing and Verifying credentials

In this section we'll learn how we can use our Verifiable Service to issue and verify credentials, 

## Anonymous credential issuance

In previous sections, we have seen how we can issue VTC for other entities, in order to let them be discoverable and trusted. But what happens when we want to issue credentials for end users, where we may want to enforce privacy-preserving features such as avoiding correlation between presentations? For such cases, we can leverage the properties of *anonymous credentials* (AnonCreds).

Unlike other W3C-compatible credentials like the JSON-LD ones we use for entities, AnonCreds credentials do not have a subject DID: they are actually issued to users through a DIDComm connection where the user agent blindly provides key material that will it later will use to demonstrate the credential has been issued to it.

Such protocol requires some more complexities than regular W3C credentials, and therefore it is needed to do some previous steps to prepare agents to issue this kind of credentials.

### Creating a Credential Type

In VS Agent, we organize the different credentials the agent is capable of issuing in *types*. At the moment, we define types only for AnonCreds credentials. The process of creating a new type involves the creation of an AnonCreds Credential Definition as well as revocation registries (if the credentials are revocable). Once this is set-up, the agent can issue credentials of this type and other agents can use its *Credential Definition ID* to reference it, for either issuing or verifying credentials of this type.

To create a new credential type, we just need to specify the JSON Schema Credential ID the type is based on, so VS Agent can conform the corresponding schema  and link the Credential Definition to it. It will be important that your DID has the permissions to issue credentials based on this JSON Schema Credential: otherwise, the Verifiable Trust check will fail.

Suppose we are going to use https://dm.gov-id-tr.demos.2060.io/vt/schemas-gov-id-jsc-vp.json as the base JSON Schema Credential ID. We simply perform a POST request to create it:

```
```

##
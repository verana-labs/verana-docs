# Issuing and Verifying credentials

In this section we'll learn how we can use our Verifiable Service to issue and verify credentials, 

## Anonymous credential issuance

In previous sections, we have seen how we can issue VTC for other entities, in order to let them be discoverable and trusted. But what happens when we want to issue credentials for end users, where we may want to enforce privacy-preserving features such as avoiding correlation between presentations? For such cases, we can leverage the properties of *anonymous credentials* (AnonCreds).

Unlike other W3C-compatible credentials like the JSON-LD ones we use for entities, AnonCreds credentials do not have a subject DID: they are actually issued to users through a DIDComm connection where the user agent blindly provides key material that will it later will use to demonstrate the credential has been issued to it.

Such protocol requires some more complexities than regular W3C credentials, and therefore it is needed to do some previous steps to prepare agents to issue this kind of credentials.

##
# Trust Resolution

## Understanding Trust Resolution

Trust Resolution is as simple as calling a method passing the [DID](https://www.w3.org/TR/did-1.0/) of the service we want to resolve, to display a **Proof-of-Trust** to the end-user:

```json
resolve_trust("did:example:gaia")
```

and receive a response similar to this one:

```json
{
  "did":"did:example:gaia",
  "verified": true,
  "service_provider": {
      "id": "did:example:def",
      "type": "Organization",
      "name": "Gaia Registry LLC",
      "country": "zz",
      "reputation": {
        "issuedCredentials": 1234,
        "verifiedCredentials": 7678,
        "trustDepositValue": 176327.124356,
        "amountSlashed": 0,
        "stars": 5.0
      },
      "issuer": "did:example:zzz",
      ...
  },
  "service": {
      "name": "Gaia Registry",
      "termsAndConditions": "http://example.com",
      "privacyPolicy": "http://example.com",
      "minimumAgeRequired": 16,
      "description": "Create your Metaverse ID at Gaia Registry! Protect your identity with biometrics and easily recover it if you loose your phone. Use your Gaia Identity to connect to fancy services with no password."
      ...
  },
  "credentials" : [
    {
      "type": "TrademarkCredential",
      ...
    }
  ]
  ...
}
```

Let's explain how the Verifiable Trust does it.

## Proof-of-Trust

The **Don't Trust, Verify** principle applied here:

<Image url="/img/vt-creds-explained.png" floating="none" caption="Proof-of-Trust and Trust Resolution" border="1px solid #DDDDDD" align="center"/>

The core idea behind Verifiable Trust is simple: trust should not be implicit, but it should be verifiable, transparent, and decentralized.

In this example, a Verifiable Service (VS) presents several Verifiable Credentials to prove:

- Who operates the service, using an Essential Credential Schema (ECS) Service Verifiable Trust Credential (data shown in red)
- What the service offers, using another ECS Service Verifiable Trust Credential (data shown in blue)
- Trademark information, using a Trademark Verifiable Trust Credential (data shown in green)

Additionally, the Verifiable Service presents computed reputation information (data shown in black). While this reputation data may support trust decisions, it is not directly defined by this specification. Refer to the [VPR Spec](https://verana-labs.github.io/verifiable-trust-vpr-spec/) for more information.

Verifiable Trust introduces the following core concepts, concepts that are fully presented in this documentation:

- Verifiable Service (VS)
- Verifiable User Agent (VUA)
- Verifiable Public Registry (VPR)
- Verifiable Trust Credentials (VTC)
- Essential Credential Schemas (ECS)

The Proof-of-Trust is established by recursively resolving the credentials presented by (in this example) a service. What makes this trust verifiable is the use of cryptographic mechanisms built into Decentralized Identifiers (DIDs) and Verifiable Credentials, as applied across these five key concepts.

Because these concepts are deeply interdependent, you may need to explore them together, and revisit them several times to fully grasp the Verifiable Trust model.

## Where trust resolution reads from: the DID Document

Everything trust resolution needs is published in DID Documents, as `service` entries. Two kinds of DID Document matter.

### The DID Document of a verifiable service

A verifiable service must be identified by a DID that resolves to a DID Document presenting, as linked verifiable presentations:

- a **Service** ECS credential (`#vpr-schemas-service-vtc-vp`) — mandatory;
- **exactly one** of an **Organization** (`#vpr-schemas-org-vtc-vp`) or **Persona** (`#vpr-schemas-persona-vtc-vp`) ECS credential — presented by the service itself when it issued its own Service credential, or by the DID Document of the issuer of that Service credential otherwise.

That is what binds every verifiable service to an accountable legal entity or natural person.

The same DID Document declares the endpoints through which the service is actually consumed. It must declare **at least one `DIDCommMessaging` entry**: DIDComm is the bootstrapping channel over which trust is established and over which credentials, tokens, and other authentication material for the remaining endpoints are obtained. It may declare any number of additional endpoints (MCP, A2A, a plain website, ...):

```json
"service": [
  {
    "id": "did:example:service#vpr-schemas-service-vtc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://example.com/vpr-schemas-service-vtc-vp.json"]
  },
  {
    "id": "did:example:service#vpr-schemas-org-vtc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://example.com/vpr-schemas-org-vtc-vp.json"]
  },
  {
    "id": "did:example:service#didcomm",
    "type": "DIDCommMessaging",
    "serviceEndpoint": {
      "uri": "https://example.com/didcomm",
      "accept": ["didcomm/v2"],
      "routingKeys": []
    }
  },
  {
    "id": "did:example:service#mcp",
    "type": "MCP",
    "serviceEndpoint": "https://example.com/mcp"
  },
  {
    "id": "did:example:service#a2a",
    "type": "A2A",
    "serviceEndpoint": "https://example.com/a2a"
  },
  {
    "id": "did:example:service#website",
    "type": "LinkedDomains",
    "serviceEndpoint": "https://example.com/"
  }
]
```

The `LinkedVerifiablePresentation` entries are **identity layer**: they are consumed *during* trust resolution and are not consumable service endpoints. A peer must trust-resolve the DID — and succeed — **before** using `#didcomm`, `#mcp`, `#a2a` or `#website`. In practice DIDComm is the control plane of a verifiable service and the other endpoints are its data plane.

:::note
The `MCP` and `A2A` type strings are illustrative: ecosystems are free to standardize type names for emerging protocols. What is required is DID Core `service` syntax, and at least one `DIDCommMessaging` entry.
:::

### The DID Document of an ECS ecosystem

Trust resolution terminates at an **ecosystem DID**, which is the issuer of the Verifiable Trust JSON Schema Credential (VTJSC) behind each credential. An ecosystem that provides Essential Credential Schemas must present, in its DID Document, one self-issued VTJSC per ECS, under these five exact fragments:

```json
"service": [
  {
    "id": "did:example:ecosystem#vpr-schemas-service-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-service-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-schemas-org-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-org-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-schemas-persona-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-persona-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-schemas-ua-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-ua-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-schemas-badge-vtjsc-vp",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": ["https://ecosystem/ecs-badge-vtjsc-vp.json"]
  },
  {
    "id": "did:example:ecosystem#vpr-schemas-ecosystem-1234",
    "type": "VerifiablePublicRegistry",
    "version": "1.0",
    "serviceEndpoint": ["vpr:verana:vna-mainnet-1"]
  }
]
```

The `VerifiablePublicRegistry` entry tells a resolver **which VPR** to verify the ecosystem's schema entries against: its `serviceEndpoint` carries the `vpr:` scheme prefix of that registry (`vpr:verana:vna-mainnet-1` for Verana mainnet, `vpr:verana:vna-testnet-1` for testnet). Individual schemas are referenced from the VTJSCs with `vpr:verana:<vpr-id>:cs:<credential-schema-id>` URIs.

See [Essential Credential Schemas](./ecs) and [Credential Schemas](../verifiable-public-registry/credential-schema) for how these entries are produced.

## How trust resolution runs

Given a DID, resolution is **recursive**, and each step is verifiable:

1. **Resolve the DID** and fetch the linked verifiable presentations declared in its DID Document.
2. **Verify each credential**: the signature for W3C VTCs, the zero-knowledge proof for AnonCreds VTCs.
3. **Resolve the VTJSC** referenced by each credential (directly via `credentialSchema.id` for W3C VTCs, via the credential definition's `relatedJsonSchemaCredentialId` for AnonCreds VTCs), verify its signature, and confirm it is issued by an ecosystem DID and binds to a `Credential Schema` entry that exists in the VPR.
4. **Determine the effective issuance time** of W3C VTCs by recomputing the credential digest and looking it up in the VPR: the `created` timestamp of the [`Digest`](../verifiable-public-registry/digest) entry is the issuance time.
5. **Check issuer authorization** in the VPR: for W3C VTCs, the issuer must have held the relevant issuer `Participant` entry *at that effective issuance time*; for AnonCreds VTCs, the issuer must be authorized now.
6. **Recurse into the issuer**: every DID encountered as an issuer must itself resolve as a verifiable service and have its own credentials verified the same way.

The recursion terminates at the **ecosystem DID** — the issuer of the VTJSC, and the trust root. If any step fails, trust resolution fails, and the credential or the connection is rejected.

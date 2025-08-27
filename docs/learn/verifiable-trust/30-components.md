# Verifiable Trust Components

## Verifiable Service (VS)

A verifiable service (VS) is a service, uniquely identified by a [DID](https://www.w3.org/TR/did-1.0/), that can authenticate itself to a peer by presenting [verifiable credentials](https://www.w3.org/TR/vc-data-model-2.0/) before any connection is initiated.

```plantuml
@startuml

object "Verifiable Service" as vsa #3fbdb6 {
    *Public DID
    *Linked-VP credentials
    *VC wallet
    *Keys
    +Crypto wallet
    +Connections
}
```

:::tip
Verifiable services can be hosted anywhere, based on service provider (organization, person) decision.
:::

Peers wishing to connect to a VS can **review the verifiable credentials presented by the service**, verify their legitimacy through trust resolution, and **decide whether to proceed with the connection based on the outcome**.

A VS is also required to verify the trustworthiness of peers attempting to connect to it, whether those peers are other verifiable services (VS) or verifiable user agents (VUAs), and must reject connections from non-verifiable peers.

Furthermore, if a verifiable service wants to issue credentials or request credential presentation, **it must first prove that it is authorized to perform these actions**. Otherwise, the peer must refuse the request.

```plantuml
@startuml

[Verifiable Public Registry (VPR)] as VPR #D88AB3


package "Verifiable Service #1 (VS1)" as VS1 #3fbdb6 {
  [Service Agent] as VS1sa 
  [Backend, store,...] as VS1b 
   VS1sa <--> VS1b
}
[Trust Resolver] as VS1tr
    [VPR Indexer] as VS1idx
    VS1sa --> VS1tr
    VS1tr --> VS1idx


interface VS3 #3fbdb6
interface VS4 #3fbdb6




VS1tr --> VPR
VS1tr --> VS3
VS1tr --> VS4

VS1idx --> VPR


@enduml

```

:::tip
All the verifications are performed by the VS by using the trust resolver component. Indexer component is used for service discovery.
:::

Examples of verifiable services include:

- chatbot services, such as services built for [Hologram Messaging](https://hologram.zone)
- decentralized social channels;
- etc...

## Verifiable User Agent (VUA)

A verifiable user agent (VUA) is software, such as a browser, app, or wallet, designed to connect with verifiable services (VS) and other VUAs. When establishing connections, a VUA must verify the identity and trustworthiness of its peers and allow connections only to compliant VS or VUA peers.

```plantuml
@startuml

object "Verifiable User Agent Instance" as hi1 #b99bce {
    *Keys
    *Connections
    +VC wallet
    +Crypto wallet
    
}
```

As part of this process, the verifiable user agent (VUA) must perform trust resolution by:

- Verifying the verifiable credentials presented by peers;

- Querying verifiable public registries (VPRs) to confirm that the credentials were issued by recognized and authorized issuers.

This ensures that all connections are established on the basis of verifiable trust, rather than assumptions.

In addition, VUAs can query an index (the DID directory, managed by the VPR - see below) that catalogs all known verifiable services (VSs), to search VSs compatible with the VUA or VSs that present a certain type of credential. This enables:

- users to search for and discover relevant services: for example, within a social browser VUA, a user could search for a social channel VS by querying the index for an influencer’s name.

- VUA vendors to require VSs to present a certain type of credential (free or paid) for being listed in the VUA, of for having specific features in the VUA (premium, etc).

```plantuml
@startuml

[Verifiable Public Registry (VPR)] as VPR #D88AB3


package "Service Provider #1 Hosted Services" as VSP  {
  [Verifiable Service #1] as VS1sa #3fbdb6
  [Verifiable Service #2] as VS2sa #3fbdb6
  
    [Trust Resolver] as VS1tr
    [VPR Indexer] as VS1idx
    VS1sa --> VS1tr
    VS1idx <-- VS1tr

    VS2sa --> VS1tr
}

interface VS2 #3fbdb6
interface VS3 #3fbdb6
interface VS4 #3fbdb6


package "Verifiable User Agent (VUA) Provider Services" as App1 {
    actor "User #1" as user1
actor "User #2" as user2
  [VUA Instance #1-1] as VUA11 #b99bce
  [VUA Instance #1-2] as VUA12 #b99bce
    [Trust Resolver] as VUAtr
    [VPR Indexer] as VUAidx

}

VUAtr --> VS2

VUAidx --> VPR

VUAidx <-- VUAtr

VS1tr --> VS3
VS1tr --> VS4

VS1idx --> VPR


VUA12 --> VUAtr : queries
VUA11 --> VUAtr : queries

VUA12 <--> VUA11 : p2p

user1 ..> VUA11 : use
user2 ..> VUA12 : use

VUA12 -->  VS1sa

@enduml

```

[Hologram Messaging](https://hologram.zone), a chatbot and AI agent browser, is the **first known verifiable user agent**.

## Verifiable Public Registry (VPR)

### Trust Registries

A VPR is a **“registry of registries”**, a public, permissionless service that provides foundational infrastructure for decentralized trust ecosystems, as specified in the [Verifiable Public Registry (VPR) specification](https://verana-labs.github.io/verifiable-trust-vpr-spec/).

It is used by ecosystems that want to define credential schemas and who can issue or verify credentials of these schemas.

Purpose of a VPR is to answer these questions:

- is participant #1 **recognized** by ecosystem E1?
- can participant #1 **issue credential** for schema ABC of ecosystem E1?
- can participant #2 request **credential presentation** of credential issued by issuer DEF from schema GHI of ecosystem E2 in context CONTEXT?

[VPRs are detailed here](../verifiable-public-registry/20-trust-registries.md).

### DID Directory

Added to trust registry features, the VPR provides a **DID directory**: a public database of [DIDs](https://www.w3.org/TR/did-1.0/). It allows crawlers and search engines to index metadata associated with **verifiable services (VSs)** provided by these DIDs.

## Indexer

A VPR records its state on-ledger, where storage is expensive. Consequently, on-chain entries are kept minimal.
The Indexer bridges that gap:

- Listens to ledger events and fetches every new or updated record.
- Builds a compact off-chain index that powers fast, user-friendly queries.

The resulting index lets you search across all ecosystem metadata, including:

- Ecosystem & Trust Registry details: names, governance-framework versions, credential-schema summaries...
- Permissions,
- ...

This approach keeps the blockchain lean while still delivering rich, searchable insight to wallets, services, and analytics tools.

## Trust Resolver

The Trust Resolver:

- recursively processes the credentials listed in a DID Document, consults relevant VPRs, and returns a concise Proof-of-Trust summary. Callers can then decide whether the resolved [DIDs](https://www.w3.org/TR/did-1.0/) and the services it represents are trustworthy.
- provides a TRQP 2.0 endpoint.

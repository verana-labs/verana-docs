# Introduction to Verifiable Trust

## Verifiable Service (VS)

A **Verifiable Service (VS)** is a service, identified with a DID, that is capable, by presenting **verifiable credentials**, of identifying itself to a peer *before any connection is established*.

```plantuml
@startuml

object "Verifiable Service" as vsa #3fbdb6 {
    *Public DID
    *Linked-VP credentials
    +VC wallet
    +Crypto wallet
    +Keys
    +Connections
}
```

Peers wishing to connect to a VS can **review the verifiable credentials presented by the service**, verify their legitimacy through trust resolution, and **decide whether to proceed with the connection based on the outcome**.

A VS is also required to verify the trustworthiness of peers attempting to connect to it, whether those peers are other verifiable services (VS) or verifiable user agents (VUAs), and must reject connections from non-verifiable peers.

Furthermore, if a verifiable service wants to issue credentials or request credential presentation, **it must first prove that it is authorized to perform these actions**. Otherwise, the peer must refuse the request.

Examples of verifiable services includes services built for [Hologram Messaging](https://hologram.zone).

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

As part of this process, the VUA must perform trust resolution by:

- Verifying the verifiable credentials presented by the peers
- Querying verifiable public registries (VPRs) to confirm that these credentials were issued by recognized and authorized issuers.

This ensures that all connections are based on verifiable trust, not assumptions.

[Hologram Messaging](https://hologram.zone), a chatbot and AI agent browser, is the **first known verifiable user agent**.

## Build for decentralization

Connections between verifiable services (VSs) and/or verifiable user agents (VUAs) are fully decentralized and verifiable.

In the example below, we have two verifiable user agents #1 and #2 from different vendors. Instances of these compliant VUAs can establish connections with other instances, and with verifiable services from all organizations. Verifiable services can connect to other verifiable services.

:::tip
Verifiable services can be hosted anywhere, based on service provider (organization, person) decision.
:::

```plantuml
@startuml



package "Verifiable Services (VSs)" {
  cloud "Hosting Organization #A" as hostingA #f0f0f0{
    [VS Instance #A1] as AVS1 #3fbdb6
    [VS Instance #A2] as AVS2 #3fbdb6
    [VS Instance #A3] as AVS3 #3fbdb6
    
    }

    cloud "Hosting Organization #B" as hostingB #f0f0f0 {
    [VS Instance #B1] as BVS1 #3fbdb6
    [VS Instance #B2] as BVS2 #3fbdb6
    
    
    }

    cloud "Hosting Person #C" as hostingC #f0f0f0 {
    [VS Instance #C1] as CVS1 #3fbdb6
    
    
    }
}

package "Verifiable User Agent (VUA) #1" as App1 {
    actor "User #1" as user1
actor "User #2" as user2
actor "User #n" as usern
  [VUA Instance #1-1] as VUA11 #b99bce
  [VUA Instance #1-2] as VUA12 #b99bce
  [VUA Instance #1-n] as VUA1n #b99bce
  
}

package "Verifiable User Agent (VUA) #2" as App2 {
    actor "User #4" as user4
actor "User #k" as userk
  [VUA Instance #2-1] as VUA21 #BC5A91
  [VUA Instance #2-n] as VUA2n #BC5A91
  
}

VUA11 <--> AVS1 : p2p
VUA11 <--> BVS2 : p2p

VUA21 <--> AVS3 : p2p

VUA12 <--> AVS1 : p2p
VUA12 <--> CVS1 : p2p

VUA1n <--> AVS3 : p2p

VUA12 <--> VUA1n : p2p

VUA21 <--> VUA2n : p2p

user1 ..> VUA11 : use
user2 ..> VUA12 : use
usern ..> VUA1n : use
user4 ..> VUA21 : use
userk ..> VUA2n : use


VUA2n <--> VUA1n : p2p

VUA2n <--> CVS1 : p2p

BVS1 <--> CVS1 : p2p

@enduml

```
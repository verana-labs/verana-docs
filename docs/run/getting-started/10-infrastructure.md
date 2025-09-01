# Verana Infrastructure

🌐 **Verana** is a **decentralized infrastructure** made up of **core components** plus a suite of **add-on modules** for extended functionality.

## Core Components

| **Component**   | **Purpose**                                                  |
|-----------------------|------------------------------------------------------------------|
| [Network Node (verana-blockchain)](https://github.com/verana-labs/verana-blockchain)    | a cosmos-SDK [Verifiable Public Registry](https://verana-labs.github.io/verifiable-trust-vpr-spec/) implementation       |
| [Indexer (verana-indexer)](https://github.com/verana-labs/verana-indexer)  | Container for indexing ledger data|
| [Trust Resolver (verana-resolver)](https://github.com/verana-labs/verana-resolver)  | Provide an extensive REST API for searching indexed and verified data. Includes a [Trust Registry Query Protocol (TRQP) v2 endpoint](https://trustoverip.github.io/tswg-trust-registry-protocol/)|
| [Verana Frontend (verana-frontend) ](https://github.com/verana-labs/verana-frontend)  | End-user Verana Frontend for using VPR features|

```plantuml
@startuml

package "Full Deployment #1" as deploy1  {
    [Network Node] as vpr1 #D88AB3

    [Indexer] as idx1
    [Resolver] as rslv1
    [Frontend] as frontend1 #3fbdb6

    idx1 --> vpr1
    frontend1 --> idx1
    frontend1 --> rslv1
    frontend1 --> vpr1
    rslv1 --> idx1


}

package "Full Deployment #2" as deploy2  {
    [Network Node] as vpr2 #D88AB3

    
    [Indexer] as idx2 
    [Resolver] as rslv2
    [Frontend] as frontend2 #3fbdb6

    idx2 --> vpr2
    frontend2 --> idx2
    frontend2 --> rslv2
    frontend2 --> vpr2
    rslv2 --> idx2

}

package "Partial Deployment #3" as deploy3  {
    [Network Node] as vpr3 #D88AB3


}

vpr1 <--> vpr2
vpr2 <--> vpr3
vpr3 <--> vpr1

@enduml

```

:::tip
These components can be run by anyone and hosted anywhere. For security considerations, it is **suggested**, for **Verifiable Service** and/or **Verifiable User Agent** providers, to run all essential components.
:::

## Add-on Modules

- a [ping.pub block explorer](https://github.com/verana-labs/pingpub-explorer);
- a [faucet chatbot](https://github.com/verana-labs/verana-faucet-hologram-chatbot).

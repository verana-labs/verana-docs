# Components

## Built for decentralization

The Verana Verifiable Trust Network is composed of 4 essential components:

| **Component**   | **Purpose**                                                  |
|-----------------------|------------------------------------------------------------------|
| [Network Node (verana-blockchain)](https://github.com/verana-labs/verana-blockchain)    | a cosmos-SDK [VPR](https://verana-labs.github.io/verifiable-trust-vpr-spec/) implementation       |
| [Verre](https://github.com/verana-labs/verre) **Ver**ana **Re**solver   | typescript library for resolving trust|
| [Indexer](#)  | Container for indexing ledger data by resolving trust|
| [Verana Frontend](https://github.com/verana-labs/verana-frontend)  | End-user Verana Frontend for using VPR features|


```plantuml
@startuml

package "Full Deployment #1" as deploy1  {
    [Network Node] as vpr1 #D88AB3

    [Verre Resolver] as verre1 #3fbdb6
    [Indexer] as idx1
    [Frontend] as frontend1

    idx1 --> vpr1
    frontend1 --> idx1
    frontend1 --> vpr1
    idx1 --> verre1
    verre1 --> vpr1

}

package "Full Deployment #2" as deploy2  {
    [Network Node] as vpr2 #D88AB3

    [Verre Resolver] as verre2 #3fbdb6
    [Indexer] as idx2
    [Frontend] as frontend2

    idx2 --> vpr2
    frontend2 --> idx2
    frontend2 --> vpr2
    idx2 --> verre2
    verre2 --> vpr2

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
These components can be run by anyone and hosted anywhere. For security considerations, it is best for Verana Network users to run all components. But this is not required and depends on use case: you can run node only, deploy a frontend and use indexer + node of a third party...
:::

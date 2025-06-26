# Verana Components

🌐 **Verana** is an Infrastructure Built for Decentralization, and is composed of **essential components** and other **adds-on** components.

## Essential Components

| **Component**   | **Purpose**                                                  |
|-----------------------|------------------------------------------------------------------|
| [Network Node (verana-blockchain)](https://github.com/verana-labs/verana-blockchain)    | a cosmos-SDK [VPR](https://verana-labs.github.io/verifiable-trust-vpr-spec/) implementation       |
| [Verre](https://github.com/verana-labs/verre) **Ver**ana **Re**solver   | typescript library for resolving trust|
| [Indexer](#)  | Container for indexing ledger data by resolving trust. Provide an extensive REST API for searching any data, and includes a [Trust Registry Query Protocol (TRQP) v2 endpoint](https://trustoverip.github.io/tswg-trust-registry-protocol/)|
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
These components can be run by anyone and hosted anywhere. For security considerations, it is **suggested**, for **Verifiable Service** and/or **Verifiable User Agent** providers, to run all essential components.
:::

## Adds-on Components

- a [ping.pub block explorer](https://github.com/verana-labs/pingpub-explorer);
- a [faucet chatbot](https://github.com/verana-labs/verana-faucet-hologram-chatbot).

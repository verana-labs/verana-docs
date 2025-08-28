# Building a Decentralized Social Network

## The Problem with Today’s Social Networks

Traditional social networks are **centralized platforms** that dictate who can publish, how content is moderated, and how user data is monetized.  
They come with serious drawbacks:

- **Data exploitation**: platforms harvest and sell user data.  
- **Censorship and opaque moderation**: rules are uneven, biased, and controlled by a central authority.  
- **Vendor lock-in**: creators cannot easily move their audience from one network to another.  
- **Fake accounts & bots**: lack of verifiable identity creates fraud and misinformation.  
- **Content provenance**: users can’t prove authorship of posts and media.

The result? A system where users are products, not participants.

## Introducing the Verifiable Trust Social Network Concept

Imagine a social network where creators and communities **own their channels**, manage their own moderation, and connect in a network secured by verifiable trust.  

### 1. Social Channel (Verifiable Service)

A Verifiable Trust Social Network provides an **open source Social Channel Verifiable Service** (a container).  
Any influencer, creator, or community can deploy their own channel in the datacenter of their choice.  

- 100% ownership of data and followers.  
- Channels are **self-hosted**, not platform-dependent.  
- Content is cryptographically signed by the channel’s DID for **provenance**.

### 2. Social Browser (Verifiable User Agent)

A **browser and/or mobile app** that lets users explore decentralized social channels.  
Think of it as a **social browser**: instead of visiting centralized feeds, users navigate across independently hosted channels.

- **Searchable & Discoverable**: through a VPR DID Directory.  
- **Verifiable**: channels present Verifiable Credentials (VCs).  
- **Portable**: no single platform controls visibility.

### 3. Example

```plantuml
@startuml


actor "Alice" as alice
actor "Bob" as bob
actor "Carol" as carol

[Alice's Social Channel] as CHA #3fbdb6
[Bob's Social Channel] as CHB #3fbdb6

[Alice's Social Browser Instance] as VUA #b99bce
[Bob's Social Browser Instance] as VUB #b99bce
[Carol's Social Browser Instance] as VUC #b99bce

[Verana Blockchain] as VPR #D88AB3
[Verana Indexer] as VUAidx #D88AB3
[Trust Resolver] as VUAtr

VUAtr --> VUAidx
VUAidx --> VPR

alice --> VUA : uses
bob --> VUB : uses
carol --> VUC : uses

VUA --> CHA : to administrate
VUB --> CHB : to administrate

VUC --> CHA : to follow
VUC --> CHB : to follow

CHA --> VUAtr
CHB --> VUAtr

VUA --> VUAtr
VUB --> VUAtr
VUC --> VUAtr

note right of CHA
  Presents credential in DID Document:
  - Person or Organization Credential
  - Service Credential
  - Social Channel Credential
  Declare "services" DID Document entries
end note

note left of CHB
  Presents credential in DID Document:
  - Person or Organization Credential
  - Service Credential
  - Social Channel Credential
  Declare "services" DID Document entries
end note


@enduml

```

:::tip
To simplify, we represented a single instance of components Trust Resolver, Verana Indexer, and Verana Blockchain. But, channel owners could decide to deploy their own instance for full decentralization.
:::

## Identity and Trust

To appear in the Social Channel User Agent, channel owners:  

- Attach a **Person Credential (ECS)** to their channel (with an avatar or identity proof).  
- Obtain a **Social Channel Credential** (free or purchased, depends on Social Channel Verifiable User Agent owner) that marks the channel as usable in the Social Channel Verifiable User Agent.  
- Register their **DID** in the **Verana DID Directory**, making the channel indexed and searchable.  

This ensures followers know exactly **who owns the channel**.

## Moderation

- **Channel-level responsibility**: Each creator moderates their own channel.  
- **Credential-based access**: For followers, posting comments or engaging deeply can require presenting a credential (e.g., proof of age, membership, or verified identity).  
- **Credential revocation**: If harmful content is posted by channel owner, or channel not properly moderated by its owner, the ecosystem can revoke the Social Channel Credential, or even the Person Credential.

This creates a **bottom-up, verifiable moderation system** instead of opaque centralized censorship.

## Economics and Incentives

Building around the Verifiable Trust concept enables **privacy-preserving business model**:  

- Social Channels can request presentation of credential of other ecosystems.  
- The Social Network company earns a **User Agent reward** whenever credential flows occur in its app.  
- **Fair, decentralized economics** replace surveillance advertising.

## Why This is Better

- **User Sovereignty**: Creators own their channels, not a corporation.  
- **Verifiable Trust**: DIDs + VCs prove identities and prevent fraud.  
- **Content Provenance**: Every content, post... is signed by channel's DID.
- **Decentralized Moderation**: Community-driven, credential-backed moderation.  
- **Privacy-Preserving Economics**: Monetization without surveillance.  
- **Interoperability**: Channels work across ecosystems, with no vendor lock-in.  

## A Trustable Internet, One Channel at a Time

We just show how the **Verifiable Trust Concept** can reimagine social networking:

- From centralized control to **decentralized ownership**.  
- From opaque moderation to **transparent governance**.  
- From surveillance-driven ads to **privacy-preserving incentives**.  

It’s time to move from “social media platforms” to a **social internet of verifiable services**.  

🚀 With Verana, the future of social networking is **trustable, decentralized, and user-owned**.  

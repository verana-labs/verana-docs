# Case Studies

Remember the purpose of Verana:

- fight against vendor lock-in;
- make the Internet decentralized again;
- protect end-user and organization data;
- enable new privacy-preserving business models;
- let Ecosystems self-govern and onboard participants that are rewarded for the value they are adding to the Ecosystems.

Verana is a solution to the centralization problem that currently exists in the Internet.

Everything starts with *HOW* we have access to the information.

## E-commerce

Let's take a simple example: you'd like to launch a new brand of kid shoes.

1. you design
2. you produce
3. you sell

The first 2 points (design and produce) 

## Hotels

### Being Searchable: Hotel Discovery

The Hotel vertical is an interesting example of a domination that can be reversed.

At the moment, most (or all) users are using brokering services to book their hotels. These brokering services, such as booking.com, expedia, or others, have reached a market domination that is capturing a huge part of the hotel's revenues, indirectly increasing the room cost for users.
Worst, users think they pay less, but obviously at the end they all pay more, because these intermediaries capture part of the value.

All hotels must rely on centralized platforms to be searchable. If they do not appear on these platforms, they do not even exist and will get no reservations.

```plantuml
@startuml

    object "Property" as property #3fbdb6

    object "Expedia" as expedia
    object "Booking" as booking
    object "Agoda" as agoda
    object "Airbnb" as airbnb

    expedia --> property : charge $$$
    booking --> property : charge $$$
    agoda --> property : charge $$$
    airbnb --> property : charge $$$

@enduml

```

> If your property is not searchable in broker services, you have no reservations!

### Hotel Management Systems

For managing your property(ies), there are currently a lot of Hotel Management Systems. Most are paid proprietary solutions, others are open source solutions, cloud based or self-hosted.

In order to prevent vendor lock-in, using an open source solution looks attractive:

- you can host the software anywhere (cloud, self hosted), and in theory move your hosted instance to a new location when needed;
- you have access to, and own your data.
- Property Management System (PMS), Booking Engine, Hotel Website draft for quick hotel website, Hotel Mobile App skeleton for building a custom Hotel mobile app, are usually provided as open source modules.

Usually, business models of these open source solutions are based on:

- the purchasing of software module add-ons, such as Hotel Channel Manager to integrate to main brokers like booking, expedia...,
- custom software development,
- hosting.

At the end, these solutions are efficient for managing the hotel, but does not provide visibility, that is always delegated to brokers.

Users are usually reaching the hotel using the brokers, even if sometimes they can access directly the hotel website if theur are returning customers:

```plantuml

@startuml
left to right direction
actor User1 as u1
actor User2 as u2

package Booking {
  usecase "Book Room" as BOOKING1
  usecase "Review" as BOOKING2
}
u1 --> BOOKING1
u1 --> BOOKING2

package Expedia {
  usecase "Book Room" as EXP1
  usecase "Review" as EXP2
}
u1 --> EXP1
u1 --> EXP2
u2 --> EXP1
u2 --> EXP2

package Agoda {
  usecase "Book Room" as AGODA1
  usecase "Review" as AGODA2
}
u2 --> AGODA1
u2 --> AGODA2

package "Hotel HMS1" #3fbdb6 {
    usecase "Booking Engine" as be1
    usecase "Hotel Website" as ws1
    usecase "Hotel Mobile App" as app1
}

u2 --> ws1
app1 --> be1

ws1 --> be1
BOOKING1 --> be1
EXP1 --> be1


package "Hotel HMS2" #3fbdb6 {
    usecase "Booking Engine" as be2
    usecase "Hotel Website" as ws2
    usecase "Hotel Mobile App" as app2
}

EXP1 --> be2
AGODA1 --> be2
app2 --> be2

ws2 --> be2
u2 --> app2


@enduml

```


### Use Verana to instantly make all Hotels visible

Instead of only relying on brokers for getting room reservations, Open Source HMS Software Providers can:

- create an Ecosystem in the Verana Trust Network, and for this Ecosystem, define an Hotel credential schema.
- add the Verifiable Trust stack to their Open Source software.
- build a global mobile app or website as a verifiable user agent, named "HMS Provider App or Website" in the diagram below, a broker competitor service that will be available for all Hotels that are using their software.

2. Now, Hotels that are using the open source software can:

- Automatically be searchable in software vendor global mobile app
- Request their users to download the global mobile app for ej doing their check-in, open their room, etc

3. As the global mobile app is in their device, users can book the same hotel, or any hotel using the same HMS directly from the "HMS Provider App or Website".

```plantuml

@startuml
left to right direction
actor User1 as u1
actor User2 as u2

package "HMS Provider App or Website" #b99bce {
  usecase "Book Room" as HMSP1
  usecase "Review" as HMSP2
}

package "Other HMS Provider Approved Apps and/or Websites" #D88AB3 {
  usecase "Book Room" as OTHER1
  usecase "Review" as OTHER2
}

u1 --> HMSP1
u1 --> HMSP2

u2 --> HMSP1
u2 --> HMSP2


u2 --> OTHER1


package "Hotel HMS1" #3fbdb6 {
    usecase "Booking Engine" as be1
    usecase "Hotel Website" as ws1
    usecase "Hotel Mobile App" as app1
}

u2 --> ws1
app1 --> be1

ws1 --> be1


package "Hotel HMS2" #3fbdb6 {
    usecase "Booking Engine" as be2
    usecase "Hotel Website" as ws2
    usecase "Hotel Mobile App" as app2
}

app2 --> be2

ws2 --> be2
u2 --> app2

HMSP1 -> be1
HMSP1 -> be2
OTHER1 -> be1
OTHER1 -> be2

@enduml

```
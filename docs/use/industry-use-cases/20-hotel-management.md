# Decentralizing Hotel Management with Verana

## The Problem: Hotel Discovery & Broker Domination

The hotel industry is a striking example of how centralization locks value.  

Today, nearly all hotel reservations happen through **brokering platforms** like **Booking.com**, **Expedia**, **Agoda**, or **Airbnb**. These intermediaries have achieved near-monopoly power, **capturing a huge share of hotel revenues** and indirectly **raising room costs for users**.  

Paradoxically, while users believe they’re saving money, they actually pay more, since hotels must increase their prices to cover broker fees.

👉 **If a hotel isn’t listed on broker platforms, it effectively doesn’t exist in the market.**

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

## Hotel Management Systems Today

To manage their properties, hotels often rely on **Hotel Management Systems (HMS)**, which may be **proprietary (SaaS)** or **open source** (self-hosted/cloud-hosted).

Open source HMS platforms are appealing because they:

- Allow hotels to host software anywhere, avoiding vendor lock-in.
- Ensure hotels own their data.
- Provide key open-source modules such as:
  - **Property Management System (PMS)**
  - **Booking Engine**
  - **Hotel Website Builder**
  - **Hotel Mobile App skeleton**

### Current Business Models of Open Source HMS

Most open-source HMS providers monetize via:

- Selling **software add-ons** (e.g., channel managers to sync with booking.com or Expedia).
- Offering **custom development services**.
- Providing **hosting solutions**.

These systems work well for **hotel management**, but **visibility is still dictated by brokers**. Even when hotels run their own websites/apps, most new customers still arrive via **brokers**.

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

## Enter Verana: Making Hotels Instantly Discoverable

Verana changes the game by **removing dependency on centralized brokers**.

### How Open Source HMS Providers Can Use Verana

Open Source HMS Providers can redefine their business models by adding the Verifiable Trust layer to their software. They just need to:

1. **Create a Hotel Ecosystem in Verana**

- Establish rules via an **Ecosystem Governance Framework (EGF)**.
- Create their Trust Registry and define a **Hotel Credential Schema** in Verana.

2. **Add Verifiable Trust to Open Source HMS Software**

- Integrate **Verana’s Verifiable Trust stack** into booking engines, PMS, and mobile apps.

3. **Launch a Verifiable User Agent**

- Build a **global mobile app or website** (the “HMS Provider App”) that serves as a **browser for verifiable hotels**.
- This app functions as a **broker competitor**, but **without extracting rents**.

### What Hotels Gain

Hotels using such an HMS automatically become:

- **Searchable** in the HMS Provider’s global app.
- **Bookable directly**, bypassing brokers.
- **Empowered** to interact with guests through verifiable credentials (e.g., for check-in, digital room access).

### What Guests Gain

- A **trustworthy, verifiable search experience**.
- The ability to **book directly with hotels** via the HMS Provider app.
- **Privacy-preserving interactions** where their identity and preferences are verified but never exploited.

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

## Why This Matters

- **For Hotels**: regain independence, stop paying excessive broker fees, own your data.
- **For Users**: enjoy lower prices, verified reviews, and more trust in bookings.
- **For HMS Providers**: compete with global brokers by offering open, decentralized visibility.
- **For the Internet**: Verana delivers a **public-good trust layer**, shifting value back to participants instead of intermediaries.

## Conclusion

The hotel industry doesn’t need to be trapped by centralized brokers. By using **Verana’s decentralized trust infrastructure**, Hotel Management Systems can:

- Make hotels **instantly visible** without intermediaries.
- Enable **trustworthy, credential-based interactions** between hotels and guests.
- Create a **privacy-preserving, fair economic model** where value stays with hotels and users.

👉 With Verana, hotels can finally say:
“**We own our reservations, our reputation, and our data.**”

# 🏨 Decentralizing Hotel Management

## The Problem: Hotel Discovery & Broker Domination

The hotel industry is a striking example of how centralization locks value.  

Today, nearly all hotel reservations happen through **brokering platforms** like **Booking.com**, **Expedia**, **Agoda**, or **Airbnb**. These intermediaries have achieved near-monopoly power, **capturing a huge share of hotel revenues** and indirectly **raising room costs for users**.  

Paradoxically, while users believe they’re saving money, they actually pay more, since hotels must increase their prices to cover broker fees.

👉 **If a hotel isn’t listed on broker platforms, it effectively doesn’t exist in the market.**

```plantuml
@startuml
' === Include the palette block above or paste here ===
' Verana palette + white background
!define BRAND_MAGENTA #9D2A6D
!define BRAND_MAGENTA_LIGHT #CB73A3
!define ACCENT_BLUE #2A6D9D
!define ACCENT_TEAL #2A9D6D
!define ACCENT_ORANGE #FFB84D
!define SURFACE #F9F9FC
!define INK #1A1A1A

skinparam backgroundColor white
skinparam Shadowing false
skinparam ArrowColor BRAND_MAGENTA
skinparam defaultFontName Kantumruy Pro
skinparam defaultTextAlignment center

skinparam RectangleBorderColor INK
skinparam RectangleFontColor INK
skinparam RectangleFontSize 14
skinparam DatabaseBorderColor INK
skinparam PackageBorderColor INK
skinparam NoteBackgroundColor SURFACE
skinparam NoteBorderColor BRAND_MAGENTA_LIGHT

' Simple stereotypes for color blocks
skinparam rectangle {
  BackgroundColor<<user>> #EEF6FF
  BorderColor<<user>> ACCENT_BLUE
  BackgroundColor<<hotel>> #E7F7F0
  BorderColor<<hotel>> ACCENT_TEAL
  BackgroundColor<<broker>> #FFF3E0
  BorderColor<<broker>> ACCENT_ORANGE
  BackgroundColor<<vpr>> #E9C1D8
  BorderColor<<vpr>> BRAND_MAGENTA
  BackgroundColor<<idx>> #F0F7FF
  BorderColor<<idx>> ACCENT_BLUE
  BackgroundColor<<box>> SURFACE
  BorderColor<<box>> BRAND_MAGENTA_LIGHT
}
rectangle "Traveler" <<user>> as U
package "Centralized Brokers" <<broker>> {
  rectangle "Booking.com" as B1
  rectangle "Expedia" as B2
  rectangle "Agoda" as B3
  rectangle "Airbnb" as B4
}
rectangle "Hotel / Property" <<hotel>> as H

U -down-> B1 : Searches / Books
U -down-> B2
U -down-> B3
U -down-> B4

B1 -down-> H : High Commissions 💸
B2 -down-> H
B3 -down-> H
B4 -down-> H

note bottom of "Centralized Brokers"
Broker visibility lock-in + data capture
end note
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

```plantuml
@startuml
' === Include the palette block above or paste here ===
' Verana palette + white background
!define BRAND_MAGENTA #9D2A6D
!define BRAND_MAGENTA_LIGHT #CB73A3
!define ACCENT_BLUE #2A6D9D
!define ACCENT_TEAL #2A9D6D
!define ACCENT_ORANGE #FFB84D
!define SURFACE #F9F9FC
!define INK #1A1A1A

skinparam backgroundColor white
skinparam Shadowing false
skinparam ArrowColor BRAND_MAGENTA
skinparam defaultFontName Kantumruy Pro
skinparam defaultTextAlignment center

skinparam RectangleBorderColor INK
skinparam RectangleFontColor INK
skinparam RectangleFontSize 14
skinparam DatabaseBorderColor INK
skinparam PackageBorderColor INK
skinparam NoteBackgroundColor SURFACE
skinparam NoteBorderColor BRAND_MAGENTA_LIGHT

' Simple stereotypes for color blocks
skinparam rectangle {
  BackgroundColor<<user>> #EEF6FF
  BorderColor<<user>> ACCENT_BLUE
  BackgroundColor<<hotel>> #E7F7F0
  BorderColor<<hotel>> ACCENT_TEAL
  BackgroundColor<<broker>> #FFF3E0
  BorderColor<<broker>> ACCENT_ORANGE
  BackgroundColor<<vpr>> #E9C1D8
  BorderColor<<vpr>> BRAND_MAGENTA
  BackgroundColor<<idx>> #F0F7FF
  BorderColor<<idx>> ACCENT_BLUE
  BackgroundColor<<box>> SURFACE
  BorderColor<<box>> BRAND_MAGENTA_LIGHT
}
package "Verana Trust Layer" <<vpr>> {
  rectangle "VPR (Trust Registry)\n• Ecosystems & Governance\n• Credential Schemas\n• Permissions" as VPR <<vpr>>
  rectangle "DID Directory\n(Discoverability)" as DID <<box>>
  rectangle "Indexer / Search API\n(Hotel & Schema Metadata)" as IDX <<idx>>
}

package "Open-Source HMS Providers" <<box>> {
  rectangle "HMS Company\nGovernance" as HMSW <<box>>
  rectangle "HMS Provider App / Website\n(Verifiable User Agent)" as VUA <<box>>
}

package "Independent Hotels" <<hotel>> {
  rectangle "Hotel A\n(HMS Verifiable Service)" as H1 <<hotel>>
  rectangle "Hotel B\n(HMS Verifiable Service)" as H2 <<hotel>>
}

rectangle "Traveler" as U <<user>>

U -down-> VUA : Search
VUA -down-> IDX : Query
IDX -up-> VUA : Results + Proof-of-Trust

H1 -down-> DID : Register DID
H2 -down-> DID : Register DID
HMSW -down-> VPR : Integrate Verifiable Trust

VUA -right-> H1 : Direct Booking
VUA -right-> H2 : Direct Booking
@enduml
```

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
' === Include the palette block above or paste here ===
' Verana palette + white background
!define BRAND_MAGENTA #9D2A6D
!define BRAND_MAGENTA_LIGHT #CB73A3
!define ACCENT_BLUE #2A6D9D
!define ACCENT_TEAL #2A9D6D
!define ACCENT_ORANGE #FFB84D
!define SURFACE #F9F9FC
!define INK #1A1A1A

skinparam backgroundColor white
skinparam Shadowing false
skinparam ArrowColor BRAND_MAGENTA
skinparam defaultFontName Kantumruy Pro
skinparam defaultTextAlignment center

skinparam RectangleBorderColor INK
skinparam RectangleFontColor INK
skinparam RectangleFontSize 14
skinparam DatabaseBorderColor INK
skinparam PackageBorderColor INK
skinparam NoteBackgroundColor SURFACE
skinparam NoteBorderColor BRAND_MAGENTA_LIGHT

' Simple stereotypes for color blocks
skinparam rectangle {
  BackgroundColor<<user>> #EEF6FF
  BorderColor<<user>> ACCENT_BLUE
  BackgroundColor<<hotel>> #E7F7F0
  BorderColor<<hotel>> ACCENT_TEAL
  BackgroundColor<<broker>> #FFF3E0
  BorderColor<<broker>> ACCENT_ORANGE
  BackgroundColor<<vpr>> #E9C1D8
  BorderColor<<vpr>> BRAND_MAGENTA
  BackgroundColor<<idx>> #F0F7FF
  BorderColor<<idx>> ACCENT_BLUE
  BackgroundColor<<box>> SURFACE
  BorderColor<<box>> BRAND_MAGENTA_LIGHT
}

actor Traveler as T
participant "HMS Provider App\n(Verifiable User Agent)" as VUA
participant "Indexer / Search API" as IDX
participant "Hotel Booking Engine" as H
participant "VPR (Trust Registry)" as VPR

== Discover & Trust ==
T -> VUA : Search hotels & dates
VUA -> IDX : Query by DID/metadata\n+ trust filters
IDX --> VUA : Results + trust hints\n(schemas, issuers, policies)
VUA -> T : Show verified results\n(identity, governance, policies)

== Verify & Book ==
T -> VUA : Choose hotel & room
VUA -> VPR : Verify hotel permissions/credentials\n(not revoked/slashed)
VPR --> VUA : OK (authorized, valid)

VUA -> H : Create reservation (direct)
H --> VUA : Confirmation
VUA --> T : Booking confirmed ✅
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

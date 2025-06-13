# Ecosystems

## What are Digital Trust Ecosystems?

As defined by the [Trust Over IP foundation](https://trustoverip.org/wp-content/uploads/ToIP-Ecosystem-Defining-Digital-Trust-Ecosystem-V1.0-2022-10-13.pdf):

>
>Digital Trust Ecosystems are interconnected communities of diverse institutional and individual participants in a trust environment sustained by the combined governance of technology and human actors.
>

## Ecosystem Governance Framework

Verana adheres to the ToIP principles of Digital Trust Ecosystems.

An Ecosystem publishes an Ecosystem Governance Framework, (EGF). An EGF defines the rules, roles, policies, and processes that govern a digital trust ecosystem.

More precisely, an EGF typically includes:

### Purpose & Scope

- Clarifies the **mission** of the ecosystem (e.g. healthcare, education, finance).
- Defines the types of **credentials** or **services** the ecosystem supports.
- Specifies the intended **participants** and **use cases**.

### Governance Structure

- Defines the **roles and responsibilities** (e.g. ecosystem controller, trust registry operator, issuers, verifiers).
- Describes how **decisions are made**, documented, and enforced.
- Outlines **dispute resolution** processes.

### Trust & Credential Policies

- Specifies how **verifiable credentials** are issued, verified, revoked, and audited.
- Defines **credential schemas**, formats, and **levels of assurance**.
- Establishes **authorization rules** for issuers and verifiers.

### Admission Criteria

- Sets the **requirements** to join the ecosystem as an issuer, verifier, or other role.
- Includes **review and approval** processes.
- May include **background checks** or **credential vetting**.

### Compliance & Enforcement

- Describes how participants are **monitored** for compliance.
- Defines **penalties** for violating the rules (e.g. slashing, suspensions).
- Ensures that **ecosystem integrity** is maintained.

### Economic & Incentive Models

- Specifies **fee structures** for issuance, verification, and registration.
- Defines how **trust fees** are distributed across roles (e.g. issuers, wallet vendors).
- Enables **reward mechanisms** for participation and compliance.

### Trust Assurance Mechanisms

- Describes **trust deposits**, **computed reputation**, and **governance metrics**.
- Establishes rules for displaying **trust marks** or proof-of-trust indicators.
- Defines **slashing conditions** and dispute handling processes.

An EGF acts as the **constitutional layer** of a digital trust ecosystem, enabling interoperability and privacy-preserving governance in decentralized environments.

## 🆔 Ecosystem Identifier

In Verana, Ecosystems are identified by a [DID](https://www.w3.org/TR/did-1.0/). DID can be from any method. The only requirement is that the DID must be resolvable, and the Ecosystem, controller of the DID, must be able to add "service" entries to the DID Document to declare credential schemas, trust registry endpoint, and present credentials.

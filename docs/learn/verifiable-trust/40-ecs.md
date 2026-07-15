# Essential Credential Schemas

**Essential Credential Schemas (ECSs)** are the Verifiable Trust basic needed schemas for **enabling a minimum trust resolution** in Services and User Agents by answering these questions:

- who is the provider of this Verifiable Service?
- what is the minimum age required to access this Verifiable Service?
- is the User Agent trying to connect to a Verifiable Service a Verifiable User Agent?
- who is the human operating this Verifiable User Agent, and whom do they represent?
- ...

[The Verana Council](https://veranacouncil.org) defined an Ecosystem Governance Framework and created an Ecosystem in the Verana Verifiable Trust Network (VVTN) for providing Essential Credential Schemas (ECS) to the community. Governance framework will be published in the [council website](https://veranacouncil.org).

There are 5 kinds of ECS:

- **Service** — describes services;
- **Organization** — identifies organizations, used to identify the owner of a service;
- **Persona** — identifies individuals, used to identify the owner of a service;
- **UserAgent** — describes user agents, such as browsers, mobile apps, and similar software;
- **Badge** — identifies humans, such as the employees or members of the organization that operates a service.

Service, Organization and Persona credentials are public: they are presented in DID Documents as linked verifiable presentations. UserAgent and Badge credentials are private (AnonCreds), presented over DIDComm with selective disclosure, and are never declared in a DID Document.

The Service schema is `OPEN` to anyone. Participants that want to obtain an Organization, Persona, or UserAgent Verifiable Trust Credential (VTC) must contact an authorized issuer and perform a validation process in order to obtain their credential. The Badge schema is different: its `issuer_onboarding_mode` is `OPEN` and its `holder_onboarding_mode` is `PERMISSIONLESS`, so any corporation whose service qualifies as a verifiable service can self-create its issuer `Participant` entry and issue Badges to the humans it stands behind — trust in a Badge comes from trust-resolving its issuer, not from an onboarding gate.

An ecosystem that provides ECS must publish, in its ecosystem DID Document, one Verifiable Trust JSON Schema Credential (VTJSC) per ECS, under five reserved `LinkedVerifiablePresentation` fragments: `#vpr-schemas-service-vtjsc-vp`, `#vpr-schemas-org-vtjsc-vp`, `#vpr-schemas-persona-vtjsc-vp`, `#vpr-schemas-ua-vtjsc-vp`, and `#vpr-schemas-badge-vtjsc-vp`. See [Credential Schemas](../verifiable-public-registry/credential-schema) and [Trust Resolution](./trust-resolution).

Remember the popup presented by a Verifiable Service: in this example you can see that information comes from Organization and Service Verifiable Trust Credentials (VTCs).

<Image url="/img/vt-creds-explained.png" floating="none" caption="Verifiable Service" border="1px solid #DDDDDD" align="center"/>

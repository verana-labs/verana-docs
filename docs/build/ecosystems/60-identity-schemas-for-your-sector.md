---
title: Offer identity schemas for your sector
description: "How a sector body or a country publishes its own organisation or person schemas, accredits issuers, and lets wallets trust them. Verandia and the Chamber of Commerce as examples."
sidebar_position: 60
persona: ecosystem-builder
surface: frontend
verified_on: pending
---

# Offer identity schemas for your sector

The ECS ecosystem answers the universal questions: what is this service, who operates it. A sector or a jurisdiction has its own: is this company registered with the chamber, is this person a licensed professional, is this citizen who they say. Those are ordinary ecosystems with ordinary schemas; what makes them identity schemas is who is accredited to issue them and what verifiers accept.

## Pattern

1. The authority (a business registry, a professional body, a civil registry) creates the ecosystem and the schemas: a business identity credential issued to companies' service DIDs, a professional licence issued to people, a citizen credential.
2. It accredits issuers: itself, or regional offices as grantors and local offices as issuers.
3. Verifiers (banks, employers, other services) join as verifiers, often in open mode, and request the credentials through their agents.
4. Wallets trust the issuers because they are accredited by the authority's ecosystem, and show the chain.

The authority's ecosystem can also issue ECS Organization credentials if it is accredited by the ECS ecosystem as an ECS issuer: a business registry is the natural issuer of organisation identity in its country.

## Two worked examples on the playground

- **Verandia**: a fictional republic whose business registry issues organisation identity, whose civil registry issues a citizen credential, and whose tax office and a bank authenticate citizens without passwords. [playground.testnet.verana.network/usecases/verandia](https://playground.testnet.verana.network/usecases/verandia)
- **Chamber of Commerce (Colombia)**: a chamber issuing business credentials to its 150 000 registered companies, consumed by a bank. [playground.testnet.verana.network/usecases/ccm](https://playground.testnet.verana.network/usecases/ccm)

## Next

- [Define a credential schema](./30-credential-schemas.md).
- Understand: [Essential Credential Schemas](../../understand/identity/essential-credential-schemas.md).

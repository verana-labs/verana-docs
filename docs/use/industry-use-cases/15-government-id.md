# 🆔 Government Digital ID

The Verana Verifiable Trust Network (VVTN) provides governments with the infrastructure to issue **privacy-preserving, verifiable, decentralized Digital IDs** that empower citizens while maintaining national sovereignty over identity systems.  

## Create the Digital Identity Ecosystem  

Governments begin by creating their **Ecosystem Trust Registry** in Verana.

- Define a **Citizen ID Credential Schema**.  
- Establish an **Ecosystem Governance Framework (EGF)** that sets rules for issuance, verification, and authorization of participants.  

This registry ensures that only authorized issuers and verifiers can participate in the Digital ID system.  

## Build the Digital Wallet  

Governments (or local providers) build a **Digital Wallet mobile app** that acts as a **Verifiable User Agent (VUA)**.  

- Citizens use the wallet to **store their Citizen ID Verifiable Credential (VC)**.  
- The wallet is **self-sovereign**: citizens own their credentials, with no central account or dependency.  
- Compatible with open standards like **EIDAS2, DIDs, DIDComm, W3C VCs, OpenID4VC, OpenID4VP**.  

## Citizen Onboarding into the Registry  

At public offices (e.g., civil registry):  

1. **Onboarding Verifiable Service** captures biometric data and validates documents.  
2. Citizen data is recorded in the **central registry database**.  
3. Citizen receives an **NFC-enabled ID card** containing personal and biometric information.  

This ensures **official enrollment** into the state identity system.  

## Issuing the Citizen ID Verifiable Credential  

<Image url="/img/govid-8.jpeg" floating="right"  maxWidth="200px" border="1px solid #DDDDDD" align="center"/>

<Image url="/img/govid-2.jpeg" floating="right"  maxWidth="200px" border="1px solid #DDDDDD" align="center"/>


Citizens then use a **Citizen Onboarding Verifiable Service** registered as an authorized issuer of the Citizen ID Credential Schema:  

1. Download the Government Digital Wallet, that automatically connects to the Citizen Onboarding Verifiable Service.  
2. Capture a photo of the **physical ID card**. The app reads the **MRZ** to retrieve the key for NFC access.  
3. Tap the ID card on the handset for **NFC read of the ID Document** to extract citizen's personal and biometric information.  
4. Perform a **face match** against the extracted photo to confirm the user of the handset is the legitimate cardholder.  
5. If verified, a **Citizen ID Verifiable Credential** is issued to the wallet.  

👉 Any previously issued credential is **revoked automatically**, ensuring there is only one valid credential per citizen.  



## Authorized Verifiers  

The government decides who can request credential presentations:  

- Applicants (e.g., banks, telecoms, hospitals) undergo a **validation process** before being authorized.  
- Once approved, they are registered as **authorized verifiers** for the Citizen ID schema.  
- Governments can implement a **pay-per-verification** model:  
  - Each verification request incurs a fee.  
  - Fee payment is **privacy-preserving**, issuers of a Citizen ID credential cannot know, even if they receive a payment for a presentation request, who is the citizen that presented the credential to a verifier (bank,...).  

## Selective Disclosure  

By supporting advanced credential formats (e.g., ZKPs, BBS+), governments can enable:  

- Citizens to **prove attributes without revealing full data** (e.g., “over 18” without disclosing date of birth).  
- Minimal disclosure principles, reducing risks of data misuse.  


## Why Verana for Government Digital ID  

- **Decentralized trust layer**: No single vendor lock-in, open governance.  
- **Wallet and format-agnostic**: Support any wallet, EIDAS2, DIDComm, OpenID4VC/VP, W3C VCs, and any DID method.
- **Cost-efficient**: Entire Verana stack is **open source** and free to use.  
- **Future-proof**: Built to interoperate across ecosystems (finance, healthcare, travel).  
- **Citizen empowerment**: IDs are stored in citizens’ wallets, not siloed in proprietary systems of third party companies.  

## A New Model for Digital ID  

With Verana, governments can deliver a **Digital ID that is secure, interoperable, privacy-preserving, and citizen-controlled**, without sacrificing state authority or economic sustainability.  

**The result:**

- Citizens can **prove who they are remotely**.  
- Governments maintain **trusted registries**.  
- Ecosystems (banks, telecoms, healthcare, travel) gain **verifiable, auditable trust**.  
- Society benefits from a **fair, decentralized digital infrastructure**.

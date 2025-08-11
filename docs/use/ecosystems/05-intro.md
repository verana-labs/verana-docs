# Introduction

Ecosystems create and manage their Trust Registries in Verana.

➡️ **Learn the basics first** in the [Learn section](../../learn/verifiable-public-registry/onboarding-participants).

## 🚀 Create Your Own Ecosystem Trust Registry

1. **Publish an Ecosystem Governance Framework (EGF)**
   - for faster you can use our EGF template.
   - EGF must outline Ecosystem mission, Credential Schema(s), rules for joining the Ecosystem, fee model, compliance, and slashing rules.  
   - Make the document publicly reachable (e.g., IPFS / GitHub) and register its digest on-chain.

2. **Create your Ecosystem in Verana**
    - [Create the trust registry](../ecosystems/trust-registries/create-a-trust-registry)
    - [Create the credential schema(s)](../ecosystems/credential-schemas/create-a-credential-schema) you defined in your EGF, and the [root permissions](../ecosystems/permissions/create-a-root-permission)
    - notify potential interested participants
    - start onboarding!

## 🤝 Join an Existing Ecosystem: Issuer, Verifier, Grantor (Trust Registry Operator)

[Search existing ecosystems](../ecosystems/trust-registries/list-trust-registries) and look at their [credential schemas](../ecosystems/credential-schemas/list-credential-schemas).

If you want to work with credentials governed by an existing Ecosystem:

1. **Review & accept** its EGF.  
2. **Choose** the Credential Schema relevant to your business case.  
3. **Request the right permission**:  
   - *Issuer Grantor* or *Verifier Grantor* → operate the trust registry branch.  
   - *Issuer* → issue credentials.  
   - *Verifier* → request presentations.  
4. Depending on schema rules, either:  
   - [Self-create your permission](../ecosystems/permissions/self-create-a-permission) (OPEN mode), or  
   - [Run a validation process](../ecosystems/permissions/run-a-validation-process-to-obtain-a-permission) with a Grantor / Ecosystem owner (GRANTOR / ECOSYSTEM mode).

## 🎓 Join as a Holder

1. **Accept** the Ecosystem’s EGF.  
2. **Pick** the Credential Schema you need.  
3. **Select an authorized Issuer** (or self-issue if you already have Issuer rights).  
4. Receive your Verifiable Credential and store it in your wallet.

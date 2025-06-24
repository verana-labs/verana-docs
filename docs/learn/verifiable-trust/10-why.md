# Why we need Verifiable Trust

The internet is broken. Existing communication channels are insecure and outdated. Because they rely on public identifiers — like email addresses, usernames, or phone numbers — anyone who knows your identifier can reach you, whether you invited them or not.

Worse, there’s no reliable way to verify the identity of either service providers or users. This leaves the door wide open to spam, phishing, fraud, and identity theft.

On the service side, each provider imposes its own fragmented registration process, often with complex password requirements or forced reliance on federated login systems—effectively handing control over to large third-party platforms.

Although the World Wide Web was originally built for openness and interoperability, dominant players have reshaped it into a closed, centralized system that most people and organizations now depend on. Privacy has become an afterthought, and personal data is routinely harvested, exploited, or leaked.

To rebuild a trustworthy internet, we need new communication channels — channels that are secure by design, based on mutual verification, and governed by decentralized trust.

Connecting to a service, proving who you are, or creating an account should be as simple and safe as presenting a verifiable credential.

A universal, open trust layer is essential for this vision to succeed.

That’s the purpose of **Verifiable Trust**.

## Problems we all are facing today

### Identification of Service Providers

Today, identifying who is truly behind a digital service is incredibly difficult. Most communication channels lack built-in mechanisms for trust and verification.

<Image url="/img/ssl-cert.png" floating="left" caption="SSL Certificate. No verifiable service provider" maxWidth="300px" border="1px solid #DDDDDD" align="center"/>

- **SSL certificates**, while effective for encrypting traffic between two endpoints, do not reveal who owns or operates the service on the other side. They ensure secure transmission—not trustworthy identity.

- On **social networks**, there is no standardized or verifiable way to confirm the identity of a profile or page owner. Impersonation is common, and users are left to guess what's real.

<Image url="/img/telegram-group.jpg" floating="right" caption="Telegram group." maxWidth="300px" border="1px solid #DDDDDD" align="center"/>

- In **messaging apps** like WhatsApp or Telegram, chatbot services and automated accounts can easily be impersonated. Users have no reliable way to confirm the identity or legitimacy of who they are interacting with.

- Even in basic **phone communication**, receiving a call from an unknown number provides no indication of the caller's true identity, making fraud and scams rampant.

In short, the internet today **lacks a verifiable identity layer** — a way to confirm who you're interacting with before you share information, take action, or trust a service. This missing layer is one of the fundamental weaknesses that the Verana Foundation seeks to address.

### Reputation

In addition to the difficulty of identifying service providers, there is currently no reliable way to assess their reputation.

While app stores offer basic rating and review systems for apps themselves, these systems are limited in scope: they reflect general user satisfaction with the app, and not the specific services or service providers operating **within** the app.

For example, Telegram may have millions of positive reviews, but users have no way to evaluate the trustworthiness of individual channels, groups, or bots inside the app.

Independent services like [TrustPilot](https://www.trustpilot.com/) exist, but they imply user must connect to a third party service separately.

End users and service providers lack a portable, verifiable reputation that can be carried across platforms and independently verified.

This absence of a standardized, decentralized reputation layer makes it easy for malicious actors to operate without consequence, while legitimate providers struggle to build trust.

### Age Verification

<Image url="/img/age-verif.png" floating="right" caption="Age verification popup." maxWidth="300px" border="1px solid #DDDDDD" align="center"/>

We need to protect our kids online — but today’s internet makes it difficult.

There are no standardized or reliable mechanisms for enforcing age restrictions across websites, apps, or digital services. Most platforms rely on easily bypassed checkboxes or self-declared birthdates.

A safer internet requires a verifiable, privacy-preserving approach to age control:

- Services should declare the minimum age required to access them as part of their published metadata.

- User agents (e.g., browsers or apps) should be able to automatically block access if the user doesn't meet the age requirement.

This process should be seamless, privacy-respecting, and enforceable without central surveillance or data collection.

### Federated Login

<Image url="/img/sonatype.png" floating="right" caption="Federated Login." maxWidth="300px" border="1px solid #DDDDDD" align="center"/>

Federated login (e.g., "Log in with Google," "Log in with Facebook") offers convenience, but it comes with serious drawbacks that undermine privacy, security, and digital sovereignty.

Here are the main problems with federated login systems:

- Tracking across services: The identity provider (e.g., Google, Apple, Facebook) can track where and how you log in, building a detailed profile of your digital activity.

- Data sharing: Your login may grant the identity provider and/or the relying party access to your personal data (email, name, contacts, etc.), often without granular user control.

- Centralized risk: If your federated login account is compromised or disabled, you may lose access to all connected services.

- Dependency on big tech: Users and services become dependent on a few tech giants. This undermines decentralization and gives disproportionate control to a handful of companies.

- No self-sovereignty: Users don’t own their identity — they’re renting access from a third party.

- No proof of trust: Relying parties have no way to independently verify that the login comes from a trusted source, or that the user is who they claim to be, without relying on the provider’s internal systems.

### Search Engines

The current search engine model, while incredibly powerful, comes with a number of structural problems, especially when viewed through the lens of digital trust, decentralization, and user autonomy. Here are some of the key issues:

#### Centralized Control

- Search is dominated by a few corporations (e.g., Google, Bing).
- These entities **control what gets indexed and how it ranks**.
- Results are influenced by opaque algorithms. Users can’t verify why something is shown (or hidden).
- **Censorship and bias** are difficult to detect or challenge.

#### Lack of Trustable Identity

- Search engines index content, **not trust**.
- There’s no native way to **verify who is behind a website or service**.
- Malicious actors can **mimic legitimate services**, abuse SEO, or spoof brands.

#### Data Exploitation

- Search queries are **tracked and monetized** to fuel surveillance-based advertising models.
- Users are **profiled without consent**.
- Personalization leads to **filter bubbles** and reinforces existing beliefs, limiting discovery and objectivity.

#### Fake Content & SEO Abuse

- SEO can be **manipulated** to surface:
  - Misinformation
  - Scam sites
  - Low-quality or dangerous products
- Search engines often struggle to distinguish real trust from artificial authority.

#### No Built-in Reputation Systems

- No standard, verifiable way to show:
  - Ratings
  - Reviews
  - Credentialed endorsements
- Reputation systems are fragmented and **easily manipulated**.

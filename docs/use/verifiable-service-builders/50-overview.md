# Understanding Verifiable Services

## What is a Verifiable Service?

A **Verifiable Service (VS)** is a service uniquely identified by a [DID](https://www.w3.org/TR/did-1.0/) that can authenticate itself to any peer — whether another service or a user agent — by presenting [verifiable credentials](https://www.w3.org/TR/vc-data-model-2.0/) **before** any connection is initiated.

Unlike traditional web services that rely on domain certificates and centralized trust, a Verifiable Service proves:

- **Who operates it** — via an Organization credential.
- **What it is** — via a Service credential.
- **What it is authorized to do** — via participants registered in a Verifiable Public Registry (VPR).

This means that any entity connecting to a VS can verify its identity, its operator, and its authorization to issue or verify credentials — all without trusting a central authority.

## What are Verifiable Services used for?

Verifiable Services are the building blocks of trust ecosystems. They can:

- **Issue credentials** — e.g., a government civil registry issuing citizen ID credentials, or a university issuing diploma credentials.
- **Verify credentials** — e.g., a bank requesting proof of identity, or an employer verifying a candidate's qualifications.
- **Participate in multiple ecosystems** — a single VS can be a participant in several Ecosystems, allowing it to issue and verify credentials across different ecosystems simultaneously.

:::tip
A Verifiable Service can be any application: an AI agent, a chatbot, an API gateway, a web portal, or any backend system that needs to interact with users or other Verifiable Services in a trusted manner.
:::

## A Trust Layer for AI Agents

AI agents today lack a standardized trust layer. When an AI agent connects to another agent or service, there is no reliable way to verify **who operates it**, **what it is authorized to do**, or **whether it should be trusted** — creating significant security and accountability gaps.

Verana solves this by enabling AI agents to operate as Verifiable Services:

- **Identity before connection** — an AI agent can verify the identity and credentials of another agent **before** establishing a connection. No more blindly trusting API endpoints or agent names.
- **Credential collection** — an AI agent can collect credentials from other services and AI agents over time, building a verifiable portfolio of authorizations (e.g., "authorized to access medical records", "certified financial advisor agent").
- **Credential presentation for task execution** — when an AI agent needs to perform a specific task (e.g., accessing a restricted API, interacting with a regulated service), it can present the required credentials to prove it is authorized, enabling the target service to grant access based on cryptographically verifiable trust rather than API keys or static allowlists.

This is particularly important as AI agents become more autonomous and interact with each other in complex workflows — each step in the chain can be verified, and no agent can impersonate another or exceed its authorized scope.

## Essential Credential Schemas (ECS) Credentials

Every Verifiable Service **must** present certain mandatory credentials so that entities connecting to it can identify the service and its owner. These are called **Essential Credential Schema (ECS)** credentials:

| Credential | Purpose |
|---|---|
| **Organization** | Identifies the legal entity (company, government, person) that operates the service |
| **Service** | Identifies the service itself: its name, type, description, terms, and privacy policy |

These credentials are exposed in the VS's **DID Document** as [Linked Verifiable Presentations](https://www.w3.org/TR/vc-data-model-2.0/), making them publicly discoverable and verifiable by anyone who resolves the DID.

When a user agent (such as [Hologram Messaging](https://hologram.zone)) connects to a VS, it reads these credentials and shows the user information about the service — who runs it, what it does, and whether it is trustworthy — **before the user decides to proceed**.

## Architecture Patterns

There are two main ways to structure a Verifiable Service deployment, depending on the complexity of your organization.

### Pattern 1: Combined Organization + Service (Simple)

A single VS Agent exposes **both** the Organization and Service credentials under the same DID. This is the simplest architecture, ideal for:

- Small organizations with a single service.
- Development and testing.
- Simple use cases where one entity = one service.

```text
┌──────────────────────────────────┐
│       VS Agent (single DID)      │
│                                  │
│  • Organization credential (VP)  │
│  • Service credential (VP)       │
│  • Ecosystem participants        │
└──────────────────────────────────┘
```

In this setup, the VS Agent self-issues its own Service credential (since the Organization and Service share the same DID).

### Pattern 2: Separate Organization + Child Services (Production)

The Organization runs a dedicated VS Agent that holds the Organization credential and issues Service credentials to its child services. Each child service runs its own VS Agent with its own DID.

```text
┌─────────────────────────────────┐
│   Organization VS Agent         │
│   (did:webvh:...org-host)       │
│                                 │
│   • Organization credential     │
│   • ISSUER participant for      │
│     Service schema              │
│   • Issues Service credentials  │
│     to child services           │
└──────────┬──────────────────────┘
           │ issues Service credential
     ┌─────┴─────┐
     ▼           ▼
┌──────────┐ ┌──────────┐
│ Service  │ │ Service  │
│ VS #1    │ │ VS #2    │
│ (own DID)│ │ (own DID)│
│          │ │          │
│ Service  │ │ Service  │
│ cred (VP)│ │ cred (VP)│
└──────────┘ └──────────┘
```

This pattern is recommended for production because:

- **Separation of concerns** — the Organization agent handles identity and credential issuance, while each service agent handles its specific business logic.
- **Scalability** — you can add new services without modifying the Organization agent.
- **Security** — each service has its own keys and DID; compromising one service does not affect others.
- **Credential chain** — the Service credential is issued by the Organization, creating a verifiable chain of trust.

### Choosing the Right Pattern

| Consideration | Combined (Pattern 1) | Separate (Pattern 2) |
|---|---|---|
| Number of services | 1 | Multiple |
| Deployment complexity | Low | Medium |
| Key isolation | Single key set | Separate per service |
| Credential chain | Self-issued Service cred | Org issues Service cred |
| Best for | Dev/test, simple use cases | Production, enterprises |

## How It All Fits Together

The following diagram shows how a Verifiable Service interacts with the broader Verana trust infrastructure:

```text
┌──────────────┐         ┌──────────────────────────┐
│  User Agent  │         │   ECS Trust Registry     │
│  (Hologram)  │         │   (issues Org creds)     │
│              │◄───────►│                          │
│  Resolves VS │         │   Organization schema    │
│  credentials │         │   Service schema         │
└──────┬───────┘         └──────────────────────────┘
       │ connects                      │
       ▼                               │ issues Org credential
┌──────────────┐                       │
│  Your VS     │◄──────────────────────┘
│  Agent       │
│              │         ┌──────────────────────────┐
│  Org VP      │         │   Verana Blockchain      │
│  Service VP  │         │   (VPR)                  │
│  Participants│◄───────►│                          │
│              │         │   Ecosystems             │
└──────────────┘         │   Schemas & Participants │
                         └──────────────────────────┘
```

1. Your VS Agent obtains an **Organization credential** from the ECS Trust Registry.
2. Your VS Agent self-issues (or receives from the Org agent) a **Service credential**.
3. Both credentials are exposed as **Linked Verifiable Presentations** in your DID Document.
4. When a user or service connects, they **resolve your DID**, verify your credentials, and check your **participants** against the VPR.
5. Only then is a trusted connection established.

## Next Steps

Now that you understand what Verifiable Services are and how they are structured, the next sections will guide you through:

1. [**ECS Trust Registries**](./51-ecs-trust-registries.md) — the trust infrastructure that issues your essential credentials.
2. [**Deploying your first VS**](./52-deploy-first-vs.md) — step-by-step local and production deployment.
3. [**Joining ecosystems**](./53-join-ecosystems.md) — participating in trust ecosystems to issue and verify credentials.

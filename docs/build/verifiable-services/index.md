---
title: Verifiable Services with VS Agent
---

# Verifiable Services with VS Agent

VS Agent is the agent runtime that turns a service or an AI agent into a Verifiable Service: it holds the DID and the credentials, speaks DIDComm and OpenID4VC, resolves trust, and operates on the registry for your corporation. These guides are written against VS Agent 2.0 and the v4 testnet; each states the surface it uses and how to verify its result.

Start with the [quickstart](./00-quickstart.mdx), then follow the path:

| Step | Guides |
|---|---|
| Deploy | [requirements](./10-requirements.mdx), [Docker Compose](./11-docker-compose.mdx), [Kubernetes with Helm](./12-kubernetes-helm.mdx), [AWS](./13-cloud-aws.mdx), [Google Cloud](./14-cloud-gcp.mdx), [Azure](./15-cloud-azure.mdx), [OVHcloud](./16-cloud-ovh.mdx), [configuration](./17-configuration.mdx), [production checklist](./18-production-checklist.mdx) |
| Become trusted | [Organization or Persona credential](./20-ecs-organization-credential.mdx), [Service credential](./21-ecs-service-credential.mdx), [child services](./22-child-services.mdx), [check that you are trusted](./23-check-trusted.mdx) |
| Connect | [verify peers](./30-verify-peers.mdx), [DIDComm connections](./31-didcomm-connections.mdx), [MCP, A2A and web endpoints](./32-endpoints.mdx) |
| Join ecosystems | [find](./40-find-ecosystems.mdx), [open schema](./41-join-open-schema.mdx), [onboarding process](./42-join-onboarding-process.mdx), [renew, cancel, leave](./43-renew-cancel-leave.mdx) |
| Credentials for your service | [receive](./50-receive-credential.mdx), [linked presentations](./51-linked-presentations.mdx) |
| Issue | [OpenID4VC](./60-issue-openid4vc.mdx), [AnonCreds](./61-issue-anoncreds.mdx), [revoke](./62-revoke.mdx), [act as validator](./63-validator-issue-after-validation.mdx) |
| Verify | [OpenID4VP](./70-verify-openid4vp.mdx), [DIDComm](./71-verify-didcomm.mdx), [the trust decision](./72-trust-decision.mdx) |
| Business model | [pay per issuance and verification](./80-pay-per-issuance-verification.mdx), [pay with corporation funds](./81-pay-with-corporation-funds.mdx) |
| AI agents | [build an AI agent as a Verifiable Service](./90-ai-agent.mdx) |
| Operate | [events](./100-events.mdx), [admin authentication](./101-admin-auth.mdx), [backup and restore](./102-backup-restore.mdx), [observe](./103-observe.mdx), [upgrade](./104-upgrade.mdx) |
| Be found | [the graph and wallets](./110-graph-and-wallets.mdx) |

Verification status: every guide carries `verified_on` in its front matter. Guides marked pending are written from the VS Agent 2.0 specification and code and will be run end to end on the v4 testnet, which goes live on 13 October 2026.

---
title: Events
description: The webhook events a VS Agent emits, their envelope and their catalog.
---

# VS Agent events

The agent notifies a backend of state changes through one webhook, configured with `EVENTS_WEBHOOK_URL`. An event is a notification, not a state transfer: the Admin API records are the source of truth, and a consumer that misses an event reads the record. Source: specification section Events API.

## Delivery

- One HTTP `POST` per event, body is the envelope, `Content-Type: application/json`.
- `Authorization: Bearer <EVENTS_WEBHOOK_API_KEY>` when the key is set.
- Any `2xx` response is a completed delivery. Anything else is logged and may be retried.
- Delivery never blocks DIDComm, flows or Admin API requests.
- Order is best effort and a retry can duplicate a delivery. Deduplicate on `id`.
- Events can carry personal data. Use `https://` whenever the path to the consumer leaves the trusted network.

## Envelope

```json
{
  "id": "0b9df6f4-3f0e-4b3a-9c26-6a5f8e2d1c47",
  "type": "didcomm.credential-exchanges.state-updated",
  "timestamp": "2026-08-28T12:00:00Z",
  "data": { "credentialExchangeId": "…", "state": "request-received", "previousState": "offer-sent" }
}
```

Types follow `{scope}.{module}.{event}`, mirroring the Admin API paths. Two kinds exist:

- `state-updated`: a record was created or changed state. `data` is the record as the `get` method returns it, plus `previousState` (`null` on creation). Automated transitions (`autoAccept`) emit it too. Deletions do not.
- `*-received`: an inbound DIDComm message arrived. `data` is the received content.

`vpr.notification` is the one exception: it reports a transaction observed on the registry through the indexer.

## Catalog

| Type | Trigger | `data` |
|---|---|---|
| `didcomm.connections.state-updated` | Connection created or changed | Connection record plus `previousState` |
| `didcomm.basic-messages.message-received` | Basic message received | Message record |
| `didcomm.receipts.message-receipts-received` | Receipts message received | `connectionId`, `receipts[]` with `messageId`, `state`, `timestamp` |
| `didcomm.reactions.message-reactions-received` | Reactions message received | `connectionId`, `reactions[]` with `messageId`, `emoji`, `action`, `timestamp` |
| `didcomm.user-profile.profile-received` | Profile received | `connectionId`, `threadId`, `profile`, `sendBackYours` |
| `didcomm.user-profile.request-profile-received` | Profile requested | `connectionId`, `threadId`, `query` |
| `didcomm.media-sharing.share-media-received` | Media shared | `connectionId`, `threadId`, `description`, `items` |
| `didcomm.media-sharing.request-media-received` | Media requested | `connectionId`, `threadId`, `description`, `itemIds` |
| `didcomm.calls.call-offer-received` | Call offered | `connectionId`, `threadId`, `callType`, `parameters`, `description`, `offerStartTime`, `offerExpirationTime` |
| `didcomm.calls.call-accept-received` | Call accepted | `connectionId`, `threadId`, `parameters` |
| `didcomm.calls.call-reject-received` | Call rejected | `connectionId`, `threadId` |
| `didcomm.calls.call-end-received` | Call ended | `connectionId`, `threadId` |
| `didcomm.action-menu.menu-request-received` | Menu requested | `connectionId`, `threadId` |
| `didcomm.action-menu.perform-received` | Menu option performed | `connectionId`, `threadId`, `name`, `params` |
| `didcomm.question-answer.answer-received` | Answer received | `connectionId`, `threadId`, `response` |
| `didcomm.mrtd.mrz-data-received` | MRZ data received | `connectionId`, `threadId`, `mrzData` |
| `didcomm.mrtd.emrtd-data-received` | eMRTD data received and verified | `connectionId`, `threadId`, `dataGroups` |
| `didcomm.mrtd.problem-report-received` | MRTD problem report | `connectionId`, `threadId`, `reason` |
| `didcomm.presentations.state-updated` | Presentation record created or changed | Presentation record plus `previousState` |
| `didcomm.credential-exchanges.state-updated` | Credential exchange created or changed | Credential exchange record plus `previousState` |
| `openid4vc.credential-exchanges.state-updated` | OpenID4VCI issuance session changed | Session record plus `previousState` |
| `openid4vc.presentations.state-updated` | OpenID4VP verification session changed | Session record plus `previousState` |
| `vt.flows.state-updated` | A credential acquisition flow changed state | Flow record plus `previousState` |
| `vpr.notification` | The agent processed an indexer transaction event | `eventType`, `did`, `blockHeight`, `txHash`, `timestamp`, `payload` (`module`, `action`, `messageType`, `txIndex`, `messageIndex`, `sender`, `relatedDids`, `entityType`, `entityId`), plus `changes` when resolved |

`vpr.notification` is emitted for every processed indexer event even when the default handler of that event is disabled. A consumer that misses one recovers from the indexer's events endpoint with `after_block_height`: the indexer, not the agent, is the durable source of chain events.

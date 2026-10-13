---
title: WebSocket subscriptions
description: The indexer's real-time stream of registry events, and the catch-up pattern that makes it gapless.
---

# Indexer WebSocket subscriptions

`WS /v4/indexer/subscribe` pushes one message per processed block, carrying the registry events that match a subscription. It is how a VS Agent, the frontend or any backend follows the chain without polling. Source: Indexer specification, `IDX-INDEXER-SUB-1`.

## Connection sequence

1. Open the WebSocket. The server sends `ready` with the next block height, its time, and `blockIntervalMs`.
2. Send a `subscribe` control message. The server answers `subscribed` with the first block height it guarantees to deliver.
3. Receive one `block` message per processed block, in strictly increasing order, even when no event matches: the block stream is the heartbeat.

```json
{ "action": "subscribe", "dids": ["did:webvh:…"], "corporationId": 42 }
```

| Filter | Delivers |
|---|---|
| `dids[]` | Events of every resource whose primary DID is listed (corporation, ecosystem or participant DID), plus participants whose validator's DID is listed. |
| `corporationId` | Events of everything the corporation owns (itself, its ecosystems, its participants and their sub-entities), plus participants whose validator belongs to that corporation. Includes the corporation's group proposals and votes. |
| both | The intersection. |
| neither | Every indexed event, exchange rates included. |

A new `subscribe` replaces the active one. `{ "action": "unsubscribe" }` stops delivery and is not acknowledged. Ignore message types you do not recognise.

## Block message

```json
{
  "type": "block",
  "block": 1500005,
  "blockTime": "2026-05-11T13:00:05Z",
  "events": [
    {
      "type": "indexer-event",
      "event_type": "StartParticipantOP",
      "did": "did:webvh:…",
      "block_height": 1500005,
      "tx_hash": "AB12…",
      "timestamp": "2026-05-11T13:00:05Z",
      "payload": {
        "module": "pp", "action": "start_participant_op", "message_type": "MsgStartParticipantOP",
        "tx_index": 3, "message_index": 0, "sender": "verana1…",
        "related_dids": [], "entity_type": "Participant", "entity_id": "…"
      }
    }
  ]
}
```

Events are ordered by transaction index then message index, and have the same shape as the REST `GET /v4/indexer/events` endpoint returns.

## Liveness, gaps and catch-up

- Treat twice `blockIntervalMs` as the liveness timeout, both for the `subscribed` acknowledgement and for the block heartbeat.
- A gap (`block > previous + 1`) means the connection lost messages.
- The stream never replays history. To start from a known point without a gap: connect, send `subscribe`, wait for `subscribed` while buffering incoming blocks; then call `GET /v4/indexer/events?after_block_height=<last seen>` to exhaustion; then apply the buffered and live blocks, discarding events already applied (same `tx_hash` and `message_index`). Repeat the same pattern after a disconnection.
- A client that does not drain its buffer may be closed with code `1011`; reconnect and catch up.

## Where it is used

The VS Agent subscribes with `VERANA_INDEXER_SUBSCRIPTION_SCOPE` (`did` or `corporation`) and surfaces each event as a `vpr.notification` webhook event. The frontend keeps one subscription per discovered corporation and refreshes views on the events of the acting one.

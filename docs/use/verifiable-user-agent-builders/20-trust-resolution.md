# Trust Resolution

When a Verifiable User Agent meets a peer — another agent, a Verifiable Service, or a
credential presenter — it needs to decide whether that peer is trustworthy. That decision
process is **trust resolution**: starting from a DID (or a credential that references one),
the agent resolves the DID to a **Participant** entry on the VPR, walks up to the
controlling **Ecosystem**, and evaluates the Ecosystem's Proof-of-Trust.

:::info Governed by the Verifiable Trust spec
The full trust-resolution protocol — `resolve_trust()`, the **Trust Resolver**, the
**Trust Registry Query Protocol (TRQP)**, and how **Proof-of-Trust** is computed and
weighed — is defined by the
**[Verifiable Trust specification](https://verana-labs.github.io/verifiable-trust-spec/)**,
not by the VPR spec. The VPR only provides the on-chain *lookup* and *signalling*
primitives described below; the resolution logic itself runs off-chain in your agent (or a
Trust Resolver service it calls).
:::

## The on-chain primitives

The VPR exposes two `pp` (Participant) primitives that a Trust Resolver builds on.

### Resolve a DID to Participants — `find-participants-with-did`

Given a DID, a role, and a credential-schema id, this **read-only query** returns the
matching Participant entries — including the controlling Ecosystem entry — so the resolver
can check that the DID is a validated, currently-effective Participant.

```bash
veranad query pp find-participants-with-did [did] [role] [schema-id]
```

`[role]` is the numeric `ParticipantRole`: `1` = ISSUER, `2` = VERIFIER,
`3` = ISSUER_GRANTOR, `4` = VERIFIER_GRANTOR, `5` = ECOSYSTEM, `6` = HOLDER. Add
`--when <RFC3339>` to evaluate validity at a specific point in time.

Example — resolving an Ecosystem DID against schema `3`:

```bash
veranad query pp find-participants-with-did \
  "did:example:18c0df1833f9f2002c4395780e84af3b" 5 3
```

```json
{
  "participants": [
    {
      "id": "3",
      "schema_id": "3",
      "role": "ECOSYSTEM",
      "did": "did:example:18c0df1833f9f2002c4395780e84af3b",
      "effective_from": "2026-07-10T08:06:20.510395Z",
      "effective_until": "2027-01-06T08:06:52.550388Z",
      "op_state": "VALIDATED",
      "corporation_id": "6"
    }
  ]
}
```

What a resolver reads from this:

- **`op_state` = `VALIDATED`** — the Participant completed its onboarding process.
- **`effective_from` / `effective_until`** — the entry is currently in force (use `--when`
  to check validity at the moment of the interaction).
- **`corporation_id`** — the Corporation that controls the entry; trust deposit and
  reputation are keyed to it.
- **`schema_id`** — the credential schema the Participant is authorized under, which points
  back to the Ecosystem's Proof-of-Trust.

An empty `participants` array means the DID is **not** a Participant for that role and
schema — the resolver should treat the peer as untrusted.

### Signal a re-resolution — `trigger-resolver`

When a Participant's DID document changes (for example a rotated verification method or
service endpoint), a Corporation can emit an on-chain event telling Trust Resolvers to
**re-resolve** the DID registered in that Participant entry. This transaction only emits an
event — it **does not modify VPR state**.

```bash
veranad tx pp trigger-resolver [id] --corporation [corporation] --operator [operator]
```

:::warning Prerequisites
`trigger-resolver` is a **delegable** transaction executed on behalf of a Corporation.
Before running it you need:
1. A **Corporation** (`policy_address`) that controls the Participant `[id]`.
2. The policy funded with `uvna` for fees.
3. An **operator** granted authorization for `/verana.pp.v1.MsgTriggerResolver` via
   [Grant Operator Authorization](../corporation/delegation/grant-operator-authorization).

Pass the corporation as `--corporation` and the authorized operator as `--operator`, and
sign with `--from <operator>`.
:::

For a full worked example with a live tx response, see the
[Participant](../ecosystems/participants/intro) how-tos.

## Where trust resolution fits

```
peer DID ──► find-participants-with-did ──► Participant (VALIDATED?) ──► Ecosystem
                                                                             │
                                          off-chain: Proof-of-Trust / TRQP  ◄┘   (VT spec)
```

The VPR answers *"is this DID a valid Participant, under which Ecosystem?"*. Deciding
*"do I trust this Ecosystem's Proof-of-Trust?"* is the VT-spec-governed step your agent
performs on top.

# How to Enforce PPI and PPV Business Models

Pay Per Issuance (PPI) and Pay Per Verification (PPV) are enforced by Verifiable Services and Verifiable User Agents when credential schemas have been configured accordingly.

When a connection is created between 2 peers (peers can be verifiable services (VSs) and/or verifiable user agents (VUAs)), each peer sends a sessionId to its peer.

Let's name the peers Alice's VS and Bob's VUA.

When the peers connect, session ids are exchanged:

1. Alice's VS sent a sessionid (uuid) to Bob's VUA - let's name it Alice's VS sessionid.
2. Bob's VUA sent a sessionid (uuid) to Alice's VS - let's name it Bob's VUA sessionid.

Now, when Alice's VS wants to issue a verifiable credential from credential schema ABC of ecosystem EGH to Bob:

1. Alice's VS checks if credential schema ABC requires payment of trust fees.
2. If payment is mandatory, Alice's VS create a corresponding permission session by using Bob's VUA provided sessionid.
3. When transaction is done, Alice's VS issues the credential to Bob.
4. Bob's VUA verifies that a permission session exists for Bob's VUA sessionid and this credential schema. If it exists, Bob's VUA accepts the credential, else it is refused.

:::note
This is independent of the other needed trust verification as defined in the [verifiable trust spec](https://verana-labs.github.io/verifiable-trust-spec/)
:::

:::tip
This is privacy preserving, as only Alice and Bob know about the sessionids.
:::

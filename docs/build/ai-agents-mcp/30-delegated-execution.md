---
title: Delegated execution and limits
description: "What the MCP server may sign, where the limits come from, and what a refusal looks like."
sidebar_position: 30
persona: ai-developer
surface: mcp
verified_on: pending (testnet v4)
---

# Delegated execution and limits

The server adds no authority. Everything it signs is bounded by the operator authorization the corporation granted to its account: the message types, a spending limit per period, an expiry. Read-only tools need nothing.

## Grant exactly what the agent needs

In the frontend, grant the operator account the message types the agent's job requires and no more: an agent that monitors needs none; an agent that onboards participants needs the participant messages; an agent that manages schemas needs the schema and governance framework messages. Add a fee grant with a limit so the corporation pays and a runaway is bounded. Revoke to stop it at once; the server's tool list shrinks live.

## What a refusal looks like

A tool call outside the authorization is not advertised in the first place. A call that reaches the chain and fails authorization comes back with the chain's error, named as such. A spending limit reached fails the same way until the period resets.

## Human in the loop

Delegation on the registry is durable and public: it says what the operator may do at all. Approval of one specific action by an accountable human is the agent runtime's job, a consent gate in front of the tool call; the two layers compose, and the roadmap's delegation work formalises the second.

## Next

- Specification: MCP server v4, `VMS-AUTH-CHAIN`; VPR v4, `AUTHZ-CHECK`.

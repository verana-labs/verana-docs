# Introduction

We learnt in the [learn section](../../learn/verifiable-trust/00-introduction.md) that verifiable service (VS) is a service, uniquely identified by a [DID](https://www.w3.org/TR/did-1.0/), that can authenticate itself to a peer by presenting [verifiable credentials](https://www.w3.org/TR/vc-data-model-2.0/) before any connection is initiated.

Building a VS is as easy as embedding the [VS Agent container](https://github.com/2060-io/vs-agent) in your service and setting it up, loading its credentials so it can present them to other agents.

Before we dive into VS Agent examples, let's quickly recap some concepts that are important to understand the next sections.

## Organizations and Services

**Organizations** are owners of services. Therefore, they are usually given Issuer permission for schemas related to services, so they can issue VTCs for their services.

**Services** can be seen as the leaves of the permission tree and are applications users usually interact with their User Agents. They might also be given Issuer or Verifier permissions for certain schemas, as needed depending on the application. 

VS Agent can be used to run both organizations and services. In the simplest form, an organization that has a single service can be run by a single VS Agent that exposes both credentials: the Organization one (issued by the ecosystem or any other participant with permissions to issue Organization VTCs) and the Service one (issued by itself).

In the following examples, initially for the sake of simplicity we'll cover this simple use case, and then move to other more complex cases.

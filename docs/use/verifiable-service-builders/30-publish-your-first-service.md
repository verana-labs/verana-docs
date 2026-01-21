# Publish your First Service

Now we have our Organization agent, we can publish our first Verifiable Service. We can have two approaches: the first one is to set up a specific VS Agent for the Service (with its own DID) while the other one is to do a single-service organization, where both the Service and Organization have the same DID and share the VS Agent, useful for test purposes, but for simple use cases as well.

## Setting up a dedicated Service VS Agent

You will need to create a VS Agent in pretty much the same way you did for your Organization: the main difference is that it will be your Organizatio nagent the issuer of the VTC you'll link to it:

- Create and deploy your Service VS Agent
- Obtain its DID
- Issue its credential with your Organization VS Agent
- Link this credential in our Service VS Agent (use `service` as `schemaBaseId`)

## Single Service organization

In this case, all you have to do is to issue your Service credential to yourself:

- Call to `/v1/vt/issue-credential` using your organization DID as the target.
- Use the output JSON document as input for a further call `/v1/vt/linked-credentials`, but this time use `service` as `schemaBaseId`.

Your VS Agent will expose both the Organization and Service credential, and will work in both roles at the same time.


# Join an Ecosystem

## Module Overview

```bash
veranad tx perm               
Transactions commands for the perm module

Usage:
  veranad tx perm [flags]
  veranad tx perm [command]

Available Commands:
  cancel-perm-vp-request        Cancel a pending perm VP request
  confirm-vp-termination        Confirm the termination of a perm VP
  create-or-update-perm-session Create or update a perm session
  create-perm                   Create a new perm for open schemas
  create-root-perm              Create a new root perm for a credential schema
  extend-perm                   Extend a perm's effective duration
  renew-perm-vp                 Renew a perm validation process
  repay-perm-slashed-td         Repay a slashed perm's trust deposit
  request-vp-termination        Request termination of a perm validation process
  revoke-perm                   Revoke a perm
  set-perm-vp-validated         Set perm validation process to validated state
  slash-perm-td                 Slash a perm's trust deposit
  start-perm-vp                 Start a new perm validation process
```


## Onboarding Process

1. List the available Ecosystems and find the one of your interest.

    ```
    curl -X GET "https://api.testnet.verana.network/tr/v1/list?active_gf_only=true&response_max_size=1" -H  "accept: application/json"
    ```

    ```json

    {
    "trust_registries": [
        {
        "id": "1",
        "did": "did:example:184a2fddab1b3d505d477adbf0643446",
        "controller": "verana12dyk649yce4dvdppehsyraxe6p6jemzg2qwutf",
        "created": "2025-06-18T16:27:13.531941769Z",
        "modified": "2025-06-18T16:27:13.531941769Z",
        "archived": null,
        "deposit": "10000000",
        "aka": "http://example-aka.com",
        "active_version": 1,
        "language": "en",
        "versions": [
            {
            "id": "1",
            "tr_id": "1",
            "created": "2025-06-18T16:27:13.531941769Z",
            "version": 1,
            "active_since": "2025-06-18T16:27:13.531941769Z",
            "documents": [
                {
                "id": "1",
                "gfv_id": "1",
                "created": "2025-06-18T16:27:13.531941769Z",
                "language": "en",
                "url": "https://example.com/governance-framework.pdf",
                "digest_sri": "sha384-MzNNbQTWCSUSi0bbz7dbua+RcENv7C6FvlmYJ1Y+I727HsPOHdzwELMYO9Mz68M26"
                }
            ]
            }
        ]
        }
    ]
    }

    ```

2. Check the Ecosystem Trust Registry and get the Ecosystem Governance Framework link, here [https://example.com/governance-framework.pdf](https://example.com/governance-framework.pdf). Verify that the `digest_sri` matches.

3. Verify you comply with requirements for obtaining the **Permission Type** or **Verifiable Credential** you would like to obtain for a given Credential Schema.

4. List the Credential Schemas of this Ecosystem

    ```
    curl -X GET "https://api.testnet.verana.network/cs/v1/list?tr_id=1&response_max_size=1" -H  "accept: application/json"
    ```

    ```json
    {
    "schemas": [
        {
        "id": "1",
        "tr_id": "1",
        "created": "2025-06-18T16:27:18.757210803Z",
        "modified": "2025-06-18T16:27:18.757210803Z",
        "archived": null,
        "deposit": "10000000",
        "json_schema": "{\n\t\t\"$schema\": \"https://json-schema.org/draft/2020-12/schema\",\n\t\t\"$id\": \"/vpr/v1/cs/js/1\",\n\t\t\"type\": \"object\",\n\t\t\"$defs\": {},\n\t\t\"properties\": {\n\t\t\t\"name\": {\n\t\t\t\t\"type\": \"string\"\n\t\t\t}\n\t\t},\n\t\t\"required\": [\"name\"],\n\t\t\"additionalProperties\": false\n\t}",
        "issuer_grantor_validation_validity_period": 360,
        "verifier_grantor_validation_validity_period": 0,
        "issuer_validation_validity_period": 360,
        "verifier_validation_validity_period": 0,
        "holder_validation_validity_period": 0,
        "issuer_perm_management_mode": "GRANTOR_VALIDATION",
        "verifier_perm_management_mode": "OPEN"
        }
    ]
    }
    ```

5. Based on the schema configuration and the permission type you would like to obtain:

- self-create your Permission;
- choose a **validator** and run a validation process as an **applicant** to obtain your Permission (or Verifiable Credential).

Based on the schema configuration and the permission type you would like to obtain, the table below shows the corresponding action that must take place:

**For Issuance Related Permissions and Verifiable Credentials:**

    | Schema Issuance Policy → Permission (or Credential) to obtain ↓  | OPEN | ECOSYSTEM | GRANTOR |
    |------------------|-------------------------------------|---------------------------------------|-------------------------------------|
    | Issuer Grantor   | N/A | N/A | run a **validation process** with an ECOSYSTEM Permission as the validator |
    | Issuer           | **self-create** an ISSUER Permission | run a **validation process** with an ECOSYSTEM Permission as the validator | run a **validation process** with ISSUER GRANTOR Permission as the validator |
    | Holder (Credential)          | **self-create** an ISSUER Permission, then **self-issue** your Verifiable Credential  | run a **validation process** with an ISSUER as the validator and **get issued** your Verifiable Credential | run a **validation process** with an ISSUER as the validator and **get issued** your Verifiable Credential |

    **For Verification Related Permissions:**

    | Schema Verification Policy → Permission to obtain ↓  | OPEN | ECOSYSTEM | GRANTOR |
    |------------------|-------------------------------------|---------------------------------------|------------------------|
    | Verifier Grantor | N/A | N/A | run a **validation process** with an ECOSYSTEM Permission as the validator |
    | Verifier         | **self-create** a VERIFIER Permission | run a **validation process** with an ECOSYSTEM Permission as the validator | run a **validation process** with VERIFIER GRANTOR Permission as the validator |

6. If you need to self-create your Permission:


```bash
veranad tx perm create-perm
Create a new ISSUER or VERIFIER perm for schemas with OPEN management mode.
This allows self-creation of permissions without validation process.

Parameters:
- schema-id: ID of the credential schema
- type: Permission type (1=ISSUER, 2=VERIFIER)
- did: DID of the grantee service

Optional flags:
- country: ISO 3166-1 alpha-2 country code
- effective-from: Timestamp when perm becomes effective (RFC3339)
- effective-until: Timestamp when perm expires (RFC3339)
- verification-fees: Fees for credential verification (default: 0)

```


**Example:**



Obtain the required attributes for creating the permission. You will need:

- the Credential Schema ID
- ...

    ```
    curl ...
    ```

Then, execute a transaction to create the Permission:

    ```
    veranad ...
    ```

Verify your Permission by querying the ledger:

    ```
    curl ...
    ```

7. If you need to initiate a validation process - as the Applicant (the one that wants to get granted the permission)

Make sure to read the [Learn - Validation Process documentation](http://localhost:3000/docs/next/learn/verifiable-public-registry/onboarding-participants#validation-process).

:::tip[TODO]

@pratikasr
Finish documentation here

:::

Obtain the required attributes for initiating the process. You will need:

- the Credential Schema ID
- ...

    ```
    curl ...
    ```

Then, execute a transaction to start the Validation Process:

    ```
    veranad ...
    ```

Verify your Permission by querying the ledger:

    ```
    curl ...
    ```

Now, get the uuid of the created Permission that is pending approval by the Validator. Contact the Validator and perform the required tasks by exchanging information with the Validator. If everything went well, Validator will set the permission as granted (or your credential will receive a credential)  

8. If you need to participate to a validation process - as Validator (the one that verifies the candidate)

:::tip[TODO]

@pratikasr
Finish documentation here

:::

- Load the Permission with the UUID that was shared by the Applicant.
- Request the Applicant a proof that it controls the verana account (crypto challenge)
- Make sure the Applicant controls the DID it set in the Permission
- Verify the documentation shared by the Applicant and make sure it matches EGF constraints.
- Finally, set the Permission as validated:

    ```
    veranad ...
    ```

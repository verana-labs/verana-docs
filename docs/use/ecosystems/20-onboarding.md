# New Participant Permission

:::note
This is a temporary minimal documentation for Verana experimentation until the [Verana Frontend](https://github.com/verana-labs/verana-frontend) is delivered. End Users will usually not manipulate APIs and command lines.
:::

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

3. Verify you complies with requirement for obtaining the permission type you would like to obtain for a given Credential Schema.

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

- self-create your permission;
- choose a **validator** and run a validation process as an **applicant** to obtain your permission.

Based on the schema configuration and the permission type you would like to obtain, the table below shows the corresponding action that must take place:

**For Issuance Related Permissions:**

    | Schema Issuance Policy → Permission (or Credential) to obtain ↓  | OPEN | ECOSYSTEM | GRANTOR |
    |------------------|-------------------------------------|---------------------------------------|-------------------------------------|
    | Issuer Grantor   | N/A | N/A | Validation Process with ECOSYSTEM Permission |
    | Issuer           | self-create ISSUER Permission | Validation Process with ECOSYSTEM permission | Validation Process with ISSUER GRANTOR permission |
    | Holder (Credential)          | self-create ISSUER Permission, then issue credential  | Validation Process with ISSUER, get issued a credential | Validation Process with ISSUER, get issued a credential |

    **For Verification Related Permissions:**

    | Schema Verification Policy → Permission to obtain ↓  | OPEN | ECOSYSTEM | GRANTOR |
    |------------------|-------------------------------------|---------------------------------------|------------------------|
    | Verifier Grantor | N/A | N/A | Validation Process with ECOSYSTEM permission |
    | Verifier         | self-create VERIFIER Permission | Validation Process with ECOSYSTEM permission | Validation Process with VERIFIER GRANTOR permission |

6. If you need to self-create your Permission:

:::tip[TODO]

Finish documentation here

:::

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

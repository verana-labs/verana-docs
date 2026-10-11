# docs.verana.io

The Verana documentation: understand the open trust layer, build on it, look things up. Built with [Docusaurus](https://docusaurus.io/).

## Structure

```
docs/                     v4, the current version, served at the root
  understand/             concepts, organised by the three pillars (ecosystems, identity, discovery)
  build/                  guides by job: Verifiable Services with VS Agent, ecosystems with the Frontend,
                          personal wallets, AI agents and MCP, running the infrastructure
  reference/              generated API references, parameters, schemas; legacy command-line pages
versioned_docs/version-v3 v3, old, served under /v3
openapi/                  OpenAPI documents fetched from the component repositories (scripts/fetch-openapi.sh)
examples/                 every code sample shown in a guide, and the nightly checks that run them on testnet
templates/                page templates
redirects.ts              old URLs to their v4 page
```

Versions: v4 is `current`. When v5 work starts, run `npm run docusaurus docs:version v4`; `docs/` then becomes v5 under `/next` and v4 fixes go to `versioned_docs/version-v4`.

## Writing

- Concept pages (Understand) carry no field names, commands or API paths. One diagram minimum, in Mermaid.
- Guides (Build) follow `templates/guide.md`: Goal, Prerequisites, Steps, Verify, Troubleshooting, Next. Code comes from `examples/`.
- Front matter `rework: legacy | draft` shows a banner; remove it when a page is final.
- Copy rules: say participants and accreditations, not permissions; no em-dashes; Verana with a capital V.

## Reference generation

```bash
npm run fetch-openapi     # pull the OpenAPI documents from the component repositories
npm run regen-api-docs    # regenerate docs/reference/*-api from openapi/
```

Generated pages are committed. A weekly workflow fetches, regenerates and opens a pull request when something changed.

## Develop

```bash
npm install
npm start                 # http://localhost:3000
npm run build
npm run typecheck
```

Legacy pages still carry PlantUML diagrams rendered through kroki.io at build time; they go away as the pages are rewritten in Mermaid.

## Deploy

Pushes to `main` build and publish to GitHub Pages (`.github/workflows/deploy.yml`). Pull requests build only.

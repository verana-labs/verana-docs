# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Created verana-docs

Inside that directory, you can run several commands:
 
### Starts the development server.

```bash
npm start
```
### Bundles your website into static files for production.

```bash
npm run build
```

### Serves the built website locally.

```bash
npm run serve
```

### Publishes the website to GitHub pages.

```bash
npm run deploy
```

We recommend that you begin by typing:

```bash
cd my-website
npm start
```



## What to do when webpack is waiting for the PlantUML/Mermaid renderer defined in remarkKroki (docusaurus.config.ts (lines 54-61))?

When that happens Every ```plantuml block in the docs is sent to https://kroki.testnet.verana.network/ to be rendered before the site can finish compiling.
With the flaky tethered connection that host isn’t reachable, so those HTTP requests never complete and the progress bar sits forever around 50 % while showing whichever .docusaurus/...json file is currently queued.
Next steps:

Verify that you can reach https://kroki.testnet.verana.network (browser or curl). If it doesn’t load on tethering, the build will keep hanging.
If you can’t reach it, temporarily comment out the remarkPlugins block or point it to a Kroki instance you can access (e.g. run docker run --rm -p 8000:8000 yuzutech/kroki locally and change the URL to http://localhost:8000).



```
docker run --rm -p 8000:8000 yuzutech/kroki
```
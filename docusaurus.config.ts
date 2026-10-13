import type {PrismTheme} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';
import {remarkKroki} from 'remark-kroki';
import {redirects, createRedirects} from './redirects';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// "Protocol Grid" code theme (Operator's Console design): the verana.io
// palette on the console ground. Used for BOTH color modes: code blocks
// stay dark, which is the theme's signature (see src/css/custom.css).
const protocolGrid: PrismTheme = {
  plain: {color: '#E8E9F0', backgroundColor: '#0E1018'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: '#6E7288', fontStyle: 'italic'}},
    {types: ['punctuation', 'operator', 'combinator'], style: {color: '#8B90A5'}},
    {types: ['property', 'tag', 'attr-name', 'key'], style: {color: '#7AA0F2'}},
    {types: ['string', 'char', 'url', 'attr-value', 'inserted'], style: {color: '#F2CE7B'}},
    {types: ['keyword', 'atrule', 'rule', 'selector'], style: {color: '#B9A3F7'}},
    {types: ['boolean', 'number', 'constant', 'symbol'], style: {color: '#29C68C'}},
    {types: ['function', 'function-name', 'builtin'], style: {color: '#7AA0F2'}},
    {types: ['class-name', 'maybe-class-name', 'namespace'], style: {color: '#B9A3F7'}},
    {types: ['variable', 'parameter'], style: {color: '#E8E9F0'}},
    {types: ['deleted'], style: {color: '#F06A6A'}},
    {types: ['important', 'bold'], style: {fontWeight: 'bold'}},
    {types: ['italic'], style: {fontStyle: 'italic'}},
  ],
};

const config: Config = {
  title: 'Verana Docs',
  tagline: 'Understand the open trust layer, build on it, look things up.',
  favicon: 'img/favicon.ico',

  url: 'https://docs.verana.io',
  baseUrl: '/',
  organizationName: 'verana-labs',
  projectName: 'verana-docs',

  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    '@docusaurus/theme-mermaid',
    'docusaurus-theme-openapi-docs',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  plugins: [
    ['@docusaurus/plugin-client-redirects', {redirects, createRedirects}],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'openapi',
        docsPluginId: 'classic',
        config: {
          indexer: {
            specPath: 'openapi/indexer.json',
            outputDir: 'docs/reference/indexer-api',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
            hideSendButton: false,
            showSchemas: true,
          } satisfies OpenApiPlugin.Options,
          graph: {
            specPath: 'openapi/graph.json',
            outputDir: 'docs/reference/graph-api',
            sidebarOptions: {groupPathsBy: 'tag', categoryLinkSource: 'tag'},
            hideSendButton: false,
            showSchemas: true,
          } satisfies OpenApiPlugin.Options,
          vsAgentAdmin: {
            specPath: 'openapi/vs-agent-admin.json',
            outputDir: 'docs/reference/vs-agent-admin-api',
            sidebarOptions: {groupPathsBy: 'tag', categoryLinkSource: 'tag'},
            hideSendButton: true,
            showSchemas: true,
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          docItemComponent: '@theme/ApiItem',
          editUrl: 'https://github.com/verana-labs/verana-docs/edit/main/',
          showLastUpdateTime: false,
          includeCurrentVersion: true,
          // Three versions: v4 is current and served at the root, v5 opens as
          // "next" when its work starts (docusaurus docs:version v4), v3 is old.
          lastVersion: 'current',
          versions: {
            current: {label: 'v4', path: '', banner: 'none'},
            v3: {label: 'v3 (old)', path: 'v3', banner: 'unmaintained'},
          },
          remarkPlugins: [
            // Kept for the legacy pages that still carry PlantUML. New pages use Mermaid.
            [remarkKroki, {alias: ['plantuml'], target: 'mdx3', server: 'https://kroki.io/'}],
          ],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    prism: {
      theme: protocolGrid,
      darkTheme: protocolGrid,
      additionalLanguages: ['bash', 'json', 'yaml'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    image: 'img/verana-docs-og.jpg',
    metadata: [
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:title', content: 'Verana Docs'},
      {name: 'twitter:description', content: 'Understand the open trust layer, build on it, look things up.'},
      {name: 'twitter:image', content: 'https://docs.verana.io/img/verana-docs-og.jpg'},
      {property: 'og:title', content: 'Verana Docs'},
      {property: 'og:description', content: 'Understand the open trust layer, build on it, look things up.'},
      {property: 'og:type', content: 'website'},
      {property: 'og:url', content: 'https://docs.verana.io'},
      {property: 'og:image', content: 'https://docs.verana.io/img/verana-docs-og.jpg'},
    ],
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Verana',
      logo: {alt: 'Verana', src: 'img/verana-mark.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'understandSidebar', position: 'left', label: 'Understand'},
        {type: 'docSidebar', sidebarId: 'buildSidebar', position: 'left', label: 'Build'},
        {type: 'docSidebar', sidebarId: 'referenceSidebar', position: 'left', label: 'Reference'},
        {href: 'https://playground.testnet.verana.network', label: 'Playground', position: 'left'},
        {
          type: 'dropdown',
          label: 'Specs',
          position: 'left',
          items: [
            {label: 'Verifiable Trust', href: 'https://verana-labs.github.io/verifiable-trust-spec/versions/v4/'},
            {label: 'Verifiable Public Registry', href: 'https://verana-labs.github.io/verifiable-trust-vpr-spec/versions/v4/'},
            {label: 'Verana components (verana-spec)', href: 'https://github.com/verana-labs/verana-spec/tree/main/v4'},
          ],
        },
        {type: 'docsVersionDropdown', position: 'right'},
        {href: 'https://github.com/verana-labs', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Specifications',
          items: [
            {label: 'Verifiable Trust', href: 'https://verana-labs.github.io/verifiable-trust-spec/versions/v4/'},
            {label: 'Verifiable Public Registry', href: 'https://verana-labs.github.io/verifiable-trust-vpr-spec/versions/v4/'},
            {label: 'Verana components', href: 'https://github.com/verana-labs/verana-spec'},
            {label: 'Trust Registry Query Protocol', href: 'https://trustoverip.github.io/tswg-trust-registry-protocol/'},
          ],
        },
        {
          title: 'Try it',
          items: [
            {label: 'Playground', href: 'https://playground.testnet.verana.network'},
            {label: 'Testnet frontend', href: 'https://app.testnet.verana.network'},
            {label: 'Trust graph search', href: 'https://search.testnet.verana.network'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'LinkedIn', href: 'https://www.linkedin.com/company/verana-verifiable-trust-network'},
            {label: 'Discord', href: 'https://discord.gg/edjaFn252q'},
            {label: 'GitHub', href: 'https://github.com/verana-labs'},
          ],
        },
        {
          title: 'About Verana',
          items: [
            {label: 'Verana.io', href: 'https://verana.io'},
            {label: 'Foundation website', href: 'https://veranafoundation.org'},
          ],
        },
      ],
      copyright: `©${new Date().getFullYear()} Verana Foundation`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

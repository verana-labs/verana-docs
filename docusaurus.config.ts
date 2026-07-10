import type {PrismTheme} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { remarkKroki } from 'remark-kroki';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// "Protocol Grid" code theme (Operator's Console design): the verana.io
// palette on the console ground. Used for BOTH color modes — code blocks
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
  title: 'Explore Verana',
  tagline: 'Verana is an open initiative providing specifications, public infrastructure, and governance to build a decentralized, verifiable identity layer for the Internet using verifiable credentials and trust registries.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.verana.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'verana-labs', // Your GitHub organization/user name
  projectName: 'verana-docs', // Your repository name

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Redirect the v4 module/section renames so links to the old paths resolve.
        createRedirects(existingPath: string) {
          const renames: [string, string][] = [
            ['/use/ecosystems/participants/', '/use/ecosystems/permissions/'],
            ['/use/ecosystems/ecosystem/', '/use/ecosystems/trust-registries/'],
            ['/use/digest/', '/use/did-directory/'],
            ['/run/network/modules/participant', '/run/network/modules/credential-schema-permissions'],
            ['/run/network/modules/digest', '/run/network/modules/did-directory'],
            ['/run/network/modules/ecosystem', '/run/network/modules/trust-registry'],
          ];
          for (const [next, old] of renames) {
            if (existingPath.includes(next)) {
              return [existingPath.replace(next, old)];
            }
          }
          return undefined;
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: undefined,
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          includeCurrentVersion: true, // Ensure the latest docs are included
          lastVersion: 'v3',
          versions: {
            current: {
              label: 'v4 (next)',
              path: 'next',
              banner: 'unreleased',
            },
            'v3': {
              label: 'v3',
              path: '',
              banner: 'none',
            },
          },
          remarkPlugins: [
            [
              remarkKroki,
              {
                // ...options here
                alias: ['plantuml', 'mermaid'],
                target: 'mdx3',
                server: 'https://kroki.io/'
              }
            ]
          ]
        },
        //blog: {
        //  showReadingTime: true,
        //  editUrl: 'https://github.com/verana-labs/verana-docs/edit/main/',
        //},
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig: {
    // Replace with your project's social card

    // Operator's Console: dark-first, light kept (user choice persists).
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    prism: {
      theme: protocolGrid,
      darkTheme: protocolGrid,
    },
    image: 'img/verana-docs-og.jpg', // Replace with your social card

    metadata: [
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:title', content: 'Verana'},
      {name: 'twitter:description', content: 'Building an open, decentralized trust layer for the Internet'},
      {name: 'twitter:image', content: 'https://docs.verana.io/img/verana-docs-og.jpg'},
  
      {property: 'og:title', content: 'Verana'},
      {property: 'og:description', content: 'Building an open, decentralized trust layer for the Internet'},
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
      logo: {
        alt: 'Verana Logo',
        src: 'img/verana-mark.svg',
      },
      items: [
        {
          type: 'docsVersionDropdown', // This enables the version dropdown
          position: 'right',
        },
        {
          type: 'docSidebar',
          sidebarId: 'learnSidebar',
          position: 'left',
          label: 'Learn',
        },
        {
          type: 'docSidebar',
          sidebarId: 'useSidebar',
          position: 'left',
          label: 'Use',
        },
        {
          type: 'docSidebar',
          sidebarId: 'runSidebar',
          position: 'left',
          label: 'Run',
        },
        
        {
          href: 'https://github.com/verana-labs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Specifications',
          items: [
            {
              label: 'Verifiable Trust',
              href: 'https://verana-labs.github.io/verifiable-trust-spec/',
            },
            {
              label: 'Verifiable Public Registry',
              href: 'https://verana-labs.github.io/verifiable-trust-vpr-spec/',
            },
            {
              label: 'Trust Registry Query Protocol',
              href: 'https://trustoverip.github.io/tswg-trust-registry-protocol/',
            },
          ],
        },
        
        
        {
          title: 'Community',
          items: [
            {
              label: 'Linkedin',
              href: 'https://www.linkedin.com/company/verana-verifiable-trust-network',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/edjaFn252q',
            }
          ],
        },
        {
          title: 'About Verana',
          items: [
            {
              label: 'Verana.io',
              href: 'https://verana.io',
            },
            {
              label: 'Foundation Website',
              href: 'https://veranafoundation.org',
            }
            
          ],
        },
        
      ],
      copyright: `©${new Date().getFullYear()} Verana Foundation`,
    },
   
  } satisfies Preset.ThemeConfig,
};

export default config;

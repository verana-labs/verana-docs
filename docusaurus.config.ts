import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { remarkKroki } from 'remark-kroki';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Explore Verana',
  tagline: 'Verana is an open initiative providing specifications, public infrastructure, and governance to build a decentralized, verifiable trust layer for the Internet using verifiable credentials and trust registries.',
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
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

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
          versions: {
            current: {
              label: 'Next', // The default latest version
              path: 'next',
              banner: 'unreleased',
            },
          },
          remarkPlugins: [
            [
              remarkKroki,
              {
                // ...options here
                alias: ['plantuml'],
                target: 'mdx3',
                server: 'https://kroki.io'
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
    
    
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    image: 'img/verana-social-card.jpg', // Replace with your social card

    
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
        src: 'img/verana.io.svg',
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
          sidebarId: 'networkSidebar',
          position: 'left',
          label: 'Network',
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
          title: 'Verana Foundation',
          items: [
            {
              label: 'Website',
              href: 'https://verana.foundation',
            }
            
          ],
        },
        
      ],
      copyright: `©${new Date().getFullYear()} the Verana Foundation`,
    },
   
  } satisfies Preset.ThemeConfig,
};

export default config;

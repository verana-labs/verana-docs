const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro', 'overview'],
    },
    {
      type: 'category',
      label: 'Environments',
      items: ['environments/environments'],
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/overview',
        'getting-started/local-node-isolated',
        'getting-started/remote-cli',
        'getting-started/local-node-join-network',
      ],
    },
    {
      type: 'category',
      label: 'Interacting with Modules',
      items: [
        'modules/trust-registry',
        'modules/did-directory',
        'modules/credential-schema',
        'modules/credential-schema-permissions',
      ],
    },
    {
      type: 'category',
      label: 'Governance and Upgrades',
      items: ['governance/proposals', 'governance/upgrades'],
    },
    {
      type: 'category',
      label: 'Testing and Debugging',
      items: [
        'testing/testing-chain',
        'testing/debugging-cli',
        'testing/test-harness'
      ],
    },
  ],
};

export default sidebars;
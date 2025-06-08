import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Intro to Verana',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Discover how Verana provides an open, verifiable trust layer for the Internet, enabling privacy-first ecosystems, verifiable AI agents, ethical monetization, and decentralized governance through public trust registries.
      </>
    ),
  },
  {
    title: 'Ecosystem Builders',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Create your Trust Registry, define credential schemas, authorize trust registry operators, issuers, verifiers, and implement privacy-preserving verifiable credential monetization in your ecosystem.
      </>
    ),
  },
  {
    title: 'App Builders',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Create your Trust Registry, define credential schemas, authorize trust registry operators, issuers, verifiers, and implement privacy-preserving verifiable credential monetization in your ecosystem.
      </>
    ),
  },
  {
    title: 'Verifiable Service Builders',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Create your Trust Registry, define credential schemas, authorize trust registry operators, issuers, verifiers, and implement privacy-preserving verifiable credential monetization in your ecosystem.
      </>
    ),
  },
  {
    title: 'Learn',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Learn how Verifiable Trust empowers user-centric privacy, verifiable credentials, decentralized governance, and ethical monetization, enabling verifiable services and ecosystems built on transparency, not surveillance.
      </>
    ),
  },
  {
    title: 'Run a Verana Network Node',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Learn how to run a Verana Verifiable Trust Network (VVTN) node. This section guides validators and community members who want to operate nodes and help secure and grow the network.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

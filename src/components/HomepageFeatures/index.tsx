import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
  to: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Understand',
    Svg: require('@site/static/img/learn.svg').default,
    to: '/docs/understand',
    description: (
      <>
        The model in plain words: sovereign ecosystems that publish who may issue and verify,
        services and agents that prove who they are before connecting, and a trust graph that
        makes all of it discoverable.
      </>
    ),
  },
  {
    title: 'Build',
    Svg: require('@site/static/img/use.svg').default,
    to: '/docs/build',
    description: (
      <>
        Guides by job: make a service verifiable with VS Agent, create and govern an ecosystem
        with the Frontend, integrate a personal wallet, connect an AI agent through MCP, run the
        infrastructure.
      </>
    ),
  },
  {
    title: 'Reference',
    Svg: require('@site/static/img/run-a-node.svg').default,
    to: '/docs/reference',
    description: (
      <>
        APIs, parameters, messages, schemas and events, generated from the component
        repositories so they match what runs.
      </>
    ),
  },
];

function Feature({title, to, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.card}>
        <Link to={to}>
          <div className="text--center">
            <Svg className={styles.featureSvg} role="img" />
          </div>
        </Link>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">
            <Link to={to}>{title}</Link>
          </Heading>
          <p>{description}</p>
        </div>
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

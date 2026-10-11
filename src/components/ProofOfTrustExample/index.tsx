import React from 'react';
import styles from './styles.module.css';

// A static rendering of the five-block Proof-of-Trust, with the claims of the
// playground's accredited demo issuer. The playground renders the same card live.
export default function ProofOfTrustExample({variant = 'trusted'}: {variant?: 'trusted' | 'untrusted'}): JSX.Element {
  const trusted = variant === 'trusted';
  return (
    <div className={styles.card} role="figure" aria-label="Example Proof-of-Trust">
      <div className={styles.band}>
        <div className={styles.row}>
          <span className={`${styles.pill} ${trusted ? styles.trusted : styles.untrusted}`}>{trusted ? 'Trusted' : 'Untrusted'}</span>
          <span className={styles.name}>{trusted ? 'Accredited Issuer (demo)' : 'Untrusted Service (demo)'}</span>
          <span className={`${styles.pill} ${styles.net}`}>TESTNET</span>
        </div>
        <div className={styles.did}>did:webvh:QmSXfnquiRk1FELWU…{trusted ? 'demo-issuer-accredited' : 'demo-untrusted'}.playground.testnet.verana.network</div>
        <p className={styles.meta}>Evaluated at block 1 504 211 · 2026-10-20 10:14 UTC</p>
      </div>
      {trusted ? (
        <>
          <div className={styles.block}>
            <p className={styles.label}>Service</p>
            <p><strong>Accredited Issuer (demo)</strong> · Issuer service</p>
            <p className={styles.sub}>Issues the DemoCredential of the Playground Ecosystem (demo). Minimum age 0 · Terms · Privacy policy</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Operated by</p>
            <p><strong>Playground Organization (demo)</strong> · 🇨🇭 CH</p>
            <p className={styles.sub}>Registry id CHE-000.000.000 · Rue de l'Exemple 1, Geneva</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Other credentials</p>
            <div className={styles.cred}><span>ISO 9001-style quality management (demo) · ISO Certification Ecosystem (demo)</span><span className={styles.ok}>valid</span></div>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Trust chain</p>
            <p className={styles.sub}>Service credential: Accredited Issuer (demo) → ECS ecosystem</p>
            <ul className={styles.chain}>
              <li>Organization credential: Helvetia Trust Services (demo), accredited ECS issuer → ECS ecosystem</li>
              <li>ISO 9001-style (demo): NormaCert (demo), accredited issuer → ISO Certification Ecosystem (demo)</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className={styles.block}>
            <p className={styles.label}>Service</p>
            <p className={styles.sub}>No ECS Service credential presented.</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Operated by</p>
            <p className={styles.sub}>No ECS Organization or ECS Persona credential presented.</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Failures</p>
            <ul className={styles.chain}>
              <li className={styles.fail}>The DID Document declares no linked presentation of a Service credential (VS-REQ-2).</li>
              <li className={styles.fail}>Self-issued claims withheld: no accredited issuer backs them.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

import React, {useState} from 'react';
import clsx from 'clsx';
import Screenshot from '@site/src/components/Screenshot';
import styles from './styles.module.css';

type StepProps = {
  title: string;
  shot: string;
  alt?: string;
  children?: React.ReactNode;
};

export function Step({children}: StepProps): React.JSX.Element {
  return <>{children}</>;
}

export default function StepThrough({children}: {children: React.ReactNode}): React.JSX.Element {
  const steps = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<StepProps> => React.isValidElement(child) && Boolean((child.props as StepProps).shot),
  );
  const [index, setIndex] = useState(0);
  const current = steps[index].props;
  const go = (next: number) => setIndex(Math.min(Math.max(next, 0), steps.length - 1));
  return (
    <div
      className={styles.stepper}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(index + 1);
        if (event.key === 'ArrowLeft') go(index - 1);
      }}>
      <ol className={styles.tabs} role="tablist">
        {steps.map((step, i) => (
          <li key={step.props.shot}>
            <button
              type="button"
              role="tab"
              aria-selected={i === index}
              className={clsx(styles.tab, i === index && styles.active, i < index && styles.done)}
              onClick={() => go(i)}>
              <span className={styles.number}>{i + 1}</span>
              <span>{step.props.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <div role="tabpanel" className={styles.panel}>
        <Screenshot name={current.shot} alt={current.alt ?? current.title} />
        <div className={styles.text}>{current.children}</div>
      </div>
      <div className={styles.nav}>
        <button type="button" className="button button--secondary button--sm" disabled={index === 0} onClick={() => go(index - 1)}>
          ← Previous
        </button>
        <span className={styles.count}>
          Step {index + 1} of {steps.length}
        </span>
        <button
          type="button"
          className="button button--primary button--sm"
          disabled={index === steps.length - 1}
          onClick={() => go(index + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}

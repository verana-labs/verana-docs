import React, {useRef} from 'react';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

type ScreenshotProps = {
  name: string;
  alt: string;
  caption?: React.ReactNode;
};

export default function Screenshot({name, alt, caption}: ScreenshotProps): React.JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);
  const sources = {
    light: useBaseUrl(`/img/frontend/${name}.light.webp`),
    dark: useBaseUrl(`/img/frontend/${name}.dark.webp`),
  };
  return (
    <figure className={styles.figure}>
      <button
        type="button"
        className={styles.zoom}
        title="Click to enlarge"
        aria-label={`Enlarge: ${alt}`}
        onClick={() => dialog.current?.showModal()}>
        <ThemedImage sources={sources} alt={alt} loading="lazy" className={styles.image} />
      </button>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
      <dialog ref={dialog} className={styles.lightbox} onClick={() => dialog.current?.close()}>
        <ThemedImage sources={sources} alt={alt} className={styles.full} />
        <span className={styles.hint}>Click anywhere or press Esc to close</span>
      </dialog>
    </figure>
  );
}

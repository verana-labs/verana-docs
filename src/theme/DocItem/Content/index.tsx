import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Admonition from '@theme/Admonition';

type Props = WrapperProps<typeof ContentType>;

const NOTES: Record<string, {title: string; body: string}> = {
  legacy: {
    title: 'Legacy page, kept while the v4 docs are being rebuilt',
    body: 'This page comes from the previous documentation set. It is command-line centred and may describe the chain rather than the way you would do this with the Frontend, the VS Agent or the MCP server. It will be replaced by a generated reference page and a guide.',
  },
  draft: {
    title: 'Draft, being rewritten for v4',
    body: 'The substance of this page is current, the structure and wording are being reworked.',
  },
};

export default function ContentWrapper(props: Props): JSX.Element {
  const {frontMatter} = useDoc();
  const rework = (frontMatter as {rework?: string}).rework;
  const note = rework ? NOTES[rework] : undefined;
  return (
    <>
      {note ? (
        <Admonition type={rework === 'legacy' ? 'warning' : 'info'} title={note.title}>
          <p>{note.body}</p>
        </Admonition>
      ) : null}
      <Content {...props} />
    </>
  );
}

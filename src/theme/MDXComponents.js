import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Image from '@site/src/components/Image';
import Screenshot from '@site/src/components/Screenshot';
import StepThrough, {Step} from '@site/src/components/StepThrough';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Map the "<Highlight>" tag to our Highlight component
  // `Highlight` will receive all props that were passed to `<Highlight>` in MDX
  Image,
  Screenshot,
  StepThrough,
  Step,
};
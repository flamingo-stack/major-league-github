/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import * as React from 'react';
  import { SVGProps } from 'react';
  const ReactComponent: React.FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
  export { ReactComponent };
  const src: string;
  export default src;
}

import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import babel from 'rollup-plugin-babel';

export const config: Config = {
  namespace: 'amplify-ui-components',
  plugins: [
    nodePolyfills()
  ],
  outputTargets: [
    { type: 'dist' },
    { type: 'docs-readme' },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};

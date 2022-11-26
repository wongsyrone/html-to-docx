import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import cleaner from 'rollup-plugin-cleaner';
import builtins from 'rollup-plugin-node-builtins';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import * as meta from './package.json';

export default {
  input: 'index.js',
  //external: ['color-name', 'escape-html', 'html-to-vdom', 'jszip', 'virtual-dom', 'xmlbuilder2'],
  plugins: [
    builtins(),
    
    resolve({
			preferBuiltins: true,
			browser: true,
		}),
    json(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
    }),
    nodePolyfills( /* options */ ),
    // terser({
    //   mangle: false,
    // }),
    
    cleaner({
      targets: ['./dist/'],
    }),
  ],
  output: [
    {
      file: 'dist/html-to-docx.esm.js',
      format: 'es',
      sourcemap: true,
      banner: `// ${meta.homepage} v${meta.version} ESM Copyright ${new Date().getFullYear()} ${
        meta.author
      }`,
    },
    {
      file: 'dist/html-to-docx.umd.js',
      format: 'umd',
      name: 'HTMLToDOCX',
      sourcemap: true,
      banner: `// ${meta.homepage} v${meta.version} UMD Copyright ${new Date().getFullYear()} ${
        meta.author
      }`,
    },
    {
      file: 'dist/html-to-docx.iife.es5.js',
      format: 'iife',
      name: 'HTMLToDOCX',
      sourcemap: true,
      banner: `// ${meta.homepage} v${meta.version} IIFE Copyright ${new Date().getFullYear()} ${
        meta.author
      }`,

    },
  ],
};

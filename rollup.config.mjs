import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import cleaner from 'rollup-plugin-cleaner';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import * as meta from './package.json' assert {type: 'json'};
// FIXME: 需要解决打包为browser后Buffer等内置模块不起作用的问题
export default {
  input: 'index.js',
  // embed all dependencies
  //external: ['color-name', 'escape-html', 'html-to-vdom', 'jszip', 'virtual-dom', 'xmlbuilder2'],
  context: "window",
  plugins: [
    json(),
    nodeResolve({
			//preferBuiltins: true,
			browser: true,
		}),
    //builtins(),
    
    commonjs(),
    nodePolyfills( /* options */ ),
    babel({
      //exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
      babelHelpers: 'bundled',
    }),
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
      }
// Modified and repacked by wshy`,
    },
    {
      file: 'dist/html-to-docx.umd.js',
      format: 'umd',
      name: 'saveHTML2DOCXFile',
      sourcemap: true,
      banner: `// ${meta.homepage} v${meta.version} UMD Copyright ${new Date().getFullYear()} ${
        meta.author
      }
// Modified and repacked by wshy`,
    },
    {
      file: 'dist/html-to-docx.iife.es5.js',
      format: 'iife',
      name: 'saveHTML2DOCXFile',
      sourcemap: true,
      banner: `// ${meta.homepage} v${meta.version} IIFE Copyright ${new Date().getFullYear()} ${
        meta.author
      }
// Modified and repacked by wshy`,

    },
  ],
};

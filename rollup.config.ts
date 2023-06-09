import { resolve } from 'path'
import nodeResolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

const commonPlugins = [
  alias({
    entries: [
      { find: '@src', replacement: resolve(__dirname, './src') },
    ],
  }),
  nodeResolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
  esbuild({
    include: /\.[jt]sx?$/,
    exclude: /node_modules/,
    sourceMap: false,
    target: 'es2017',
  }),
]

const external = ['vue', /node_modules/]
const globalsForUMD = {
  vue: 'Vue',
}

export default [
  {
    input: 'src/index.ts',
    external,
    output: {
      exports: 'named',
      dir: 'lib/cjs/',
      format: 'cjs',
      preserveModules: true,
    },
    plugins: commonPlugins,
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      exports: 'named',
      dir: 'lib/es/',
      format: 'es',
      preserveModules: true,
    },
    plugins: commonPlugins,
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      exports: 'named',
      file: 'lib/umd/index.js',
      format: 'umd',
      globals: globalsForUMD,
      name: 'monaco_vue',
    },
    plugins: commonPlugins,
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      exports: 'named',
      file: 'lib/umd/index.min.js',
      format: 'umd',
      globals: globalsForUMD,
      name: 'monaco_vue',
    },
    plugins: [
      ...commonPlugins,
      terser({
        mangle: false,
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        compilerOptions: {
          preserveSymlinks: false,
        },
      }),
    ],
  },
]

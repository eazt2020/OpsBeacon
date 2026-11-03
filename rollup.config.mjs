import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';

export default {
  input: 'src/module.tsx',
  output: {
    file: 'dist/module.js',
    format: 'system',
    sourcemap: true,
    exports: 'named',
  },
  external: ['react', 'react-dom', '@grafana/data', '@grafana/runtime', '@grafana/ui'],
  plugins: [
    resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] }),
    esbuild({
      include: /\.[jt]sx?$/,
      target: 'es2020',
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      loaders: { '.ts': 'ts', '.tsx': 'tsx' },
      minify: false,
    }),
  ],
};

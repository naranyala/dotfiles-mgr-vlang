import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';

const result = await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  write: false,
  minify: true,
  sourcemap: false,
  target: ['es2020'],
});

const js = result.outputFiles[0].text;
const html = readFileSync('index.html', 'utf-8')
  .replace('<script src="dist/bundle.js"></script>',
    `<script>${js}</script>`);

writeFileSync('dist/app.html', html);
console.log('Built → dist/app.html');

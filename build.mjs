import {build} from 'esbuild';
await build({entryPoints:['main.tsx'],outfile:'website.js',bundle:true,minify:true,jsx:'automatic',target:['es2020'],define:{'process.env.NODE_ENV':'"production"'}});

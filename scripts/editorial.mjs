import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {join} from 'node:path';import {createHash} from 'node:crypto';import {renderMarkdown} from '../src/lib/editorial/markdown.mjs';
const hash=s=>createHash('sha256').update(s).digest('hex');
function walk(dir){return readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.name==='estado.json'?[join(dir,e.name)]:[]);}
const result={};
for(const file of walk('contenido-editorial')){const state=JSON.parse(readFileSync(file,'utf8')),dir=file.slice(0,-'estado.json'.length);for(const e of state.recursos){if(!['aprobado','demostracion'].includes(e.estado))continue;const markdown=readFileSync(join(dir,e.archivo),'utf8');if(e.estado==='aprobado'&&e.sha256!==hash(markdown))throw Error('Original alterado: '+e.id);if(result[e.id])throw Error('ID duplicado');renderMarkdown(markdown);result[e.id]={markdown,estado:e.estado};}}
const output=JSON.stringify(result,null,2)+'\n',dest='src/lib/data/editorial-generado/originales.json';mkdirSync('src/lib/data/editorial-generado',{recursive:true});if(process.argv.includes('--check')){if(readFileSync(dest,'utf8')!==output)throw Error('Generado desactualizado');}else writeFileSync(dest,output);

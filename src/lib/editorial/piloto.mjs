import {renderMarkdown} from './markdown.mjs';

// Solo para documentos del piloto. El Markdown original permanece intacto.
export function seccionesPiloto(source){
 const main=source.split('\n## Profundización opcional')[0];
 const sections=Array.from(main.matchAll(/^## (\d+)\. (.+)$/gm),m=>({id:'piloto-'+m[1],label:m[2],reference:undefined,paragraphs:[],editorialId:undefined}));
 if(source.includes('\n## Profundización opcional')) sections.push({id:'piloto-fuentes',label:'Fuentes',reference:undefined,paragraphs:[],editorialId:undefined});
 return sections;
}
export function renderPiloto(source, selected){
 const [main, optional] = source.split('\n## Profundización opcional (propuesta de desplegables)\n');
 const parts = (optional ?? main).split(/\n## (?:6\. )?Fuentes\n/);
 const bibliography = parts[1] ?? '';
 const refs = new Map();
 for(const line of bibliography.split('\n')){
  const m=line.match(/^(\d+)\. (.+)$/);
  if(m) refs.set(m[1],renderMarkdown(m[2]));
 }
 const sections=main.split(/(?=^## \d+\. )/m);
 const digits='⁰¹²³⁴⁵⁶⁷⁸⁹';
 const cite = html => html.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, token=>{
  const n=Array.from(token,c=>digits.indexOf(c)).join('');
  if(!refs.has(n)) throw Error('Referencia sin fuente: '+n);
  return '<sup><button type="button" class="cita-piloto" popovertarget="bvi-fuente-'+n+'" aria-label="Consultar fuente '+n+'">'+token+'</button></sup>';
 });
 let body;
 if(optional !== undefined){
  const notes=parts[0].split('\n').filter(l=>l.startsWith('- '));
  body=sections.map((section,i)=>{
   const note=notes[i-1];
   if(selected && selected!=='piloto-'+i) return '';
   return cite(renderMarkdown(selected?section.replace(/^## .+\n/,''):section))+(note?'<aside class="profundizacion-piloto"><strong class="nota-titulo">Profundización académica</strong>'+cite(renderMarkdown(note.slice(2)))+'</aside>':'');
  }).join('\n');
 }else if(selected){const n=Number(selected.replace('piloto-',''));body=cite(renderMarkdown((sections[n]??'').replace(/^## .+\n/,'')));}else body=cite(renderMarkdown(parts[0]));
 if(bibliography && (!selected || selected==='piloto-fuentes' || (optional===undefined && selected==='piloto-6'))) body+='<h4>Fuentes</h4>'+renderMarkdown(bibliography);
 for(const [n,html] of refs) body+='<div class="fuente-piloto" id="bvi-fuente-'+n+'" popover><strong>Fuente '+n+'</strong>'+html+'<button type="button" popovertarget="bvi-fuente-'+n+'" popovertargetaction="hide">Cerrar</button></div>';
 return body.replace(/<table><thead><tr>(.*?)<\/tr><\/thead><tbody>(.*?)<\/tbody><\/table>/gs,(_,head,rows)=>{const labels=Array.from(head.matchAll(/<th[^>]*>(.*?)<\/th>/gs),m=>m[1]);return '<div class="tarjetas-tabla" role="list">'+Array.from(rows.matchAll(/<tr>(.*?)<\/tr>/gs),m=>'<div class="fila-tabla" role="listitem">'+Array.from(m[1].matchAll(/<td>(.*?)<\/td>/gs),(c,i)=>'<div class="celda-tabla"><span class="etiqueta-tabla">'+labels[i]+'</span><div>'+c[1]+'</div></div>').join('')+'</div>').join('')+'</div>';});
}

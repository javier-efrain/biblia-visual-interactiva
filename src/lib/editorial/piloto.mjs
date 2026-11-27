import {renderMarkdown} from './markdown.mjs';

// Solo para documentos del piloto. El Markdown original permanece intacto.
export function renderPiloto(source){
 const [main, optional] = source.split('\n## Profundización opcional (propuesta de desplegables)\n');
 const parts = (optional ?? main).split(/\n## (?:6\. )?Fuentes\n/);
 const bibliography = parts[1] ?? '';
 const refs = new Map();
 for(const line of bibliography.split('\n')){
  const m=line.match(/^(\d+)\. (.+)$/);
  if(m) refs.set(m[1],renderMarkdown(m[2]));
 }
 const digits='⁰¹²³⁴⁵⁶⁷⁸⁹';
 const cite = html => html.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, token=>{
  const n=Array.from(token,c=>digits.indexOf(c)).join('');
  if(!refs.has(n)) throw Error('Referencia sin fuente: '+n);
  return '<sup><button type="button" class="cita-piloto" popovertarget="bvi-fuente-'+n+'" aria-label="Consultar fuente '+n+'">'+token+'</button></sup>';
 });
 let body;
 if(optional !== undefined){
  const notes=parts[0].split('\n').filter(l=>l.startsWith('- '));
  const sections=main.split(/(?=^## \d+\. )/m);
  body=sections.map((section,i)=>{
   const note=notes[i-1];
   return cite(renderMarkdown(section))+(note?'<details class="profundizacion-piloto"><summary>Profundización académica</summary>'+cite(renderMarkdown(note.slice(2)))+'</details>':'');
  }).join('\n');
 }else body=cite(renderMarkdown(parts[0]));
 if(bibliography) body+='<h4>Fuentes</h4>'+renderMarkdown(bibliography);
 for(const [n,html] of refs) body+='<div class="fuente-piloto" id="bvi-fuente-'+n+'" popover><strong>Fuente '+n+'</strong>'+html+'<button type="button" popovertarget="bvi-fuente-'+n+'" popovertargetaction="hide">Cerrar</button></div>';
 return body;
}

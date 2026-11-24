const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const inline=s=>esc(s).replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" rel="noopener noreferrer">$1</a>').replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
export function renderMarkdown(source){
 const lines=source.replace(/\r\n/g,'\n').split('\n');let i=0,out=[];
 const cells=s=>s.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
 const special=s=>/^(#{1,6} |:::|> |[-+] |\d+\. |\|)/.test(s);
 while(i<lines.length){let s=lines[i];if(!s.trim()){i++;continue;}
 let h=s.match(/^(#{1,6}) (.+)$/);if(h){let n=Math.min(6,h[1].length+2);out.push('<h'+n+'>'+inline(h[2])+'</h'+n+'>');i++;continue;}
 if(s.startsWith(':::')){let kind=s.slice(3).trim();if(!['palabra','verdad-central','nota','reflexion'].includes(kind))throw Error('Etiqueta desconocida');let body=[];i++;while(i<lines.length&&lines[i]!==':::')body.push(lines[i++]);if(i===lines.length)throw Error('Recuadro sin cierre');i++;out.push('<aside class="editorial-'+kind+'">'+renderMarkdown(body.join('\n'))+'</aside>');continue;}
 if(s.startsWith('|')&&/^[ |:-]+$/.test(lines[i+1]??'')&&lines[i+1]?.includes('-')){let header=cells(s),rows=[];i+=2;while(i<lines.length&&lines[i].startsWith('|')){let row=cells(lines[i++]);if(row.length!==header.length)throw Error('Tabla irregular');rows.push(row);}out.push('<div class="tabla-editorial" tabindex="0" role="region" aria-label="Tabla comparativa"><table><thead><tr>'+header.map(x=>'<th scope="col">'+inline(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(x=>'<td>'+inline(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>');continue;}
 if(s.startsWith('> ')){let q=[];while(i<lines.length&&lines[i].startsWith('> '))q.push(lines[i++].slice(2));out.push('<blockquote>'+renderMarkdown(q.join('\n'))+'</blockquote>');continue;}
 let list=s.match(/^([-+]|\d+\.) (.+)$/);if(list){let ordered=/\d/.test(list[1]),tag=ordered?'ol':'ul',items=[];while(i<lines.length){let m=lines[i].match(/^([-+]|\d+\.) (.+)$/);if(!m||/\d/.test(m[1])!==ordered)break;items.push('<li>'+inline(m[2])+'</li>');i++;}out.push('<'+tag+'>'+items.join('')+'</'+tag+'>');continue;}
 let p=[s];i++;while(i<lines.length&&lines[i].trim()&&!special(lines[i]))p.push(lines[i++]);out.push('<p>'+inline(p.join('\n'))+'</p>');}
 return out.join('\n');
}

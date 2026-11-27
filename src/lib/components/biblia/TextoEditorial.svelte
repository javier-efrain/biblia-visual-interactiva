<script lang="ts">
import {renderMarkdown} from '../../editorial/markdown.mjs';
import {renderPiloto} from '../../editorial/piloto.mjs';
let {markdown,esPiloto=false,seleccion}:{markdown:string;esPiloto?:boolean;seleccion?:string}=$props();
let html=$derived(esPiloto ? renderPiloto(markdown,seleccion) : renderMarkdown(markdown));
</script>
<div class="editorial">{@html html}</div>
<style>
.editorial{font:17px/1.75 Georgia,serif;overflow-wrap:anywhere;color:inherit}
.editorial :global(p){margin:0 0 1em;white-space:pre-line}
.editorial :global(h3),.editorial :global(h4){line-height:1.3;margin:1.2em 0 .6em}
.editorial :global(aside),.editorial :global(blockquote){margin:1em 0;padding:1em;border-inline-start:3px solid #568e7d;background:color-mix(in srgb,currentColor 6%,transparent);border-radius:6px}
.editorial :global(.editorial-palabra){font-size:1.1em}
.editorial :global(.editorial-verdad-central){border-color:#b68c4c}
.editorial :global(.tabla-editorial){overflow-x:auto;margin:1em 0}
.editorial :global(table){border-collapse:collapse;width:100%}
.editorial :global(th),.editorial :global(td){border:1px solid #87958b;padding:.5em;text-align:start}
.editorial :global(a){color:inherit;text-decoration:underline}
.editorial :global(.profundizacion-piloto){margin:1em 0;padding:.8em;border:1px solid #d7e5dc;border-radius:9px;background:#f5f8f5}
.editorial :global(summary){cursor:pointer;font:600 14px/1.5 Arial,sans-serif;color:#355a4e}
.editorial :global(.cita-piloto){border:0;background:transparent;color:#28695c;cursor:pointer;font:700 16px Arial,sans-serif;padding:3px 5px;text-decoration:underline}
.editorial :global(.fuente-piloto){box-sizing:border-box;width:min(420px,calc(100% - 32px));padding:20px;border:1px solid #d7e5dc;border-radius:12px;background:white;color:#273e35;box-shadow:0 8px 30px #142b2840}
.editorial :global(.fuente-piloto button){cursor:pointer;padding:8px 14px}
.editorial :global(.profundizacion-piloto){background:color-mix(in srgb,currentColor 5%,transparent);border:0;border-inline-start:3px solid #568e7d;font-size:.9em}
.editorial :global(.nota-titulo),.editorial :global(.etiqueta-tabla){display:block;font:600 13px/1.4 Arial,sans-serif;opacity:.8;margin-bottom:6px}
.editorial :global(.tarjetas-tabla){display:grid;gap:12px}
.editorial :global(.fila-tabla){border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:12px;padding:14px;display:grid;gap:12px;overflow-wrap:normal}
.editorial :global(.celda-tabla + .celda-tabla){border-top:1px solid color-mix(in srgb,currentColor 15%,transparent);padding-top:10px;font-weight:600}
.editorial :global(.celda-tabla + .celda-tabla .etiqueta-tabla){font-weight:400}
</style>
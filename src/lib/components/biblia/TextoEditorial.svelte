<script lang="ts">
import {renderMarkdown} from '../../editorial/markdown.mjs';
let {markdown}:{markdown:string}=$props();
let html=$derived(renderMarkdown(markdown));
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
</style>
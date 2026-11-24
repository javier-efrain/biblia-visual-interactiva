<script lang="ts">
 import TextoEditorial from '../../lib/components/biblia/TextoEditorial.svelte';
 import originales from '../../lib/data/editorial-generado/originales.json';
</script>
<main><h1>Laboratorio editorial BVI</h1><p>Demostración independiente. No es un estudio aprobado.</p><TextoEditorial markdown={originales.demo.markdown}/></main>
<style>main{max-width:680px;margin:auto;padding:24px;color:#29453b;background:#fff} @media(prefers-color-scheme:dark){main{background:#202825;color:#e5eee7}}</style>

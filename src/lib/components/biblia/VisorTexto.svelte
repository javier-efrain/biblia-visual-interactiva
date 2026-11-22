<script lang="ts">
  import { tick } from 'svelte';
  import type { TarjetaRecurso } from '../../data/biblia/registro-capitulos';

  let { recurso, cerrar }: { recurso: TarjetaRecurso | null; cerrar: () => void } = $props();
  let dialogo: HTMLDialogElement;
  let anterior: HTMLElement | null = null;
  let pestana = $state('');
  const nombres: Record<string, string> = {
    contexto: 'Contexto', exegesis: 'Exégesis', ensenanza: 'Enseñanza', devocional: 'Devocional'
  };
  const etiqueta = (tipo: string) => nombres[tipo] ?? 'Recurso';
  const secciones = $derived(recurso?.type === 'contexto' ? (recurso.sections ?? []) : []);
  const activa = $derived(secciones.find((s) => s.id === pestana) ?? secciones[0]);
  const parrafos = $derived(activa?.paragraphs ?? recurso?.paragraphs ?? []);

  $effect(() => {
    const id = recurso?.id;
    if (id) pestana = '';
  });

  $effect(() => {
    if (recurso && dialogo) {
      anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (!dialogo.open) dialogo.showModal();
    } else if (!recurso && dialogo?.open) {
      dialogo.close();
    }
  });

  async function finalizar() {
    cerrar();
    await tick();
    anterior?.focus();
  }
</script>

<dialog bind:this={dialogo} onclose={finalizar} aria-labelledby="visor-titulo" aria-describedby="visor-contenido">
  {#if recurso}
    <div class="encabezado">
      <div>
        <span class="categoria">{etiqueta(recurso.type)}</span>
        <h2 id="visor-titulo">{recurso.title}</h2>
      </div>
      <button class="cerrar" type="button" onclick={finalizar} aria-label="Cerrar recurso">✕</button>
    </div>
    {#if secciones.length}
      <nav class="pestanas" aria-label="Perspectivas del contexto">
        {#each secciones as seccion (seccion.id)}
          <button type="button" class:activa={activa?.id === seccion.id} aria-current={activa?.id === seccion.id ? 'true' : undefined} onclick={() => (pestana = seccion.id)}>
            {seccion.label}
          </button>
        {/each}
      </nav>
    {/if}
    <div class="contenido" id="visor-contenido" aria-live="polite">
      {#if activa}
        <h3>{activa.label}</h3>
      {/if}
      {#if parrafos.length}
        {#each parrafos as parrafo, indice (indice)}
          <p>{parrafo}</p>
        {/each}
      {:else}
        <p class="pendiente">Este recurso todavía no tiene contenido editorial publicado.</p>
      {/if}
    </div>
    <footer><button type="button" onclick={finalizar}>Volver a la lectura</button></footer>
  {/if}
</dialog>

<style>
  dialog { box-sizing: border-box; width: min(680px, calc(100% - 24px)); max-height: min(88dvh, 900px); padding: 0; border: 1px solid #dbe6dd; border-radius: 18px; background: #fff; color: #273e35; box-shadow: 0 18px 65px #142b2860; }
  dialog::backdrop { background: #0c211db3; }
  .encabezado { display: flex; justify-content: space-between; align-items: start; gap: 16px; padding: 24px 28px 18px; border-bottom: 1px solid #e2eae3; }
  .categoria { color: #397b70; text-transform: uppercase; letter-spacing: 1.4px; font: 700 11px Arial, sans-serif; }
  h2 { margin: 9px 0 0; font: 600 clamp(22px, 4vw, 30px)/1.25 Georgia, serif; }
  .cerrar { flex: none; width: 36px; height: 36px; border: 1px solid #dce6df; border-radius: 50%; background: #f4f7f4; color: #294b40; cursor: pointer; }
  .pestanas { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 28px 4px; }
  .pestanas button { border: 1px solid #d7e5dc; border-radius: 999px; padding: 9px 13px; background: #f5f8f5; color: #355a4e; font: 600 12px/1.3 Arial, sans-serif; cursor: pointer; }
  .pestanas button.activa { background: #397b70; color: white; border-color: #397b70; }
  .contenido { padding: 18px 28px 26px; font: 17px/1.8 Georgia, serif; }
  .contenido h3 { margin: 0 0 12px; font: 600 20px/1.4 Georgia, serif; }
  .contenido p { margin: 0 0 1.1em; white-space: pre-line; }
  .pendiente { color: #63756b; font-style: italic; }
  footer { display: flex; justify-content: flex-end; padding: 14px 28px 22px; border-top: 1px solid #e2eae3; }
  footer button { padding: 11px 17px; border: 0; border-radius: 9px; background: #397b70; color: white; font: 600 13px Arial, sans-serif; cursor: pointer; }
  button:focus-visible { outline: 3px solid #bb914e; outline-offset: 3px; }
  @media(max-width: 480px) { dialog { max-height: 92dvh; } .encabezado { padding: 20px 18px 16px; } .pestanas { padding: 14px 18px 2px; gap: 7px; } .pestanas button { padding: 9px 11px; } .contenido { padding: 16px 18px 20px; font-size: 16px; } footer { padding: 12px 18px 18px; } }
</style>

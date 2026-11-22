<script lang="ts">
  import { tick } from 'svelte';
  import type { TarjetaRecurso } from '../../data/biblia/registro-capitulos';

  let { recurso, cerrar }: { recurso: TarjetaRecurso | null; cerrar: () => void } = $props();
  let dialogo: HTMLDialogElement;
  let barra: HTMLElement;
  let lectura: HTMLElement;
  let anterior: HTMLElement | null = null;
  let pestana = $state('');
  const nombres: Record<string, string> = {
    contexto: 'Contexto', exegesis: 'Exégesis', ensenanza: 'Enseñanza', devocional: 'Devocional'
  };
  const etiqueta = (tipo: string) => nombres[tipo] ?? 'Recurso';
  const secciones = $derived(recurso?.type === 'contexto' || recurso?.type === 'exegesis' ? (recurso.sections ?? []) : []);
  const indice = $derived(Math.max(0, secciones.findIndex((s) => s.id === pestana)));
  const activa = $derived(secciones[indice]);
  const parrafos = $derived(activa?.paragraphs ?? recurso?.paragraphs ?? []);
  const esExegesis = $derived(recurso?.type === 'exegesis' && secciones.length > 0);

  $effect(() => {
    const id = recurso?.id;
    if (id) pestana = '';
  });

  $effect(() => {
    if (recurso && dialogo) {
      if (!dialogo.open) {
        anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialogo.showModal();
      }
    } else if (!recurso && dialogo?.open) {
      dialogo.close();
    }
  });

  async function seleccionar(id: string) {
    pestana = id;
    await tick();
    if (lectura) lectura.scrollTop = 0;
    if (barra) {
      const boton = Array.from(barra.querySelectorAll<HTMLButtonElement>('button[data-seccion]'))
        .find((elemento) => elemento.dataset.seccion === id);
      if (boton) {
        const centro = boton.offsetLeft + boton.offsetWidth / 2 - barra.clientWidth / 2;
        const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        barra.scrollTo({ left: centro, behavior: movimientoReducido ? 'instant' : 'smooth' });
      }
    }
  }

  function mover(direccion: number) {
    const siguiente = secciones[indice + direccion];
    if (siguiente) void seleccionar(siguiente.id);
  }

  function solicitarCierre() {
    if (dialogo?.open) dialogo.close();
  }

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
      <button class="cerrar" type="button" onclick={solicitarCierre} aria-label="Cerrar recurso">✕</button>
    </div>
    <div class="cuerpo-desplazable" bind:this={lectura}>
    {#if secciones.length}
      {#if esExegesis}
        <div class="navegacion-exegesis">
          <div class="progreso">Análisis {indice + 1} de {secciones.length}</div>
          <nav class="pestanas-exegesis" bind:this={barra} aria-label="Análisis exegéticos">
            {#each secciones as seccion (seccion.id)}
              <button data-seccion={seccion.id} type="button" class:activa={activa?.id === seccion.id} aria-current={activa?.id === seccion.id ? 'true' : undefined} onclick={() => seleccionar(seccion.id)}>
                <span>{seccion.label}</span>
                {#if seccion.reference}<small>{seccion.reference}</small>{/if}
              </button>
            {/each}
          </nav>
        </div>
      {:else}
        <nav class="pestanas" aria-label="Perspectivas del contexto">
          {#each secciones as seccion (seccion.id)}
            <button type="button" class:activa={activa?.id === seccion.id} aria-current={activa?.id === seccion.id ? 'true' : undefined} onclick={() => seleccionar(seccion.id)}>
              {seccion.label}
            </button>
          {/each}
        </nav>
      {/if}
    {/if}
    <div class="contenido" id="visor-contenido" aria-live="polite">
      {#if activa}
        {#if activa.reference}<span class="referencia">{activa.reference}</span>{/if}
        <h3>{activa.label}</h3>
      {/if}
      {#if parrafos.length}
        {#each parrafos as parrafo, i (i)}
          <p>{parrafo}</p>
        {/each}
      {:else}
        <p class="pendiente">Este recurso todavía no tiene contenido editorial publicado.</p>
      {/if}
    </div>
    </div>
    {#if esExegesis}
    <footer>
        <div class="controles">
          <button type="button" class="secundario" disabled={indice === 0} onclick={() => mover(-1)}>‹ Anterior</button>
          <button type="button" class="secundario" disabled={indice === secciones.length - 1} onclick={() => mover(1)}>Siguiente ›</button>
        </div>
    </footer>
    {/if}
  {/if}
</dialog>

<style>
  dialog { box-sizing: border-box; width: min(680px, calc(100% - 24px)); height: min(88dvh, 900px); max-height: 900px; padding: 0; border: 1px solid #dbe6dd; border-radius: 18px; background: #fff; color: #273e35; box-shadow: 0 18px 65px #142b2860; overflow: hidden; }
  dialog[open] { display: flex; flex-direction: column; }
  dialog::backdrop { background: #0c211db3; }
  .encabezado { flex: none; display: flex; justify-content: space-between; align-items: start; gap: 16px; padding: 24px 28px 18px; border-bottom: 1px solid #e2eae3; }
  .categoria { color: #397b70; text-transform: uppercase; letter-spacing: 1.4px; font: 700 11px Arial, sans-serif; }
  h2 { margin: 9px 0 0; font: 600 clamp(22px, 4vw, 30px)/1.25 Georgia, serif; }
  .cerrar { flex: none; width: 36px; height: 36px; border: 1px solid #dce6df; border-radius: 50%; background: #f4f7f4; color: #294b40; cursor: pointer; }
  .pestanas { flex: none; display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 28px 12px; }
  .pestanas button { border: 1px solid #d7e5dc; border-radius: 999px; padding: 9px 13px; background: #f5f8f5; color: #355a4e; font: 600 12px/1.3 Arial, sans-serif; cursor: pointer; }
  .pestanas button.activa { background: #397b70; color: white; border-color: #397b70; }
  .cuerpo-desplazable { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
  .navegacion-exegesis { padding: 12px 0 10px; border-bottom: 1px solid #e2eae3; background: #fff; }
  .progreso { padding: 0 28px 9px; font: 600 11px Arial, sans-serif; color: #62776e; }
  .pestanas-exegesis { display: flex; gap: 8px; overflow-x: auto; padding: 2px 28px 8px; scroll-snap-type: x proximity; scrollbar-width: thin; }
  .pestanas-exegesis button { flex: 0 0 165px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 5px; min-height: 64px; padding: 10px 12px; border: 1px solid #d7e5dc; border-radius: 12px; background: #f5f8f5; color: #355a4e; text-align: left; font: 600 12px/1.35 Arial, sans-serif; cursor: pointer; scroll-snap-align: center; }
  .pestanas-exegesis button small { font: 400 11px/1.3 Arial, sans-serif; opacity: .85; }
  .pestanas-exegesis button.activa { background: #397b70; color: white; border-color: #397b70; }
  .contenido { padding: 18px 28px 26px; font: 17px/1.8 Georgia, serif; }
  .contenido h3 { margin: 4px 0 12px; font: 600 20px/1.4 Georgia, serif; }
  .contenido p { margin: 0 0 1.1em; white-space: pre-line; }
  .referencia { font: 600 12px Arial, sans-serif; color: #397b70; }
  .pendiente { color: #63756b; font-style: italic; }
  footer { flex: none; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 10px; padding: 12px 28px 18px; border-top: 1px solid #e2eae3; background: white; }
  footer button { padding: 10px 14px; border: 0; border-radius: 9px; background: #397b70; color: white; font: 600 12px Arial, sans-serif; cursor: pointer; }
  footer .controles { display: flex; justify-content: space-between; gap: 12px; width: 100%; }
  footer button.secundario { flex: 1; background: #eef4ef; color: #355a4e; border: 1px solid #d7e5dc; }
  footer button:disabled { opacity: .4; cursor: not-allowed; }
  button:focus-visible { outline: 3px solid #bb914e; outline-offset: 3px; }
  @media(max-width: 480px) { dialog { height: 92dvh; } .encabezado { padding: 20px 18px 16px; } .pestanas { padding: 14px 18px 12px; gap: 7px; } .pestanas button { padding: 9px 11px; } .progreso { padding-left: 18px; } .pestanas-exegesis { padding-left: 18px; padding-right: 18px; } .contenido { padding: 16px 18px 20px; font-size: 16px; } footer { padding: 10px 18px 14px; } }
</style>

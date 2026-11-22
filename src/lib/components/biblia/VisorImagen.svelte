<script lang="ts">
  import { page } from '$app/state';
  import { tick } from 'svelte';
  import type { TarjetaRecurso } from '../../data/biblia/registro-capitulos';

  let { recurso, cerrar }: { recurso: TarjetaRecurso | null; cerrar: () => void } = $props();
  let dialogo: HTMLDialogElement;
  let area: HTMLDivElement;
  let anterior: HTMLElement | null = null;
  let escala = $state(1);
  let informacionAbierta = $state(false);
  let x = $state(0);
  let y = $state(0);
  let puntos = new Map<number, { x: number; y: number }>();
  let gesto: { distancia: number; escala: number; x: number; y: number; centroX: number; centroY: number } | null = null;
  const maxEscala = 5;
  const distancia = (a: {x: number; y: number}, b: {x: number; y: number}) => Math.hypot(a.x - b.x, a.y - b.y);
  const imagen = $derived(resolverRuta(recurso?.visual?.src ?? recurso?.image ?? ''));
  function resolverRuta(ruta: string): string {
    return ruta.startsWith('/biblia-visual-interactiva/') ? (page.url.pathname.startsWith('/biblia-visual-interactiva/pruebas') ? '/biblia-visual-interactiva/pruebas' : '/biblia-visual-interactiva') + ruta.slice('/biblia-visual-interactiva'.length) : ruta;
  }
  const descripcion = $derived(recurso?.visual?.description ?? '');
  const referencia = $derived(recurso?.visual?.reference ?? '');

  $effect(() => {
    if (recurso && dialogo && !dialogo.open) {
      anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialogo.showModal();
    } else if (!recurso && dialogo?.open) dialogo.close();
  });
  $effect(() => { if (recurso?.id) { escala = 1; x = 0; y = 0; informacionAbierta = false; } });

  function limitar() {
    if (!area) return;
    const ancho = area.clientWidth;
    const alto = area.clientHeight;
    x = Math.max(-ancho * (escala - 1) / 2, Math.min(ancho * (escala - 1) / 2, x));
    y = Math.max(-alto * (escala - 1) / 2, Math.min(alto * (escala - 1) / 2, y));
  }
  function zoom(nueva: number) {
    escala = Math.max(1, Math.min(maxEscala, nueva));
    if (escala === 1) { x = 0; y = 0; }
    limitar();
  }
  function alPunteroAbajo(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    puntos.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (puntos.size === 2) {
      const [a,b] = [...puntos.values()];
      gesto = { distancia: distancia(a,b), escala, x, y, centroX: (a.x+b.x)/2, centroY: (a.y+b.y)/2 };
    }
  }
  function alPunteroMover(e: PointerEvent) {
    const previo = puntos.get(e.pointerId);
    if (!previo) return;
    puntos.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (puntos.size === 2 && gesto) {
      const [a,b] = [...puntos.values()];
      escala = Math.max(1, Math.min(maxEscala, gesto.escala * distancia(a,b) / Math.max(1, gesto.distancia)));
      x = gesto.x + (a.x+b.x)/2 - gesto.centroX;
      y = gesto.y + (a.y+b.y)/2 - gesto.centroY;
    } else if (puntos.size === 1 && escala > 1) {
      x += e.clientX - previo.x;
      y += e.clientY - previo.y;
    }
    limitar();
  }
  function alPunteroArriba(e: PointerEvent) {
    puntos.delete(e.pointerId);
    gesto = null;
    if (puntos.size === 1) {
      const [a] = [...puntos.values()];
      gesto = { distancia: 1, escala, x, y, centroX: a.x, centroY: a.y };
    }
  }
  function alRueda(e: WheelEvent) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    zoom(escala * (e.deltaY > 0 ? .85 : 1.15));
  }
  function alCancelar(e: Event) {
    if (informacionAbierta) { e.preventDefault(); informacionAbierta = false; }
  }
  /** Contenido editorial: solo etiquetas de formato, sin scripts, estilos ni atributos. */
  function limpiarHtml(html: string): string {
    const escapar = (texto: string) => texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const partes = html.split(/(<\/?(?:p|strong|em|b|i|ul|ol|li|h3|h4|blockquote)\s*>)/gi);
    return partes.map((parte) => /^<\/?(?:p|strong|em|b|i|ul|ol|li|h3|h4|blockquote)\s*>$/i.test(parte) ? parte : escapar(parte)).join('');
  }
  const infoHtml = $derived(recurso?.visual?.infoHtml ? limpiarHtml(recurso.visual.infoHtml) : '');
  function cerrarVisor() { if (dialogo?.open) dialogo.close(); }
  async function alCerrar() {
    puntos.clear();
    cerrar();
    await tick();
    anterior?.focus();
  }
</script>

<dialog bind:this={dialogo} onclose={alCerrar} oncancel={alCancelar} aria-label={recurso?.title ?? 'Recurso visual'}>
  {#if recurso}
    <div class="barra" aria-label="Controles de imagen">
      <button type="button" onclick={cerrarVisor} aria-label="Cerrar imagen" title="Cerrar">✕</button>
      <div class="derecha">
        <button type="button" onclick={() => zoom(escala / 1.5)} disabled={escala <= 1} aria-label="Alejar imagen">−</button>
        <button type="button" onclick={() => zoom(escala * 1.5)} disabled={escala >= maxEscala} aria-label="Ampliar imagen">+</button>
        <button type="button" onclick={() => zoom(1)} disabled={escala === 1} aria-label="Restablecer zoom">↺</button>
        <button type="button" class:activo={informacionAbierta} onclick={() => (informacionAbierta = !informacionAbierta)} aria-label="Información del recurso" aria-expanded={informacionAbierta} aria-controls="visual-informacion">ⓘ</button>
      </div>
    </div>
    <div class="area" bind:this={area} onpointerdown={alPunteroAbajo} onpointermove={alPunteroMover} onpointerup={alPunteroArriba} onpointercancel={alPunteroArriba} onwheel={alRueda} role="group" aria-label="Imagen ampliable con gestos de dos dedos">
      {#if imagen}
        <img src={imagen} alt={recurso.visual?.alt ?? recurso.title} draggable="false" style:transform="translate({x}px, {y}px) scale({escala})" />
      {:else}
        <p>La imagen todavía no está disponible.</p>
      {/if}
    </div>
    {#if informacionAbierta}
      <section class="informacion" id="visual-informacion" aria-label="Información del recurso">
        <div class="info-cabecera">
          <div><h2>{recurso.title}</h2>{#if referencia}<small>{referencia}</small>{/if}</div>
          <button type="button" onclick={() => (informacionAbierta = false)} aria-label="Cerrar información">✕</button>
        </div>
        {#if infoHtml}
          <div class="info-texto">{@html infoHtml}</div>
        {:else if descripcion}
          <p>{descripcion}</p>
        {:else}
          <p>Este recurso no tiene una explicación adicional.</p>
        {/if}
      </section>
    {/if}
  {/if}
</dialog>

<style>
  dialog { box-sizing: border-box; width: 100vw; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: #eaf0e9; color: #29453b; overflow: hidden; }
  dialog[open] { display: flex; flex-direction: column; }
  dialog::backdrop { background: #122820b8; }
  .barra { position: absolute; z-index: 3; top: max(12px, env(safe-area-inset-top)); left: 12px; right: 12px; display: flex; align-items: start; justify-content: space-between; gap: 10px; pointer-events: none; }
  .derecha { display: flex; gap: 6px; flex-wrap: wrap; justify-content: end; }
  .barra button, .info-cabecera button { pointer-events: auto; min-width: 40px; height: 40px; padding: 0 10px; border: 1px solid #c4d5c9; border-radius: 11px; background: #ffffffed; color: #29453b; font: 600 23px Arial, sans-serif; box-shadow: 0 2px 9px #0002; cursor: pointer; }
  .barra button.activo { background: #397b70; color: white; }
  .barra button:disabled { opacity: .4; cursor: not-allowed; }
  .area { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #eaf0e9; touch-action: none; user-select: none; }
  .area img { width: 100%; height: 100%; object-fit: contain; transform-origin: center center; pointer-events: none; }
  .informacion { position: absolute; z-index: 4; left: 0; right: 0; bottom: 0; box-sizing: border-box; max-height: min(65dvh, 600px); overflow-y: auto; padding: 20px 22px max(22px, env(safe-area-inset-bottom)); background: #fff; border-radius: 18px 18px 0 0; box-shadow: 0 -8px 35px #142b2840; font: 15px/1.6 Arial, sans-serif; }
  .info-cabecera { display: flex; justify-content: space-between; gap: 12px; align-items: start; }
  h2 { margin: 0 0 5px; font: 600 23px/1.3 Georgia, serif; }
  small { color: #587367; }
  .informacion p { margin: 12px 0 0; }
  .info-texto :global(p) { margin: 12px 0; }
  .info-texto :global(h3) { margin: 16px 0 5px; font-size: 17px; }
  .info-texto :global(ul), .info-texto :global(ol) { padding-left: 23px; }
  .info-texto :global(blockquote) { border-left: 3px solid #397b70; margin: 12px 0; padding-left: 12px; }
  button:focus-visible { outline: 3px solid #bb914e; outline-offset: 3px; }
  @media (max-width: 480px) { .barra { left: 8px; right: 8px; } .derecha { gap: 4px; } .barra button { min-width: 38px; height: 38px; padding: 0 8px; } }
</style>

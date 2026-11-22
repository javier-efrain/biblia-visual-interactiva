<script lang="ts">
  import { base } from '$app/paths';
  import { tick } from 'svelte';
  import type { TarjetaRecurso } from '../../data/biblia/registro-capitulos';

  let { recurso, cerrar }: { recurso: TarjetaRecurso | null; cerrar: () => void } = $props();
  let dialogo: HTMLDialogElement;
  let area: HTMLDivElement;
  let anterior: HTMLElement | null = null;
  let escala = $state(1);
  let maximizada = $state(false);
  let x = $state(0);
  let y = $state(0);
  let puntos = new Map<number, { x: number; y: number }>();
  let gesto: { distancia: number; escala: number; x: number; y: number; centroX: number; centroY: number } | null = null;
  const maxEscala = 5;
  const distancia = (a: {x: number; y: number}, b: {x: number; y: number}) => Math.hypot(a.x - b.x, a.y - b.y);
  const imagen = $derived(resolverRuta(recurso?.visual?.src ?? recurso?.image ?? ''));
  function resolverRuta(ruta: string): string {
    return ruta.startsWith('/biblia-visual-interactiva/') ? base + ruta.slice('/biblia-visual-interactiva'.length) : ruta;
  }
  const descripcion = $derived(recurso?.visual?.description ?? '');
  const referencia = $derived(recurso?.visual?.reference ?? '');

  $effect(() => {
    if (recurso && dialogo && !dialogo.open) {
      anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialogo.showModal();
    } else if (!recurso && dialogo?.open) dialogo.close();
  });
  $effect(() => { if (recurso?.id) { escala = 1; x = 0; y = 0; maximizada = false; } });

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
  function alternarMaximizada() {
    maximizada = !maximizada;
    zoom(1);
  }
  function alCancelar(e: Event) {
    if (maximizada) { e.preventDefault(); alternarMaximizada(); }
  }
  function cerrarVisor() { if (dialogo?.open) dialogo.close(); }
  async function alCerrar() {
    puntos.clear();
    cerrar();
    await tick();
    anterior?.focus();
  }
</script>

<dialog bind:this={dialogo} onclose={alCerrar} oncancel={alCancelar} aria-labelledby="visual-titulo">
  {#if recurso}
    {#if maximizada}
      <button class="restaurar-flotante" type="button" onclick={alternarMaximizada} aria-label="Salir de vista de solo imagen" title="Salir de pantalla completa">⤢</button>
    {/if}
    {#if !maximizada}
    <header>
      <div class="titulos">
        <span class="tipo">RECURSO VISUAL</span>
        <h2 id="visual-titulo">{recurso.title}</h2>
        {#if referencia}<small>{referencia}</small>{/if}
      </div>
      <button class="cerrar" onclick={cerrarVisor} aria-label="Cerrar recurso visual">✕</button>
    </header>
    {/if}
    <div class="area" bind:this={area} onpointerdown={alPunteroAbajo} onpointermove={alPunteroMover} onpointerup={alPunteroArriba} onpointercancel={alPunteroArriba} onwheel={alRueda} role="group" aria-label="Imagen ampliable con gestos de dos dedos">
      {#if imagen}
        <img src={imagen} alt={recurso.visual?.alt ?? recurso.title} draggable="false" style:transform="translate({x}px, {y}px) scale({escala})" />
      {:else}
        <p>La imagen todavía no está disponible.</p>
      {/if}
    </div>
    {#if !maximizada}
    <div class="pie">
      <div class="controles">
        <button onclick={() => zoom(escala / 1.5)} disabled={escala <= 1} aria-label="Alejar imagen">−</button>
        <span aria-live="polite">{Math.round(escala * 100)}%</span>
        <button onclick={() => zoom(escala * 1.5)} disabled={escala >= maxEscala} aria-label="Ampliar imagen">+</button>
        <button onclick={() => zoom(1)} disabled={escala === 1}>Restablecer</button>
        <button onclick={alternarMaximizada} aria-label="Ver solo la imagen">⛶ Maximizar</button>
      </div>
      {#if descripcion}<p>{descripcion}</p>{/if}
    </div>
    {/if}
  {/if}
</dialog>

<style>
  dialog { box-sizing: border-box; width: 100vw; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: #f8faf8; color: #29453b; }
  dialog[open] { display: flex; flex-direction: column; }
  dialog::backdrop { background: #122820b8; }
  header { display: flex; justify-content: space-between; align-items: start; gap: 14px; padding: max(15px, env(safe-area-inset-top)) 20px 14px; background: #fff; border-bottom: 1px solid #dbe6dd; }
  .titulos { min-width: 0; }
  .tipo { font: 700 11px Arial, sans-serif; letter-spacing: 1.2px; color: #397b70; }
  h2 { margin: 6px 0 3px; font: 600 clamp(19px, 4vw, 26px)/1.2 Georgia, serif; }
  small { color: #587367; font: 12px Arial, sans-serif; }
  .cerrar { flex: none; width: 40px; height: 40px; border: 1px solid #dce6df; border-radius: 50%; background: #f4f7f4; color: #294b40; font-size: 22px; }
  .area { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #eaf0e9; touch-action: none; user-select: none; }
  .area img { width: 100%; height: 100%; object-fit: contain; transform-origin: center center; pointer-events: none; }
  .restaurar-flotante { position: absolute; z-index: 2; top: max(14px, env(safe-area-inset-top)); right: 14px; width: 42px; height: 42px; border: 1px solid #b8cfc1; border-radius: 12px; background: #fffdf0e8; color: #29453b; font-size: 26px; cursor: pointer; box-shadow: 0 2px 12px #0002; }
  .pie { flex: none; padding: 12px 20px max(16px, env(safe-area-inset-bottom)); background: white; border-top: 1px solid #dbe6dd; }
  .controles { display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; }
  .controles button { min-width: 40px; min-height: 38px; padding: 8px 12px; border: 1px solid #d7e5dc; border-radius: 9px; background: #eef4ef; color: #355a4e; font: 600 15px Arial, sans-serif; }
  .controles button:disabled { opacity: .4; }
  .controles span { min-width: 48px; text-align: center; font: 12px Arial, sans-serif; }
  .pie p { max-width: 720px; margin: 12px auto 0; color: #48665a; font: 13px/1.5 Arial, sans-serif; }
  button:focus-visible { outline: 3px solid #bb914e; outline-offset: 3px; }
  @media (max-width: 480px) { header { padding-left: 14px; padding-right: 14px; } .pie { padding-left: 12px; padding-right: 12px; } }
</style>

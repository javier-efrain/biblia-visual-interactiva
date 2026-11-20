<script lang="ts">
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';

  type Versiculo = { verse: number; text: string };
  type Libro = { name: string; chapters: Record<string, Versiculo[]> };

  let libro = $state<Libro | null>(null);
  let capitulo = $state(1);
  let error = $state('');
  let cargando = $state(true);

  let totalCapitulos = $derived(libro ? Object.keys(libro.chapters).length : 0);
  let versiculos = $derived(libro?.chapters[String(capitulo)] ?? []);

  onMount(() => {
    async function cargarBiblia() {
      try {
        const respuesta = await fetch(resolve('/bibles/rv1909/01.json'));
        if (!respuesta.ok) throw new Error(`No se pudo cargar Génesis (HTTP ${respuesta.status})`);
        const datos: Libro = await respuesta.json();
        if (!datos.chapters?.['1']) throw new Error('El archivo de Génesis no contiene capítulos válidos');
        libro = datos;
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
      } finally {
        cargando = false;
      }
    }

    void cargarBiblia();
  });

  function cambiarCapitulo(nuevo: number) {
    if (nuevo < 1 || nuevo > totalCapitulos) return;
    capitulo = nuevo;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:head>
  <title>BVI | Lector bíblico</title>
  <meta name="description" content="Leé la Biblia Reina-Valera 1909 en Biblia Visual Interactiva." />
</svelte:head>

<div class="app">
  <header class="encabezado">
    <div class="marca"><span class="simbolo">✦</span> BVI <span class="nombre">Biblia Visual Interactiva</span></div>
    <span class="etiqueta">Lector bíblico</span>
  </header>

  <main class="contenedor">
    <div class="intro">
      <p class="seccion">LA PALABRA, A TU ALCANCE</p>
      <h1>Leé. Descubrí. Profundizá.</h1>
      <p class="subtitulo">Una lectura tranquila, capítulo a capítulo.</p>
    </div>

    <section class="lector" aria-label="Lector de la Biblia">
      {#if cargando}
        <p class="estado" role="status">Cargando Génesis…</p>
      {:else if error}
        <p class="estado error" role="alert">No pudimos cargar la Biblia: {error}</p>
      {:else if libro}
        <div class="barra">
          <div>
            <p class="version">REINA-VALERA 1909</p>
            <h2>{libro.name}</h2>
          </div>
          <label class="selector">
            <span>Capítulo</span>
            <select
              value={capitulo}
              onchange={(evento) => cambiarCapitulo(Number(evento.currentTarget.value))}
              aria-label="Seleccionar capítulo de Génesis"
            >
              {#each Array.from({ length: totalCapitulos }, (_, i) => i + 1) as numero}
                <option value={numero}>{numero}</option>
              {/each}
            </select>
          </label>
        </div>

        <article class="texto">
          <p class="capitulo-titulo">CAPÍTULO {capitulo}</p>
          {#each versiculos as versiculo (versiculo.verse)}
            <p class="versiculo"><sup>{versiculo.verse}</sup>{versiculo.text}</p>
          {/each}
        </article>

        <nav class="navegacion" aria-label="Navegación entre capítulos">
          <button onclick={() => cambiarCapitulo(capitulo - 1)} disabled={capitulo === 1}>← Anterior</button>
          <span>{capitulo} de {totalCapitulos}</span>
          <button onclick={() => cambiarCapitulo(capitulo + 1)} disabled={capitulo === totalCapitulos}>Siguiente →</button>
        </nav>
      {/if}
    </section>
    <footer>Biblioteca BVI · Reina-Valera 1909, dominio público</footer>
  </main>
</div>

<style>
  :global(body) { background: #f5f7f3; color: #253a36; }
  .app { min-height: 100vh; }
  .encabezado { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 18px max(24px, calc((100vw - 1050px)/2)); background: #fff; border-bottom: 1px solid #e4eae5; }
  .marca { display: flex; align-items: center; gap: 9px; font-size: 23px; font-weight: 800; letter-spacing: -.5px; }
  .simbolo { color: #397b70; }
  .nombre { font-size: 13px; font-weight: 500; color: #71827a; letter-spacing: 0; padding-left: 8px; border-left: 1px solid #d8e2dc; }
  .etiqueta { background: #e8f1ec; color: #346b5e; border-radius: 99px; padding: 8px 13px; font-size: 12px; font-weight: 700; }
  .contenedor { max-width: 850px; margin: 0 auto; padding: 58px 24px 32px; }
  .intro { text-align: center; margin-bottom: 40px; }
  .seccion, .version, .capitulo-titulo { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #478376; }
  h1 { font-size: clamp(28px, 5vw, 42px); letter-spacing: -1.5px; margin: 12px 0; }
  .subtitulo { color: #75847e; margin: 0; }
  .lector { background: #fff; border: 1px solid #e3eae4; border-radius: 18px; box-shadow: 0 14px 45px #253a3610; overflow: hidden; }
  .barra { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 28px 36px; border-bottom: 1px solid #edf1ed; }
  .version { margin: 0 0 6px; }
  h2 { margin: 0; font-size: 29px; letter-spacing: -.7px; }
  .selector { display: flex; align-items: center; gap: 10px; color: #64786e; font-size: 13px; }
  select { min-width: 76px; border: 1px solid #cbdcd2; background: #f8faf8; border-radius: 9px; padding: 10px; color: #253a36; font: inherit; }
  .texto { padding: 34px 48px 42px; }
  .capitulo-titulo { margin: 0 0 28px; }
  .versiculo { font-family: Georgia, 'Times New Roman', serif; font-size: 19px; line-height: 1.85; margin: 0 0 15px; color: #2e3834; }
  sup { font-family: Arial, sans-serif; color: #478376; font-size: 11px; font-weight: 700; margin-right: 9px; vertical-align: super; }
  .navegacion { display: flex; align-items: center; justify-content: space-between; gap: 10px; border-top: 1px solid #edf1ed; padding: 22px 36px; color: #75847e; font-size: 13px; }
  button { background: #397b70; color: white; border: 0; border-radius: 9px; padding: 12px 18px; cursor: pointer; font-weight: 700; }
  button:hover:not(:disabled) { background: #2b645a; }
  button:disabled { background: #e7ede9; color: #9baaa1; cursor: not-allowed; }
  .estado { padding: 60px 30px; text-align: center; }
  .error { color: #a43737; }
  footer { text-align: center; padding: 28px 0; color: #9aa9a0; font-size: 12px; }
  @media (max-width: 600px) {
    .nombre { display: none; }
    .contenedor { padding: 35px 14px 20px; }
    .intro { margin-bottom: 25px; }
    .barra { padding: 22px; }
    .texto { padding: 26px 23px 30px; }
    .versiculo { font-size: 18px; }
    .navegacion { padding: 18px; }
    button { padding: 11px 12px; }
  }
</style>
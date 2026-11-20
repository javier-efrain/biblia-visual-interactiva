<script lang="ts">
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';
  import divisiones from '$lib/data/divisiones/marcos-2.json';

  type Versiculo = { verse: number; text: string };
  let versiculos = $state<Versiculo[]>([]);
  let cargando = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      const respuesta = await fetch(`${resolve('/')}bibles/rv1909/41.json`);
      if (!respuesta.ok) throw new Error('No se pudo cargar Marcos');
      const libro: { chapters: Record<string, Versiculo[]> } = await respuesta.json();
      versiculos = libro.chapters['2'] ?? [];
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      cargando = false;
    }
  });
</script>

<svelte:head>
  <title>Marcos 2 · Prueba piloto BVI</title>
  <meta name="description" content="Prueba piloto de divisiones editoriales en Marcos 2." />
</svelte:head>

<main class="pagina">
  <a class="volver" href={resolve('/')}>← Volver al lector BVI</a>
  <div class="etiqueta">PRUEBA PILOTO · DIVISIONES BVI</div>
  <h1>Marcos 2</h1>
  <p class="version">Reina-Valera 1909 · Cuatro secciones editoriales</p>

  {#if cargando}
    <p>Cargando capítulo…</p>
  {:else if error}
    <p role="alert">{error}</p>
  {:else}
    <article class="capitulo">
      {#each versiculos as versiculo (versiculo.verse)}
        {#each divisiones.sections.filter((seccion) => seccion.startVerse === versiculo.verse) as seccion (seccion.id)}
          <h2 class="division">{seccion.title}</h2>
          <p class="referencia">Marcos 2:{seccion.startVerse}–{seccion.endVerse}</p>
        {/each}
        <p class="versiculo"><sup>{versiculo.verse}</sup>{versiculo.text}</p>
      {/each}
    </article>
  {/if}
</main>

<style>
  :global(body) { margin: 0; background: #f5f7f3; color: #253a36; }
  .pagina { max-width: 780px; margin: 0 auto; padding: 28px 20px 70px; }
  .volver { display: inline-block; color: #397b70; font-size: 14px; margin-bottom: 35px; text-decoration: none; }
  .etiqueta { font-size: 11px; letter-spacing: 1.5px; font-weight: 800; color: #397b70; }
  h1 { margin: 12px 0 4px; font-size: 36px; }
  .version { margin: 0 0 24px; color: #72847a; font-size: 13px; }
  .capitulo { background: white; border: 1px solid #e3eae4; border-radius: 16px; padding: 30px clamp(22px, 5vw, 52px) 45px; }
  .division { margin: 36px 0 3px; font-size: 21px; line-height: 1.35; color: #397b70; }
  .division:first-child { margin-top: 0; }
  .referencia { font-size: 12px; color: #819087; margin: 0 0 18px; }
  .versiculo { margin: 0 0 13px; font: 19px/1.8 Georgia, 'Times New Roman', serif; }
  sup { font: 700 11px Arial, sans-serif; color: #397b70; margin-right: 9px; }
  @media(max-width:600px) { .pagina { padding: 20px 12px 50px; } .capitulo { padding: 24px 22px 35px; } h1 { font-size: 30px; } }
</style>

<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Division } from '../../data/biblia/registro-capitulos';
  let { division, estilo, libro, capitulo, imagen }: { division: Division; estilo: 'Editorial' | 'Minimalista' | 'Banner CSS' | 'Banner imagen'; libro: string; capitulo: number; imagen?: string } = $props();
  let fondo = $derived(imagen ? `url("${resolve('/')}${imagen}")` : 'none');
</script>

{#if estilo === 'Banner CSS' || estilo === 'Banner imagen'}
  <div class="banner-estudio" class:banner-imagen={estilo === 'Banner imagen'} style:--banner-url={fondo} aria-label={division.title}>
    <span class="banner-etiqueta">{libro.toUpperCase()} {capitulo} · BVI</span>
    <h3>{division.title}</h3>
    <span class="banner-referencia">Versículos {division.startVerse}–{division.endVerse}</span>
  </div>
{:else}
  <h3 class="titulo-division" class:editorial={estilo === 'Editorial'} class:minimalista={estilo === 'Minimalista'}>{division.title}</h3>
{/if}

<style>
  .titulo-division { font-size: 18px; line-height: 1.4; font-weight: 700; color: #397b70; margin: 30px 0 14px; }
  .titulo-division.editorial { text-align: center; font-family: Georgia, 'Times New Roman', serif; font-size: 21px; font-weight: 500; font-style: italic; color: #394d43; margin: 44px 0 24px; }
  .titulo-division.minimalista { font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: 700; color: inherit; margin: 26px 0 10px; }
  :global(.oscuro) .titulo-division { color: #8ac5ad; }
  :global(.oscuro) .titulo-division.editorial { color: #d6dfd6; }
  :global(.oscuro) .titulo-division.minimalista { color: #e4e8e2; }
  .banner-estudio { position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 6px; min-height: 112px; margin: 30px 0 22px; padding: 19px 23px; border-radius: 12px; border-left: 4px solid #397b70; background: linear-gradient(115deg, #e5f0e9, #f5f5ed); color: #264b42; }
  .banner-estudio::after { content: '✦'; position: absolute; right: 23px; top: 12px; font-size: 52px; color: #397b7020; pointer-events: none; }
  .banner-estudio h3 { position: relative; z-index: 1; font: 700 clamp(18px, 3vw, 22px)/1.25 Georgia, 'Times New Roman', serif; margin: 0; max-width: 90%; }
  .banner-etiqueta, .banner-referencia { position: relative; z-index: 1; font-size: 10px; font-weight: 700; letter-spacing: 1px; }
  .banner-referencia { font-size: 11px; font-weight: 500; letter-spacing: 0; }
  .banner-imagen { border-left-color: #a9c6a9; color: #fff; background: linear-gradient(90deg, #172e2de8 0%, #172e2dbb 55%, #172e2d50 100%), var(--banner-url) center/cover no-repeat; }
  .banner-imagen::after { display: none; }
  :global(.oscuro) .banner-estudio:not(.banner-imagen) { background: linear-gradient(115deg, #304b42, #2b3835); color: #e7f1e9; border-left-color: #8ac5ad; }
  @media (max-width: 600px) { .banner-estudio { min-height: 100px; padding: 16px 18px; margin: 24px 0 18px; } }
</style>

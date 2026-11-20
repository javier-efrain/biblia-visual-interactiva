<script lang="ts">
  /** Contrato visual reutilizable. Las imágenes son opcionales y no se inventan. */
  type Tipo = 'contexto' | 'exegesis' | 'rve' | 'ensenanza' | 'devocional';
  type Tarjeta = { id: string; title: string; type: string; image?: string };
  let { tarjetas = [], posicion }: { tarjetas?: Tarjeta[]; posicion: 'inicio' | 'centro' | 'final' } = $props();
  const tipos: Tipo[] = ['contexto', 'exegesis', 'rve', 'ensenanza', 'devocional'];
  function etiqueta(tipo: string) {
    return ({ contexto: 'Contexto', exegesis: 'Exégesis', rve: 'RVE', ensenanza: 'Enseñanza', devocional: 'Devocional' } as Record<string, string>)[tipo] ?? 'Recurso';
  }
</script>

{#if tarjetas.length > 0}
  <section class="recursos" aria-label="Recursos del relato" class:central={posicion === 'centro'}>
    <div class:carrusel={posicion === 'centro'} class:lista={posicion !== 'centro'}>
      {#each tarjetas as tarjeta (tarjeta.id)}
        {@const tipo = tipos.includes(tarjeta.type as Tipo) ? tarjeta.type : 'rve'}
        <details class="tarjeta" class:horizontal={posicion !== 'centro'} class:miniatura={posicion === 'centro'} data-tipo={tipo}>
          <summary>
            <span class="imagen" aria-hidden="true">
              {#if tarjeta.image}
                <img src={tarjeta.image} alt="" loading="lazy" />
              {:else}
                <span class="simbolo">{tipo === 'contexto' ? '◈' : tipo === 'ensenanza' ? '✦' : tipo === 'devocional' ? '♡' : tipo === 'exegesis' ? '§' : '▧'}</span>
              {/if}
            </span>
            <span class="informacion">
              <span class="tipo">{etiqueta(tipo)}</span>
              <strong>{tarjeta.title}</strong>
              <span class="accion">Abrir recurso ↗</span>
            </span>
          </summary>
          <p class="demostracion">Demostración de diseño. El contenido definitivo de este recurso todavía no fue definido.</p>
        </details>
      {/each}
    </div>
  </section>
{/if}

<style>
  .recursos { margin: 14px 0 22px; --cuadrado: 82px; --miniatura: 178px; }
  .lista { display: grid; gap: 10px; }
  .carrusel { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-inline: contain; padding: 2px 1px 12px; }
  .tarjeta { --acento: #3b7c6d; --fondo: #e2eee7; min-width: 0; border: 1px solid #d9e5dc; background: #fafcf9; color: #29453b; border-radius: 12px; overflow: hidden; }
  .tarjeta[data-tipo='ensenanza'] { --acento: #946b35; --fondo: #f2e6ce; }
  .tarjeta[data-tipo='devocional'] { --acento: #795b9c; --fondo: #e9e0f3; }
  .tarjeta[data-tipo='exegesis'] { --acento: #4b708d; --fondo: #dce8f0; }
  .tarjeta[data-tipo='rve'] { --acento: #507a53; --fondo: #e4ead7; }
  summary { display: flex; cursor: pointer; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  .horizontal summary { align-items: stretch; min-height: var(--cuadrado); }
  .imagen { flex: none; display: flex; justify-content: center; align-items: center; overflow: hidden; background: var(--fondo); color: var(--acento); }
  .horizontal .imagen { width: var(--cuadrado); aspect-ratio: 1; }
  .imagen img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .simbolo { font: 38px/1 Georgia, serif; }
  .informacion { min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 5px; padding: 11px 14px; }
  .tipo { color: var(--acento); font: 700 10px/1.3 Arial, sans-serif; letter-spacing: 1px; text-transform: uppercase; }
  strong { font: 600 15px/1.3 Georgia, serif; }
  .accion { color: var(--acento); font: 600 11px/1.4 Arial, sans-serif; }
  .miniatura { flex: 0 0 min(var(--miniatura), 72%); scroll-snap-align: start; }
  .miniatura summary { display: block; }
  .miniatura .imagen { width: 100%; aspect-ratio: 4 / 3; }
  .miniatura .informacion { min-height: 90px; padding: 10px 12px 13px; }
  .miniatura strong { font-size: 14px; }
  .demostracion { padding: 0 14px 14px; margin: 0; font: 13px/1.6 Arial, sans-serif; }
  @media (max-width: 360px) { .recursos { --cuadrado: 72px; --miniatura: 160px; } .informacion { padding: 9px 11px; } }
</style>
<script lang="ts">
  type Tarjeta = { id: string; title: string; type: string };
  let { tarjetas = [], posicion }: { tarjetas?: Tarjeta[]; posicion: 'inicio' | 'centro' | 'final' } = $props();
</script>

{#if tarjetas.length > 0}
  <section class="recursos" aria-label="Recursos educativos del relato">
    {#if posicion === 'centro'}
      <div class="carrusel">
        {#each tarjetas as tarjeta (tarjeta.id)}
          <details class="tarjeta">
            <summary><span class="tipo">{tarjeta.type === 'rve' ? 'RVE' : tarjeta.type === 'exegesis' ? 'Exégesis' : tarjeta.type}</span><strong>{tarjeta.title}</strong><span class="accion">Ver recurso ↗</span></summary>
            <p>Espacio de demostración. El contenido de este recurso todavía no fue definido.</p>
          </details>
        {/each}
      </div>
    {:else}
      {#each tarjetas as tarjeta (tarjeta.id)}
        <details class="tarjeta individual">
          <summary><span class="tipo">{tarjeta.type === 'ensenanza' ? 'Enseñanza' : 'Contexto'}</span><strong>{tarjeta.title}</strong><span class="accion">Abrir ↗</span></summary>
          <p>Espacio de demostración. El contenido de este recurso todavía no fue definido.</p>
        </details>
      {/each}
    {/if}
  </section>
{/if}

<style>
  .recursos { margin: 18px 0 24px; }
  .carrusel { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 3px 1px 12px; }
  .tarjeta { flex: 0 0 min(230px, 76%); scroll-snap-align: start; border: 1px solid #d9e5dc; background: #f6f9f5; border-radius: 12px; overflow: hidden; color: #29453b; }
  .individual { width: 100%; }
  summary { cursor: pointer; list-style: none; display: flex; flex-direction: column; gap: 9px; padding: 16px; }
  summary::-webkit-details-marker { display: none; }
  .tipo { text-transform: uppercase; font: 700 10px/1.4 Arial, sans-serif; letter-spacing: 1px; color: #397b70; }
  strong { font: 600 16px/1.35 Georgia, serif; }
  .accion { font: 600 11px Arial, sans-serif; color: #397b70; }
  p { margin: 0; padding: 0 16px 16px; font: 13px/1.6 Arial, sans-serif; }
</style>
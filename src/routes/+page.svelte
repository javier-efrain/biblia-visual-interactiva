<script lang="ts">
import { resolve } from '$app/paths';  import { onMount } from 'svelte';

  type Versiculo = {
    verse: number;
    text: string;
  };

  type Libro = {
    name: string;
    chapters: Record<string, Versiculo[]>;
  };

  let libro = $state<Libro | null>(null);
  let error = $state('');

  onMount(async () => {
    try {
const respuesta = await fetch(resolve('/bibles/rv1909/01.json'));
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}`);
      }

      libro = await respuesta.json();
    } catch (e) {
      error = String(e);
    }
  });
</script>

<main>
  {#if libro}
    <p>Reina-Valera 1909</p>
    <h1>{libro.name} 1</h1>

    {#each libro.chapters['1'] ?? [] as versiculo}
      <p>
        <sup>{versiculo.verse}</sup>
        {versiculo.text}
      </p>
    {/each}
  {:else if error}
    <p>No pudimos cargar la Biblia: {error}</p>
  {:else}
    <p>Cargando Génesis...</p>
  {/if}
</main>

<style>
  main {
    max-width: 760px;
    margin: 40px auto;
    padding: 24px;
    line-height: 1.8;
  }

  h1 {
    margin-bottom: 32px;
  }

  sup {
    color: #3c7280;
    font-weight: bold;
    margin-right: 8px;
  }
</style>
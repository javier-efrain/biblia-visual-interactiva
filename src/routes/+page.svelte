<script lang="ts">
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';
  import divisionesMarcos2 from '../lib/data/divisiones/marcos-2.json';

  type Versiculo = { verse: number; text: string };
  type Libro = { name: string; chapters: Record<string, Versiculo[]> };

  const libros = [{"id":1,"name":"Génesis"},{"id":2,"name":"Éxodo"},{"id":3,"name":"Levítico"},{"id":4,"name":"Números"},{"id":5,"name":"Deuteronomio"},{"id":6,"name":"Josué"},{"id":7,"name":"Jueces"},{"id":8,"name":"Rut"},{"id":9,"name":"1 Samuel"},{"id":10,"name":"2 Samuel"},{"id":11,"name":"1 Reyes"},{"id":12,"name":"2 Reyes"},{"id":13,"name":"1 Crónicas"},{"id":14,"name":"2 Crónicas"},{"id":15,"name":"Esdras"},{"id":16,"name":"Nehemías"},{"id":17,"name":"Ester"},{"id":18,"name":"Job"},{"id":19,"name":"Salmos"},{"id":20,"name":"Proverbios"},{"id":21,"name":"Eclesiastés"},{"id":22,"name":"Cantares"},{"id":23,"name":"Isaías"},{"id":24,"name":"Jeremías"},{"id":25,"name":"Lamentaciones"},{"id":26,"name":"Ezequiel"},{"id":27,"name":"Daniel"},{"id":28,"name":"Oseas"},{"id":29,"name":"Joel"},{"id":30,"name":"Amós"},{"id":31,"name":"Abdías"},{"id":32,"name":"Jonás"},{"id":33,"name":"Miqueas"},{"id":34,"name":"Nahúm"},{"id":35,"name":"Habacuc"},{"id":36,"name":"Sofonías"},{"id":37,"name":"Hageo"},{"id":38,"name":"Zacarías"},{"id":39,"name":"Malaquías"},{"id":40,"name":"Mateo"},{"id":41,"name":"Marcos"},{"id":42,"name":"Lucas"},{"id":43,"name":"Juan"},{"id":44,"name":"Hechos"},{"id":45,"name":"Romanos"},{"id":46,"name":"1 Corintios"},{"id":47,"name":"2 Corintios"},{"id":48,"name":"Gálatas"},{"id":49,"name":"Efesios"},{"id":50,"name":"Filipenses"},{"id":51,"name":"Colosenses"},{"id":52,"name":"1 Tesalonicenses"},{"id":53,"name":"2 Tesalonicenses"},{"id":54,"name":"1 Timoteo"},{"id":55,"name":"2 Timoteo"},{"id":56,"name":"Tito"},{"id":57,"name":"Filemón"},{"id":58,"name":"Hebreos"},{"id":59,"name":"Santiago"},{"id":60,"name":"1 Pedro"},{"id":61,"name":"2 Pedro"},{"id":62,"name":"1 Juan"},{"id":63,"name":"2 Juan"},{"id":64,"name":"3 Juan"},{"id":65,"name":"Judas"},{"id":66,"name":"Apocalipsis"}];

  type VersionApi = { id: string; name: string; abbreviation?: string };
  type LibroApi = { id: string; name: string };
  type CapituloApi = { id: string; number: string };
  const apiKey = 'Uou_17CaU7dE4j_hYXI0I';
  const apiUrl = 'https://rest.api.bible/v1';
  type Seccion = 'Inicio' | 'Biblia' | 'Catálogo' | 'Explorar';
  let seccion = $state<Seccion>('Biblia');
  let tamanoLetra = $state(19);
  let modoNoche = $state(false);
  let modoLectura = $state<'Lectura' | 'Estudio' | 'Devocional'>('Estudio');
  let temaLectura = $state('Clásico');
  let estiloSubtitulos = $state<'Clásico' | 'Editorial' | 'Minimalista'>('Clásico');
  let version = $state('local');
  let versiones = $state<VersionApi[]>([]);
  let librosApi = $state<LibroApi[]>([]);
  let capitulosApi = $state<CapituloApi[]>([]);
  let libroApiId = $state('');
  let capituloApiId = $state('');
  let contenidoApi = $state('');
  let avisoVersiones = $state('');
  let libroId = $state(1);
  let libro = $state<Libro | null>(null);
  let capitulo = $state(1);
  let error = $state('');
  let cargando = $state(true);

  let totalCapitulos = $derived(libro ? Object.keys(libro.chapters).length : 0);
  let versiculos = $derived(libro?.chapters[String(capitulo)] ?? []);
  let divisionesActuales = $derived(libroId === 41 && capitulo === 2 ? divisionesMarcos2.sections : []);

  let solicitudActual = 0;

  async function cargarLibro(id: number) {
    const solicitud = ++solicitudActual;
    cargando = true;
    error = '';
    try {
      const archivo = String(id).padStart(2, '0');
      const respuesta = await fetch(`${resolve('/')}bibles/rv1909/${archivo}.json`);
      if (!respuesta.ok) throw new Error(`No se pudo cargar el libro (HTTP ${respuesta.status})`);
      const datos: Libro = await respuesta.json();
      if (!datos.chapters?.['1']) throw new Error('El archivo no contiene capítulos válidos');
      if (solicitud !== solicitudActual) return;
      libro = datos;
      capitulo = 1;
      libroId = id;
    } catch (e) {
      if (solicitud !== solicitudActual) return;
      error = e instanceof Error ? e.message : String(e);
    } finally {
      if (solicitud === solicitudActual) cargando = false;
    }
  }

  async function pedirApi<T>(ruta: string): Promise<T> {
    const respuesta = await fetch(apiUrl + ruta, { headers: { 'api-key': apiKey } });
    if (!respuesta.ok) throw new Error('API.Bible respondió HTTP ' + respuesta.status);
    const json = await respuesta.json();
    return json.data as T;
  }

  async function cargarVersiones() {
    try {
      const disponibles = await pedirApi<VersionApi[]>('/bibles?language=spa');
      const permitidas = new Set(['LBLA', 'NBLA', 'NTV']);
      versiones = disponibles.filter((item) => permitidas.has(item.abbreviation?.toUpperCase() ?? ''));
      if (!versiones.length) avisoVersiones = 'Tu cuenta no tiene traducciones en español disponibles.';
    } catch (e) {
      avisoVersiones = 'No se pudieron consultar otras versiones: ' + String(e);
    }
  }

  let solicitudApi = 0;
  async function elegirVersion(id: string) {
    version = id;
    if (id === 'local') {
      ++solicitudApi;
      error = '';
      cargando = false;
      return;
    }
    const solicitud = ++solicitudApi;
    cargando = true;
    error = '';
    contenidoApi = '';
    try {
      const datos = await pedirApi<LibroApi[]>('/bibles/' + encodeURIComponent(id) + '/books');
      if (solicitud !== solicitudApi) return;
      const idsCanonicos = new Set(['GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL','MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV']);
      librosApi = datos.filter((item) => idsCanonicos.has(item.id));
      if (!librosApi.length) throw new Error('Esta versión no tiene libros disponibles');
      await elegirLibroApi(librosApi[0].id, solicitud);
    } catch (e) {
      if (solicitud === solicitudApi) error = String(e);
    } finally {
      if (solicitud === solicitudApi) cargando = false;
    }
  }

  async function elegirLibroApi(id: string, solicitud = ++solicitudApi) {
    if (solicitud === solicitudApi) { cargando = true; error = ''; }
    try {
      const datos = await pedirApi<CapituloApi[]>('/bibles/' + encodeURIComponent(version) + '/books/' + encodeURIComponent(id) + '/chapters');
      if (solicitud !== solicitudApi) return;
      libroApiId = id;
      capitulosApi = datos.filter((item) => /^\d+$/.test(item.number));
      if (!capitulosApi.length) throw new Error('No hay capítulos disponibles');
      await elegirCapituloApi(capitulosApi[0].id, solicitud);
    } catch (e) {
      if (solicitud === solicitudApi) error = String(e);
    } finally {
      if (solicitud === solicitudApi) cargando = false;
    }
  }

  async function elegirCapituloApi(id: string, solicitud = ++solicitudApi) {
    if (solicitud === solicitudApi) { cargando = true; error = ''; }
    try {
      const datos = await pedirApi<{ content: string }>('/bibles/' + encodeURIComponent(version) + '/chapters/' + encodeURIComponent(id) + '?content-type=text&include-notes=false&include-titles=false');
      if (solicitud !== solicitudApi) return;
      capituloApiId = id;
      contenidoApi = datos.content;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      if (solicitud === solicitudApi) error = String(e);
    } finally {
      if (solicitud === solicitudApi) cargando = false;
    }
  }

  onMount(() => { void cargarLibro(1); void cargarVersiones(); });

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

<div class:oscuro={modoNoche} class="app">
  <header class="encabezado">
    <div class="header-interior">
      <button class="marca" onclick={() => seccion = 'Biblia'} aria-label="Ir al lector bíblico">
        <span class="simbolo">✦</span><strong>BVI</strong><span class="nombre">Biblia Visual Interactiva</span>
      </button>
      <nav class="menu" aria-label="Navegación principal">
        {#each ['Inicio', 'Biblia', 'Catálogo', 'Explorar'] as opcion}
          <button class:activo={seccion === opcion} onclick={() => seccion = opcion as Seccion}>{opcion}</button>
        {/each}
      </nav>
      <details class="perfil">
        <summary aria-label="Abrir perfil y preferencias" title="Perfil y preferencias">
          <span aria-hidden="true">◉</span><span>Perfil</span>
        </summary>
        <div class="panel-perfil">
          <p class="panel-titulo">Mi espacio BVI</p>
          <p class="panel-ayuda">Preferencias de lectura</p>
          <div class="opcion-perfil">
            <span>Tamaño del texto</span>
            <div class="controles-perfil">
              <button onclick={() => tamanoLetra = Math.max(15, tamanoLetra - 1)} disabled={tamanoLetra === 15} aria-label="Reducir letra">A−</button>
              <span>{tamanoLetra}px</span>
              <button onclick={() => tamanoLetra = Math.min(26, tamanoLetra + 1)} disabled={tamanoLetra === 26} aria-label="Aumentar letra">A+</button>
            </div>
          </div>
          <div class="opcion-perfil">
            <span>Modo nocturno</span>
            <button class="alternar-perfil" onclick={() => modoNoche = !modoNoche}>{modoNoche ? 'Activado' : 'Desactivado'}</button>
          </div>
          <label class="opcion-perfil">
            <span>Modo de lectura</span>
            <select bind:value={modoLectura} aria-label="Modo de lectura">
              <option value="Lectura">Lectura</option>
              <option value="Estudio">Estudio</option>
              <option value="Devocional">Devocional</option>
            </select>
          </label>
          <p class="panel-nota">El modo Estudio es el predeterminado. Los recursos propios de cada modo se desarrollarán próximamente.</p>
          <label class="opcion-perfil">
            <span>Estilo de subtítulos</span>
            <select bind:value={estiloSubtitulos} aria-label="Estilo de subtítulos">
              <option value="Clásico">Clásico</option>
              <option value="Editorial">Editorial</option>
              <option value="Minimalista">Minimalista</option>
            </select>
          </label>
          <label class="opcion-perfil">
            <span>Temas</span>
            <select bind:value={temaLectura} aria-label="Tema de lectura">
              <option value="Clásico">Clásico</option>
            </select>
          </label>
          <p class="panel-nota">Más fuentes y estilos visuales estarán disponibles próximamente.</p>
          <p class="panel-nota">Por ahora no necesitás crear una cuenta.</p>
        </div>
      </details>
    </div>
  </header>

  <main class="contenedor">
    {#if seccion !== 'Biblia'}
      <section class="proximamente">
        <p class="seccion">BIBLIA VISUAL INTERACTIVA</p>
        <h1>{seccion}</h1>
        <p>Estamos preparando esta sección. Mientras tanto, podés leer la Biblia completa en el lector.</p>
        <button class="volver" onclick={() => seccion = 'Biblia'}>Abrir la Biblia →</button>
      </section>
    {:else}
      <div class="lectura-encabezado">
        <span>LECTOR BÍBLICO</span>
        <span class="modo-actual">{modoLectura}</span>
      </div>
    <section class="lector" aria-label="Lector de la Biblia">
      <div class="versiones">
        <label for="version-biblia">Traducción</label>
        <select id="version-biblia" value={version} onchange={(evento) => void elegirVersion(evento.currentTarget.value)}>
          <option value="local">Reina-Valera 1909 · Local</option>
          {#each versiones as opcion (opcion.id)}
            <option value={opcion.id}>{opcion.name} ({opcion.abbreviation ?? 'API'})</option>
          {/each}
        </select>
        {#if avisoVersiones}<p class="aviso">{avisoVersiones}</p>{/if}
      </div>
      {#if cargando}
        <p class="estado" role="status">Cargando libro…</p>
      {:else if error}
        <p class="estado error" role="alert">No pudimos cargar la Biblia: {error}</p>
      {:else if version !== 'local'}
        <div class="barra barra-api">
          <label class="selector"><span>Libro</span>
            <select value={libroApiId} onchange={(evento) => void elegirLibroApi(evento.currentTarget.value)}>
              {#each librosApi as opcion (opcion.id)}<option value={opcion.id}>{opcion.name}</option>{/each}
            </select>
          </label>
          <label class="selector"><span>Capítulo</span>
            <select value={capituloApiId} onchange={(evento) => void elegirCapituloApi(evento.currentTarget.value)}>
              {#each capitulosApi as opcion (opcion.id)}<option value={opcion.id}>{opcion.number}</option>{/each}
            </select>
          </label>
        </div>
        <article class="texto" style:--tamano-letra={`${tamanoLetra}px`}><p class="capitulo-titulo">{librosApi.find((item) => item.id === libroApiId)?.name ?? 'Biblia'} {capitulosApi.find((item) => item.id === capituloApiId)?.number ?? ''}</p><div class="contenido-api">{contenidoApi}</div></article>
      {:else if libro}
        <div class="barra">
          <label class="selector selector-libro">
            <span>Libro</span>
            <select value={libroId} onchange={(evento) => void cargarLibro(Number(evento.currentTarget.value))} aria-label="Seleccionar libro de la Biblia">
              {#each libros as opcion}
                <option value={opcion.id}>{opcion.name}</option>
              {/each}
            </select>
          </label>
          <label class="selector">
            <span>Capítulo</span>
            <select
              value={capitulo}
              onchange={(evento) => cambiarCapitulo(Number(evento.currentTarget.value))}
              aria-label="Seleccionar capítulo"
            >
              {#each Array.from({ length: totalCapitulos }, (_, i) => i + 1) as numero}
                <option value={numero}>{numero}</option>
              {/each}
            </select>
          </label>
        </div>

        <article class="texto" style:--tamano-letra={`${tamanoLetra}px`}>
          <h2 class="titulo-lectura">{libro.name} {capitulo}</h2>
          {#each versiculos as versiculo (versiculo.verse)}
            {#each divisionesActuales.filter((division) => division.startVerse === versiculo.verse) as division (division.id)}
              <h3 class="titulo-division" class:editorial={estiloSubtitulos === 'Editorial'} class:minimalista={estiloSubtitulos === 'Minimalista'}>{division.title}</h3>
            {/each}
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
    {/if}
    <footer>Biblioteca BVI · Lectura y recursos para profundizar en la Palabra</footer>
  </main>
</div>

<style>
  :global(body) { background: #f5f7f3; color: #253a36; }
  .app { min-height: 100vh; background: #f5f7f3; transition: background .2s; }
  .header-interior { max-width: 1150px; margin: auto; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .perfil { position: relative; flex-shrink: 0; }
  .perfil summary { display: flex; align-items: center; gap: 8px; cursor: pointer; border-radius: 999px; background: #e7f1eb; color: #24695b; padding: 10px 15px; font-size: 13px; font-weight: 700; list-style: none; }
  .perfil summary::-webkit-details-marker { display: none; }
  .perfil summary:focus-visible { outline: 2px solid #397b70; outline-offset: 3px; }
  .panel-perfil { position: absolute; top: calc(100% + 14px); right: 0; width: min(330px, calc(100vw - 24px)); z-index: 20; background: white; border: 1px solid #dfe9e1; border-radius: 15px; box-shadow: 0 18px 45px #1c38252b; padding: 22px; color: #253a36; }
  .panel-titulo { font-size: 17px; font-weight: 800; margin: 0 0 4px; }
  .panel-ayuda, .panel-nota { color: #71827a; font-size: 12px; margin: 0 0 16px; }
  .panel-nota { margin: 15px 0 0; }
  .opcion-perfil { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 12px 0; border-top: 1px solid #edf1ed; font-size: 13px; }
  .controles-perfil { display: flex; align-items: center; gap: 7px; }
  .controles-perfil button, .alternar-perfil { padding: 7px 9px; background: #e7f1eb; color: #24695b; }
  .proximas-preferencias { border-top: 1px solid #edf1ed; padding-top: 15px; font-size: 12px; color: #71827a; }
  .proximas-preferencias strong { color: #346b5e; }
  .proximas-preferencias p { margin: 7px 0 0; line-height: 1.5; }
  .lectura-encabezado { display: flex; justify-content: space-between; align-items: center; margin: 0 0 12px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #478376; }
  .modo-actual { letter-spacing: 0; background: #e4efe7; padding: 6px 11px; border-radius: 20px; }
  .titulo-lectura { font-size: 26px; margin: 0 0 24px; color: #397b70; }
  .oscuro .titulo-lectura { color: #8ac5ad; }
  .ir-preferido { width: 100%; margin-bottom: 12px; padding: 9px; }
  .opcion-perfil select { max-width: 165px; min-width: 110px; padding: 7px; font-size: 12px; }
  .menu { display: flex; align-items: center; gap: 5px; }
  .menu button { background: transparent; color: #667a71; padding: 12px 15px; border-radius: 9px; font-size: 14px; }
  .menu button:hover { background: #f0f5f1; }
  .menu button.activo { background: #e6f1eb; color: #24695b; }
  .herramientas { display: flex; justify-content: space-between; align-items: center; gap: 14px; margin-bottom: 16px; color: #60756a; font-size: 13px; font-weight: 700; }
  .acciones-lectura { display: flex; align-items: center; gap: 8px; }
  .acciones-lectura button { background: white; border: 1px solid #d8e5db; color: #346b5e; padding: 8px 12px; }
  .acciones-lectura button:disabled { background: #e7ede9; }
  .acciones-lectura .modo { margin-left: 8px; }
  .proximamente { background: white; border: 1px solid #e4eae5; border-radius: 18px; padding: 60px 40px; text-align: center; }
  .proximamente p:not(.seccion) { color: #708278; line-height: 1.7; }
  .volver { margin-top: 16px; }
  .oscuro { background: #16211f; }
  .oscuro .contenedor { color: #e5eae5; }
  .oscuro .lector, .oscuro .proximamente { background: #22312d; border-color: #3a4a44; }
  .oscuro .versiculo, .oscuro .contenido-api { color: #e4e8e2; }
  .oscuro .subtitulo, .oscuro .navegacion, .oscuro .selector { color: #b0c0b5; }
  .oscuro .barra, .oscuro .versiones, .oscuro .navegacion { border-color: #3a4a44; }
  .oscuro .acciones-lectura button { background: #2b4139; color: #e5eae5; border-color: #52685b; }
  .encabezado { position: sticky; top: 0; z-index: 10; padding: 12px 24px; background: #fff; border-bottom: 1px solid #e4eae5; }
  .marca { display: flex; align-items: center; gap: 9px; font-size: 23px; font-weight: 800; letter-spacing: -.5px; border: 0; background: transparent; color: #253a36; padding: 0; cursor: pointer; white-space: nowrap; }
  .simbolo { color: #397b70; }
  .nombre { font-size: 13px; font-weight: 500; color: #71827a; letter-spacing: 0; padding-left: 8px; border-left: 1px solid #d8e2dc; }
  .etiqueta { background: #e8f1ec; color: #346b5e; border-radius: 99px; padding: 8px 13px; font-size: 12px; font-weight: 700; }
  .contenedor { max-width: 850px; margin: 0 auto; padding: 26px 24px 32px; }
  .intro { text-align: center; margin-bottom: 40px; }
  .seccion, .version, .capitulo-titulo { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #478376; }
  h1 { font-size: clamp(28px, 5vw, 42px); letter-spacing: -1.5px; margin: 12px 0; }
  .subtitulo { color: #75847e; margin: 0; }
  .lector { background: #fff; border: 1px solid #e3eae4; border-radius: 18px; box-shadow: 0 14px 45px #253a3610; overflow: hidden; }
  .versiones { padding: 12px 28px; border-bottom: 1px solid #edf1ed; display: flex; flex-direction: column; gap: 8px; }
  .versiones label { color: #478376; font-size: 12px; font-weight: 800; }
  .versiones select { width: 100%; max-width: 450px; }
  .aviso { color: #986f32; font-size: 12px; margin: 0; }
  .barra-api { justify-content: flex-start !important; }
  .contenido-api { white-space: pre-wrap; font: var(--tamano-letra, 19px)/1.85 Georgia, 'Times New Roman', serif; }
  .barra { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 15px 28px; border-bottom: 1px solid #edf1ed; }
  .version { margin: 0 0 6px; }
  h2 { margin: 0; font-size: 29px; letter-spacing: -.7px; }
  .selector { display: flex; align-items: center; gap: 10px; color: #64786e; font-size: 13px; }
  .selector-libro select { max-width: 180px; width: 100%; }
  select { min-width: 76px; border: 1px solid #cbdcd2; background: #f8faf8; border-radius: 9px; padding: 10px; color: #253a36; font: inherit; }
  .texto { padding: 24px 40px 42px; }
  .capitulo-titulo { margin: 0 0 28px; }
  .titulo-division { font-size: 18px; line-height: 1.4; font-weight: 700; color: #397b70; margin: 30px 0 14px; }
  .oscuro .titulo-division { color: #8ac5ad; }
  .titulo-division.editorial { text-align: center; font-family: Georgia, 'Times New Roman', serif; font-size: 21px; font-weight: 500; font-style: italic; color: #394d43; margin: 44px 0 24px; }
  .titulo-division.minimalista { font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: 700; color: inherit; margin: 26px 0 10px; }
  .oscuro .titulo-division.editorial { color: #d6dfd6; }
  .oscuro .titulo-division.minimalista { color: #e4e8e2; }
  .versiculo { font-family: Georgia, 'Times New Roman', serif; font-size: var(--tamano-letra, 19px); line-height: 1.85; margin: 0 0 15px; color: #2e3834; }
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
    .contenedor { padding: 16px 12px 20px; }
    .intro { margin-bottom: 25px; }
    .barra { padding: 12px 16px; }
    .versiones { padding: 12px 16px; }
    .selector-libro { flex: 1; width: auto; justify-content: space-between; }
    .texto { padding: 20px 22px 30px; }
    .versiculo { line-height: 1.75; }
    .header-interior { flex-wrap: wrap; justify-content: center; gap: 8px; }
    .encabezado { padding: 9px 12px; }
    .menu { order: 3; width: 100%; justify-content: space-between; }
    .perfil { margin-left: auto; }
    .menu button { padding: 11px 8px; font-size: 12px; min-height: 42px; flex: 1; }
    .menu { gap: 2px; }
    .perfil summary { min-height: 42px; padding: 9px 12px; }
    .marca { font-size: 21px; }
    .intro h1 { font-size: 29px; }
    .selector { flex-wrap: wrap; }
    .barra-api .selector { width: 100%; justify-content: space-between; }
    .barra-api select { max-width: 65%; }
    .selector-libro select { max-width: 75%; }
    .versiones select { max-width: 100%; }
    .acciones-lectura { flex-wrap: wrap; }
    .navegacion { gap: 6px; }
    .navegacion button { min-height: 44px; }
    .contenido-api { overflow-wrap: anywhere; }
    .herramientas { flex-wrap: wrap; }
    .proximamente { padding: 42px 22px; }
    .navegacion { padding: 18px; }
    button { padding: 11px 12px; }\n    .panel-perfil { right: 0; }
  }
</style>
/** Registro de capítulos: importar JSON nuevos sin editar el lector ni este archivo. */
export type Division = { id: string; startVerse: number; endVerse: number; title: string; bannerImage?: string; estudioId?: string; afterVerse?: number };
export type SeccionRecurso = { id: string; label: string; reference?: string; paragraphs: string[]; editorialId?: string };
export type RecursoVisual = { src: string; alt: string; description?: string; reference?: string; infoHtml?: string; labelMode?: boolean; hotspots?: { x: number; y: number; title: string; description: string; reference?: string }[] };
export type TarjetaRecurso = { id: string; title: string; type: string; image?: string; visual?: RecursoVisual; paragraphs?: string[]; editorialId?: string; sections?: SeccionRecurso[] };
export type BloqueEstudio = { divisionId: string; afterVerse?: number; contexto?: TarjetaRecurso[]; central?: TarjetaRecurso[]; ensenanza?: TarjetaRecurso[] };
export type BloqueDevocional = { divisionId: string; devocional?: TarjetaRecurso[] };
export type CapituloBVI = { book: string; chapter: number; sections: Division[]; blocks: BloqueEstudio[]; devotionals: BloqueDevocional[]; bannerImage?: string };

type DivisionesJSON = { book: string; chapter: number; sections: Division[]; bannerImage?: string };
type RecursosJSON = { book: string; chapter: number; blocks: BloqueEstudio[] };
type DevocionalesJSON = { book: string; chapter: number; blocks: BloqueDevocional[] };

const divisiones = import.meta.glob<DivisionesJSON>('../divisiones/*.json', { eager: true, import: 'default' });
const estudios = import.meta.glob<RecursosJSON>('../recursos/*.json', { eager: true, import: 'default' });
const devocionales = import.meta.glob<DevocionalesJSON>('../recursos/devocionales-*.json', { eager: true, import: 'default' });
export type EstudioCompartido = { id: string; title: string; bannerImage?: string; contexto?: TarjetaRecurso[]; central?: TarjetaRecurso[]; ensenanza?: TarjetaRecurso[]; devocional?: TarjetaRecurso[] };
const compartidos = import.meta.glob<EstudioCompartido>('../estudios-compartidos/*.json', { eager: true, import: 'default' });
const registro = new Map<string, CapituloBVI>();
const clave = (book: string, chapter: number) => `${book}:${chapter}`;

for (const datos of Object.values(divisiones)) {
  const id = clave(datos.book, datos.chapter);
  if (registro.has(id)) throw new Error(`Divisiones duplicadas: ${id}`);
  registro.set(id, { ...datos, blocks: [], devotionals: [] });
}
for (const [ruta, datos] of Object.entries(estudios)) {
  if (ruta.includes('/devocionales-')) continue;
  const capitulo = registro.get(clave(datos.book, datos.chapter));
  if (!capitulo) throw new Error(`Recursos sin divisiones: ${ruta}`);
  capitulo.blocks = datos.blocks;
}
for (const [ruta, datos] of Object.entries(devocionales)) {
  const capitulo = registro.get(clave(datos.book, datos.chapter));
  if (!capitulo) throw new Error(`Devocionales sin divisiones: ${ruta}`);
  capitulo.devotionals = datos.blocks;
}

export function integrarCompartidos(capitulos: Iterable<CapituloBVI>, fuentes: Iterable<EstudioCompartido>) {
  const catalogo = new Map<string, EstudioCompartido>();
  for (const estudio of fuentes) {
    if (catalogo.has(estudio.id)) throw new Error('Estudio duplicado: ' + estudio.id);
    catalogo.set(estudio.id, estudio);
  }
  for (const capitulo of capitulos) {
    const ids = new Set<string>();
    for (const division of capitulo.sections) {
      if (ids.has(division.id)) throw new Error('División duplicada: ' + division.id);
      ids.add(division.id);
      if (!division.estudioId) continue;
      const estudio = catalogo.get(division.estudioId);
      if (!estudio) throw new Error('Estudio inexistente: ' + division.estudioId);
      const afterVerse = division.afterVerse ?? division.startVerse;
      if (!Number.isInteger(afterVerse) || afterVerse < division.startVerse || afterVerse > division.endVerse) throw new Error('Posición inválida: ' + division.id);
      if (capitulo.blocks.some(b => b.divisionId === division.id) || capitulo.devotionals.some(b => b.divisionId === division.id)) throw new Error('Recursos duplicados: ' + division.id);
      division.bannerImage ??= estudio.bannerImage;
      capitulo.blocks.push({ divisionId: division.id, afterVerse, contexto: estudio.contexto, central: estudio.central, ensenanza: estudio.ensenanza });
      capitulo.devotionals.push({ divisionId: division.id, devocional: estudio.devocional });
    }
  }
}
integrarCompartidos(registro.values(), Object.values(compartidos));

export function obtenerCapituloBVI(book: string, chapter: number): CapituloBVI | undefined {
  return registro.get(clave(book, chapter));
}

/** El orden coincide con los 66 libros del lector RV1909. */
export const librosCanonicos = [
  "GEN",
  "EXO",
  "LEV",
  "NUM",
  "DEU",
  "JOS",
  "JDG",
  "RUT",
  "1SA",
  "2SA",
  "1KI",
  "2KI",
  "1CH",
  "2CH",
  "EZR",
  "NEH",
  "EST",
  "JOB",
  "PSA",
  "PRO",
  "ECC",
  "SNG",
  "ISA",
  "JER",
  "LAM",
  "EZK",
  "DAN",
  "HOS",
  "JOL",
  "AMO",
  "OBA",
  "JON",
  "MIC",
  "NAM",
  "HAB",
  "ZEP",
  "HAG",
  "ZEC",
  "MAL",
  "MAT",
  "MRK",
  "LUK",
  "JHN",
  "ACT",
  "ROM",
  "1CO",
  "2CO",
  "GAL",
  "EPH",
  "PHP",
  "COL",
  "1TH",
  "2TH",
  "1TI",
  "2TI",
  "TIT",
  "PHM",
  "HEB",
  "JAS",
  "1PE",
  "2PE",
  "1JN",
  "2JN",
  "3JN",
  "JUD",
  "REV"
] as const;
export function idCanonico(numeroLibro: number): string { return librosCanonicos[numeroLibro - 1] ?? ''; }
export function numeroCanonico(id: string): number { return librosCanonicos.indexOf(id as typeof librosCanonicos[number]) + 1; }

import marcos1 from '../divisiones/marcos-1.json';
import marcos2 from '../divisiones/marcos-2.json';
import recursos1 from '../recursos/marcos-1.json';
import recursos2 from '../recursos/marcos-2.json';
import devocionales1 from '../recursos/devocionales-marcos-1.json';
import devocionales2 from '../recursos/devocionales-marcos-2.json';

export type Division = { id: string; startVerse: number; endVerse: number; title: string };
export type TarjetaRecurso = { id: string; title: string; type: string; image?: string };
export type BloqueEstudio = { divisionId: string; afterVerse?: number; contexto?: TarjetaRecurso[]; central?: TarjetaRecurso[]; ensenanza?: TarjetaRecurso[] };
export type BloqueDevocional = { divisionId: string; devocional?: TarjetaRecurso[] };
export type CapituloBVI = { book: string; chapter: number; sections: Division[]; blocks: BloqueEstudio[]; devotionals: BloqueDevocional[]; bannerImage?: string };

const capitulos: CapituloBVI[] = [
  { ...marcos1, blocks: recursos1.blocks, devotionals: devocionales1.blocks },
  { ...marcos2, blocks: recursos2.blocks, devotionals: devocionales2.blocks, bannerImage: 'banners/marcos-2.svg' }
];
const registro = new Map(capitulos.map((c) => [`${c.book}:${c.chapter}`, c]));

export function obtenerCapituloBVI(book: string, chapter: number): CapituloBVI | undefined {
  return registro.get(`${book}:${chapter}`);
}

export const librosCanonicos: Record<number, string> = { 41: 'MRK' };

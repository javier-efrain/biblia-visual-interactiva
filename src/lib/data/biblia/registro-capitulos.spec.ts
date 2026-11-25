import { describe, it, expect } from 'vitest';
import { obtenerCapituloBVI, integrarCompartidos, type CapituloBVI } from './registro-capitulos';
describe('Estudios compartidos', () => {
  it('reutiliza las mismas tarjetas y conserva posiciones locales', () => {
    const refs = [['MAT',4,'mat-4-1',2],['MRK',1,'mrk-1-3',12],['LUK',4,'luk-4-1',2]] as const;
    const bloques = refs.map(([book,chapter,id,pos]) => {
      const c = obtenerCapituloBVI(book,chapter)!;
      const b = c.blocks.find(x=>x.divisionId===id)!;
      expect(b.afterVerse).toBe(pos);
      expect(b.central).toHaveLength(6);
      expect(c.sections.find(x=>x.id===id)?.bannerImage).toBe('banners/marcos-01-03-banner.webp');
      return {b,d:c.devotionals.find(x=>x.divisionId===id)!};
    });
    for (const x of bloques) {
      expect(x.b.contexto).toBe(bloques[0].b.contexto);
      expect(x.b.central).toBe(bloques[0].b.central);
      expect(x.b.ensenanza).toBe(bloques[0].b.ensenanza);
      expect(x.d.devocional).toBe(bloques[0].d.devocional);
    }
    expect(obtenerCapituloBVI('MRK',1)?.blocks.find(x=>x.divisionId==='mrk-1-1')).toBeDefined();
  });
  it('rechaza referencias inexistentes y duplicados', () => {
    const c: CapituloBVI={book:'MAT',chapter:4,sections:[{id:'x',title:'x',startVerse:1,endVerse:2,estudioId:'x'}],blocks:[],devotionals:[]};
    expect(()=>integrarCompartidos([c],[])).toThrow('Estudio inexistente');
    expect(()=>integrarCompartidos([], [{id:'x',title:'x'},{id:'x',title:'x'}])).toThrow('Estudio duplicado');
  });
});

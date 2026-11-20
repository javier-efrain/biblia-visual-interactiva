# BVI — Contrato de bloques narrativos y recursos visuales (v1)

## Objetivo
Reutilizar **un único lector**, **un componente de tarjetas** y **una estructura de datos**. No crear un visor, una miniatura ni un banner nuevos para cada relato. Primero extender componentes existentes.

## Componentes y fuentes actuales
- Lector: `src/routes/+page.svelte` (RV1909 local y traducciones API.Bible).
- Divisiones editoriales: `src/lib/data/divisiones/marcos-2.json`.
- Recursos de Estudio: `src/lib/data/recursos/marcos-2.json`.
- Recursos de Devocional: `src/lib/data/recursos/devocionales-marcos-2.json`.
- Tarjetas reutilizables: `src/lib/components/biblia/RecursosBloque.svelte`.
- Los banners actuales siguen en el lector; **pendiente** extraerlos a `BannerNarrativo.svelte` antes de ampliarlos a otros libros.

## Reglas de modos
| Modo | Inicio del bloque | Mitad aproximada | Final |
| --- | --- | --- | --- |
| Estudio | Contexto opcional | Carrusel de Exégesis y/o uno o más RVE, opcional | Enseñanza opcional |
| Devocional | Ninguno | Ninguno | Devocional opcional |
| Lectura | Ninguno | Ninguno | Ninguno |

Los banners/subtítulos y el texto bíblico se mantienen en los tres modos.

## Contrato visual (móvil primero)
- Banner: horizontal, alto objetivo 100–115 px, título con zona segura; los diseños CSS y con imagen siguen siendo opciones.
- Contexto / Enseñanza / Devocional: tarjeta horizontal, imagen **1:1** a la izquierda, lado **82 px** (72 px en pantallas <=360 px). No se exige imagen: el componente dibuja un marcador visual genérico.
- Exégesis / RVE: miniatura vertical en carrusel, ancho **178 px** (160 px en pantallas <=360 px), imagen superior **4:3**, texto debajo.
- Las imágenes definitivas se generan para su proporción de destino: cuadradas 1024×1024 y miniaturas 1200×900, o resoluciones equivalentes. `object-fit: cover`; mantener sujetos y texto lejos de bordes. Evitar texto incrustado en la imagen: el título es HTML accesible.
- El componente permite el campo opcional `image` (ruta de imagen publicada); no requiere una imagen para funcionar.
- Los tamaños se ajustan mediante variables CSS `--cuadrado` y `--miniatura`, no con cambios dispersos.

## Contrato de datos
Una división tiene `id`, `startVerse`, `endVerse`, `title`.
Un bloque de Estudio usa `divisionId`, `afterVerse`, `contexto[]`, `central[]`, `ensenanza[]`.
Un bloque de Devocional usa `divisionId`, `devocional[]`.
Cada tarjeta tiene `id`, `title`, `type` y opcionalmente `image`. Los tipos admitidos son `contexto`, `exegesis`, `rve`, `ensenanza`, `devocional`.
Arrays ausentes o vacíos no deben mostrar tarjetas. `afterVerse` se elige cerca de la mitad narrativa, en una pausa natural.
Los recursos pertenecen al relato, **no a una traducción específica**.

## Regla de implementación
1. Agregar división y recursos en JSON.
2. Reutilizar `RecursosBloque.svelte` para cualquier tarjeta, sin duplicar su HTML/CSS.
3. Para contenido abierto de recursos, diseñar **un único visor reutilizable** cuando se defina el formato definitivo; por ahora `details` es solo una demostración.
4. Probar modos Estudio, Devocional, Lectura y traducciones local/API en celular.
5. Verificar GitHub Actions antes de fusionar `develop` a `main`. No fusionar sin aprobación.

## Pendientes
- Extraer banners del lector a componente reutilizable y centralizar la carga de divisiones por libro/capítulo.
- Definir contenido real y visor de recursos.
- Revisar accesibilidad, imágenes definitivas y contraste en tema oscuro.
- Sustituir datos demostrativos de Marcos 2 por contenido editorial validado.

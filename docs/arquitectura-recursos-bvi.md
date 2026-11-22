# BVI — Contrato de bloques narrativos y recursos visuales (v1)

## Objetivo
Reutilizar **un único lector**, **un componente de tarjetas** y **una estructura de datos**. No crear un visor, una miniatura ni un banner nuevos para cada relato. Primero extender componentes existentes.

## Componentes y fuentes actuales
- Lector: `src/routes/+page.svelte` (RV1909 local y traducciones API.Bible).
- Divisiones editoriales por capítulo: `src/lib/data/divisiones/marcos-1.json`, `marcos-2.json`, etc.
- Recursos de Estudio: `src/lib/data/recursos/marcos-2.json`.
- Recursos de Devocional: `src/lib/data/recursos/devocionales-marcos-2.json`.
- Tarjetas reutilizables: `src/lib/components/biblia/RecursosBloque.svelte`.
- Banners y títulos: `src/lib/components/biblia/BannerNarrativo.svelte` (componente único en ambos lectores).
- Registro central: `src/lib/data/biblia/registro-capitulos.ts` (resuelve libro y capítulo, sin condiciones por relato en el lector).

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

## Prueba de escalabilidad: Marcos 1\n- Marcos 1 tiene nueve divisiones narrativas (versículos 1–45).\n- Los JSON de Estudio y Devocional están vacíos deliberadamente: **no inventar tarjetas ni estudios**.\n- El banner de Marcos 1 usa CSS en ausencia de ilustración; no reutilizar la imagen de Marcos 2 para otro capítulo.\n- Para un nuevo capítulo, agregar `divisiones/<libro>-<capítulo>.json` con `book`, `chapter`, `sections` y opcional `bannerImage`. El registro lo descubre automáticamente mediante `import.meta.glob`. Los JSON de recursos son opcionales; no modificar los bucles de versículos ni el registro.\n- La carga ahora es descubrimiento automático en compilación (Vite `import.meta.glob`), no una petición de archivos en tiempo de ejecución. Nuevos JSON se incorporan al próximo despliegue.\n\n## Regla de implementación
1. Agregar divisiones en JSON; opcionalmente recursos y devocionales en JSON con el mismo `book` y `chapter`. No registrar manualmente.
2. Reutilizar `RecursosBloque.svelte` para cualquier tarjeta, sin duplicar su HTML/CSS.
3. Para contenido abierto de recursos, diseñar **un único visor reutilizable** cuando se defina el formato definitivo; por ahora `details` es solo una demostración.
4. Probar modos Estudio, Devocional, Lectura y traducciones local/API en celular.
5. Verificar GitHub Actions antes de fusionar `develop` a `main`. No fusionar sin aprobación.

## Pendientes
- El registro acepta cualquier libro con ID canónico API.Bible. La referencia de lectura `{book, chapter}` es independiente de la traducción y se conserva al alternar RV1909/API.Bible (si el destino incluye ese pasaje). Verificar visualmente con distintas versiones y capítulos; la conservación de posición exacta del versículo todavía no está implementada.
- Definir contenido real y visor de recursos.
- Revisar accesibilidad, imágenes definitivas y contraste en tema oscuro.
- Sustituir datos demostrativos de Marcos 2 por contenido editorial validado.

## Navegación entre traducciones
- `referencia` en `src/routes/+page.svelte` conserva el identificador canónico de libro y capítulo.
- RV1909 usa índices 1–66; API.Bible usa identificadores como `MRK`. La tabla completa de correspondencias está en `registro-capitulos.ts`.
- Cambiar traducción busca el mismo libro y capítulo en el destino. Solo recurre al primer capítulo disponible cuando la traducción no ofrece el solicitado.
- Cambiar libro o capítulo actualiza la referencia compartida. El número de versículo y la posición de desplazamiento aún no se sincronizan.
- Verificar los tres modos, Marcos 1 y 2, RV1909 → NBLA/LBLA/NTV → RV1909, y el cambio manual de capítulos.

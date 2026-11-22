# BVI — Visor de recursos de texto (v1)

## Estado
Implementado y probado en móvil para Contexto, Exégesis, Enseñanza y Devocional. Componente compartido: `src/lib/components/biblia/VisorTexto.svelte`. No duplicar un visor por relato.

## Dónde se configura
- Contrato de tipos: `src/lib/data/biblia/registro-capitulos.ts`, tipos `TarjetaRecurso` y `SeccionRecurso`.
- Estudios por capítulo: `src/lib/data/recursos/<libro>-<capitulo>.json` (ejemplo `marcos-2.json`).
- Devocionales por capítulo: `src/lib/data/recursos/devocionales-<libro>-<capitulo>.json`.
- Tarjetas que abren el modal: `src/lib/components/biblia/RecursosBloque.svelte`.
- El registro descubre JSON mediante `import.meta.glob`; para añadir un capítulo no se debe copiar el visor.

## Formato de datos
Cada tarjeta tiene `id`, `title`, `type` y opcionalmente `paragraphs`, `image`, `sections`. Cada elemento de `sections` tiene `id` (único dentro de la tarjeta), `label`, `paragraphs` (array de textos) y `reference` opcional. Si faltan `sections`, se muestran los `paragraphs` de la tarjeta o un aviso de contenido pendiente.

Ejemplo:
```json
{
  "id": "exe-ejemplo",
  "title": "Exégesis del pasaje",
  "type": "exegesis",
  "sections": [
    {
      "id": "tema-1",
      "label": "El perdón de los pecados",
      "reference": "Marcos 2:5",
      "paragraphs": ["Análisis del pasaje aquí."]
    }
  ]
}
```

## Cuatro formatos
| Tipo `type` | Navegación | Secciones iniciales |
| --- | --- | --- |
| `contexto` | Pestañas compactas que envuelven en varias líneas | Cultural, Religioso, Histórico, Teológico, Conexiones AT/NT |
| `exegesis` | Pestañas horizontales desplazables; tema y referencia por pestaña | Cantidad variable según versículo o bloque; `reference` por sección |
| `ensenanza` | Pestañas compactas que envuelven en varias líneas | Punto de tensión, Verdad exegética central, Devocional, Preguntas de reflexión, Aplicación, Desafío, Oración |
| `devocional` | Dos pestañas compactas | Devocional, Aplicación |

La cantidad de secciones se obtiene de los datos, no está fijada en el componente. Los nombres anteriores son el contrato editorial inicial, no un límite técnico.

## Comportamiento de lectura
1. La tarjeta abre un diálogo modal; la X cierra y el botón Atrás del móvil debe cerrar el diálogo sin abandonar la lectura.
2. El encabezado y los botones **Anterior/Siguiente** permanecen visibles; las pestañas y el texto se desplazan verticalmente juntos.
3. Al cambiar de sección se actualizan título, contenido, estado de pestaña y disponibilidad de Anterior/Siguiente. La zona de lectura vuelve al principio.
4. En Exégesis, la barra de pestañas se desplaza horizontalmente para mostrar la seleccionada; respetar preferencia de movimiento reducido.
5. En la primera sección Anterior está deshabilitado; en la última, Siguiente.
6. La navegación no debe modificar libro, capítulo, traducción ni posición del lector bíblico detrás del modal.
7. No volver a agregar un segundo botón «Volver a la lectura»; la X y Atrás cumplen esa función.

## Cómo modificar sin romper los demás
- **Cambiar un texto o añadir un análisis:** editar solamente el JSON correspondiente y mantener IDs únicos.
- **Cambiar botones o diseño común:** modificar `VisorTexto.svelte`, revisar los cuatro tipos.
- **Agregar un nuevo tipo de recurso:** ampliar el tipo y el tratamiento en `VisorTexto.svelte` y las tarjetas, con prueba en móvil.
- **Agregar capítulos:** crear JSON y divisiones siguiendo `docs/arquitectura-recursos-bvi.md`; no crear componentes específicos por capítulo.
- **Publicación:** cambios primero en `develop`; verificar `npm run check`, `npm test`, `npm run build` y GitHub Actions. Fusionar en `main` solo con autorización explícita.

## Lista de verificación
- Abrir/cerrar por X y Atrás de Android.
- Probar pestañas y Anterior/Siguiente en los cuatro recursos.
- Verificar 1, 2 y 10+ análisis exegéticos y desplazamiento horizontal automático.
- Probar scroll de textos largos en pantalla pequeña sin barra de pestañas fija.
- Verificar cambio de traducción, regreso a lectura y persistencia de libro/capítulo.
- Comprobar que recursos sin `sections` siguen funcionando.
- Confirmar que la compilación y publicación de GitHub Pages finalicen en verde.

## Pendiente editorial
Los textos de Marcos 2 son contenido piloto y no sustituyen una revisión exegética/editorial final. Las etiquetas de las secciones podrán refinarse sin cambiar la arquitectura.

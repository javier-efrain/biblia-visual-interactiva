# BVI — Manual de recursos visuales
Versión 2.3 · Criterios aprobados · 2026-11-27

## Propósito y selección
Cada recurso responde a una necesidad educativa concreta del pasaje. No existe cuota por capítulo. Familias abiertas: mapas, cronologías, diagramas, reconstrucciones, genealogías, relaciones, comparaciones, infografías y escenas. Profundidad ilustrativa, explicativa o analítica según necesidad, sin categorías obligatorias visibles.

## Identidad y modalidades
Realismo histórico cinematográfico, sensación de observar un mundo real. Mapas, diagramas y cronologías pueden privilegiar precisión funcional. Modalidad principal para explicaciones: imagen con texto incorporado, comprensible sin abrir información adicional. Exploración interactiva opcional para edificios, ciudades y objetos complejos; conservar marcadores numerados. Escenas limpias cuando el texto no aporta. No exigir etiquetas HTML superpuestas. El botón de información amplía, documenta y aclara.

## Composición
Proporción, resolución y orientación determinadas por el contenido, sin formato universal. Títulos clásicos cinematográficos, explicaciones de tipografía moderna legible; jerarquía de título, referencia, subtítulos y explicación cuando corresponda. Colores adaptados al entorno y mensaje, sin paleta fija. Densidad según profundidad educativa, sin límite arbitrario de palabras; dividir cuando mejore lectura. Verificar legibilidad móvil y con zoom, contraste, ortografía y referencias. No sacrificar profundidad por minimalismo.

## Biblioteca interna progresiva
Crear referencias reutilizables a medida que se producen estudios, no como requisito previo masivo. Fichas de personajes principales con identidad visual consistente, edad y vestimenta adaptadas a cada escena; secundarios flexibles. Registrar identificador, período, origen, rasgos plausibles, referencia visual, fuentes e incertidumbres. Rostros son reconstrucciones ilustrativas, no retratos documentados. Lugares diferenciados por período histórico; objetos, arquitectura y vestimentas según época y región. Revisar continuidad: IA no garantiza identidad exacta. Biblioteca interna inicialmente, posible atlas futuro.

## Rigor
Distinguir lo documentado (texto o evidencia externa), reconstrucción plausible y representación conceptual. Indicar detalles desconocidos, hipótesis y debates. Evitar anacronismos, errores geográficos y confusión entre metáfora y realidad. Consultar texto bíblico, léxicos, documentos antiguos, investigaciones académicas, museos, arqueología, atlas y comentarios según necesidad. IA no es fuente de autoridad. Registrar fuentes realmente consultadas, referencias bíblicas, naturaleza del recurso y observaciones en información complementaria. No inventar citas.

## Flujo de producción
1. Estudiar el pasaje.
2. Identificar necesidades educativas visuales.
3. Investigar y consultar biblioteca existente.
4. Diseñar composición, textos, proporción y referencias.
5. Generar imagen.
6. Revisar precisión, ortografía, continuidad y legibilidad; corregir o regenerar.
7. Integrar imagen, título, descripción, referencias y fuentes.
8. Guardar progresivamente los recursos aprobados en develop; probar en móvil y escritorio y solicitar aprobación explícita antes de publicar en main.

Separar manuales, referencias internas y recursos publicados. Aplicar [Checklist editorial](CHECKLIST_EDITORIAL.md). Las pruebas del templo y Gálatas son prototipos, no recursos históricos o editoriales definitivos.

## Criterio de precisión proporcional
En mapas esquemáticos, priorizar las relaciones geográficas necesarias para el objetivo educativo; indicar ubicaciones y límites aproximados. No exigir precisión cartográfica innecesaria ni presentar con certeza datos desconocidos. Revisar autónomamente y regenerar por errores sustantivos, no por diferencias estéticas menores.

## Experiencia de viaje
Formato opcional aprobado: paisaje cinematográfico desde la perspectiva del viajero, recorrido geográfico, etapas, distancias, perfil de elevación cuando aporte, condiciones ambientales, fauna regional y contexto histórico. Distinguir itinerarios hipotéticos, ubicaciones tradicionales, estimaciones de marcha y datos verificados; no confundir diferencia neta de altitud con descenso acumulado. Identificar fuentes y referencia bíblica. No imponer todos los elementos a cada recurso. Ejemplo: Marcos 1:4–5, RVE 06.

## Política de calidad y optimización
Priorizar legibilidad móvil. Conservar resolución original de RVE y mapas en PNG o WebP sin pérdida; no recortar ni reducir resolución para ahorrar peso. Optimizar miniaturas y banners por separado en WebP de alta calidad, previa comprobación visual. Evitar duplicación de recursos: preferir el que aporte mayor valor educativo, conservando identificadores e historial. En Marcos 1:1–8 el RVE 06 sustituye al RVE 01 en la primera posición del carrusel.

## Registro de versión
Versión 2.0: consolida identidad, precisión proporcional, experiencia de viaje y calidad visual. La política de optimización no implica que los archivos existentes hayan sido convertidos. Validar miniaturas y banners antes de adoptar conversiones a escala.

## Procedimiento WebP aprobado (2026-11-25)
Miniaturas y banners: calidad 95, resolución original, sin recortes. Conservar PNG originales en Git. Ejecutar `bash scripts/optimizar-imagenes.sh` con cwebp instalado; genera derivados WebP sin modificar originales. La primera integración limita el script a Marcos 1:1–8. Ampliar explícitamente el alcance para próximos bloques tras verificar calidad. GitHub Actions genera los derivados antes de compilar el laboratorio; no se versionan los binarios derivados. Las referencias de las miniaturas de contexto, exégesis, enseñanza y devocional, y del banner apuntan a WebP. Para desarrollo local ejecutar el script antes de iniciar el visor. No procesar static/visuales. Verificar dimensiones, peso y legibilidad en móvil antes de publicar. La calidad 95 es compresión con pérdida, no porcentaje de fidelidad.

## Ampliación de experiencia de viaje (2026-11-25)
Formato aprobado: infografía geográfica inmersiva, con paisaje cinematográfico panorámico desde la perspectiva del viajero como protagonista y un pequeño mapa aéreo de relieve integrado para situar el recorrido. Incorporar, cuando aporten, etapas, distancias, tiempos, perfil de elevación, clima, agua, terreno, flora, fauna y contexto bíblico e histórico. No imponer todos los módulos. Verificar coordenadas y relaciones espaciales; distinguir distancia geodésica de distancia recorrida, marcha efectiva de duración total y diferencia neta de altitud de desnivel acumulado. No dibujar perfiles cuantitativos sin datos de terreno de un itinerario definido; si faltan, usar comparación de altitudes o descripción cualitativa. El mapa inserto debe indicar si es esquemático y no llevar escala ficticia. Distinguir destino tradicional, recorrido hipotético y hechos textuales; identificar fuentes consultadas. Revisar cifras, coherencia entre gráfico y etiquetas, legibilidad móvil y zoom antes de aprobar. Marcos 1:4–5 RVE 06 es referencia de composición; Marcos 1:9–11 RVE 01 incorpora el mapa aéreo pequeño; consultar su historial de aprobación. Esta ampliación se conserva en la versión 2.1.

## Producción visual secuencial y control de calidad (v2.1)
1. Definir para cada RVE su pregunta educativa, afirmaciones sustentadas, fuentes, composición y método principal. Para recursos explicativos, combinar infografía con el método pertinente (mapa, cronología, comparación, diagrama, escena o reconstrucción); evitar módulos decorativos y combinaciones forzadas. Las escenas limpias siguen siendo válidas.
2. Preparar texto definitivo y referencias visuales antes de generar. Una solicitud produce un único recurso y una composición coherente; no entregar mosaicos de variantes ni avanzar al siguiente RVE sin aprobación explícita del actual.
3. Inspeccionar el resultado real antes de presentarlo: cotejar cada texto, cifra, flecha, etiqueta, referencia, relación espacial y detalle histórico con el diseño y fuentes. En mapas comprobar orientación, posiciones relativas, hidrografía y rutas; en fauna comprobar especie, hábitat y plausibilidad regional, sin afirmar presencia en la escena cuando el texto calla. Distinguir paralelos interpretativos de equivalencias explícitas; en comparaciones sinópticas ausencia de mención no significa negación.
4. Corregir autónomamente errores sustantivos; revisar la imagen corregida completa para detectar regresiones. Mantener composición y elementos ya aprobados salvo cambios necesarios. Si persiste un error, detenerse, explicar el defecto y ofrecer corrección o aceptación explícita documentada; una nota complementaria no convierte un error gráfico en un hecho correcto.
5. Presentar únicamente el recurso revisado para aprobación. Al aprobar, conservar inmediatamente el PNG definitivo sin cambios, con ID estable, nombre, ruta, fuentes y observaciones; verificar archivo y commit en develop antes de avanzar. Si no es posible persistirlo directamente, declarar el bloqueo y solicitar la carga del archivo exacto; no afirmar que fue guardado.
6. Producir banner y miniaturas como piezas diferenciadas, coherentes con el bloque y entre sí; comprobar recorte real, contraste y legibilidad. Mantener originales y generar derivados WebP q95 mediante el script, ampliando explícitamente el alcance por bloque. No convertir RVE con pérdida.
7. Integrar y comprobar cada recurso en el visor real: ruta, título, descripción, alt, referencia, información complementaria, orden, zoom y navegación. Confirmar que los derivados se incluyen en el artefacto desplegado. Registrar las comprobaciones visuales efectivamente realizadas y las pendientes.

Marcos 1:12–13 evidencia la necesidad de estas puertas: errores cartográficos y de fauna, matices interpretativos, reiteración de correcciones y una compilación exitosa sin tarjetas vinculadas. Las excepciones aceptadas para ese bloque no constituyen precedentes de calidad.

**Registro v2.1 (2026-11-25):** actualización posterior a Marcos 1:12–13; conserva los criterios vigentes de v2.0 y añade controles secuenciales y técnicos.

## Recursos visuales compartidos entre relatos paralelos (v2.2)
- Planificar los RVE después de aprobar el estudio integral. Inventariar y reutilizar recursos aprobados pertinentes; no producir mapas, escenas, miniaturas ni banners repetidos por cada evangelio sin necesidad educativa.
- Conservar un único archivo definitivo por recurso, ID estable, rutas, originales y fuentes. Compartir banner y miniaturas cuando resulten adecuados; si un pasaje necesita una pieza específica, justificarla. No alterar imágenes aprobadas sin nueva revisión y aprobación.
- En comparaciones, identificar explícitamente cada testimonio y sus referencias; distinguir ausencia de mención de negación, orden narrativo de cronología histórica y detalles exclusivos de datos comunes. No imponer una secuencia armonizada incierta. Un recurso centrado en un autor puede reutilizarse si su alcance queda claro.
- Revisar las referencias incorporadas en la imagen y metadatos; ampliar solo cuando aporte y sin ocultar su procedencia. Aplicar íntegramente las puertas secuenciales v2.1, persistencia, calidad, fuentes y optimización. Verificar la misma imagen y sus derivados desde todos los pasajes vinculados, en laboratorio.

**Registro v2.2 (2026-11-25):** incorpora producción integral de relatos paralelos y reutilización técnica; conserva íntegramente las normas anteriores. Piloto técnico: commit ebea2ec, ejecución 45698925494; compilación y despliegue exitosos, cero errores y advertencias Svelte, tres pruebas unitarias aprobadas en develop. Advertencias de infraestructura Node.js 20, punycode y url.parse() registradas. Validación del usuario en los tres libros; no implica inspección exhaustiva de cada visor ni aprobación editorial integral.

## Estándar 2.3 — aprobado el 27/11/2026

- Conservar metodología RVE anterior; no cambiar imágenes aprobadas por ajustes del visor textual.
- Navegación horizontal para contexto y exégesis 2.3; notas académicas visibles y diferenciadas, sin desplegables. Tablas compactas con desplazamiento; tarjetas para síntesis cuando aporten. Componentes reutilizables, no HTML específico por estudio.

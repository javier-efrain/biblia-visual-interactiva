# BVI — Manual de recursos visuales
Versión 2.0 · Criterios aprobados · 2026-11-25

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
Miniaturas y banners: calidad 95, resolución original, sin recortes. Conservar PNG originales en Git. Ejecutar `bash scripts/optimizar-imagenes.sh` con cwebp instalado; genera derivados WebP sin modificar originales. La primera integración limita el script a Marcos 1:1–8. Ampliar explícitamente el alcance para próximos bloques tras verificar calidad. GitHub Actions genera los derivados antes de compilar el laboratorio; no se versionan los binarios derivados. Las referencias de las cinco tarjetas y banner apuntan a WebP. Para desarrollo local ejecutar el script antes de iniciar el visor. No procesar static/visuales. Verificar dimensiones, peso y legibilidad en móvil antes de publicar. La calidad 95 es compresión con pérdida, no porcentaje de fidelidad.

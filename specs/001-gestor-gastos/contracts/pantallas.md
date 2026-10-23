# Contrato: pantallas y rutas (expo-router)

Cada archivo de `gestor-gastos/app/` es una pantalla. Esta tabla es el "mapa" de la app.

| # spec | Archivo | Ruta | Parámetros | Título | Cómo se llega |
|---|---|---|---|---|---|
| — | `app/_layout.tsx` | — | — | — | `Stack` raíz: contiene las pestañas y las pantallas que se abren encima. |
| — | `app/(tabs)/_layout.tsx` | — | — | — | `Tabs` con "Gastos" y "Resumen". |
| 1 | `app/(tabs)/index.tsx` | `/` | — | Gastos | Pestaña "Gastos" (inicio). |
| 4 | `app/(tabs)/resumen.tsx` | `/resumen` | — | Resumen | Pestaña "Resumen". |
| 2 | `app/gasto/[id].tsx` | `/gasto/abc123` | `id` | Detalle | Tocar un gasto de la lista. |
| 3 | `app/gasto/formulario.tsx` | `/gasto/formulario` o `/gasto/formulario?id=abc123` | `id` (opcional) | Nuevo gasto / Editar gasto | "Agregar gasto" (sin `id`) o "Editar" (con `id`). |

## Navegación

```text
[Pestañas]
  Gastos (/) ──toca un gasto──> Detalle (/gasto/[id]) ──Editar──> Formulario (?id=)
     │                               │                               │ Guardar → vuelve al Detalle
     │                               └─Eliminar + confirmar──> vuelve a Gastos
     └──Agregar gasto──> Formulario (sin id) ── Guardar → vuelve a Gastos
  Resumen (/resumen)
```

- Para volver después de guardar o eliminar se usa `router.back()`.
- Las pantallas que muestran datos los recargan al volver a verse (`useFocusEffect`), así siempre
  están actualizadas.

## Estados de cada pantalla (principio IV / FR-003)

| Pantalla | Cargando | Vacío | Error |
|---|---|---|---|
| Gastos | "Cargando…" + indicador | "Todavía no cargaste gastos" + botón "Agregar gasto" | Mensaje + "Reintentar" |
| Detalle | Indicador | "No se encontró el gasto" + "Volver" | Mensaje + "Reintentar" |
| Formulario (edición) | Indicador mientras trae el gasto | "No se encontró el gasto" | Mensaje + "Reintentar" |
| Formulario (al guardar) | Botón "Guardar" deshabilitado con "Guardando…" | — | Mensaje arriba del botón; se puede volver a intentar |
| Resumen | Indicador | "No hay gastos este mes" | Mensaje + "Reintentar" |

Los tres estados se dibujan con componentes compartidos de `components/`: `Cargando`,
`MensajeVacio` y `MensajeError`.

## Agregado durante el desarrollo (H6 y H7)

| # spec | Archivo | Ruta | Título | Cómo se llega |
|---|---|---|---|---|
| 5 | `app/categoria/nueva.tsx` | `/categoria/nueva` | Nueva categoría | Mosaico "Nueva" en las categorías del formulario. |

- **Formulario**: la lista de categorías ya no es fija: se pide a `obtenerCategorias()` (con sus
  estados de carga y error) y termina con el mosaico "Nueva".
- **Resumen**: selector "Semana / Mes" y flechas "‹ ›" debajo del encabezado; si el período no
  tiene gastos, "No hay gastos en este período" sin ocultar el selector.

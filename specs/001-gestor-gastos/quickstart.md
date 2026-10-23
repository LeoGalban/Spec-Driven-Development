# Guía rápida y pruebas: Gestor de Gastos

Cómo correr la app y cómo comprobar, en el teléfono, que cumple la spec.

## Requisitos

- Node.js 20 o superior (`node -v`).
- La app **Expo Go** instalada en el teléfono (Play Store / App Store), compatible con SDK 58.
- Teléfono y computadora en la **misma red Wi-Fi**.

## Correr la app

```powershell
cd gestor-gastos
npm install
npx expo start
```

Escanear el código QR con Expo Go (Android) o con la cámara (iPhone). Si la red no lo permite,
usar `npx expo start --tunnel`.

## Volver a los datos de ejemplo

En Android: Ajustes → Aplicaciones → Expo Go → Almacenamiento → "Borrar datos". En iPhone:
desinstalar y volver a instalar Expo Go. Al no existir la clave `gastos`, se vuelven a cargar los
ejemplos.

## Escenarios de prueba

Cada fila es una prueba manual. Se considera aprobada si pasa lo de la columna "Resultado esperado".

| # | Historia / requisito | Pasos | Resultado esperado |
|---|---|---|---|
| 1 | H1, FR-012, FR-013 | Abrir la app por primera vez | Se ve "Cargando…" (~1 s) y después 12 gastos de ejemplo. |
| 2 | H1, FR-001 | Mirar las fechas de la lista | Van de la más reciente a la más antigua. |
| 3 | H1, FR-002 | Sumar a mano los gastos del mes actual | Coincide con el total de arriba; los del mes anterior no se suman. |
| 4 | H1 | Mirar una fila | Descripción, categoría, fecha `DD/MM/AAAA` y monto `$ 1.234,50`. |
| 5 | H2 | Tocar un gasto | Se abre el detalle con todos sus datos; "Atrás" vuelve a la lista. |
| 6 | H3 | "Agregar gasto" | Formulario vacío con la fecha de hoy. |
| 7 | H3, FR-006 | Tocar "Guardar" con todo vacío | No se guarda; aparecen mensajes en descripción, monto y categoría. |
| 8 | FR-006 | Probar: descripción `"  ab "`, monto `0`, `abc`, `10,555`, `20000000`, fecha `31/02/2026`, fecha de mañana, nota de 201 caracteres | Cada caso muestra su mensaje del [modelo de datos](data-model.md#reglas-de-validación-fr-006). |
| 9 | H3 | Corregir un campo y volver a "Guardar" | El mensaje de ese campo desaparece. |
| 10 | H3, casos borde | Cargar un gasto válido con monto `1500,50`; tocar "Guardar" dos veces rápido | Botón deshabilitado mientras guarda; el gasto aparece **una sola vez** en la lista y el total sube $ 1.500,50. |
| 11 | H4 | Detalle → "Editar" → cambiar el monto → "Guardar" | Vuelve al detalle con el monto nuevo; la lista también lo muestra. |
| 12 | H4, FR-009 | Detalle → "Eliminar" → "Cancelar" | No pasa nada. |
| 13 | H4, FR-009 | Detalle → "Eliminar" → confirmar | Vuelve a la lista y el gasto ya no está. |
| 14 | H5, FR-010 | Abrir "Resumen" | Categorías del mes con total y %, de mayor a menor; los totales coinciden con la lista. |
| 15 | H5 | Agregar un gasto y volver a "Resumen" | Los totales se actualizaron. |
| 16 | FR-011 | Cerrar Expo Go por completo y volver a abrir la app | Los cambios de las pruebas anteriores siguen ahí. |
| 17 | H1, FR-003 | Eliminar todos los gastos | "Todavía no cargaste gastos" con botón para agregar; "Resumen" dice "No hay gastos este mes". |
| 18 | FR-003 | Poner `PROBABILIDAD_ERROR = 1` en `services/simulacion.ts` y guardar | Las pantallas muestran el mensaje de error y "Reintentar". Volver a `0` y tocar "Reintentar": cargan bien. |
| 19 | Casos borde | Agregar varios gastos y desplazar la lista | Se desplaza sin trabarse (`FlatList`). |

## Escenarios agregados durante el desarrollo (H6 y H7)

| # | Historia / requisito | Pasos | Resultado esperado |
|---|---|---|---|
| 20 | H6 | Formulario → "Nueva" → nombre "Mascotas", un color y un ícono → "Crear" | Vuelve al formulario con "Mascotas" elegida. |
| 21 | H6, FR-016 | Intentar crear "comida", "a" y un nombre de 21 letras | Cada caso muestra su mensaje y no se crea. |
| 22 | H6 | Guardar un gasto con "Mascotas" | Aparece con su ícono y color en la lista, el detalle y el resumen. |
| 23 | H6, FR-011 | Cerrar Expo Go y volver a abrir | "Mascotas" sigue en las categorías. |
| 24 | H7 | Resumen → "Semana" | Total y categorías de lunes a domingo de esta semana, con el rango de fechas. |
| 25 | H7, FR-017 | Tocar "‹" y "›" en semana y en mes | Cambia el período; "›" no pasa del actual. Un período sin gastos dice "No hay gastos en este período". |

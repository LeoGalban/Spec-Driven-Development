# Contrato: servicio de gastos (`services/gastos.ts`)

Es la "API" que usan las pantallas. Hoy la implementa un mock con AsyncStorage; si mañana hay un
backend real, se reescribe este archivo respetando el mismo contrato y las pantallas no cambian
(principio III).

## Reglas comunes a todas las funciones

- Son `async` y devuelven una `Promise`.
- Antes de responder esperan entre **500 y 1000 ms** (`esperar()` de `services/simulacion.ts`).
- Si se está simulando un error (`PROBABILIDAD_ERROR`), la `Promise` se **rechaza** con
  `Error('No se pudieron cargar los datos')`. La pantalla lo muestra con "Reintentar".
- Las pantallas **no** acceden a AsyncStorage ni a los datos de ejemplo directamente.

## Funciones

| Función | Recibe | Devuelve | Comportamiento |
|---|---|---|---|
| `obtenerGastos()` | — | `Promise<Gasto[]>` | Todos los gastos, ordenados por `fecha` de más reciente a más antiguo. La primera vez (no existe la clave `gastos`) guarda y devuelve los datos de ejemplo. |
| `obtenerGasto(id)` | `id: string` | `Promise<Gasto \| null>` | El gasto con ese `id`, o `null` si no existe (la pantalla muestra "No se encontró el gasto"). |
| `crearGasto(datos)` | `datos: DatosGasto` | `Promise<Gasto>` | Genera el `id`, lo guarda y devuelve el gasto creado. |
| `actualizarGasto(id, datos)` | `id: string`, `datos: DatosGasto` | `Promise<Gasto>` | Reemplaza los datos del gasto. Si el `id` no existe, rechaza con `Error('No se encontró el gasto')`. |
| `eliminarGasto(id)` | `id: string` | `Promise<void>` | Lo borra. Si no existe, no hace nada. |

Los tipos están en el [modelo de datos](../data-model.md).

## Funciones auxiliares (sin latencia, no acceden a datos)

En `utils/`, porque son cálculos puros sobre datos que la pantalla ya tiene:

| Función | Archivo | Qué hace |
|---|---|---|
| `totalDelMes(gastos)` | `utils/calculos.ts` | Suma en centavos de los gastos del mes actual. |
| `resumenPorCategoria(gastos)` | `utils/calculos.ts` | `{ categoria, totalCentavos, porcentaje }[]` del mes actual, de mayor a menor. |
| `validarGasto(valores)` | `utils/validacion.ts` | `ErroresFormulario` según FR-006. |
| `formatearPesos`, `textoACentavos`, `centavosATexto`, `fechaAMostrar`, `fechaAGuardar`, `hoy` | `utils/formato.ts` | Conversiones del [modelo de datos](../data-model.md#conversiones). |

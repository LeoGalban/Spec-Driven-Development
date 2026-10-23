# Tareas: Gestor de Gastos Personales

**Entrada**: documentos de diseño de `specs/001-gestor-gastos/`

**Requisitos previos**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Pruebas**: no hay tareas de tests automáticos ([research.md §11](research.md)). Cada tarea dice
**cómo se verifica en el teléfono** con Expo Go.

## Cómo se trabaja cada tarea (constitución, principio VI)

1. Se hace **una tarea por vez**, en orden.
2. Se prueba en el teléfono según la línea **Verificar**.
3. Se registra en `PROCESO.md` (sección 5): prompt, qué generó la IA, qué se corrigió y cómo se
   verificó.
4. **Un commit por tarea**: `feat: T07 - servicio de gastos` (o `chore:`, `docs:`, `fix:`).
5. Se marca la casilla `[x]` de la tarea en este archivo, dentro del mismo commit.

## Formato: `- [ ] T## [P?] [H?] Descripción`

- **[P]**: se puede hacer en cualquier orden respecto de otras [P] de la misma fase (archivos
  distintos, sin depender entre sí).
- **[H1]…[H5]**: historia de usuario de la spec a la que pertenece.
- Todas las rutas son relativas a `gestor-gastos/`, salvo que digan otra cosa.

---

## Fase 1: Preparación del proyecto

**Objetivo**: un proyecto Expo con expo-router que abre en el teléfono.

- [x] T01 Crear el proyecto con `npx create-expo-app@latest gestor-gastos --template blank-typescript` desde la raíz del repositorio y comprobar que `gestor-gastos/.gitignore` excluye `node_modules/`.
  - **Verificar**: `cd gestor-gastos` + `npx expo start`, escanear el QR con Expo Go y ver la pantalla inicial de la plantilla. Sacar captura para `PROCESO.md` §4.3.
- [x] T02 Instalar y configurar expo-router siguiendo la guía de instalación manual de la documentación de Expo: `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`; en `package.json` poner `"main": "expo-router/entry"`; en `app.json` agregar `"scheme": "gestorgastos"`; borrar `App.tsx` e `index.ts`. Crear `app/_layout.tsx` con un `Stack` cuya pantalla `(tabs)` no muestre encabezado (`headerShown: false`), `app/(tabs)/_layout.tsx` con `Tabs` de dos pestañas (`index` con título "Gastos" y `resumen` con título "Resumen"), y `app/(tabs)/index.tsx` y `app/(tabs)/resumen.tsx` que solo muestren un texto con su nombre.
  - **Verificar**: en el teléfono se ven las dos pestañas y se puede pasar de una a otra.
- [x] T03 Crear `AGENTS.md` en la **raíz del repositorio** con el resumen de la constitución para el agente de IA (stack, carpetas, idioma, "datos solo por `services/`", estados de carga/vacío/error, una tarea por vez) y `CLAUDE.md` en la raíz con una sola línea que indique leer `AGENTS.md`.
  - **Verificar**: abrir los archivos y comprobar que coinciden con `.specify/memory/constitution.md`.

**Punto de control**: la app abre en Expo Go con dos pestañas vacías.

---

## Fase 2: Base (bloquea a todas las historias)

**Objetivo**: tipos, formato, servicio mock y componentes de estado que usan todas las pantallas.

⚠️ Ninguna historia se puede empezar hasta terminar esta fase.

- [x] T04 [P] Crear `types/gasto.ts` con: `type Categoria = 'Comida' | 'Transporte' | 'Hogar' | 'Salud' | 'Ocio' | 'Otros'`; `const CATEGORIAS: Categoria[]` con esas 6 en ese orden; `type Gasto = { id: string; descripcion: string; montoCentavos: number; categoria: Categoria; fecha: string; nota: string }` (`fecha` en formato `AAAA-MM-DD`, `nota` es `""` si no tiene); `type DatosGasto = Omit<Gasto, 'id'>`; `ValoresFormulario` (`descripcion`, `monto`, `fecha` y `nota` como `string`; `categoria: Categoria | null`) y `type ErroresFormulario = Partial<Record<keyof ValoresFormulario, string>>`, según [data-model.md](data-model.md).
  - **Verificar**: `npx tsc --noEmit` no muestra errores.
- [x] T05 [P] Crear `utils/formato.ts` con funciones puras: `formatearPesos(centavos)` → `"$ 1.234,50"` (punto de miles, coma decimal, siempre 2 decimales, **sin** `Intl`); `textoACentavos(texto)` que acepta coma o punto decimal (`"1500,50"` → `150050`, usando `Math.round` para evitar errores de redondeo); `centavosATexto(centavos)` → `"1500,50"`; `fechaAMostrar("2026-10-23")` → `"23/10/2026"`; `fechaAGuardar("23/10/2026")` → `"2026-10-23"`; `hoy()` → fecha de hoy en `AAAA-MM-DD` usando la hora local del teléfono.
  - **Verificar**: llamar temporalmente las funciones con `console.log` desde `app/(tabs)/index.tsx`, comparar en la terminal de Metro con los ejemplos de [data-model.md](data-model.md#conversiones) y **borrar** los `console.log` antes del commit.
- [ ] T06 Crear `services/simulacion.ts` con `esperar()` (espera un tiempo aleatorio entre 500 y 1000 ms con `Promise` + `setTimeout`), la constante exportada `PROBABILIDAD_ERROR = 0` (comentar que se pone en `1` para mostrar el estado de error en la demo) y `simularError()` que lanza `Error('No se pudieron cargar los datos')` si `Math.random() < PROBABILIDAD_ERROR`. Crear `services/datosEjemplo.ts` con una función `crearDatosEjemplo(): Gasto[]` que genere **12 gastos** según la fecha de hoy: **7 del mes actual** (días entre el 1 y hoy) y **5 del mes anterior**, usando las 6 categorías y al menos 2 con nota ([research.md §13](research.md)).
  - **Verificar**: `npx tsc --noEmit` sin errores.
- [ ] T07 Instalar AsyncStorage con `npx expo install @react-native-async-storage/async-storage` y crear `services/gastos.ts` con `obtenerGastos`, `obtenerGasto`, `crearGasto`, `actualizarGasto` y `eliminarGasto` exactamente como dice [contracts/servicio-gastos.md](contracts/servicio-gastos.md): todas llaman a `esperar()` y `simularError()`; guardan la lista completa en JSON bajo la clave `gastos`; si la clave **no existe** guardan y devuelven `crearDatosEjemplo()`, y si existe (aunque sea `[]`) respetan su contenido; `obtenerGastos` ordena por `fecha` de más reciente a más antiguo; `crearGasto` genera el `id` con `Date.now().toString()`. Comentario al inicio del archivo explicando qué simula.
  - **Verificar**: en `app/(tabs)/index.tsx`, con un `useEffect` temporal, llamar `obtenerGastos()` y mostrar en pantalla la cantidad: tras ~1 s debe decir 12. Quitar la prueba antes del commit (o dejarla si la reemplaza T11).
- [ ] T08 [P] Crear los componentes de estado en `components/`: `Cargando.tsx` (`ActivityIndicator` + texto opcional, por defecto "Cargando…"), `MensajeVacio.tsx` (recibe `mensaje` y opcionalmente `textoBoton` + `alPresionar`) y `MensajeError.tsx` (recibe `mensaje` y `alReintentar`, muestra botón "Reintentar"). Estilos con `StyleSheet`, centrados en la pantalla.
  - **Verificar**: mostrarlos temporalmente en `app/(tabs)/resumen.tsx`, mirarlos en el teléfono y volver a dejar la pantalla como estaba.

**Punto de control**: el servicio devuelve los 12 gastos de ejemplo después de la demora.

---

## Fase 3: Historia 1 — Ver mis gastos (P1) 🎯 MVP

**Objetivo**: la pestaña "Gastos" muestra la lista ordenada y el total del mes, con sus estados.

**Prueba independiente**: abrir la app y comprobar lista, orden y total (escenarios 1–4 de
[quickstart.md](quickstart.md)).

- [ ] T09 [P] [H1] Crear `utils/calculos.ts` con `totalDelMes(gastos: Gasto[]): number` que sume `montoCentavos` solo de los gastos cuya `fecha` empieza con el `AAAA-MM` de `hoy()` (FR-002).
  - **Verificar**: `npx tsc --noEmit` sin errores (se ve funcionando en T11).
- [ ] T10 [P] [H1] Crear `components/TarjetaGasto.tsx`: recibe un `gasto` y `alPresionar`; muestra descripción, categoría, fecha con `fechaAMostrar` y monto con `formatearPesos`. Usa `Pressable`.
  - **Verificar**: `npx tsc --noEmit` sin errores (se ve en T11).
- [ ] T11 [H1] Implementar `app/(tabs)/index.tsx`: carga con `obtenerGastos()` dentro de `useFocusEffect` (de `expo-router`); estados con `useState` para `gastos`, `cargando` y `error`; muestra `Cargando`, `MensajeError` (con "Reintentar" que vuelve a cargar) o `MensajeVacio` con "Todavía no cargaste gastos"; si hay datos, arriba el total del mes ("Total de este mes" + `formatearPesos(totalDelMes(gastos))`) y debajo una `FlatList` de `TarjetaGasto`.
  - **Verificar**: escenarios 1, 2, 3, 4 y 19 de [quickstart.md](quickstart.md).

**Punto de control**: MVP — la app ya muestra los gastos en el teléfono.

---

## Fase 4: Historia 2 — Ver el detalle de un gasto (P1)

**Objetivo**: tocar un gasto abre su detalle por encima de las pestañas.

**Prueba independiente**: escenario 5 de [quickstart.md](quickstart.md).

- [ ] T12 [H2] Crear `app/gasto/[id].tsx`: lee `id` con `useLocalSearchParams`, carga con `obtenerGasto(id)` en `useFocusEffect`; muestra `Cargando`, `MensajeError` con "Reintentar", o "No se encontró el gasto" con botón "Volver" (`router.back()`) si devuelve `null`; si existe, muestra descripción, monto, categoría, fecha y nota (solo si no está vacía). En `app/_layout.tsx` darle el título "Detalle". En `app/(tabs)/index.tsx` hacer que `TarjetaGasto` navegue con `router.push(`/gasto/${gasto.id}`)`.
  - **Verificar**: escenario 5 de [quickstart.md](quickstart.md); el botón "Atrás" vuelve a la lista.

---

## Fase 5: Historia 3 — Agregar un gasto (P2)

**Objetivo**: cargar un gasto nuevo con validación.

**Prueba independiente**: escenarios 6–10 de [quickstart.md](quickstart.md).

- [ ] T13 [P] [H3] Crear `utils/validacion.ts` con `validarGasto(valores: ValoresFormulario): ErroresFormulario`, función pura que aplica **en este orden** y devuelve **un solo mensaje por campo** (el de la primera regla que falla):
  - descripción (con `trim()`): vacía → "Escribí una descripción"; menos de 3 o más de 50 caracteres → "La descripción debe tener entre 3 y 50 caracteres".
  - monto: vacío → "Escribí el monto"; no es número (aceptando coma o punto decimal) → "El monto debe ser un número"; menor o igual a 0 → "El monto debe ser mayor a 0"; más de 2 decimales → "Usá como máximo 2 decimales"; mayor a 10.000.000 → "El monto máximo es $ 10.000.000".
  - categoría: `null` → "Elegí una categoría".
  - fecha: vacía → "Escribí la fecha"; no cumple `DD/MM/AAAA` → "Usá el formato DD/MM/AAAA"; no es una fecha real (por ejemplo `31/02/2026`) → "Esa fecha no existe"; posterior a `hoy()` → "La fecha no puede ser futura".
  - nota: más de 200 caracteres → "La nota puede tener hasta 200 caracteres".
  - **Verificar**: `console.log` temporal con los casos del escenario 8 de [quickstart.md](quickstart.md); borrarlo antes del commit.
- [ ] T14 [P] [H3] Crear `components/SelectorCategoria.tsx`: recibe `valor: Categoria | null` y `alCambiar`; dibuja un `Pressable` por cada elemento de `CATEGORIAS`, en filas que se acomodan (`flexWrap`), resaltando el elegido.
  - **Verificar**: `npx tsc --noEmit` sin errores (se ve en T15).
- [ ] T15 [H3] Crear `app/gasto/formulario.tsx` en **modo alta** (sin parámetro `id`), con título "Nuevo gasto": `TextInput` para descripción, monto (`keyboardType="decimal-pad"`), fecha (empieza con `fechaAMostrar(hoy())`) y nota (multilínea); `SelectorCategoria`; debajo de cada campo, su mensaje de error en rojo. Al tocar "Guardar": `validarGasto`; si hay errores los muestra y no guarda; si no, pone `guardando = true` (botón deshabilitado con texto "Guardando…", así un doble toque no crea dos gastos), llama a `crearGasto` con `descripcion.trim()`, `textoACentavos(monto)` y `fechaAGuardar(fecha)`, y vuelve con `router.back()`. Si `crearGasto` falla, muestra el mensaje arriba del botón y vuelve a habilitarlo. Usar `ScrollView` con `keyboardShouldPersistTaps="handled"`.
  - **Verificar**: `npx tsc --noEmit` sin errores. Todavía no hay botón para llegar a esta
    pantalla: se prueba completa en el teléfono en T16.
- [ ] T16 [H3] En `app/(tabs)/index.tsx` agregar el botón "Agregar gasto" (arriba de la lista) y el botón de `MensajeVacio`, ambos con `router.push('/gasto/formulario')`.
  - **Verificar**: escenarios 6, 7, 8, 9 y 10 de [quickstart.md](quickstart.md).

---

## Fase 6: Historia 4 — Editar y eliminar (P3)

**Objetivo**: desde el detalle, modificar o borrar un gasto.

**Prueba independiente**: escenarios 11–13 de [quickstart.md](quickstart.md).

- [ ] T17 [H4] Agregar el **modo edición** a `app/gasto/formulario.tsx`: si recibe `id` (con `useLocalSearchParams`), el título es "Editar gasto" (`Stack.Screen options`), carga el gasto con `obtenerGasto(id)` mostrando `Cargando` / `MensajeError` / "No se encontró el gasto", completa los campos (`centavosATexto`, `fechaAMostrar`) y al guardar llama a `actualizarGasto(id, datos)`. En `app/gasto/[id].tsx` agregar el botón "Editar" con `router.push(`/gasto/formulario?id=${id}`)`.
  - **Verificar**: escenario 11 de [quickstart.md](quickstart.md); el detalle muestra los datos nuevos al volver (gracias a `useFocusEffect`).
- [ ] T18 [H4] En `app/gasto/[id].tsx` agregar el botón "Eliminar": `Alert.alert('¿Eliminar este gasto?', …)` con "Cancelar" y "Eliminar" (estilo `destructive`); al confirmar llama a `eliminarGasto(id)` y vuelve con `router.back()`.
  - **Verificar**: escenarios 12, 13 y 17 de [quickstart.md](quickstart.md).

---

## Fase 7: Historia 5 — Resumen por categoría (P3)

**Objetivo**: la pestaña "Resumen" muestra cuánto se gastó por categoría en el mes.

**Prueba independiente**: escenarios 14 y 15 de [quickstart.md](quickstart.md).

- [ ] T19 [P] [H5] Agregar `resumenPorCategoria(gastos: Gasto[])` a `utils/calculos.ts`: devuelve `{ categoria, totalCentavos, porcentaje }[]` solo de los gastos del mes actual, solo categorías con gastos, ordenado de mayor a menor total; `porcentaje` redondeado a entero.
  - **Verificar**: `npx tsc --noEmit` sin errores (se ve en T20).
- [ ] T20 [H5] Implementar `app/(tabs)/resumen.tsx`: carga con `obtenerGastos()` en `useFocusEffect`; estados `Cargando`, `MensajeError` con "Reintentar" y `MensajeVacio` con "No hay gastos este mes" (cuando `resumenPorCategoria` devuelve una lista vacía); si hay datos, el total del mes arriba y una fila por categoría con su total (`formatearPesos`) y porcentaje (`"35 %"`).
  - **Verificar**: escenarios 14, 15 y 17 de [quickstart.md](quickstart.md); sumar a mano los totales (SC-003).

---

## Fase 8: Cierre

- [ ] T21 Recorrer **todos** los escenarios de [quickstart.md](quickstart.md) en el teléfono, incluido el 18 (cambiar `PROBABILIDAD_ERROR` a `1` en `services/simulacion.ts`, ver el error en cada pantalla y volver a `0`). Anotar el resultado de cada escenario en `PROCESO.md` y corregir lo que falle (cada corrección es un commit `fix:`).
  - **Verificar**: los 19 escenarios dan el resultado esperado.
- [ ] T22 Crear `README.md` en la raíz del repositorio con instrucciones para correr el proyecto (requisitos, `npm install`, `npx expo start --tunnel`, Expo Go; lo pide la consigna para la entrega). Completar `PROCESO.md` (en la raíz del repositorio): capturas de las 4 pantallas y de los estados de carga, vacío y error; lo que haya quedado fuera de la spec y por qué (constitución, principio I); y la sección de conclusiones.
  - **Verificar**: releer el documento completo.

---

## Dependencias y orden

### Entre fases

- **Fase 1 → Fase 2**: no se puede hacer nada sin el proyecto.
- **Fase 2** bloquea a todas las historias.
- **H1 (Fase 3)** va primero: es el MVP y la pantalla desde la que se llega a las demás.
- **H2 (Fase 4)** depende de H1 (se llega tocando una fila de la lista).
- **H3 (Fase 5)** depende de H1 (el botón "Agregar gasto" está en la lista).
- **H4 (Fase 6)** depende de H2 (los botones están en el detalle) y de H3 (reutiliza el formulario).
- **H5 (Fase 7)** solo depende de la Fase 2: se podría hacer después de la Fase 2 en cualquier
  momento, pero se deja para el final según su prioridad (P3).
- **Cierre (Fase 8)**: al final.

### Dentro de cada fase

- Las tareas [P] de una misma fase se pueden hacer en cualquier orden entre sí; las demás, en el
  orden de la lista.
- Como se trabaja de a una tarea por vez (un commit por tarea), [P] **no** significa "al mismo
  tiempo", sino "el orden entre ellas no importa".

### Ejemplos de tareas [P] por fase

```text
Fase 2:  T04 (tipos), T05 (formato) y T08 (componentes de estado) → en cualquier orden.
         T06 necesita T04; T07 necesita T04 y T06.
Fase 3:  T09 (totalDelMes) y T10 (TarjetaGasto) → en cualquier orden; T11 necesita las dos.
Fase 5:  T13 (validación) y T14 (selector) → en cualquier orden; T15 necesita las dos.
```

## Estrategia de implementación

### MVP primero

1. Fases 1 y 2 (T01–T08).
2. Fase 3 (T09–T11). **Parar y probar**: la lista funciona en el teléfono → ya hay algo para
   mostrar.

### Entrega por partes

Cada historia que se termina suma algo visible sin romper lo anterior:

| Al terminar | La app ya puede… |
|---|---|
| T11 | Mostrar los gastos y el total del mes (MVP) |
| T12 | Abrir el detalle de un gasto |
| T16 | Cargar gastos nuevos con validación |
| T18 | Editar y eliminar gastos |
| T20 | Mostrar el resumen por categoría |
| T22 | Entregarse |

## Resumen

- **Total**: 22 tareas.
- **Por fase**: Preparación 3 · Base 5 · H1 3 · H2 1 · H3 4 · H4 2 · H5 2 · Cierre 2.
- **MVP sugerido**: hasta T11 (Historia 1).

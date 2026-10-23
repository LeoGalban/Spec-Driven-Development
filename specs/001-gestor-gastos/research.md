# Investigación técnica (Fase 0): Gestor de Gastos

**Funcionalidad**: `specs/001-gestor-gastos` | **Fecha**: 2026-10-23

Cada decisión responde una duda del contexto técnico del [plan](plan.md). Formato: **Decisión**,
**Por qué** y **Alternativas descartadas**.

---

## 1. Versión de Expo y forma de crear el proyecto

- **Decisión**: Expo SDK 58 (la estable al 23/10/2026), creado con
  `npx create-expo-app@latest gestor-gastos --template blank-typescript` dentro del repositorio.
- **Por qué**: la plantilla `blank-typescript` trae solo lo mínimo (sin pantallas de ejemplo que
  después haya que borrar), así cada archivo del proyecto lo agregamos y lo entendemos nosotros. La
  app vive en la carpeta `gestor-gastos/`, separada de la documentación (`PROCESO.md`, `specs/`).
- **Alternativas descartadas**: plantilla `default` (trae pestañas, temas y componentes de ejemplo
  que no vamos a usar); crear la app en la raíz del repo (mezcla código con documentación y
  `create-expo-app` no acepta una carpeta con archivos).

## 2. Navegación: pestañas + pila

- **Decisión**: expo-router con un `Stack` en `app/_layout.tsx` que contiene un grupo de pestañas
  `app/(tabs)/` ("Gastos" y "Resumen"). El detalle y el formulario son pantallas del `Stack`, por
  eso se abren **por encima** de las pestañas y tienen botón "Atrás" (FR-014).
- **Por qué**: es el patrón que documenta expo-router para "pestañas + pantallas encima". Las
  carpetas entre paréntesis `(tabs)` agrupan pantallas sin agregar nada a la URL.
- **Alternativas descartadas**: un `Stack` dentro de la pestaña Gastos (más archivos `_layout` y
  más difícil de explicar); solo pestañas (el detalle no tendría "Atrás").

## 3. Un solo formulario para alta y edición

- **Decisión**: una pantalla `app/gasto/formulario.tsx`. Si recibe el parámetro `id` edita ese
  gasto; si no, crea uno nuevo (FR-008: "el mismo formulario").
- **Por qué**: las validaciones quedan en un solo lugar y no se duplica código.
- **Alternativas descartadas**: dos pantallas `nuevo.tsx` y `editar/[id].tsx` que usen un mismo
  componente (más archivos para el mismo resultado).

## 4. Actualizar datos al volver a una pantalla

- **Decisión**: la lista, el detalle y el resumen cargan sus datos con `useFocusEffect` de
  expo-router, que se ejecuta **cada vez que la pantalla vuelve a verse**.
- **Por qué**: cumple "al volver a Resumen los totales están actualizados" (Historia 5) y "el
  nuevo gasto aparece en la lista" sin necesitar estado global (principio V).
- **Alternativas descartadas**: Context o una librería de estado global (Zustand, Redux): más
  conceptos para explicar; pasar datos por parámetros de navegación (se desactualizan).

## 5. Persistencia

- **Decisión**: `@react-native-async-storage/async-storage` (incluida en Expo Go). Toda la lista de
  gastos se guarda como texto JSON en **una sola clave**: `gastos`.
- **Por qué**: es la opción más simple para pocos datos. La clave sirve también para saber si es la
  primera vez: si no existe, se cargan los datos de ejemplo; si existe (aunque sea `[]`), se respeta
  lo que hay. Así, si el usuario borra todo, ve el estado vacío y no vuelven los ejemplos (supuesto
  de la spec).
- **Alternativas descartadas**: `expo-sqlite` (requiere SQL, es demasiado para este alcance);
  `expo-secure-store` (pensado para datos chicos y secretos).

## 6. Latencia y error simulados

- **Decisión**: un archivo `services/simulacion.ts` con:
  - `esperar()`: espera un tiempo aleatorio entre 500 y 1000 ms (FR-013).
  - `PROBABILIDAD_ERROR`: un número entre 0 y 1. Vale `0` normalmente. Para la demo del estado de
    error se cambia a `1`, se guarda, y Expo Go se recarga solo (Fast Refresh): todas las cargas
    fallan y se ve el mensaje con "Reintentar". Se vuelve a `0` y "Reintentar" funciona.
- **Por qué**: resuelve el supuesto de la spec ("habrá una forma de simular una falla") sin agregar
  pantallas ni botones que no están en la spec.
- **Alternativas descartadas**: un interruptor oculto en la app (es una funcionalidad que no está
  en la spec); fallos aleatorios siempre activos (molestan al usar la app).

## 7. Montos sin errores de redondeo

- **Decisión**: el monto se guarda como **número entero de centavos** (`montoCentavos`). `$ 1.500,50`
  se guarda como `150050`.
- **Por qué**: en JavaScript `0.1 + 0.2` da `0.30000000000000004`. Sumando enteros no hay errores,
  y así los totales coinciden "al centavo" (SC-003).
- **Alternativas descartadas**: guardar el monto con decimales (puede dar diferencias de centavos al
  sumar); una librería de decimales (dependencia extra).

## 8. Fechas

- **Decisión**:
  - Se guardan como texto `AAAA-MM-DD` (por ejemplo, `2026-10-23`).
  - En pantalla y en el formulario se muestran y escriben como `DD/MM/AAAA`.
  - La fecha se escribe en un campo de texto; no se usa selector de calendario.
- **Por qué**: el formato `AAAA-MM-DD` se ordena bien como texto (sirve para ordenar la lista,
  FR-001) y evita problemas de zona horaria de `Date`. El campo de texto permite probar la regla de
  validación "fecha real" (`31/02/2026`, caso borde).
- **Alternativas descartadas**: guardar `Date` o milisegundos (problemas de zona horaria);
  `@react-native-community/datetimepicker` (dependencia extra y no deja probar fechas inválidas).

## 9. Formato de moneda

- **Decisión**: una función propia `formatearPesos(centavos)` en `utils/formato.ts` que devuelve
  `$ 1.234,50`.
- **Por qué**: `Intl.NumberFormat` cambia el resultado según el motor y el teléfono (a veces usa
  espacios especiales); una función de pocas líneas da siempre el mismo resultado y se puede
  explicar.
- **Alternativas descartadas**: `Intl.NumberFormat('es-AR')`; librerías de formato.

## 10. Validación del formulario

- **Decisión**: una función pura `validarGasto(valores)` en `utils/validacion.ts` que recibe los
  textos del formulario y devuelve un objeto con un mensaje de error por campo (vacío si está todo
  bien). Implementa exactamente las reglas de FR-006.
- **Por qué**: es "pura" (no depende de la pantalla), así que se puede leer y probar sola. Es lo
  pedido: sin librerías de formularios (principio V).
- **Alternativas descartadas**: `react-hook-form`, `formik`, `zod`/`yup`.

## 11. Pruebas

- **Decisión**: pruebas **manuales** en el teléfono con Expo Go, siguiendo los escenarios de
  [quickstart.md](quickstart.md). No se agrega un framework de tests automáticos.
- **Por qué**: la constitución (principio VI) define que una tarea termina cuando se probó en el
  teléfono; agregar Jest suma configuración que no pide la consigna.
- **Alternativas descartadas**: Jest + React Native Testing Library (se puede sumar en el futuro,
  empezando por `validarGasto`).

## 12. Selección de categoría

- **Decisión**: las 6 categorías se muestran como botones en fila (con `Pressable`); el elegido se
  resalta.
- **Por qué**: con solo 6 opciones fijas es más rápido que un menú desplegable y no necesita
  librerías.
- **Alternativas descartadas**: `@react-native-picker/picker` (dependencia extra).

## 13. Datos de ejemplo siempre "del mes actual"

- **Decisión**: los 12 gastos de ejemplo se generan **en relación con la fecha de hoy**: 7 en el
  mes actual (con días entre el 1 y hoy) y 5 en el mes anterior.
- **Por qué**: si las fechas fueran fijas (por ejemplo, octubre de 2026), en noviembre el total del
  mes daría $ 0 y el resumen quedaría vacío. Así siempre se puede probar FR-002 y FR-010.
- **Alternativas descartadas**: fechas fijas.

---

## Decisiones agregadas durante el desarrollo (H6 y H7)

## 14. Dónde se guardan las categorías creadas

- **Decisión**: un servicio nuevo `services/categorias.ts` con `obtenerCategorias()` y
  `crearCategoria()`, con la misma demora y error simulados que los gastos. Las categorías creadas
  se guardan en AsyncStorage en otra clave, `categorias`; las 6 fijas siguen en el código
  (`constants/tema.ts`) y el servicio devuelve las 6 fijas + las creadas.
- **Por qué**: mantiene el principio III (las pantallas solo hablan con `services/`) y no cambia
  cómo se guardan los gastos: un gasto sigue guardando el **nombre** de su categoría.
- **Alternativas descartadas**: guardar las categorías dentro de cada gasto (se repetirían);
  guardar también las 6 fijas en AsyncStorage (habría que "sembrarlas" como los datos de ejemplo).

## 15. Cómo saben las pantallas el ícono y el color de una categoría creada

- **Decisión**: las pantallas que muestran gastos (lista, detalle, resumen) piden los gastos y las
  categorías juntos con `Promise.all`, y le pasan a `IconoCategoria` el **estilo** (ícono y color)
  de la categoría. Si un gasto tuviera una categoría que no existe, se muestra un ícono gris
  genérico.
- **Por qué**: es explícito (se ve de dónde sale cada dato) y `Promise.all` hace los dos pedidos a
  la vez, así la espera no se duplica.
- **Alternativas descartadas**: un "almacén" global en memoria o Context (más difícil de explicar).

## 16. Elegir la categoría recién creada

- **Decisión**: "Nueva categoría" es otra pantalla (`app/categoria/nueva.tsx`). Al crearla vuelve
  con `router.back()`. El formulario recarga las categorías cada vez que vuelve a verse
  (`useFocusEffect`): si hay una más que antes, la elige automáticamente (las creadas se agregan
  al final).
- **Por qué**: no hace falta pasar datos "hacia atrás" entre pantallas.

## 17. Semanas y meses

- **Decisión**: un archivo `utils/periodos.ts` con `periodoSemana(semanasAtras)` y
  `periodoMes(mesesAtras)`, que devuelven `{ desde, hasta, titulo }` con fechas `AAAA-MM-DD`. La
  semana va de **lunes a domingo**. Los cálculos de resumen reciben el período y suman los gastos
  con `desde <= fecha <= hasta` (comparando texto, como en T09).
- **Por qué**: separa "qué período mirar" de "cómo sumar", y las dos partes se prueban solas.
  Comparar textos `AAAA-MM-DD` resuelve sola la semana que cruza dos meses.
- **Alternativas descartadas**: semanas de domingo a sábado (en Argentina la semana laboral
  empieza el lunes); una librería de fechas (dependencia extra).

# Especificación: Gestor de Gastos Personales

**Carpeta de la funcionalidad**: `specs/001-gestor-gastos`

**Creada**: 2026-10-23

**Estado**: Borrador — pendiente de aprobación docente

**Entrada (idea original)**: "Una app para anotar mis gastos del día a día: ver la lista de lo que
gasté, ver el detalle de cada gasto, cargar uno nuevo con un formulario que valide los datos,
editarlo o borrarlo, y ver cuánto gasté por categoría en el mes."

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia 1 — Ver mis gastos (Prioridad: P1)

Como usuario, abro la app y veo la lista de mis gastos, del más reciente al más antiguo, con el
total gastado en el mes actual arriba de todo.

**Por qué esta prioridad**: es la pantalla principal; sin ella la app no tiene sentido.

**Prueba independiente**: abrir la app con los datos de ejemplo y comprobar que aparecen los gastos
ordenados y el total del mes.

**Escenarios de aceptación**:

1. **Dado** que abro la app por primera vez, **cuando** se cargan los datos, **entonces** veo un
   indicador de "Cargando…" y después la lista de gastos de ejemplo.
2. **Dado** que hay gastos cargados, **cuando** veo la lista, **entonces** cada fila muestra
   descripción, categoría, fecha (DD/MM/AAAA) y monto en pesos (`$ 1.234,50`).
3. **Dado** que hay gastos de varios meses, **cuando** veo la lista, **entonces** el total de
   arriba suma solo los gastos del mes calendario actual.
4. **Dado** que no hay ningún gasto, **cuando** abro la app, **entonces** veo el mensaje "Todavía
   no cargaste gastos" y un botón para agregar el primero.
5. **Dado** que la carga de datos falla, **cuando** termina de cargar, **entonces** veo un mensaje
   de error y un botón "Reintentar" que vuelve a intentar la carga.

---

### Historia 2 — Ver el detalle de un gasto (Prioridad: P1)

Como usuario, toco un gasto de la lista y veo toda su información en una pantalla aparte.

**Por qué esta prioridad**: es la forma de revisar un gasto y el punto de entrada para editarlo o
borrarlo.

**Prueba independiente**: tocar cualquier gasto de la lista y comprobar que se abre su detalle con
los datos correctos, y que el botón "Atrás" vuelve a la lista.

**Escenarios de aceptación**:

1. **Dado** que estoy en la lista, **cuando** toco un gasto, **entonces** se abre la pantalla de
   detalle con descripción, monto, categoría, fecha y nota (si tiene).
2. **Dado** que estoy en el detalle, **cuando** los datos todavía se están cargando, **entonces**
   veo un indicador de carga.
3. **Dado** que el gasto pedido no existe (por ejemplo, fue borrado), **cuando** se abre el
   detalle, **entonces** veo el mensaje "No se encontró el gasto" y puedo volver a la lista.

---

### Historia 3 — Agregar un gasto (Prioridad: P2)

Como usuario, cargo un gasto nuevo completando un formulario. Si me equivoco en algún dato, la app
me dice qué corregir antes de guardar.

**Por qué esta prioridad**: es la acción principal de la app, pero se puede probar la lista y el
detalle con datos de ejemplo antes de tenerla.

**Prueba independiente**: tocar "Agregar gasto", completar el formulario, guardar y comprobar que
el gasto aparece primero en la lista y el total del mes se actualiza.

**Escenarios de aceptación**:

1. **Dado** que estoy en la lista, **cuando** toco "Agregar gasto", **entonces** se abre el
   formulario vacío con la fecha de hoy ya completada.
2. **Dado** que completo todos los campos correctamente, **cuando** toco "Guardar", **entonces** el
   botón se deshabilita mientras guarda, vuelvo a la lista y el nuevo gasto aparece en ella.
3. **Dado** que dejo campos obligatorios vacíos o con datos inválidos, **cuando** toco "Guardar",
   **entonces** no se guarda nada y debajo de cada campo con problemas aparece un mensaje que
   explica el error (ver reglas en FR-006).
4. **Dado** que corrijo un campo con error, **cuando** vuelvo a tocar "Guardar", **entonces** el
   mensaje de ese campo desaparece.

---

### Historia 4 — Editar y eliminar un gasto (Prioridad: P3)

Como usuario, desde el detalle de un gasto puedo modificarlo (si me equivoqué) o eliminarlo.

**Por qué esta prioridad**: es útil, pero la app ya sirve sin esto.

**Prueba independiente**: desde un detalle, editar el monto y comprobar el cambio en la lista;
después eliminarlo y comprobar que ya no aparece.

**Escenarios de aceptación**:

1. **Dado** que estoy en el detalle, **cuando** toco "Editar", **entonces** se abre el mismo
   formulario de la historia 3 con los datos del gasto ya completados.
2. **Dado** que modifico datos válidos, **cuando** toco "Guardar", **entonces** vuelvo al detalle y
   veo los datos actualizados (y también en la lista).
3. **Dado** que estoy en el detalle, **cuando** toco "Eliminar", **entonces** la app me pide
   confirmación ("¿Eliminar este gasto?").
4. **Dado** que confirmo la eliminación, **cuando** termina, **entonces** vuelvo a la lista y el
   gasto ya no aparece. Si cancelo, no pasa nada.

---

### Historia 5 — Resumen por categoría (Prioridad: P3)

Como usuario, veo cuánto gasté en el mes actual en cada categoría, para saber en qué se me va la
plata.

**Por qué esta prioridad**: aporta valor extra, pero no es necesaria para registrar gastos.

**Prueba independiente**: abrir la pestaña "Resumen" y comprobar que los totales por categoría
coinciden con la suma manual de los gastos del mes.

**Escenarios de aceptación**:

1. **Dado** que hay gastos en el mes actual, **cuando** abro "Resumen", **entonces** veo cada
   categoría con gastos, su total en pesos y el porcentaje sobre el total del mes, ordenadas de
   mayor a menor.
2. **Dado** que no hay gastos en el mes actual, **cuando** abro "Resumen", **entonces** veo el
   mensaje "No hay gastos este mes".
3. **Dado** que agrego, edito o elimino un gasto, **cuando** vuelvo a "Resumen", **entonces** los
   totales están actualizados.

---

### Historia 6 — Crear categorías propias (Prioridad: P3) *(agregada durante el desarrollo)*

Como usuario, si ninguna de las 6 categorías me sirve (por ejemplo "Mascotas" o "Facultad"), creo
una categoría nueva con su nombre, color e ícono, y la uso para mis gastos.

**Por qué esta prioridad**: las 6 categorías fijas cubren lo básico; esto permite adaptar la app a
cada persona.

**Prueba independiente**: crear la categoría "Mascotas", cargar un gasto con ella y comprobar que
aparece con su ícono y color en la lista, el detalle y el resumen.

**Escenarios de aceptación**:

1. **Dado** que estoy en el formulario de gasto, **cuando** toco "Nueva" en la lista de
   categorías, **entonces** se abre la pantalla "Nueva categoría" con el nombre vacío y un color
   y un ícono ya elegidos.
2. **Dado** que escribo un nombre válido y elijo color e ícono, **cuando** toco "Crear",
   **entonces** vuelvo al formulario con la nueva categoría ya elegida.
3. **Dado** que el nombre está vacío, tiene menos de 2 o más de 20 caracteres, o ya existe otra
   categoría con ese nombre (sin importar mayúsculas), **cuando** toco "Crear", **entonces** no
   se crea y veo el mensaje que explica el error.
4. **Dado** que creé una categoría, **cuando** cierro y vuelvo a abrir la app, **entonces** la
   categoría sigue disponible.

---

### Historia 7 — Resumen por semana y por mes (Prioridad: P3) *(agregada durante el desarrollo)*

Como usuario, en "Resumen" elijo ver la **semana** o el **mes**, y puedo ir hacia atrás para ver
semanas o meses anteriores.

**Por qué esta prioridad**: el resumen mensual (Historia 5) ya existe; ver la semana ayuda a
controlar el gasto día a día y comparar con períodos anteriores.

**Prueba independiente**: en "Resumen" cambiar a "Semana", comprobar que el total coincide con la
suma de los gastos de lunes a domingo de esta semana, e ir a la semana anterior con "‹".

**Escenarios de aceptación**:

1. **Dado** que abro "Resumen", **cuando** se cargan los datos, **entonces** veo el resumen del
   **mes actual** (como en la Historia 5) y un selector "Semana / Mes".
2. **Dado** que elijo "Semana", **cuando** cambia la vista, **entonces** veo el total y el
   detalle por categoría de la semana actual (de lunes a domingo) y el rango de fechas
   ("20/10 al 26/10").
3. **Dado** que toco "‹", **cuando** cambia el período, **entonces** veo la semana (o el mes)
   anterior; con "›" vuelvo hacia adelante, pero nunca más allá del período actual.
4. **Dado** que el período elegido no tiene gastos, **cuando** lo veo, **entonces** aparece "No
   hay gastos en este período" y puedo seguir cambiando de período.

---

### Casos borde

- **Montos con decimales**: se aceptan hasta 2 decimales, usando coma o punto (`1500,50` o
  `1500.50`).
- **Montos muy grandes**: el máximo permitido es $ 10.000.000 por gasto.
- **Nombre de categoría repetido**: "comida" o "COMIDA" no se puede crear porque ya existe
  "Comida".
- **Semana que cruza dos meses** (por ejemplo, del 28/9 al 4/10): el resumen semanal incluye
  los días de los dos meses.
- **Fecha futura**: no se permite cargar un gasto con fecha posterior a hoy.
- **Fecha inválida**: `31/02/2026` o texto que no sea una fecha muestra error.
- **Descripción con solo espacios**: se considera vacía.
- **Doble toque en "Guardar"**: no debe crear el gasto dos veces.
- **Cerrar la app**: los gastos agregados, editados o eliminados se mantienen al volver a abrirla.
- **Lista larga** (más de 50 gastos): la lista se desplaza sin trabarse.

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **FR-001**: La app MUST mostrar la lista de gastos ordenada por fecha, del más reciente al más
  antiguo.
- **FR-002**: La app MUST mostrar arriba de la lista el total gastado en el mes calendario actual.
- **FR-003**: La app MUST mostrar un estado de carga, un estado vacío y un estado de error (con
  "Reintentar") en toda pantalla que obtiene datos.
- **FR-004**: La app MUST permitir abrir el detalle de cualquier gasto desde la lista.
- **FR-005**: La app MUST permitir agregar un gasto con los campos: descripción, monto, categoría,
  fecha y nota (opcional).
- **FR-006**: El formulario MUST validar antes de guardar:
  - **Descripción**: obligatoria, entre 3 y 50 caracteres (sin contar espacios al inicio y al final).
  - **Monto**: obligatorio, número mayor a 0, como máximo 2 decimales y hasta 10.000.000.
  - **Categoría**: obligatoria, una de las categorías existentes (FR-007).
  - **Fecha**: obligatoria, formato DD/MM/AAAA, fecha real y no posterior a hoy.
  - **Nota**: opcional, como máximo 200 caracteres.
- **FR-007**: Hay 6 categorías fijas (Comida, Transporte, Hogar, Salud, Ocio y Otros) que no se
  pueden modificar, más las que cree el usuario (FR-016).
- **FR-008**: La app MUST permitir editar un gasto existente usando el mismo formulario y las
  mismas validaciones.
- **FR-009**: La app MUST permitir eliminar un gasto, pidiendo confirmación antes.
- **FR-010**: La app MUST mostrar un resumen con el total y el porcentaje por categoría, del
  **mes** o de la **semana** (de lunes a domingo) que elija el usuario (FR-017).
- **FR-011**: Los cambios (alta, edición, eliminación) MUST conservarse al cerrar y volver a abrir
  la app.
- **FR-012**: La primera vez que se abre la app, MUST mostrar un conjunto de gastos de ejemplo
  (al menos 10, de al menos 2 meses distintos) para poder probarla.
- **FR-013**: Toda operación de datos MUST tardar entre 0,5 y 1 segundo, simulando un servidor.
- **FR-014**: La navegación MUST tener dos pestañas ("Gastos" y "Resumen"); el detalle y el
  formulario se abren por encima de la pestaña "Gastos" con opción de volver atrás.
- **FR-015** *(agregado durante el desarrollo)*: La interfaz MUST tener un estilo visual
  consistente y atractivo, definido en un único sistema de diseño (`constants/tema.ts`): paleta
  tomada del logo (verde bosque como color principal, verde lima del billete para la acción
  "Agregar gasto" y rosa de la alcancía para detalles), una sola tipografía (Outfit), radios y
  sombras comunes, un ícono y un color por categoría, íconos del sistema (SF Symbols en iPhone,
  Material Symbols en Android, con `expo-symbols`; sin emojis) y contraste de textos de al menos
  4,5:1 (WCAG). La app tiene logo propio (una alcancía) como ícono, pantalla de inicio, en el
  encabezado de todas las pantallas y en los estados vacíos, y se llama "Gestor de Gastos". Sin
  gráficos (siguen fuera de alcance).
- **FR-016** *(agregado durante el desarrollo)*: El usuario MUST poder crear categorías con:
  - **Nombre**: obligatorio, entre 2 y 20 caracteres (sin contar espacios al inicio y al final),
    que no exista ya otra con el mismo nombre (sin importar mayúsculas).
  - **Color**: uno de 6 colores de la app.
  - **Ícono**: uno de 8 íconos de la app.
  Las categorías creadas se guardan en el teléfono (como los gastos) y pasan por `services/` con
  la misma demora simulada (FR-013).
- **FR-017** *(agregado durante el desarrollo)*: El resumen MUST tener un selector "Semana / Mes"
  y botones para ir al período anterior y al siguiente, sin pasar del período actual. Por defecto
  muestra el mes actual.

### Pantallas

| # | Pantalla | Qué muestra | Cómo se llega |
|---|---|---|---|
| 1 | Lista de gastos | Total del mes + lista de gastos + botón "Agregar gasto" | Pestaña "Gastos" (inicio) |
| 2 | Detalle del gasto | Todos los datos + botones "Editar" y "Eliminar" | Tocando un gasto de la lista |
| 3 | Formulario de gasto | Campos con validación + "Guardar" (alta y edición) | "Agregar gasto" o "Editar" |
| 4 | Resumen | Total por categoría y porcentaje, por semana o por mes | Pestaña "Resumen" |
| 5 | Nueva categoría | Nombre, color e ícono + "Crear" | "Nueva" en las categorías del formulario |

### Entidades principales

- **Gasto**: un pago realizado por el usuario. Tiene: identificador único, descripción, monto (en
  pesos), categoría, fecha y nota opcional.
- **Categoría**: tiene nombre, color e ícono. Hay 6 fijas (FR-007) y el usuario puede crear más
  (FR-016).

### Fuera de alcance

Para esta versión **no** se incluye:

- Usuarios, inicio de sesión o cuentas.
- Backend, sincronización en la nube o varios dispositivos.
- Registro de ingresos, saldo o presupuestos.
- Editar o borrar categorías (solo se pueden crear).
- Otras monedas además de pesos argentinos.
- Gráficos (el resumen es una lista con totales y porcentajes).
- Búsqueda, filtros u ordenamientos distintos al de fecha.
- Fotos de tickets o archivos adjuntos.
- Notificaciones o recordatorios.
- Exportar datos (Excel, PDF, etc.).
- Modo oscuro y otros idiomas.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: Un usuario nuevo puede cargar un gasto completo en menos de 30 segundos.
- **SC-002**: El 100 % de los datos inválidos de FR-006 se detectan antes de guardar y muestran un
  mensaje que dice cómo corregirlos.
- **SC-003**: Los totales del resumen coinciden al centavo con la suma manual de los gastos del mes.
- **SC-004**: Ningún gasto se pierde al cerrar y volver a abrir la app.
- **SC-005**: Durante la espera de datos, el usuario nunca ve una pantalla en blanco: siempre ve un
  indicador de carga, los datos, un mensaje de vacío o un mensaje de error.
- **SC-006**: La app se puede recorrer completa (las 4 pantallas y todas las historias) en un
  teléfono real.

## Supuestos

- Hay un solo usuario por teléfono, por eso no hace falta inicio de sesión.
- La app funciona sin internet: todos los datos están en el teléfono.
- El mes "actual" es el mes calendario según la fecha del teléfono.
- Los datos de ejemplo se cargan solo la primera vez; si el usuario borra todo, ve el estado vacío
  (no se vuelven a cargar los ejemplos).
- Para poder mostrar el estado de error en la demo, habrá una forma de simular una falla de carga
  (se define en el plan técnico).

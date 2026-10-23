# Gestor de Gastos — Constitución del proyecto

## Principios fundamentales

### I. La spec manda

- No se programa nada que no esté en `spec.md` y en una tarea de `tasks.md`.
- Si durante el desarrollo aparece una idea nueva, primero se agrega a la spec (y se avisa a los
  docentes si cambia el alcance); recién después se crea la tarea.
- Lo que está en la spec y no se implemente MUST quedar anotado en `PROCESO.md` con el motivo.

**Por qué:** evita que la IA agregue funcionalidades que nadie pidió y que algo prometido quede
olvidado.

### II. Stack fijo, sin backend

- La app se construye con **Expo** (SDK estable más reciente), **React Native**, **TypeScript** y
  **expo-router** para la navegación.
- No hay servidor, base de datos remota ni llamadas a internet.
- MUST correr en un teléfono real con **Expo Go**, así que solo se usan librerías incluidas en Expo
  Go (no se usan *development builds*).
- Persistencia local con `@react-native-async-storage/async-storage`.

**Por qué:** es lo que exige la consigna y mantiene el proyecto simple de instalar y de probar.

### III. Los datos viven en `services/`

- Todo acceso a datos pasa por funciones `async` dentro de la carpeta `services/`.
- Cada función simula la demora de un servidor con una latencia aleatoria de **500 a 1000 ms**
  (`Promise` + `setTimeout`).
- Las pantallas MUST NOT leer AsyncStorage ni los datos mock directamente: siempre llaman a
  `services/`.

**Por qué:** si mañana existe un backend real, solo se reemplaza la carpeta `services/` y las
pantallas no cambian.

### IV. Toda pantalla con datos maneja carga, vacío y error

- Mientras se esperan datos se muestra un indicador de carga.
- Si no hay datos se muestra un mensaje de estado vacío que explica qué hacer.
- Si el servicio falla se muestra un mensaje de error con opción de reintentar.

**Por qué:** la latencia simulada hace visibles estos estados y la consigna los evalúa.

### V. Simple y explicable

- El código tiene que poder ser explicado línea por línea por cualquiera de los dos integrantes.
- Se prefiere código directo antes que abstracciones "inteligentes". Nada de librerías extra
  (estado global, formularios, UI) si se puede resolver con React y React Native básicos.
- Estado con `useState`/`useEffect`; estilos con `StyleSheet`.
- Código que no se entiende no se commitea.

**Por qué:** la defensa oral es individual y eliminatoria.

### VI. Una tarea, un commit, probada en el teléfono

- Se trabaja una tarea de `tasks.md` por vez.
- Cada tarea termina cuando se probó en el teléfono con Expo Go.
- Un commit por tarea, con el formato `feat: T07 - pantalla de detalle` (o `fix:`, `docs:`, `chore:`).
- Los dos integrantes commitean.

**Por qué:** el historial de Git es parte de la evidencia que se evalúa.

## Convenciones de código

- **Idioma:** nombres de variables, funciones, componentes, tipos y comentarios en **español**
  (sin tildes ni ñ en los identificadores: `obtenerGastos`, `anio`). Los textos de la interfaz en
  español con tildes.
- **Archivos:** pantallas en `app/` (expo-router); componentes reutilizables en `components/`
  con nombre en PascalCase (`TarjetaGasto.tsx`); servicios en `services/`; tipos en `types/`.
- **Comentarios:** solo donde el *por qué* no es obvio. Cada archivo de `services/` explica qué
  simula.
- **Formato:** el que trae el proyecto de Expo (Prettier/ESLint por defecto).
- **Moneda:** pesos argentinos (ARS), con formato `$ 1.234,50`.

## Flujo de trabajo con IA

1. Constitución → `spec.md` → `plan.md` → `tasks.md` → implementación (GitHub Spec Kit).
2. La IA propone, nosotros decidimos: cada documento generado se revisa y se corrige a mano.
3. Para cada tarea se registra en `PROCESO.md`: el prompt usado, qué generó la IA, qué se corrigió
   a mano y cómo se verificó.
4. El documento del proceso se escribe en el momento, no al final.

## Gobierno

- Esta constitución está por encima de cualquier otra decisión del proyecto. Si un pedido a la IA
  la contradice, gana la constitución.
- Para cambiarla: se acuerda entre los dos integrantes, se edita este archivo, se sube la versión y
  se registra el cambio en `PROCESO.md`.
- Versionado: MAYOR = se quita o redefine un principio; MENOR = se agrega un principio o sección;
  PARCHE = aclaraciones de redacción.
- `AGENTS.md` resume estas reglas para el agente de IA y se mantiene sincronizado con este archivo.

**Versión**: 1.0.0 | **Ratificada**: 2026-10-23 | **Última modificación**: 2026-10-23

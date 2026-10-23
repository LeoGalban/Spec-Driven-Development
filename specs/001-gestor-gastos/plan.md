# Plan técnico: Gestor de Gastos Personales

**Rama**: `001-gestor-gastos` (se trabaja en `main`) | **Fecha**: 2026-10-23 |
**Spec**: [spec.md](spec.md)

**Entrada**: especificación de `specs/001-gestor-gastos/spec.md`

## Resumen

App móvil para anotar gastos personales con 4 pantallas: lista con total del mes, detalle,
formulario de alta/edición con validación y resumen por categoría. Se construye con Expo SDK 58,
expo-router y TypeScript, **sin backend**: los datos pasan por un servicio mock en
`services/gastos.ts` que simula 500–1000 ms de demora y guarda todo en el teléfono con AsyncStorage.
Sin librerías extra: estado con `useState`/`useEffect`, estilos con `StyleSheet` y validación con
una función propia. Las decisiones y sus motivos están en [research.md](research.md).

## Contexto técnico

**Lenguaje/versión**: TypeScript (el que trae Expo SDK 58), React Native de Expo SDK 58.

**Dependencias principales**:
- `expo` 58, `expo-router` (navegación por archivos: `Stack` + `Tabs`).
- `@react-native-async-storage/async-storage` (persistencia, incluida en Expo Go).
- Todas se instalan con `npx expo install` para que la versión coincida con el SDK.

**Almacenamiento**: AsyncStorage, una sola clave `gastos` con la lista en JSON
([data-model.md](data-model.md#almacenamiento)).

**Pruebas**: manuales en el teléfono con Expo Go, según [quickstart.md](quickstart.md). Sin tests
automáticos ([research.md §11](research.md)).

**Plataforma**: Android e iOS mediante **Expo Go** (sin *development builds*).

**Tipo de proyecto**: app móvil (solo frontend).

**Objetivos de rendimiento**: lista fluida con más de 50 gastos (`FlatList`).

**Restricciones**:
- Funciona sin internet.
- Toda operación de datos tarda 500–1000 ms (FR-013).
- Montos en centavos enteros, sin errores de redondeo (SC-003).

**Escala**: 1 usuario, 4 pantallas, decenas a cientos de gastos.

## Verificación de la constitución

*Se revisa antes de la Fase 0 y otra vez después del diseño (Fase 1).*

| Principio | ¿Cumple? | Cómo |
|---|---|---|
| I. La spec manda | ✅ | Todo lo del plan sale de un FR o una historia. Lo único agregado es `PROBABILIDAD_ERROR`, que resuelve un supuesto de la spec. |
| II. Stack fijo, sin backend | ✅ | Expo SDK 58 + expo-router + TS. Única dependencia agregada: AsyncStorage (incluida en Expo Go). |
| III. Los datos viven en `services/` | ✅ | Las pantallas solo llaman a `services/gastos.ts` ([contrato](contracts/servicio-gastos.md)). Latencia en `services/simulacion.ts`. |
| IV. Carga, vacío y error | ✅ | Tabla de estados por pantalla en [contracts/pantallas.md](contracts/pantallas.md) + componentes compartidos. |
| V. Simple y explicable | ✅ | Sin Context, Redux, librerías de formularios ni de UI. `useFocusEffect` para refrescar datos al volver. |
| VI. Una tarea, un commit | ✅ | Se aplicará en `tasks.md`: cada tarea chica y verificable en el teléfono. |

**Resultado**: aprobado, sin violaciones. Revisión después del diseño: sigue aprobado.

> **Nota**: la constitución menciona "los dos integrantes", pero el trabajo es individual. Se
> corrige la redacción en la versión 1.0.1 (cambio de tipo PARCHE, no cambia ningún principio),
> que además agrega la carpeta `utils/` a las convenciones.

## Estructura del proyecto

### Documentación (esta funcionalidad)

```text
specs/001-gestor-gastos/
├── spec.md              # Qué se construye
├── plan.md              # Este archivo: cómo se construye
├── research.md          # Decisiones técnicas y por qué
├── data-model.md        # Tipos, validaciones y almacenamiento
├── quickstart.md        # Cómo correrla y probarla
├── contracts/
│   ├── servicio-gastos.md   # Funciones de services/gastos.ts
│   └── pantallas.md         # Rutas, navegación y estados por pantalla
├── checklists/requirements.md
└── tasks.md             # Lo genera /speckit-tasks (siguiente paso)
```

### Código fuente

```text
gestor-gastos/                 # Proyecto Expo (creado con create-expo-app)
├── app/                       # Pantallas (expo-router: cada archivo es una ruta)
│   ├── _layout.tsx            # Stack raíz
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Pestañas "Gastos" y "Resumen"
│   │   ├── index.tsx          # 1. Lista de gastos + total del mes
│   │   └── resumen.tsx        # 4. Resumen por categoría
│   └── gasto/
│       ├── [id].tsx           # 2. Detalle (Editar / Eliminar)
│       └── formulario.tsx     # 3. Alta y edición (?id= opcional)
├── components/
│   ├── TarjetaGasto.tsx       # Fila de la lista
│   ├── SelectorCategoria.tsx  # Botones de las 6 categorías
│   ├── Cargando.tsx           # Estado de carga
│   ├── MensajeVacio.tsx       # Estado vacío
│   └── MensajeError.tsx       # Estado de error + "Reintentar"
├── services/
│   ├── gastos.ts              # Mock del "servidor": CRUD sobre AsyncStorage
│   ├── simulacion.ts          # esperar() y PROBABILIDAD_ERROR
│   └── datosEjemplo.ts        # 12 gastos generados según la fecha de hoy
├── utils/
│   ├── formato.ts             # Pesos y fechas
│   ├── validacion.ts          # validarGasto() — reglas de FR-006
│   └── calculos.ts            # totalDelMes(), resumenPorCategoria()
├── types/
│   └── gasto.ts               # Gasto, Categoria, CATEGORIAS, tipos del formulario
├── app.json
├── package.json
└── tsconfig.json
```

**Decisión de estructura**: un único proyecto Expo en `gestor-gastos/`, separado de la
documentación del repositorio. Se agrega la carpeta `utils/` (no prevista en la constitución) para
las funciones puras de formato, validación y cálculo: no son pantallas, ni componentes, ni acceden a
datos, y separarlas permite explicarlas y probarlas de forma aislada.

## Orden de construcción sugerido

Sigue las prioridades de la spec, para tener algo funcionando en el teléfono lo antes posible:

1. **Base**: crear el proyecto, expo-router con pestañas vacías, tipos, `utils/formato.ts`,
   servicio mock con datos de ejemplo y componentes de estado.
2. **H1 (P1)**: lista con total del mes y los tres estados.
3. **H2 (P1)**: detalle.
4. **H3 (P2)**: validación + formulario de alta.
5. **H4 (P3)**: edición (mismo formulario) y eliminación con confirmación.
6. **H5 (P3)**: resumen por categoría.
7. **Cierre**: recorrer todo [quickstart.md](quickstart.md) en el teléfono.

## Seguimiento de complejidad

| Excepción | Por qué hace falta | Alternativa simple descartada |
|---|---|---|
| Librerías de diseño agregadas en T23 (FR-015): `expo-symbols`, `expo-font`, `expo-splash-screen`, `@expo-google-fonts/outfit` | El principio V pide no agregar librerías "si se puede resolver con React Native básico". Íconos del sistema y una tipografía propia **no** se pueden hacer con React Native básico. Las 4 son oficiales de Expo e incluidas en Expo Go (principio II). | Emojis como íconos (primera versión de T23): no se ven profesionales y cambian según el teléfono. Se probaron también Plus Jakarta Sans, Nunito y Fredoka antes de elegir Outfit. |

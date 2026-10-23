# Gestor de Gastos

App móvil para anotar los gastos del día a día: lista de gastos agrupada por día, detalle,
alta y edición con validación, categorías propias y resumen por categoría de la semana o del mes.

Trabajo práctico de **React Native II** (Instituto Politécnico Formosa), hecho con **Expo**,
**expo-router** y **Spec-Driven Development** (GitHub Spec Kit). Es un prototipo **sin backend**:
los datos se simulan en `gestor-gastos/services/` (con demora de 0,5 a 1 segundo) y se guardan en
el teléfono con AsyncStorage.

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior (`node -v` para ver la versión).
- La app **Expo Go** en el teléfono (App Store o Play Store), actualizada: el proyecto usa
  **Expo SDK 58**.
- Computadora y teléfono con conexión a internet.

## Cómo correrlo

```bash
cd gestor-gastos
npm install
npx expo start --tunnel
```

1. Se muestra un código QR en la terminal.
2. **iPhone:** escanearlo con la cámara. **Android:** escanearlo desde Expo Go ("Scan QR code").
3. La app se abre en Expo Go. Al guardar un archivo, se actualiza sola.

> **¿Por qué `--tunnel`?** Conecta el teléfono con la computadora a través de internet. Sin él,
> el teléfono tiene que estar en la misma red Wi-Fi que la computadora, y muchas redes públicas o
> de instituciones bloquean esa conexión directa. Si la red lo permite, también funciona
> `npx expo start`.

### Problemas comunes

| Problema | Solución |
|---|---|
| "Project is incompatible with this version of Expo Go" | Actualizar Expo Go desde la tienda. |
| "Could not connect to development server" | Cortar con `Ctrl + C` cualquier `expo start` que esté corriendo y volver a correr `npx expo start --tunnel`. |
| Los cambios no se ven | Correr `npx expo start --tunnel -c` (borra la caché) y volver a escanear. |

## Probar el estado de error

En `gestor-gastos/services/simulacion.ts`, cambiar `PROBABILIDAD_ERROR` de `0` a `1` y guardar:
todas las pantallas muestran "Algo salió mal" con el botón "Reintentar". Volver a `0` al terminar.

## Volver a los datos de ejemplo

La primera vez que se abre, la app carga 12 gastos de ejemplo (del mes actual y del anterior).
Para volver a verlos hay que borrar los datos guardados: en Android, Ajustes → Aplicaciones →
Expo Go → Almacenamiento → "Borrar datos"; en iPhone, desinstalar y volver a instalar Expo Go.

## Estructura del repositorio

| Carpeta / archivo | Qué es |
|---|---|
| [`PROCESO.md`](PROCESO.md) | **Documento del proceso** (la entrega): investigación, spec, plan, setup, cada tarea con su prompt y sus correcciones, y conclusiones. |
| [`specs/001-gestor-gastos/`](specs/001-gestor-gastos/) | `spec.md` (qué), `plan.md` (cómo), `tasks.md` (tareas T01–T27), modelo de datos, contratos y [pruebas](specs/001-gestor-gastos/quickstart.md). |
| [`.specify/memory/constitution.md`](.specify/memory/constitution.md) | Reglas del proyecto (constitución de Spec Kit). |
| [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md) | Instrucciones para el agente de IA. |
| [`gestor-gastos/`](gestor-gastos/) | La app (proyecto Expo). |
| [`capturas/`](capturas/) | Capturas del teléfono usadas en `PROCESO.md`. |

Dentro de `gestor-gastos/`:

| Carpeta | Contenido |
|---|---|
| `app/` | Pantallas (expo-router: cada archivo es una ruta). |
| `components/` | Componentes reutilizables (tarjetas, íconos, estados de carga, vacío y error). |
| `services/` | Datos simulados: gastos y categorías (AsyncStorage + demora). |
| `utils/` | Funciones puras: formato, validación, cálculos y períodos. |
| `constants/tema.ts` | Sistema de diseño: colores, tipografía, íconos por categoría. |
| `types/` | Tipos de TypeScript. |

## Comprobaciones

```bash
cd gestor-gastos
npx tsc --noEmit     # tipos de TypeScript
npx expo-doctor      # dependencias compatibles con el SDK
```

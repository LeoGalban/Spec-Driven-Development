# Gestor de Gastos — instrucciones para agentes de IA

App móvil para anotar gastos personales. Trabajo práctico con **Spec-Driven Development** (GitHub
Spec Kit). Resumen de [`.specify/memory/constitution.md`](.specify/memory/constitution.md): si algo
de acá no coincide con la constitución, gana la constitución.

## Dónde está cada cosa

| Carpeta / archivo | Qué es |
|---|---|
| `gestor-gastos/` | El proyecto Expo (la app). Tiene su propio `AGENTS.md` con reglas de Expo: leerlo también. |
| `specs/001-gestor-gastos/` | `spec.md` (qué), `plan.md` (cómo), `tasks.md` (tareas T01–T22), `data-model.md`, `contracts/`, `quickstart.md`. |
| `PROCESO.md` | Documento del proceso que se entrega. Se actualiza en cada tarea. |
| `capturas/` | Capturas del teléfono que usa `PROCESO.md`. |

## Reglas

1. **La spec manda.** No programar nada que no esté en `spec.md` y en una tarea de `tasks.md`.
2. **Una tarea por vez**, en el orden de `tasks.md`. Al terminarla: marcar `[x]`, registrarla en
   `PROCESO.md` (sección 5: prompt, qué hizo la IA, qué se corrigió, cómo se verificó) y avisar al
   usuario que haga **un commit** (`feat: T07 - ...`). El usuario hace los commits, no el agente.
3. **Stack fijo:** Expo SDK 58 + expo-router + TypeScript. Debe correr en **Expo Go** (iPhone).
   Instalar paquetes solo con `npx expo install` y solo si el plan lo dice.
4. **Sin backend.** Las pantallas solo obtienen datos llamando a `gestor-gastos/services/`
   (funciones `async` con 500–1000 ms de demora y AsyncStorage). Nunca leer AsyncStorage desde una
   pantalla.
5. **Toda pantalla con datos** muestra carga, vacío y error (con "Reintentar").
6. **Simple y explicable:** `useState`/`useEffect`, `StyleSheet`, sin librerías de estado, UI ni
   formularios. El autor tiene que poder explicar cada línea en la defensa oral.

## Skills

En `.claude/skills/` hay skills de Spec Kit (`speckit-*`) y skills oficiales de Expo
(`expo-overview`, `expo-router`, `expo-upgrade`). Usar las de Expo para consultar APIs de SDK 58,
pero **si una skill contradice la constitución, gana la constitución**: nombres de componentes en
PascalCase, rutas en `app/` (no `src/app/`), pestañas de JavaScript (`Tabs`, no `NativeTabs`), sin
vistas previas ni menús en los links, y AsyncStorage para guardar datos.

## Convenciones de código

- Identificadores y comentarios **en español**, sin tildes ni ñ (`obtenerGastos`, `anio`,
  `LayoutPestanias`). Textos de la interfaz en español con tildes.
- Pantallas en `app/`, componentes en `components/` (PascalCase), datos en `services/`, funciones
  puras en `utils/`, tipos en `types/`.
- Montos en **centavos enteros**; fechas guardadas como `AAAA-MM-DD`; moneda `$ 1.234,50`.
- Comentarios solo donde el *por qué* no es obvio.

## Antes de dar una tarea por terminada

```powershell
cd gestor-gastos
npx tsc --noEmit      # sin errores de tipos
npx expo-doctor       # dependencias compatibles con el SDK
```

Y pedirle al usuario que la pruebe en el teléfono (`npx expo start --tunnel`: la red Wi-Fi donde
trabaja bloquea las conexiones locales).

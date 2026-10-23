# Documento del proceso — Gestor de Gastos

**Instituto Politécnico Formosa** · Taller Complementario – React Native II
**Actividad áulica N.° 1:** Desarrollo de una app móvil con React Native, Expo y Spec-Driven Development

**Integrantes:**
- Leonel Galban
- _(compañero/a — a completar)_

**Agente de IA utilizado:** Claude Code (extensión de VS Code)
**Herramienta SDD:** _(a completar en la etapa 2)_

---

## 1. Investigación

> Respuestas con nuestras propias palabras, citando las fuentes consultadas. Los números entre corchetes [n] remiten a la lista de fuentes al final de la sección.

### 1.1 React Native

**¿Qué es y qué problema resuelve?**
React Native es un framework creado por Meta (Facebook) para hacer apps móviles usando JavaScript/TypeScript y React. El problema que resuelve es que, sin él, para tener una app en Android y en iPhone hay que escribirla **dos veces**: una en Kotlin (Android) y otra en Swift (iOS), con dos equipos y dos códigos distintos. Con React Native se escribe **un solo código** que funciona en las dos plataformas [1].

**¿Cómo logra que JavaScript muestre componentes nativos?**
El código JavaScript no dibuja la pantalla él mismo. Cuando escribimos `<View>` o `<Text>`, React Native le pide al sistema operativo que cree el componente **nativo real** equivalente (en Android un `android.view.View`, en iOS un `UIView`) [2]. Funciona así:
1. Nuestro código JavaScript corre en un motor de JavaScript dentro de la app (Hermes).
2. React calcula qué hay que mostrar.
3. Mediante la **JSI** (JavaScript Interface), JavaScript se comunica directamente con el código nativo (C++/Kotlin/Swift). Esto es parte de la "Nueva Arquitectura", que reemplazó al viejo "bridge" que mandaba mensajes en formato JSON [3].
4. El renderizador (**Fabric**) crea y actualiza los componentes nativos en pantalla.

Por eso una app de React Native se ve y se siente como nativa: los botones y las listas **son** nativos, no una página web.

**Diferencias con otros enfoques:**

| Enfoque | Cómo funciona | Ventajas | Desventajas |
|---|---|---|---|
| **Nativo puro** (Kotlin / Swift) | Un código distinto por plataforma, con las herramientas oficiales | Máximo rendimiento y acceso total al teléfono | Dos códigos, dos equipos, más caro y lento |
| **React Native** | Un código JS/TS que maneja componentes nativos | Un solo código, UI nativa, gran comunidad, recarga rápida | Algunas funciones muy específicas requieren código nativo; un poco menos de rendimiento en casos extremos (juegos 3D) |
| **Híbrido web** (Ionic, PWA) | La app es una página web dentro de un navegador (WebView) o se instala desde el navegador | Se reutiliza conocimiento web (HTML/CSS); una PWA ni siquiera necesita tienda | No se siente 100 % nativa, peor rendimiento y acceso más limitado al hardware |

**3 apps conocidas hechas con React Native** [4]: **Facebook** (partes de la app, como Marketplace), **Discord** (app móvil), **Shopify** (sus apps móviles). Otras: Microsoft Outlook, Coinbase.

### 1.2 Expo

**¿Qué agrega Expo sobre React Native "pelado"?**
Expo es un conjunto de herramientas y librerías que se monta sobre React Native y facilita todo [5]:
- **Crear un proyecto con un solo comando** (`npx create-expo-app`), sin tener que configurar Android Studio ni Xcode.
- **Librerías listas** (el "Expo SDK") para cámara, ubicación, notificaciones, archivos, etc.
- **Expo Router** para la navegación.
- **EAS** (Expo Application Services) para compilar la app y publicarla en las tiendas desde la nube.

**¿Qué es Expo Go?**
Es una app que se instala desde la Play Store o la App Store. Al correr `npx expo start` en la computadora aparece un **código QR**; lo escaneamos con el teléfono y la app se abre al instante dentro de Expo Go. Cada vez que guardamos un cambio, se actualiza sola en el teléfono (*Fast Refresh*). Facilita probar porque **no hace falta compilar ni instalar nada** en el teléfono [6].

**¿Qué es expo-router y cómo maneja la navegación?**
Es el sistema de navegación de Expo y se basa en **archivos** ("file-based routing"): cada archivo dentro de la carpeta `app/` es una pantalla, y su ubicación define su ruta [7]. Ejemplos:
- `app/index.tsx` → pantalla inicial (`/`)
- `app/gastos/[id].tsx` → detalle de un gasto (`/gastos/5`); los corchetes indican un parámetro.
- `app/_layout.tsx` → define cómo se agrupan las pantallas (pila, pestañas, etc.).

Para ir de una pantalla a otra se usa `<Link href="/gastos/5">` o `router.push("/gastos/5")`. Funciona igual que las URLs de una página web.

**¿Cuándo conviene Expo y qué limitaciones tiene?**
Conviene en casi todos los proyectos nuevos; la documentación oficial de React Native recomienda empezar con un framework como Expo [1]. Es ideal para aprender, para prototipos y para la mayoría de las apps comerciales.
Limitaciones: **Expo Go** solo trae las librerías nativas que vienen incluidas. Si necesitamos una librería nativa que no está, hay que crear un *development build* (una versión propia de Expo Go) [8]. Además, la app final pesa un poco más.

### 1.3 SDD — Spec-Driven Development

**¿Qué es y por qué apareció con los agentes de IA?**
SDD (desarrollo guiado por especificaciones) es una forma de trabajar donde **primero se escribe qué se quiere construir** (la especificación) y recién después se programa. La especificación pasa a ser la fuente de verdad del proyecto [9].
Apareció junto con los agentes de IA porque estos escriben código muy rápido, pero **si no tienen instrucciones claras, adivinan**. Una spec bien escrita le da al agente un contexto fijo y verificable, y a nosotros una forma de controlar lo que hace.

**¿Qué es el "vibe coding" y qué problemas trae?**
Es programar pidiéndole cosas a la IA "a ojo" ("haceme una app de gastos") y aceptar lo que genera sin leerlo ni planificar. Sirve para un prototipo rápido, pero trae problemas:
- Código que nadie del equipo entiende ni puede mantener.
- La IA inventa funcionalidades que no pedimos y olvida otras que sí queríamos.
- Errores y problemas de seguridad que pasan sin revisión.
- Cada pedido nuevo puede romper lo anterior, porque no hay un plan.

**Flujo típico de SDD:**
1. **Reglas del proyecto (constitution):** principios fijos (tecnologías, idioma, convenciones).
2. **Especificación:** el *qué*: historias de usuario, criterios de aceptación, qué queda fuera.
3. **Plan técnico:** el *cómo*: estructura de carpetas, librerías, arquitectura.
4. **Tareas:** el plan dividido en pasos chicos y verificables.
5. **Implementación:** el agente hace una tarea por vez y nosotros revisamos y probamos.

**Herramientas:**
- **GitHub Spec Kit** [9]: herramienta de código abierto de GitHub. Se instala la CLI `specify` y agrega comandos al agente: `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks` y `/speckit.implement`, uno por cada paso del flujo. Funciona con muchos agentes: **Claude Code, GitHub Copilot, Gemini CLI, Cursor**, entre otros.
- **Kiro** [10]: un editor de código (IDE) con agente de IA hecho por Amazon (AWS). Tiene SDD integrado: genera `requirements.md` (requisitos), `design.md` (diseño) y `tasks.md` (tareas). Usa modelos de Claude por dentro.

### 1.4 Agentes de código y skills

**¿Qué es un agente de código y en qué se diferencia de un chat?**
Un chat común (por ejemplo, ChatGPT en el navegador) solo **responde texto**: nosotros copiamos y pegamos el código. Un **agente de código** (Claude Code, GitHub Copilot en modo agente, Cursor, Gemini CLI) trabaja **dentro del proyecto**: puede leer los archivos, crear y modificar código, ejecutar comandos en la terminal (instalar paquetes, correr tests) y repetir hasta lograr el objetivo [11]. La diferencia es que el chat sugiere y el agente actúa (con nuestro permiso).

**¿Para qué sirven AGENTS.md o CLAUDE.md?**
Son archivos de texto en la raíz del proyecto que el agente **lee automáticamente al empezar**. Ahí se le explica el contexto: de qué trata el proyecto, qué tecnologías usamos, cómo correrlo, qué convenciones respetar (idioma, estilo, carpetas). Así no hay que repetírselo en cada pedido. `AGENTS.md` es un formato abierto que entienden varios agentes [12]; `CLAUDE.md` es el equivalente específico de Claude Code [11].

**¿Qué son las skills y dónde se consiguen?**
Una **skill** es un paquete de instrucciones (y a veces scripts) que le enseña al agente a hacer una tarea específica, como seguir buenas prácticas de Expo o crear un tipo de archivo. Es una carpeta con un archivo `SKILL.md`. El agente solo la carga cuando la tarea lo requiere, así no ocupa contexto de más [13].
Se consiguen en repositorios de GitHub de la comunidad y de las empresas (por ejemplo, el repositorio oficial `anthropics/skills`, o skills publicadas por equipos como el de Expo) y en catálogos de skills. Se instalan **copiando la carpeta** en `.claude/skills/` del proyecto o **instalando un plugin** desde el agente con el comando `/plugin` [13].

### 1.5 Mocks

**¿Qué es un mock y por qué permite hacer el frontend sin backend?**
Un mock es una **imitación**: código que simula ser el servidor real y devuelve datos inventados. Si la app llama a `obtenerGastos()` y esa función devuelve una lista de ejemplo, la pantalla no sabe ni le importa si los datos vienen de internet o no. Así se puede construir y probar toda la app **sin esperar a que exista el backend**. El día que exista, solo se reemplaza esa función por una que llame a la API real.

**Estrategias en React Native:**
- **JSON estático:** un archivo `.json` o `.ts` con los datos que se importa directamente. Es lo más simple, pero los datos aparecen instantáneamente y no se pueden modificar.
- **Servicio simulado con `Promise` + `setTimeout`:** una función `async` que espera, por ejemplo, 800 ms y después devuelve los datos. **Imita la demora de internet**, lo que nos obliga a programar los estados de "cargando…" y de error. Es la estrategia que pide la consigna.
- **AsyncStorage** [14]: almacenamiento local de clave-valor en el teléfono. Permite que los datos que el usuario agrega **sigan ahí después de cerrar la app**. Se puede combinar con el servicio simulado.

```ts
// Ejemplo de servicio simulado
const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function obtenerGastos() {
  await esperar(800);   // simula la demora del servidor
  return gastosMock;    // devuelve los datos de ejemplo
}
```

### Fuentes

1. React Native — Introducción y entorno: https://reactnative.dev/docs/getting-started y https://reactnative.dev/docs/environment-setup
2. React Native — Core Components and Native Components: https://reactnative.dev/docs/intro-react-native-components
3. React Native — About the New Architecture: https://reactnative.dev/architecture/landing-page
4. React Native Showcase: https://reactnative.dev/showcase
5. Documentación de Expo: https://docs.expo.dev/
6. Expo Go: https://docs.expo.dev/get-started/expo-go/
7. Expo Router — Introducción: https://docs.expo.dev/router/introduction/
8. Expo — Development builds: https://docs.expo.dev/develop/development-builds/introduction/
9. GitHub Spec Kit: https://github.com/github/spec-kit
10. Kiro: https://kiro.dev/
11. Claude Code — Documentación: https://docs.claude.com/en/docs/claude-code/overview
12. AGENTS.md: https://agents.md/
13. Agent Skills (Claude Code): https://docs.claude.com/en/docs/claude-code/skills y https://github.com/anthropics/skills
14. AsyncStorage: https://react-native-async-storage.github.io/async-storage/

---

## 2. Especificación

### 2.1 Idea original
_(pendiente)_

### 2.2 Reglas del proyecto (constitution)
_(pendiente)_

### 2.3 Prompts usados para generar la spec
_(pendiente)_

### 2.4 Qué corregimos de lo que propuso la IA
_(pendiente)_

---

## 3. Plan técnico y tareas

### 3.1 Prompts usados
_(pendiente)_

### 3.2 Qué corregimos del plan y de las tareas
_(pendiente)_

---

## 4. Setup del entorno

### 4.1 Creación del proyecto
_(pendiente)_

### 4.2 Skills encontradas e instaladas
_(pendiente)_

### 4.3 Captura de la app base en el teléfono
_(pendiente)_

---

## 5. Desarrollo

> Por cada tarea: prompt utilizado, qué generó la IA, qué corregimos a mano y cómo lo verificamos.

_(pendiente)_

---

## Registro de prompts generales

| Etapa | Prompt utilizado (a Claude Code) | Resultado |
|---|---|---|
| 0 | "quiero que me hagas este trabajo de una forma fácil para que yo pueda entenderlo y luego explicarle a mis profesores [...]" + PDF de la consigna | La IA propuso un plan por etapas, clonó el repositorio y creó la estructura de este documento. |
| 1 | "quiero que vos hagas todo y me digas cuándo tengo que hacer commit" | La IA redactó un borrador de la investigación con fuentes. Lo revisamos y reescribimos con nuestras palabras. |

---

## 6. Conclusiones

_(pendiente)_

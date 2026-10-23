# Documento del proceso — Gestor de Gastos

**Instituto Politécnico Formosa** · Taller Complementario – React Native II
**Actividad áulica N.° 1:** Desarrollo de una app móvil con React Native, Expo y Spec-Driven Development

**Integrante:**
- Leonel Galban

**Agente de IA utilizado:** Claude 
**Herramienta SDD:** GitHub Spec Kit (`specify-cli` v1.2.4) con integración para Claude Code

---

## 1. Investigación

> Cada número entre corchetes indica de qué fuente sacamos esa información [n].

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

**3 apps conocidas hechas con React Native:** **Facebook Ads Manager** (de Meta) [4], **Shopify** (sus apps móviles, como Shop y Point of Sale) [4] y **Discord** (su app de iOS) [15]. Otras que figuran en la página oficial: Microsoft Outlook, Microsoft Teams y Amazon Shopping [4].

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
Una **skill** es un paquete de instrucciones (y a veces scripts) que le enseña al agente a hacer una tarea específica, como seguir buenas prácticas de Expo o crear un tipo de archivo. Es una carpeta con un archivo `SKILL.md`. El agente solo la carga cuando la tarea lo requiere, así no ocupa contexto de más [13]. Es un **formato abierto** (Agent Skills) que hoy entienden varios agentes, no solo Claude Code [16].
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
6. Expo — Set up your environment (Expo Go): https://docs.expo.dev/get-started/set-up-your-environment/
7. Expo Router — Introducción: https://docs.expo.dev/router/introduction/
8. Expo — Development builds: https://docs.expo.dev/develop/development-builds/introduction/
9. GitHub Spec Kit: https://github.com/github/spec-kit
10. Kiro — Specs: https://kiro.dev/ y https://kiro.dev/docs/specs/
11. Claude Code — Overview: https://code.claude.com/docs/en/overview
12. AGENTS.md: https://agents.md/
13. Claude Code — Skills: https://code.claude.com/docs/en/skills y repositorio https://github.com/anthropics/skills
14. Expo — AsyncStorage: https://docs.expo.dev/versions/latest/sdk/async-storage/ y repositorio https://github.com/react-native-async-storage/async-storage
15. Discord Blog — How Discord achieves native iOS performance with React Native: https://discord.com/blog/how-discord-achieves-native-ios-performance-with-react-native
16. Agent Skills (estándar abierto): https://agentskills.io/home

> Todos los enlaces fueron verificados el 23/10/2026: abren correctamente y son páginas oficiales
> de cada proyecto o empresa.

---

## 2. Especificación

### 2.0 Instalación de la herramienta SDD

Elegimos **GitHub Spec Kit** porque es de código abierto, funciona con Claude Code (el agente que
usamos) y es la herramienta sugerida en la consigna.

```powershell
pip install --user uv                     # uv: instalador de herramientas de Python
python -m uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init --here --integration claude --ignore-agent-tools
```

- `specify init` creó la carpeta `.specify/` (plantillas, scripts y la constitución) y la carpeta
  `.claude/skills/` con los comandos de Spec Kit para el agente: `/speckit-constitution`,
  `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`, etc.
- **Problema encontrado:** la primera vez falló con *"claude not found"*, porque usamos Claude Code
  como extensión de VS Code y no como comando de terminal. Se resolvió con la opción
  `--ignore-agent-tools`, que saltea esa verificación.

### 2.1 Idea original

> "Una app para anotar mis gastos del día a día: ver la lista de lo que gasté, ver el detalle de
> cada gasto, cargar uno nuevo con un formulario que valide los datos, editarlo o borrarlo, y ver
> cuánto gasté por categoría en el mes."

Elegimos un **gestor de gastos personales** porque cumple naturalmente con los requisitos de la
consigna: tiene un listado con detalle, un formulario donde la validación tiene sentido (montos,
fechas) y se puede hacer sin backend.

### 2.2 Reglas del proyecto (constitution)

Archivo: [`.specify/memory/constitution.md`](.specify/memory/constitution.md). Resumen de los 6
principios:

1. **La spec manda:** no se programa nada que no esté en la spec y en una tarea.
2. **Stack fijo, sin backend:** Expo + React Native + TypeScript + expo-router; solo librerías
   compatibles con Expo Go.
3. **Los datos viven en `services/`:** funciones `async` con 500–1000 ms de latencia simulada.
4. **Carga, vacío y error** en toda pantalla con datos.
5. **Simple y explicable:** sin librerías extra; `useState`/`useEffect` y `StyleSheet`.
6. **Una tarea, un commit, probada en el teléfono.**

Convenciones: código y comentarios **en español** (sin tildes en los nombres), moneda en pesos
argentinos.

### 2.3 Prompts usados para generar la spec

| Paso | Prompt |
|---|---|
| Constitución (`/speckit-constitution`) | "Stack fijo: Expo + expo-router + TypeScript, sin backend, datos mock en `services/` con latencia de 500–1000 ms, AsyncStorage para persistencia, debe correr en Expo Go. Código y comentarios en español. Una tarea = un commit. Toda pantalla maneja carga, vacío y error. Código simple que podamos explicar línea por línea." |
| Especificación (`/speckit-specify`) | "Gestor de gastos personales. Una app para anotar mis gastos del día a día: ver la lista de lo que gasté, ver el detalle de cada gasto, cargar uno nuevo con un formulario que valide los datos, editarlo o borrarlo, y ver cuánto gasté por categoría en el mes. Mínimo 4 pantallas con expo-router. Sin usuarios ni backend." |

Spec Kit generó:
- [`specs/001-gestor-gastos/spec.md`](specs/001-gestor-gastos/spec.md): 5 historias de usuario con
  prioridad (P1–P3), criterios de aceptación *Dado / Cuando / Entonces*, 14 requisitos
  funcionales, tabla de pantallas, sección **Fuera de alcance** y criterios de éxito medibles.
- [`specs/001-gestor-gastos/checklists/requirements.md`](specs/001-gestor-gastos/checklists/requirements.md):
  checklist de calidad de la spec.

### 2.4 Qué corregimos de lo que propuso la IA

Decisiones que tomamos para **recortar** y **concretar** la spec:

- **Recortamos alcance:** quedaron explícitamente fuera los gráficos, presupuestos, ingresos,
  búsqueda/filtros, categorías personalizadas, varias monedas, exportar datos y modo oscuro. Son
  ideas típicas de una app de gastos, pero no las pide la consigna y alargan el trabajo.
- **Reglas de validación concretas (FR-006):** "validar el formulario" era muy vago. Lo
  reemplazamos por reglas que se pueden probar una por una (descripción 3–50 caracteres, monto
  mayor a 0 con hasta 2 decimales, fecha no futura, etc.).
- **Categorías fijas (FR-007):** 6 categorías cerradas, para no tener que hacer una pantalla de
  administración de categorías.
- **Estado de error demostrable:** agregamos un supuesto para poder *forzar* un error en la demo,
  porque si el mock nunca falla no hay forma de mostrar el estado de error.
- **Datos de ejemplo (FR-012):** al menos 10 gastos de 2 meses distintos, para poder probar que el
  total del mes solo suma el mes actual.

> ✏️ **Revisión personal:** _(completar al leer la spec: qué cambié a mano, qué me pareció que
> sobraba o faltaba, y qué observaciones hicieron los docentes al aprobarla)._

---

## 3. Plan técnico y tareas

### 3.1 Prompts usados

| Paso | Prompt |
|---|---|
| Plan técnico (`/speckit-plan`) | "Expo SDK actual + expo-router (navegación por archivos, Stack) + TypeScript. Sin backend: servicio mock en `services/gastos.ts` con funciones async y latencia simulada de 500-1000 ms, persistencia con `@react-native-async-storage/async-storage` (incluida en Expo Go). Sin librerías extra de estado, UI ni formularios: `useState`/`useEffect` y `StyleSheet`. Validación del formulario hecha a mano en una función pura. Debe correr en Expo Go. Código y comentarios en español." |
| Tareas (`/speckit-tasks`) | "Tareas chicas (una tarea = un commit = algo que se prueba en el teléfono). Sin tareas de tests automáticos. Numeradas T01, T02... Agrupadas por historia de usuario en orden de prioridad." |

Spec Kit generó, en [`specs/001-gestor-gastos/`](specs/001-gestor-gastos/):

| Archivo | Para qué sirve |
|---|---|
| [`plan.md`](specs/001-gestor-gastos/plan.md) | El *cómo*: versiones, estructura de carpetas, verificación contra la constitución y orden de construcción. |
| [`research.md`](specs/001-gestor-gastos/research.md) | 13 decisiones técnicas, cada una con su motivo y las alternativas descartadas. |
| [`data-model.md`](specs/001-gestor-gastos/data-model.md) | Los tipos de datos, las reglas de validación con sus mensajes y cómo se guarda todo. |
| [`contracts/`](specs/001-gestor-gastos/contracts/) | Las funciones del servicio mock y el mapa de pantallas/rutas con sus estados. |
| [`quickstart.md`](specs/001-gestor-gastos/quickstart.md) | Cómo correr la app y 19 pruebas manuales para hacer en el teléfono. |
| [`tasks.md`](specs/001-gestor-gastos/tasks.md) | 22 tareas (T01–T22) agrupadas por historia, cada una con su forma de verificarla. |

**Decisiones técnicas más importantes** (detalle en `research.md`):

- **Expo SDK 58** con la plantilla `blank-typescript`, en la carpeta `gestor-gastos/` (separada de
  la documentación).
- **Navegación:** un `Stack` con dos pestañas adentro; el detalle y el formulario se abren encima.
- **Un solo formulario** para agregar y editar (si recibe un `id`, edita).
- **Montos en centavos enteros** (`150050` = `$ 1.500,50`), porque en JavaScript `0.1 + 0.2` no da
  exactamente `0.3` y los totales tienen que coincidir al centavo.
- **Fechas guardadas como `AAAA-MM-DD`**, que se ordenan bien como texto.
- **Simular el error:** una constante `PROBABILIDAD_ERROR` en `services/simulacion.ts`; se cambia a
  `1` para mostrar el estado de error en la demo.
- **Datos de ejemplo según la fecha de hoy**, para que el total del mes nunca dé $ 0.

### 3.2 Qué corregimos del plan y de las tareas

- **Plantilla `blank-typescript` en vez de la `default`:** la de ejemplo trae pestañas, temas y
  componentes que no vamos a usar. Preferimos empezar vacíos y agregar cada archivo sabiendo para
  qué está.
- **Datos de ejemplo relativos a hoy:** con fechas fijas, al mes siguiente la lista no tendría
  gastos "de este mes" y no se podría probar el total ni el resumen.
- **Sin tests automáticos:** la constitución dice que una tarea se termina al probarla en el
  teléfono. En su lugar, `quickstart.md` tiene 19 pruebas manuales con el resultado esperado.
- **Sin selector de fecha ni de categoría de librerías externas:** la fecha es un campo de texto
  (así se puede probar la validación `31/02/2026`) y las categorías son 6 botones.
- **Tareas chicas y verificables:** cada tarea dice en qué archivo se trabaja y cómo se prueba en el
  teléfono, para poder hacer un commit por tarea.
- **Constitución 1.0.1:** decía "los dos integrantes", pero el trabajo es individual. Se corrigió
  esa redacción y se agregó la carpeta `utils/` (funciones de formato, validación y cálculos) a las
  convenciones.

> ✏️ **Revisión personal:** _(completar al leer `plan.md` y `tasks.md`: qué cambié a mano o qué
> me pareció que sobraba o faltaba)._

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
| 2 | "siguiente" (continuar con la etapa 2) + los prompts de la sección 2.3 | La IA instaló Spec Kit, escribió la constitución y generó la spec. |
| 3 | "listo" (continuar con la etapa 3) + los prompts de la sección 3.1 | La IA generó el plan técnico, los documentos de diseño y las 22 tareas; corrigió la constitución a 1.0.1 por ser trabajo individual. |

---

## 6. Conclusiones



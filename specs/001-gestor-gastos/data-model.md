# Modelo de datos (Fase 1): Gestor de Gastos

**Funcionalidad**: `specs/001-gestor-gastos` | **Fecha**: 2026-10-23

Los tipos se definen en `gestor-gastos/types/gasto.ts`.

## Categoria

Lista cerrada (FR-007). No se puede crear ni editar.

```ts
type Categoria = 'Comida' | 'Transporte' | 'Hogar' | 'Salud' | 'Ocio' | 'Otros';
```

Se exporta también como arreglo `CATEGORIAS` para dibujar los botones del formulario.

## Gasto

Lo que se guarda en el teléfono.

| Campo | Tipo | Obligatorio | Ejemplo | Notas |
|---|---|---|---|---|
| `id` | `string` | Sí | `"1729700000000"` | Lo genera el servicio al crear. No se repite. |
| `descripcion` | `string` | Sí | `"Supermercado"` | Se guarda sin espacios al inicio ni al final. |
| `montoCentavos` | `number` (entero) | Sí | `150050` | `$ 1.500,50`. Ver [research.md §7](research.md). |
| `categoria` | `Categoria` | Sí | `"Comida"` | |
| `fecha` | `string` | Sí | `"2026-10-23"` | Formato `AAAA-MM-DD`. Ver [research.md §8](research.md). |
| `nota` | `string` | No | `"Compra del mes"` | Cadena vacía `""` si no tiene. |

## DatosGasto

Lo que la pantalla manda al servicio para crear o editar: un `Gasto` **sin `id`**
(`Omit<Gasto, 'id'>`). El servicio pone el `id`.

## ValoresFormulario y ErroresFormulario

Lo que el usuario escribe en el formulario. Todo es texto porque viene de `TextInput`.

```ts
type ValoresFormulario = {
  descripcion: string;
  monto: string;       // "1500,50" o "1500.50"
  categoria: Categoria | null;
  fecha: string;       // "23/10/2026"
  nota: string;
};

// Un mensaje por campo con error. Si un campo no aparece, está bien.
type ErroresFormulario = Partial<Record<keyof ValoresFormulario, string>>;
```

## Reglas de validación (FR-006)

`validarGasto(valores)` devuelve `ErroresFormulario`. Si el objeto está vacío, se puede guardar.

| Campo | Regla | Mensaje de error |
|---|---|---|
| descripción | Obligatoria (sin contar espacios) | "Escribí una descripción" |
| descripción | Entre 3 y 50 caracteres (sin contar espacios al inicio y al final) | "La descripción debe tener entre 3 y 50 caracteres" |
| monto | Obligatorio | "Escribí el monto" |
| monto | Número válido (acepta coma o punto decimal) | "El monto debe ser un número" |
| monto | Mayor a 0 | "El monto debe ser mayor a 0" |
| monto | Máximo 2 decimales | "Usá como máximo 2 decimales" |
| monto | Hasta 10.000.000 | "El monto máximo es $ 10.000.000" |
| categoría | Obligatoria | "Elegí una categoría" |
| fecha | Obligatoria | "Escribí la fecha" |
| fecha | Formato `DD/MM/AAAA` | "Usá el formato DD/MM/AAAA" |
| fecha | Fecha real (no `31/02/2026`) | "Esa fecha no existe" |
| fecha | No posterior a hoy | "La fecha no puede ser futura" |
| nota | Máximo 200 caracteres | "La nota puede tener hasta 200 caracteres" |

Cada campo muestra **un solo mensaje**: el de la primera regla que no cumple, en el orden de la
tabla.

## Conversiones

| De → A | Función (`utils/`) | Ejemplo |
|---|---|---|
| Texto del monto → centavos | `textoACentavos` | `"1500,50"` → `150050` |
| Centavos → texto en pantalla | `formatearPesos` | `150050` → `"$ 1.500,50"` |
| Centavos → texto del formulario (al editar) | `centavosATexto` | `150050` → `"1500,50"` |
| `DD/MM/AAAA` → `AAAA-MM-DD` | `fechaAGuardar` | `"23/10/2026"` → `"2026-10-23"` |
| `AAAA-MM-DD` → `DD/MM/AAAA` | `fechaAMostrar` | `"2026-10-23"` → `"23/10/2026"` |

## Almacenamiento

- **Clave** de AsyncStorage: `gastos`.
- **Valor**: arreglo de `Gasto` en JSON.
- **Clave inexistente** → primera vez: se guardan los datos de ejemplo y se devuelven.
- **Valor `[]`** → el usuario borró todo: se muestra el estado vacío.

## Valores calculados (no se guardan)

- **Total del mes**: suma de `montoCentavos` de los gastos cuya `fecha` empieza con el `AAAA-MM`
  de hoy (FR-002).
- **Resumen por categoría**: para cada categoría con gastos en el mes, el total y el porcentaje
  sobre el total del mes, ordenados de mayor a menor (FR-010). El porcentaje se muestra redondeado
  a un número entero.

## Ciclo de vida de un gasto

```text
(no existe) --crear--> guardado --editar--> guardado
                           |
                       eliminar (con confirmación)
                           v
                      (no existe)  → su detalle muestra "No se encontró el gasto"
```

## Agregado durante el desarrollo (H6 y H7)

### Categoria (cambia)

`Categoria` pasa de ser una lista cerrada a ser el **nombre** de una categoría (`string`). Los
gastos guardados no cambian: siguen teniendo el nombre de su categoría.

### InfoCategoria (nuevo)

| Campo | Tipo | Ejemplo | Notas |
|---|---|---|---|
| `nombre` | `string` | `"Mascotas"` | Único (sin importar mayúsculas). |
| `color` | `string` | `"#0E9384"` | Uno de `COLORES_CATEGORIA` (6 opciones). |
| `icono` | `{ ios, android }` | `{ ios: 'pawprint.fill', android: 'pets' }` | Uno de `ICONOS_CATEGORIA` (8 opciones). |
| `propia` | `boolean` | `true` | `false` para las 6 fijas. |

Se guardan en AsyncStorage, clave `categorias`, solo las creadas por el usuario (sin `propia`).

### Validación de una categoría nueva (FR-016)

`validarCategoria(nombre, existentes)` devuelve el mensaje de error o `null`:

| Regla | Mensaje |
|---|---|
| Vacío (sin contar espacios) | "Escribí un nombre" |
| Menos de 2 o más de 20 caracteres | "El nombre debe tener entre 2 y 20 caracteres" |
| Ya existe (sin importar mayúsculas) | "Ya existe una categoría con ese nombre" |

### Periodo (nuevo)

`{ desde: 'AAAA-MM-DD', hasta: 'AAAA-MM-DD', titulo: string }`. Ejemplos:
`periodoMes(0)` → octubre 2026, título "Octubre 2026"; `periodoSemana(0)` → del lunes 19/10 al
domingo 25/10, título "19/10 al 25/10".

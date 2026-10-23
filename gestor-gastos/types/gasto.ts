import type { NombreIcono } from '../components/Icono';

// Tipos de datos de la app (ver specs/001-gestor-gastos/data-model.md).

// Una categoría se identifica por su nombre: "Comida", o una creada por el usuario, como
// "Mascotas" (FR-007 y FR-016). Por eso es un texto cualquiera y no una lista cerrada.
export type Categoria = string;

// Nombres de las 6 categorías fijas (FR-007), en el orden en que se muestran.
export const CATEGORIAS: Categoria[] = ['Comida', 'Transporte', 'Hogar', 'Salud', 'Ocio', 'Otros'];

// Cómo se dibuja una categoría: su ícono (con nombre para iPhone y para Android) y su color.
export type EstiloCategoria = {
  icono: NombreIcono;
  color: string;
};

// Una categoría completa: nombre, estilo y si la creó el usuario (propia) o es de las 6 fijas.
export type InfoCategoria = EstiloCategoria & {
  nombre: Categoria;
  propia: boolean;
};

// Un gasto tal como se guarda en el teléfono.
export type Gasto = {
  id: string;
  descripcion: string;
  montoCentavos: number; // entero: $ 1.500,50 se guarda como 150050 (evita errores de redondeo)
  categoria: Categoria;
  fecha: string; // "AAAA-MM-DD", así se ordena bien como texto
  nota: string; // "" si no tiene nota
};

// Lo que la pantalla le manda al servicio para crear o editar: un gasto sin id
// (el id lo pone el servicio).
export type DatosGasto = Omit<Gasto, 'id'>;

// Lo que el usuario escribe en el formulario. Es todo texto porque viene de los TextInput.
export type ValoresFormulario = {
  descripcion: string;
  monto: string; // "1500,50" o "1500.50"
  categoria: Categoria | null; // null mientras no eligió ninguna
  fecha: string; // "DD/MM/AAAA"
  nota: string;
};

// Un mensaje de error por campo. Si un campo no aparece, es porque está bien.
export type ErroresFormulario = Partial<Record<keyof ValoresFormulario, string>>;

// Tipos de datos de la app (ver specs/001-gestor-gastos/data-model.md).

// Las 6 categorías fijas (FR-007). Un gasto solo puede tener una de estas.
export type Categoria = 'Comida' | 'Transporte' | 'Hogar' | 'Salud' | 'Ocio' | 'Otros';

// La misma lista, pero como arreglo, para poder recorrerla y dibujar un botón por categoría.
export const CATEGORIAS: Categoria[] = ['Comida', 'Transporte', 'Hogar', 'Salud', 'Ocio', 'Otros'];

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

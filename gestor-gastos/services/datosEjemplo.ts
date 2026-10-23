import { Categoria, Gasto } from '../types/gasto';
import { fechaATexto } from '../utils/formato';

// Gastos de ejemplo que se cargan la primera vez que se abre la app (FR-012).
// Las fechas se calculan a partir de hoy para que siempre haya gastos "de este mes"
// y "del mes anterior", sin importar cuándo se pruebe la app (research.md §13).

// Fecha del mes actual o del anterior, en un día dado.
// Si ese día no existe todavía (o no existe en ese mes), se usa el último día posible.
function fechaDelMes(mesesAtras: 0 | 1, dia: number): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = ahora.getMonth() - mesesAtras; // si da -1, Date lo pasa a diciembre del año anterior

  // El "día 0" del mes siguiente es el último día de este mes (28, 29, 30 o 31).
  const ultimoDiaDelMes = new Date(anio, mes + 1, 0).getDate();
  // En el mes actual no se puede pasar de hoy: no se permiten gastos futuros.
  const diaMaximo = mesesAtras === 0 ? ahora.getDate() : ultimoDiaDelMes;

  return fechaATexto(new Date(anio, mes, Math.min(dia, diaMaximo)));
}

// Arma un gasto de ejemplo. El id empieza con "ejemplo-" para distinguirlo de los que carga el usuario.
function ejemplo(
  numero: number,
  descripcion: string,
  montoCentavos: number,
  categoria: Categoria,
  fecha: string,
  nota = '',
): Gasto {
  return { id: `ejemplo-${numero}`, descripcion, montoCentavos, categoria, fecha, nota };
}

// 12 gastos: 7 del mes actual y 5 del mes anterior, usando las 6 categorías.
export function crearDatosEjemplo(): Gasto[] {
  return [
    // Mes actual
    ejemplo(1, 'Supermercado', 4535000, 'Comida', fechaDelMes(0, 2), 'Compra grande del mes'),
    ejemplo(2, 'Carga SUBE', 1000000, 'Transporte', fechaDelMes(0, 3)),
    ejemplo(3, 'Factura de luz', 2870050, 'Hogar', fechaDelMes(0, 5)),
    ejemplo(4, 'Farmacia', 1245000, 'Salud', fechaDelMes(0, 8), 'Remedios para la gripe'),
    ejemplo(5, 'Cine', 900000, 'Ocio', fechaDelMes(0, 12)),
    ejemplo(6, 'Verdulería', 685075, 'Comida', fechaDelMes(0, 15)),
    ejemplo(7, 'Regalo de cumpleaños', 1500000, 'Otros', fechaDelMes(0, 20)),
    // Mes anterior
    ejemplo(8, 'Alquiler', 35000000, 'Hogar', fechaDelMes(1, 1)),
    ejemplo(9, 'Nafta', 2500000, 'Transporte', fechaDelMes(1, 7)),
    ejemplo(10, 'Pizza con amigos', 1840000, 'Comida', fechaDelMes(1, 14)),
    ejemplo(11, 'Consulta médica', 2000000, 'Salud', fechaDelMes(1, 21)),
    ejemplo(12, 'Recital', 4500000, 'Ocio', fechaDelMes(1, 28)),
  ];
}

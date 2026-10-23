import { Gasto } from '../types/gasto';
import { hoy } from './formato';

// Cálculos sobre la lista de gastos. Son funciones puras: no guardan ni leen datos,
// solo trabajan con la lista que reciben.

// "AAAA-MM" del mes actual, por ejemplo "2026-10".
function mesActual(): string {
  return hoy().slice(0, 7);
}

// Suma, en centavos, de los gastos del mes calendario actual (FR-002).
// Un gasto es de este mes si su fecha "AAAA-MM-DD" empieza con el "AAAA-MM" de hoy.
export function totalDelMes(gastos: Gasto[]): number {
  const mes = mesActual();
  let total = 0;
  for (const gasto of gastos) {
    if (gasto.fecha.startsWith(mes)) {
      total += gasto.montoCentavos;
    }
  }
  return total;
}

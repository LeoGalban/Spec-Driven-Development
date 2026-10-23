import { CATEGORIAS, Categoria, Gasto } from '../types/gasto';
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

// Una fila del resumen: cuánto se gastó en una categoría y qué parte del total es.
export type ResumenCategoria = {
  categoria: Categoria;
  totalCentavos: number;
  porcentaje: number; // redondeado a entero: 35 significa 35 %
};

// Total y porcentaje por categoría del mes actual, de mayor a menor (FR-010).
// Solo aparecen las categorías que tienen gastos este mes.
export function resumenPorCategoria(gastos: Gasto[]): ResumenCategoria[] {
  const mes = mesActual();
  const totalMes = totalDelMes(gastos);
  const resumen: ResumenCategoria[] = [];

  for (const categoria of CATEGORIAS) {
    let total = 0;
    for (const gasto of gastos) {
      if (gasto.categoria === categoria && gasto.fecha.startsWith(mes)) {
        total += gasto.montoCentavos;
      }
    }
    if (total > 0) {
      resumen.push({
        categoria,
        totalCentavos: total,
        porcentaje: Math.round((total * 100) / totalMes),
      });
    }
  }

  // sort con (a, b) => b - a ordena de mayor a menor.
  return resumen.sort((a, b) => b.totalCentavos - a.totalCentavos);
}

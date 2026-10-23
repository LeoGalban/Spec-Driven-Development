import { Categoria, Gasto } from '../types/gasto';
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
// Agrupa por el nombre de la categoría de cada gasto, así sirve para las 6 fijas y para las que
// crea el usuario. Solo aparecen las categorías que tienen gastos este mes.
export function resumenPorCategoria(gastos: Gasto[]): ResumenCategoria[] {
  const mes = mesActual();
  const totalMes = totalDelMes(gastos);
  const resumen: ResumenCategoria[] = [];

  for (const gasto of gastos) {
    if (!gasto.fecha.startsWith(mes)) continue; // solo los del mes
    // ¿Ya hay una fila para esta categoría? Si no, se crea.
    let fila = resumen.find((f) => f.categoria === gasto.categoria);
    if (!fila) {
      fila = { categoria: gasto.categoria, totalCentavos: 0, porcentaje: 0 };
      resumen.push(fila);
    }
    fila.totalCentavos += gasto.montoCentavos;
  }

  // Con los totales ya sumados se calcula qué parte del mes es cada categoría.
  for (const fila of resumen) {
    fila.porcentaje = Math.round((fila.totalCentavos * 100) / totalMes);
  }

  // sort con (a, b) => b - a ordena de mayor a menor.
  return resumen.sort((a, b) => b.totalCentavos - a.totalCentavos);
}

// Un grupo de la lista: todos los gastos de un mismo día y cuánto suman.
export type GrupoDeDia = {
  fecha: string; // "AAAA-MM-DD"
  totalCentavos: number;
  data: Gasto[]; // SectionList espera que la lista de cada grupo se llame "data"
};

// Agrupa los gastos por día, respetando el orden en que llegan (del más reciente al más antiguo).
export function agruparPorDia(gastos: Gasto[]): GrupoDeDia[] {
  const grupos: GrupoDeDia[] = [];
  for (const gasto of gastos) {
    const ultimo = grupos[grupos.length - 1];
    // Como vienen ordenados por fecha, si es del mismo día que el último grupo va ahí.
    if (ultimo && ultimo.fecha === gasto.fecha) {
      ultimo.data.push(gasto);
      ultimo.totalCentavos += gasto.montoCentavos;
    } else {
      grupos.push({ fecha: gasto.fecha, totalCentavos: gasto.montoCentavos, data: [gasto] });
    }
  }
  return grupos;
}

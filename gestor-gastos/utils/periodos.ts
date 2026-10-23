import { fechaAMostrar, fechaATexto, mesYAnio } from './formato';

// Períodos para el resumen (Historia 7, FR-017): una semana o un mes, con sus fechas de inicio y
// fin en formato "AAAA-MM-DD" (así se comparan como texto, igual que en el resto de la app).
export type Periodo = {
  desde: string; // primer día, incluido
  hasta: string; // último día, incluido
  titulo: string; // "Octubre 2026" o "19/10 al 25/10"
};

// Un mes calendario: mesesAtras = 0 es el mes actual, 1 el anterior, y así.
// new Date se encarga de los cambios de año: el mes -1 de 2027 es diciembre de 2026.
export function periodoMes(mesesAtras: number): Periodo {
  const ahora = new Date();
  const primerDia = new Date(ahora.getFullYear(), ahora.getMonth() - mesesAtras, 1);
  // El "día 0" del mes siguiente es el último día de este mes (28, 29, 30 o 31).
  const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() - mesesAtras + 1, 0);
  const desde = fechaATexto(primerDia);
  return { desde, hasta: fechaATexto(ultimoDia), titulo: mesYAnio(desde) };
}

// Una semana de lunes a domingo: semanasAtras = 0 es la semana actual, 1 la anterior, y así.
export function periodoSemana(semanasAtras: number): Periodo {
  const ahora = new Date();
  // getDay() da 0 para el domingo, 1 para el lunes... 6 para el sábado.
  // (getDay() + 6) % 7 da cuántos días pasaron desde el lunes: lunes 0, domingo 6.
  const diasDesdeElLunes = (ahora.getDay() + 6) % 7;
  const lunes = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate() - diasDesdeElLunes - semanasAtras * 7,
  );
  const domingo = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + 6);
  const desde = fechaATexto(lunes);
  const hasta = fechaATexto(domingo);
  // "19/10/2026" → "19/10": el año no hace falta en el título de una semana.
  const titulo = `${fechaAMostrar(desde).slice(0, 5)} al ${fechaAMostrar(hasta).slice(0, 5)}`;
  return { desde, hasta, titulo };
}

// ¿La fecha "AAAA-MM-DD" cae dentro del período? Los textos se comparan como en un diccionario.
export function estaEnPeriodo(fecha: string, periodo: Periodo): boolean {
  return fecha >= periodo.desde && fecha <= periodo.hasta;
}

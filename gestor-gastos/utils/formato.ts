// Funciones puras para convertir montos y fechas entre cómo se guardan y cómo se muestran
// (ver "Conversiones" en specs/001-gestor-gastos/data-model.md).

// Completa con ceros a la izquierda hasta tener 2 dígitos: 5 → "05".
function dosDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

// 150050 → "$ 1.500,50"
// No usamos Intl.NumberFormat porque su resultado cambia según el teléfono.
export function formatearPesos(centavos: number): string {
  const pesos = Math.floor(centavos / 100);
  const resto = centavos % 100;

  // Recorremos los dígitos de derecha a izquierda y ponemos un punto cada 3.
  const digitos = String(pesos);
  let conPuntos = '';
  for (let i = 0; i < digitos.length; i++) {
    const posicionDesdeLaDerecha = digitos.length - i;
    conPuntos += digitos[i];
    if (posicionDesdeLaDerecha > 1 && posicionDesdeLaDerecha % 3 === 1) {
      conPuntos += '.';
    }
  }

  return `$ ${conPuntos},${dosDigitos(resto)}`;
}

// "1500,50" o "1500.50" → 150050
// Se multiplica por 100 y se redondea porque, por ejemplo, 1.1 * 100 da 110.00000000000001.
// Si el texto no es un número devuelve NaN (la validación lo revisa antes de guardar).
export function textoACentavos(texto: string): number {
  const conPunto = texto.trim().replace(',', '.');
  return Math.round(Number(conPunto) * 100);
}

// 150050 → "1500,50" (para completar el formulario al editar)
export function centavosATexto(centavos: number): string {
  const pesos = Math.floor(centavos / 100);
  return `${pesos},${dosDigitos(centavos % 100)}`;
}

// "2026-10-23" → "23/10/2026"
export function fechaAMostrar(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

// "23/10/2026" → "2026-10-23"
export function fechaAGuardar(fecha: string): string {
  const [dia, mes, anio] = fecha.trim().split('/');
  return `${anio}-${mes}-${dia}`;
}

// Un Date de JavaScript → "AAAA-MM-DD", usando la hora local del teléfono.
// Se arma a mano (y no con toISOString) porque toISOString usa la hora de Greenwich:
// a las 22 h en Argentina ya diría que es el día siguiente.
export function fechaATexto(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = dosDigitos(fecha.getMonth() + 1); // getMonth() empieza en 0 (enero = 0)
  const dia = dosDigitos(fecha.getDate());
  return `${anio}-${mes}-${dia}`;
}

// Fecha de hoy según el reloj del teléfono, en formato "AAAA-MM-DD".
export function hoy(): string {
  return fechaATexto(new Date());
}

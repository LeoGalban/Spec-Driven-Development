import { ErroresFormulario, ValoresFormulario } from '../types/gasto';
import { fechaAGuardar, hoy, textoACentavos } from './formato';

// Validación del formulario de gasto (FR-006). Función pura: recibe lo que escribió el usuario
// y devuelve un mensaje por cada campo con error. Si devuelve {} se puede guardar.
// Cada campo muestra un solo mensaje: el de la primera regla que no cumple.

const MONTO_MAXIMO_CENTAVOS = 10_000_000 * 100; // $ 10.000.000

// Un número con signo opcional y, si tiene decimales, separados por coma o punto: "1500", "1500,5", "-3.25"
const FORMATO_NUMERO = /^-?\d+([.,]\d+)?$/;

// Dos dígitos / dos dígitos / cuatro dígitos: "23/10/2026"
const FORMATO_FECHA = /^\d{2}\/\d{2}\/\d{4}$/;

export function validarGasto(valores: ValoresFormulario): ErroresFormulario {
  const errores: ErroresFormulario = {};

  const descripcion = validarDescripcion(valores.descripcion);
  if (descripcion) errores.descripcion = descripcion;

  const monto = validarMonto(valores.monto);
  if (monto) errores.monto = monto;

  if (valores.categoria === null) errores.categoria = 'Elegí una categoría';

  const fecha = validarFecha(valores.fecha);
  if (fecha) errores.fecha = fecha;

  if (valores.nota.length > 200) errores.nota = 'La nota puede tener hasta 200 caracteres';

  return errores;
}

// Cada función devuelve el mensaje de error, o null si el campo está bien.

function validarDescripcion(texto: string): string | null {
  const limpio = texto.trim(); // los espacios al inicio y al final no cuentan
  if (limpio === '') return 'Escribí una descripción';
  if (limpio.length < 3 || limpio.length > 50) {
    return 'La descripción debe tener entre 3 y 50 caracteres';
  }
  return null;
}

function validarMonto(texto: string): string | null {
  const limpio = texto.trim();
  if (limpio === '') return 'Escribí el monto';
  if (!FORMATO_NUMERO.test(limpio)) return 'El monto debe ser un número';

  const centavos = textoACentavos(limpio);
  if (centavos <= 0) return 'El monto debe ser mayor a 0';

  // Lo que viene después de la coma o el punto ("" si no tiene decimales).
  const decimales = limpio.split(/[.,]/)[1] ?? '';
  if (decimales.length > 2) return 'Usá como máximo 2 decimales';

  if (centavos > MONTO_MAXIMO_CENTAVOS) return 'El monto máximo es $ 10.000.000';
  return null;
}

function validarFecha(texto: string): string | null {
  const limpio = texto.trim();
  if (limpio === '') return 'Escribí la fecha';
  if (!FORMATO_FECHA.test(limpio)) return 'Usá el formato DD/MM/AAAA';

  // Para saber si la fecha existe, se la da a Date y se mira si cambió:
  // new Date(2026, 1, 31) (31 de febrero) se convierte solo en 3 de marzo.
  const [dia, mes, anio] = limpio.split('/').map(Number);
  const fecha = new Date(anio, mes - 1, dia); // en Date los meses empiezan en 0
  const existe =
    fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
  if (!existe) return 'Esa fecha no existe';

  // Las fechas "AAAA-MM-DD" se pueden comparar como texto.
  if (fechaAGuardar(limpio) > hoy()) return 'La fecha no puede ser futura';
  return null;
}

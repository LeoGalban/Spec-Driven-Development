import AsyncStorage from '@react-native-async-storage/async-storage';

import { DatosGasto, Gasto } from '../types/gasto';
import { crearDatosEjemplo } from './datosEjemplo';
import { esperar, simularError } from './simulacion';

// Servicio de gastos: simula un servidor que guarda los gastos (ver
// specs/001-gestor-gastos/contracts/servicio-gastos.md).
// En realidad los datos quedan en el teléfono con AsyncStorage, pero cada función tarda
// entre 0,5 y 1 segundo y puede fallar, como un servidor de verdad.
// Las pantallas usan SOLO estas funciones: si mañana hay un backend real, se cambia este
// archivo y las pantallas quedan iguales.

// Clave donde se guarda la lista completa de gastos, como texto JSON.
const CLAVE = 'gastos';

// Lee la lista guardada. Si la clave no existe es la primera vez que se abre la app:
// se guardan y devuelven los datos de ejemplo. Si existe (aunque sea "[]"), se respeta.
async function leerGastos(): Promise<Gasto[]> {
  const texto = await AsyncStorage.getItem(CLAVE);
  if (texto === null) {
    const ejemplos = crearDatosEjemplo();
    await guardarGastos(ejemplos);
    return ejemplos;
  }
  return JSON.parse(texto);
}

async function guardarGastos(gastos: Gasto[]): Promise<void> {
  await AsyncStorage.setItem(CLAVE, JSON.stringify(gastos));
}

// Todos los gastos, del más reciente al más antiguo (FR-001).
// Las fechas "AAAA-MM-DD" se pueden comparar como texto: "2026-10-23" > "2026-09-30".
export async function obtenerGastos(): Promise<Gasto[]> {
  await esperar();
  simularError();
  const gastos = await leerGastos();
  return gastos.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

// Un gasto por su id, o null si no existe (por ejemplo, si fue eliminado).
export async function obtenerGasto(id: string): Promise<Gasto | null> {
  await esperar();
  simularError();
  const gastos = await leerGastos();
  return gastos.find((gasto) => gasto.id === id) ?? null;
}

// Crea un gasto nuevo y lo devuelve con su id.
export async function crearGasto(datos: DatosGasto): Promise<Gasto> {
  await esperar();
  simularError();
  const gastos = await leerGastos();
  // Date.now() son los milisegundos desde 1970: no se repite entre dos gastos creados a mano.
  const nuevo: Gasto = { id: Date.now().toString(), ...datos };
  // Se agrega al principio: entre gastos de la misma fecha, el más nuevo queda primero.
  await guardarGastos([nuevo, ...gastos]);
  return nuevo;
}

// Reemplaza los datos de un gasto existente.
export async function actualizarGasto(id: string, datos: DatosGasto): Promise<Gasto> {
  await esperar();
  simularError();
  const gastos = await leerGastos();
  const posicion = gastos.findIndex((gasto) => gasto.id === id);
  if (posicion === -1) {
    throw new Error('No se encontró el gasto');
  }
  const actualizado: Gasto = { id, ...datos };
  gastos[posicion] = actualizado;
  await guardarGastos(gastos);
  return actualizado;
}

// Elimina un gasto. Si no existe, no hace nada.
export async function eliminarGasto(id: string): Promise<void> {
  await esperar();
  simularError();
  const gastos = await leerGastos();
  await guardarGastos(gastos.filter((gasto) => gasto.id !== id));
}

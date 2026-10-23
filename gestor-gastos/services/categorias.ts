import AsyncStorage from '@react-native-async-storage/async-storage';

import { CATEGORIAS_FIJAS } from '../constants/tema';
import { EstiloCategoria, InfoCategoria } from '../types/gasto';
import { validarCategoria } from '../utils/validacion';
import { esperar, simularError } from './simulacion';

// Servicio de categorías: simula un servidor, igual que services/gastos.ts (ver
// specs/001-gestor-gastos/contracts/servicio-gastos.md). Las 6 categorías fijas viven en el
// código (constants/tema.ts); acá solo se guardan las que crea el usuario (FR-016).

// Clave donde se guardan las categorías creadas, como texto JSON.
const CLAVE = 'categorias';

// Lo que se guarda de cada categoría creada (propia siempre es true, por eso no se guarda).
type CategoriaGuardada = EstiloCategoria & { nombre: string };

async function leerPropias(): Promise<InfoCategoria[]> {
  const texto = await AsyncStorage.getItem(CLAVE);
  if (texto === null) return []; // todavía no creó ninguna
  const guardadas: CategoriaGuardada[] = JSON.parse(texto);
  return guardadas.map((categoria) => ({ ...categoria, propia: true }));
}

// Todas las categorías: primero las 6 fijas y después las creadas, en el orden en que se crearon.
export async function obtenerCategorias(): Promise<InfoCategoria[]> {
  await esperar();
  simularError();
  return [...CATEGORIAS_FIJAS, ...(await leerPropias())];
}

// Crea una categoría y la devuelve. Si el nombre no es válido o ya existe, rechaza con el mismo
// mensaje que muestra el formulario.
export async function crearCategoria(datos: CategoriaGuardada): Promise<InfoCategoria> {
  await esperar();
  simularError();
  const propias = await leerPropias();
  const error = validarCategoria(datos.nombre, [...CATEGORIAS_FIJAS, ...propias]);
  if (error) {
    throw new Error(error);
  }
  const nueva: CategoriaGuardada = { ...datos, nombre: datos.nombre.trim() };
  // Se guarda al final: así la lista mantiene el orden en que se crearon.
  const guardadas: CategoriaGuardada[] = [
    ...propias.map(({ nombre, icono, color }) => ({ nombre, icono, color })),
    nueva,
  ];
  await AsyncStorage.setItem(CLAVE, JSON.stringify(guardadas));
  return { ...nueva, propia: true };
}

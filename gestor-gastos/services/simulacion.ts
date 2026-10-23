// Simula el comportamiento de un servidor real: tarda en responder y a veces falla.
// Así las pantallas tienen que mostrar los estados de carga y de error (FR-003, FR-013).

// Probabilidad de que una operación falle: 0 = nunca, 1 = siempre.
// Para mostrar el estado de error en la demo: cambiar a 1, guardar, y volver a 0 al terminar.
export const PROBABILIDAD_ERROR = 1;

// Espera un tiempo al azar entre 500 y 1000 ms, como si los datos viajaran por internet.
export function esperar(): Promise<void> {
  const milisegundos = 500 + Math.random() * 500;
  return new Promise((resolver) => setTimeout(resolver, milisegundos));
}

// Lanza un error según PROBABILIDAD_ERROR, como si el servidor no respondiera.
export function simularError(): void {
  if (Math.random() < PROBABILIDAD_ERROR) {
    throw new Error('No se pudieron cargar los datos');
  }
}

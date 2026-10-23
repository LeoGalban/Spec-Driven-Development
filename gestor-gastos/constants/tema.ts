import type { NombreIcono } from '../components/Icono';
import { CATEGORIAS, EstiloCategoria, InfoCategoria } from '../types/gasto';

// Sistema de diseño de la app (FR-015). Todos los colores, fuentes, tamaños e íconos salen de
// acá: así la app se ve consistente y, si se quiere cambiar algo, se cambia en un solo lugar.
//
// Paleta inspirada en el logo (la alcancía con el billete):
// - verde bosque para la tarjeta principal y los botones (serio, "de finanzas"),
// - verde lima (el billete) para la acción más importante: "Agregar gasto",
// - rosa (la alcancía) solo para detalles: porcentajes y "Eliminar".
// Todos los pares de texto y fondo cumplen el contraste mínimo 4,5 a 1 (norma WCAG).
export const COLORES = {
  bosque: '#1B4332', // verde oscuro: tarjeta principal, botones, pestaña activa
  bosqueClaro: '#2D6A4F', // para el degradado y detalles
  lima: '#9BE15D', // verde del billete: botón "Agregar gasto" y detalles sobre el bosque
  limaSuave: '#EAF7DD', // fondo clarito verde (atajos, fila tocada)
  rosa: '#D93650', // rosa de la alcancía: "Eliminar" y acentos
  rosaTexto: '#C02A43', // rosa para textos sobre rosaSuave
  rosaSuave: '#FDE8EB',
  fondo: '#F6F6F1', // blanco cálido de fondo
  superficie: '#FFFFFF', // tarjetas y campos
  texto: '#14231A', // casi negro verdoso
  textoSecundario: '#646E61',
  borde: '#E7E9E2',
  error: '#C62828',
  errorSuave: '#FDECEC',
};

// Una sola tipografía, Outfit (Google Fonts): geométrica, moderna y con números muy prolijos.
// Se carga en app/_layout.tsx. Con fuentes propias el grosor se elige con la familia.
export const FUENTES = {
  regular: 'Outfit_400Regular',
  media: 'Outfit_500Medium',
  seminegrita: 'Outfit_600SemiBold',
  negrita: 'Outfit_700Bold',
};

// Radios de las esquinas, para que todas las tarjetas y botones se vean de la misma familia.
export const RADIO = {
  chico: 12,
  medio: 18,
  grande: 28,
};

// Sombra suave para las tarjetas blancas. boxShadow funciona igual en iPhone y Android.
export const SOMBRA = {
  boxShadow: '0px 6px 20px rgba(20, 35, 26, 0.06)',
};

// Fondo de la tarjeta principal: degradado verde bosque. React Native 0.88 entiende degradados
// de CSS en backgroundImage, sin librerías. backgroundColor queda por si no se pudiera dibujar.
export const FONDO_PRINCIPAL = {
  backgroundColor: COLORES.bosque,
  backgroundImage: 'linear-gradient(145deg, #1B4332 0%, #2D6A4F 100%)',
};

// Ícono y color de cada categoría. El ícono tiene un nombre para iPhone (SF Symbols) y otro
// para Android (Material Symbols), porque cada sistema tiene su propia colección.
export const ESTILO_CATEGORIA: Record<string, EstiloCategoria> = {
  Comida: { icono: { ios: 'fork.knife', android: 'restaurant' }, color: '#E8890C' },
  Transporte: { icono: { ios: 'bus.fill', android: 'directions_bus' }, color: '#2F6FDB' },
  Hogar: { icono: { ios: 'house.fill', android: 'home' }, color: '#D93650' },
  Salud: { icono: { ios: 'cross.case.fill', android: 'medical_services' }, color: '#0E9384' },
  Ocio: { icono: { ios: 'popcorn.fill', android: 'movie' }, color: '#7A4FD8' },
  Otros: { icono: { ios: 'shippingbox.fill', android: 'inventory_2' }, color: '#5D6B7A' },
};

// Las 6 categorías fijas como InfoCategoria, en el orden de CATEGORIAS (FR-007).
export const CATEGORIAS_FIJAS: InfoCategoria[] = CATEGORIAS.map((nombre) => ({
  nombre,
  ...ESTILO_CATEGORIA[nombre],
  propia: false,
}));

// Opciones para las categorías que crea el usuario (FR-016): 6 colores y 8 íconos.
export const COLORES_CATEGORIA = ['#0E9384', '#2F6FDB', '#7A4FD8', '#D93650', '#E8890C', '#4A8516'];

export const ICONOS_CATEGORIA: NombreIcono[] = [
  { ios: 'pawprint.fill', android: 'pets' },
  { ios: 'graduationcap.fill', android: 'school' },
  { ios: 'gift.fill', android: 'redeem' },
  { ios: 'tshirt.fill', android: 'checkroom' },
  { ios: 'dumbbell.fill', android: 'fitness_center' },
  { ios: 'car.fill', android: 'directions_car' },
  { ios: 'cart.fill', android: 'shopping_cart' },
  { ios: 'heart.fill', android: 'favorite' },
];

// Estilo para una categoría que no se encuentra (por ejemplo, si se borraran los datos).
const ESTILO_GENERICO: EstiloCategoria = {
  icono: { ios: 'tag.fill', android: 'sell' },
  color: '#5D6B7A',
};

// Busca el ícono y el color de una categoría por su nombre, entre las fijas y las creadas.
export function estiloDeCategoria(nombre: string, categorias: InfoCategoria[]): EstiloCategoria {
  return categorias.find((categoria) => categoria.nombre === nombre) ?? ESTILO_GENERICO;
}

// Agrega transparencia a un color "#RRGGBB": colorSuave('#E8890C') → '#E8890C1F'.
// Los dos últimos dígitos son la opacidad en hexadecimal (1F ≈ 12 %).
export function colorSuave(color: string): string {
  return `${color}1F`;
}

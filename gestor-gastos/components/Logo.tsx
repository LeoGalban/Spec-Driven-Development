import { Image } from 'react-native';

type Props = {
  tamanio?: number; // alto en píxeles; el ancho se calcula para no deformarlo
};

// Proporción del dibujo (ancho / alto) de assets/logo.png: 545 × 600.
const PROPORCION = 545 / 600;

// Logo de la app: la alcancía (FR-015). Es la misma imagen del ícono, con fondo transparente.
export default function Logo({ tamanio = 32 }: Props) {
  return (
    <Image
      source={require('../assets/logo.png')}
      style={{ width: tamanio * PROPORCION, height: tamanio }}
      resizeMode="contain"
      accessibilityLabel="Logo de Gestor de Gastos"
    />
  );
}

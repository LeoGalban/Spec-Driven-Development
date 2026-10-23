import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { ColorValue } from 'react-native';

// Nombre de un ícono en cada sistema: { ios: 'house.fill', android: 'home' }.
export type NombreIcono = Exclude<SymbolViewProps['name'], string>;

type Props = {
  nombre: NombreIcono;
  tamanio?: number;
  color?: ColorValue;
};

// Ícono del sistema (FR-015): en iPhone usa SF Symbols y en Android Material Symbols,
// con expo-symbols (librería oficial de Expo, incluida en Expo Go).
export default function Icono({ nombre, tamanio = 22, color }: Props) {
  return <SymbolView name={nombre} size={tamanio} tintColor={color} />;
}

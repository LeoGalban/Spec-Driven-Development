import { StyleSheet, View } from 'react-native';

import { colorSuave, ESTILO_CATEGORIA } from '../constants/tema';
import { Categoria } from '../types/gasto';
import Icono from './Icono';

type Props = {
  categoria: Categoria;
  tamanio?: number; // diámetro del círculo; por defecto 40
};

// Ícono de la categoría dentro de un círculo de su color suave. Se usa en la lista, el detalle
// y el resumen, así cada categoría se reconoce igual en toda la app.
export default function IconoCategoria({ categoria, tamanio = 40 }: Props) {
  const { icono, color } = ESTILO_CATEGORIA[categoria];
  return (
    <View
      style={[
        styles.circulo,
        {
          width: tamanio,
          height: tamanio,
          borderRadius: tamanio / 2, // la mitad del ancho hace un círculo perfecto
          backgroundColor: colorSuave(color),
        },
      ]}
    >
      <Icono nombre={icono} tamanio={tamanio * 0.45} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

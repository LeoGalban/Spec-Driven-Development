import { StyleSheet, View } from 'react-native';

import { colorSuave } from '../constants/tema';
import { EstiloCategoria } from '../types/gasto';
import Icono from './Icono';

type Props = {
  estilo: EstiloCategoria; // ícono y color de la categoría (ver estiloDeCategoria en el tema)
  tamanio?: number; // diámetro del círculo; por defecto 40
};

// Ícono de una categoría dentro de un círculo de su color suave. Se usa en la lista, el detalle,
// el resumen y la pantalla "Nueva categoría", así cada categoría se reconoce igual en toda la app.
export default function IconoCategoria({ estilo, tamanio = 40 }: Props) {
  return (
    <View
      style={[
        styles.circulo,
        {
          width: tamanio,
          height: tamanio,
          borderRadius: tamanio / 2, // la mitad del ancho hace un círculo perfecto
          backgroundColor: colorSuave(estilo.color),
        },
      ]}
    >
      <Icono nombre={estilo.icono} tamanio={tamanio * 0.45} color={estilo.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

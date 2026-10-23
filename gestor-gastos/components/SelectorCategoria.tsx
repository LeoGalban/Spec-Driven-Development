import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORES, colorSuave, FUENTES, RADIO } from '../constants/tema';
import { Categoria, InfoCategoria } from '../types/gasto';
import Icono from './Icono';

type Props = {
  categorias: InfoCategoria[]; // las 6 fijas y las creadas por el usuario
  valor: Categoria | null; // la categoría elegida, o null si todavía no eligió
  alCambiar: (categoria: Categoria) => void;
  alCrear: () => void; // qué hacer al tocar "Nueva" (abrir la pantalla Nueva categoría)
};

// Las categorías en una cuadrícula de 3 columnas, con su ícono, y al final el mosaico "Nueva"
// para crear otra (FR-016). La elegida se marca con el borde y el fondo de su color.
// No guarda estado propio: la categoría elegida la guarda la pantalla del formulario.
export default function SelectorCategoria({ categorias, valor, alCambiar, alCrear }: Props) {
  return (
    <View style={styles.cuadricula}>
      {categorias.map(({ nombre, icono, color }) => {
        const elegida = nombre === valor;
        return (
          <Pressable
            key={nombre}
            onPress={() => alCambiar(nombre)}
            accessibilityRole="button"
            accessibilityLabel={nombre}
            accessibilityState={{ selected: elegida }} // VoiceOver dice "seleccionado"
            style={({ pressed }) => [
              styles.mosaico,
              elegida && { borderColor: color, backgroundColor: colorSuave(color) },
              pressed && styles.presionado,
            ]}
          >
            <Icono nombre={icono} tamanio={22} color={color} />
            <Text
              style={[styles.texto, elegida && { color: COLORES.texto }]}
              numberOfLines={1} // un nombre largo se corta con "…" en vez de agrandar el mosaico
            >
              {nombre}
            </Text>
          </Pressable>
        );
      })}

      {/* Mosaico para crear una categoría nueva, con borde punteado */}
      <Pressable
        onPress={alCrear}
        accessibilityRole="button"
        accessibilityLabel="Nueva categoría"
        style={({ pressed }) => [styles.mosaico, styles.nueva, pressed && styles.presionado]}
      >
        <Icono nombre={{ ios: 'plus', android: 'add' }} tamanio={22} color={COLORES.bosque} />
        <Text style={[styles.texto, styles.textoNueva]}>Nueva</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cuadricula: {
    flexDirection: 'row',
    flexWrap: 'wrap', // tres por fila; las demás siguen abajo
    gap: 8,
  },
  mosaico: {
    width: '31.8%',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: RADIO.medio,
    borderWidth: 1.5,
    borderColor: 'transparent', // ocupa su lugar aunque no se vea: así nada "salta" al elegir
    backgroundColor: COLORES.superficie,
  },
  nueva: {
    backgroundColor: 'transparent',
    borderColor: COLORES.bosqueClaro,
    borderStyle: 'dashed',
  },
  presionado: {
    transform: [{ scale: 0.96 }],
  },
  texto: {
    fontSize: 13,
    fontFamily: FUENTES.media,
    color: COLORES.textoSecundario,
  },
  textoNueva: {
    color: COLORES.bosque,
  },
});

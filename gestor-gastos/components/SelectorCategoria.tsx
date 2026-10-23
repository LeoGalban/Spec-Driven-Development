import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORES, colorSuave, ESTILO_CATEGORIA, FUENTES, RADIO } from '../constants/tema';
import { CATEGORIAS, Categoria } from '../types/gasto';
import Icono from './Icono';

type Props = {
  valor: Categoria | null; // la categoría elegida, o null si todavía no eligió
  alCambiar: (categoria: Categoria) => void;
};

// Las 6 categorías fijas (FR-007) en una cuadrícula de 3 columnas, con su ícono.
// La elegida se marca con el borde y el fondo del color de su categoría.
// No guarda estado propio: la categoría elegida la guarda la pantalla del formulario.
export default function SelectorCategoria({ valor, alCambiar }: Props) {
  return (
    <View style={styles.cuadricula}>
      {CATEGORIAS.map((categoria) => {
        const elegida = categoria === valor;
        const { icono, color } = ESTILO_CATEGORIA[categoria];
        return (
          <Pressable
            key={categoria}
            onPress={() => alCambiar(categoria)}
            accessibilityRole="button"
            accessibilityLabel={categoria}
            accessibilityState={{ selected: elegida }} // VoiceOver dice "seleccionado"
            style={({ pressed }) => [
              styles.mosaico,
              elegida && { borderColor: color, backgroundColor: colorSuave(color) },
              pressed && styles.presionado,
            ]}
          >
            <Icono nombre={icono} tamanio={22} color={color} />
            <Text style={[styles.texto, elegida && { color: COLORES.texto }]}>{categoria}</Text>
          </Pressable>
        );
      })}
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
    borderRadius: RADIO.medio,
    borderWidth: 1.5,
    borderColor: 'transparent', // ocupa su lugar aunque no se vea: así nada "salta" al elegir
    backgroundColor: COLORES.superficie,
  },
  presionado: {
    transform: [{ scale: 0.96 }],
  },
  texto: {
    fontSize: 13,
    fontFamily: FUENTES.media,
    color: COLORES.textoSecundario,
  },
});

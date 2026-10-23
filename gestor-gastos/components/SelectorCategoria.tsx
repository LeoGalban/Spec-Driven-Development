import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORIAS, Categoria } from '../types/gasto';

type Props = {
  valor: Categoria | null; // la categoría elegida, o null si todavía no eligió
  alCambiar: (categoria: Categoria) => void;
};

// Un botón por cada una de las 6 categorías fijas (FR-007). El elegido se resalta en azul.
// No guarda estado propio: la categoría elegida la guarda la pantalla del formulario.
export default function SelectorCategoria({ valor, alCambiar }: Props) {
  return (
    <View style={styles.contenedor}>
      {CATEGORIAS.map((categoria) => {
        const elegida = categoria === valor;
        return (
          <Pressable
            key={categoria}
            onPress={() => alCambiar(categoria)}
            style={[styles.boton, elegida && styles.botonElegido]}
          >
            <Text style={[styles.texto, elegida && styles.textoElegido]}>{categoria}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    flexWrap: 'wrap', // si no entran en una fila, siguen en la de abajo
    gap: 8,
  },
  boton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  botonElegido: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  texto: {
    fontSize: 15,
    color: '#222',
  },
  textoElegido: {
    color: '#fff',
    fontWeight: '600',
  },
});

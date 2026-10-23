import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  mensaje: string;
  textoBoton?: string; // el botón es opcional: solo se muestra si se pasan
  alPresionar?: () => void; // textoBoton y alPresionar
};

// Estado vacío: no hay datos para mostrar y se explica qué hacer (FR-003).
export default function MensajeVacio({ mensaje, textoBoton, alPresionar }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.mensaje}>{mensaje}</Text>
      {textoBoton && alPresionar && (
        <Pressable style={styles.boton} onPress={alPresionar}>
          <Text style={styles.textoBoton}>{textoBoton}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mensaje: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  boton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

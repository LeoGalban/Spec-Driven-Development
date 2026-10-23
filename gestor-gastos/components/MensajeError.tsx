import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  mensaje: string;
  alReintentar: () => void; // vuelve a pedir los datos al servicio
};

// Estado de error: el servicio falló y se ofrece volver a intentar (FR-003).
export default function MensajeError({ mensaje, alReintentar }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Algo salió mal</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
      <Pressable style={styles.boton} onPress={alReintentar}>
        <Text style={styles.textoBoton}>Reintentar</Text>
      </Pressable>
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
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C62828',
  },
  mensaje: {
    marginTop: 8,
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

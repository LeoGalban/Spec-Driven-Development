import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type Props = {
  texto?: string; // opcional: si no se pasa, dice "Cargando…"
};

// Estado de carga: se muestra mientras se esperan los datos del servicio (FR-003).
export default function Cargando({ texto = 'Cargando…' }: Props) {
  return (
    <View style={styles.contenedor}>
      <ActivityIndicator size="large" />
      <Text style={styles.texto}>{texto}</Text>
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
  texto: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
});

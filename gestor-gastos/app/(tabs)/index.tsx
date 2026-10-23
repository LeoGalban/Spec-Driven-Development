import { StyleSheet, Text, View } from 'react-native';

// Pantalla 1: lista de gastos. Por ahora solo muestra su nombre.
export default function PantallaGastos() {
  return (
    <View style={styles.contenedor}>
      <Text>Gastos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

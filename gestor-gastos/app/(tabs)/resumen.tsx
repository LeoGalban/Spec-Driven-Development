import { StyleSheet, Text, View } from 'react-native';

// Pantalla 4: resumen del mes por categoría. Por ahora solo muestra su nombre.
export default function PantallaResumen() {
  return (
    <View style={styles.contenedor}>
      <Text>Resumen</Text>
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

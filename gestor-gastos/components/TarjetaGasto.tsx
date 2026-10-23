import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Gasto } from '../types/gasto';
import { fechaAMostrar, formatearPesos } from '../utils/formato';

type Props = {
  gasto: Gasto;
  alPresionar: () => void;
};

// Una fila de la lista de gastos: descripción, categoría, fecha y monto (Historia 1).
export default function TarjetaGasto({ gasto, alPresionar }: Props) {
  return (
    <Pressable
      onPress={alPresionar}
      // Mientras se mantiene apretada, la tarjeta se ve un poco más transparente.
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
    >
      <View style={styles.izquierda}>
        <Text style={styles.descripcion} numberOfLines={1}>
          {gasto.descripcion}
        </Text>
        <Text style={styles.detalle}>
          {gasto.categoria} · {fechaAMostrar(gasto.fecha)}
        </Text>
      </View>
      <Text style={styles.monto}>{formatearPesos(gasto.montoCentavos)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row', // izquierda y monto uno al lado del otro
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  presionada: {
    opacity: 0.6,
  },
  izquierda: {
    flex: 1, // ocupa todo el espacio que deja libre el monto
    marginRight: 12,
  },
  descripcion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  detalle: {
    marginTop: 2,
    fontSize: 14,
    color: '#777',
  },
  monto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
});

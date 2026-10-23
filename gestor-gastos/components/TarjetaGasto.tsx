import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORES, FUENTES, RADIO } from '../constants/tema';
import { Gasto } from '../types/gasto';
import { formatearPesos } from '../utils/formato';
import IconoCategoria from './IconoCategoria';

type Props = {
  gasto: Gasto;
  alPresionar: () => void;
  primero: boolean; // primer gasto del día: lleva las esquinas de arriba redondeadas
  ultimo: boolean; // último gasto del día: esquinas de abajo redondeadas y sin línea abajo
};

// Una fila de la lista de gastos: ícono, descripción, categoría y monto (Historia 1).
// Los gastos de un mismo día se ven juntos, como una sola tarjeta separada por líneas finas.
// La fecha no va acá porque la lista la muestra en el título de cada día.
export default function TarjetaGasto({ gasto, alPresionar, primero, ultimo }: Props) {
  return (
    <Pressable
      onPress={alPresionar}
      // VoiceOver lee la fila entera como un botón: "Supermercado, Comida, $ 45.350,00".
      accessibilityRole="button"
      accessibilityLabel={`${gasto.descripcion}, ${gasto.categoria}, ${formatearPesos(gasto.montoCentavos)}`}
      accessibilityHint="Abre el detalle del gasto"
      style={({ pressed }) => [
        styles.fila,
        primero && styles.primero,
        ultimo && styles.ultimo,
        pressed && styles.presionada, // al tocarla se tiñe de verde clarito
      ]}
    >
      <IconoCategoria categoria={gasto.categoria} />
      <View style={[styles.centro, !ultimo && styles.conLinea]}>
        <View style={styles.textos}>
          <Text style={styles.descripcion} numberOfLines={1}>
            {gasto.descripcion}
          </Text>
          <Text style={styles.detalle} numberOfLines={1}>
            {gasto.nota !== '' ? `${gasto.categoria} · ${gasto.nota}` : gasto.categoria}
          </Text>
        </View>
        <Text style={styles.monto}>{formatearPesos(gasto.montoCentavos)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row', // ícono a la izquierda; textos y monto a la derecha
    alignItems: 'center',
    backgroundColor: COLORES.superficie,
    paddingLeft: 14,
    marginHorizontal: 16,
  },
  primero: {
    borderTopLeftRadius: RADIO.medio,
    borderTopRightRadius: RADIO.medio,
    paddingTop: 2,
  },
  ultimo: {
    borderBottomLeftRadius: RADIO.medio,
    borderBottomRightRadius: RADIO.medio,
    paddingBottom: 2,
  },
  presionada: {
    backgroundColor: COLORES.limaSuave,
  },
  // La línea fina va debajo de los textos (no debajo del ícono), como en las listas de iPhone.
  centro: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    paddingRight: 14,
    paddingVertical: 12,
  },
  conLinea: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORES.borde,
  },
  textos: {
    flex: 1, // ocupa todo el espacio que deja libre el monto
    marginRight: 10,
  },
  descripcion: {
    fontSize: 15,
    fontFamily: FUENTES.media,
    color: COLORES.texto,
  },
  detalle: {
    marginTop: 1,
    fontSize: 12,
    fontFamily: FUENTES.regular,
    color: COLORES.textoSecundario,
  },
  monto: {
    fontSize: 15,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.texto,
  },
});

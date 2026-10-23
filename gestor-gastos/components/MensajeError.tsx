import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORES, FUENTES, RADIO } from '../constants/tema';
import Icono from './Icono';

type Props = {
  mensaje: string;
  alReintentar: () => void; // vuelve a pedir los datos al servicio
};

// Estado de error: el servicio falló y se ofrece volver a intentar (FR-003).
export default function MensajeError({ mensaje, alReintentar }: Props) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.circulo}>
        <Icono
          nombre={{ ios: 'wifi.exclamationmark', android: 'wifi_off' }}
          tamanio={30}
          color={COLORES.rosa}
        />
      </View>
      <Text style={styles.titulo}>Algo salió mal</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
      <Pressable
        onPress={alReintentar}
        accessibilityRole="button"
        style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
      >
        <Icono nombre={{ ios: 'arrow.clockwise', android: 'refresh' }} tamanio={16} color="#fff" />
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
    backgroundColor: COLORES.fondo,
  },
  circulo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORES.rosaSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  titulo: {
    fontSize: 20,
    fontFamily: FUENTES.negrita,
    color: COLORES.texto,
  },
  mensaje: {
    marginTop: 6,
    fontSize: 15,
    fontFamily: FUENTES.regular,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  boton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORES.bosque,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: RADIO.grande,
  },
  presionado: {
    transform: [{ scale: 0.96 }],
  },
  textoBoton: {
    color: '#fff',
    fontSize: 15,
    fontFamily: FUENTES.seminegrita,
  },
});

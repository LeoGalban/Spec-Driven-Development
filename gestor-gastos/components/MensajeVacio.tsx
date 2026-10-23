import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORES, FUENTES, RADIO } from '../constants/tema';
import Icono from './Icono';
import Logo from './Logo';

type Props = {
  mensaje: string;
  textoBoton?: string; // el botón es opcional: solo se muestra si se pasan
  alPresionar?: () => void; // textoBoton y alPresionar
};

// Estado vacío: no hay datos para mostrar y se explica qué hacer (FR-003).
export default function MensajeVacio({ mensaje, textoBoton, alPresionar }: Props) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.circulo}>
        <Logo tamanio={64} />
      </View>
      <Text style={styles.mensaje}>{mensaje}</Text>
      {textoBoton && alPresionar && (
        <Pressable
          onPress={alPresionar}
          accessibilityRole="button"
          style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
        >
          <Icono nombre={{ ios: 'plus', android: 'add' }} tamanio={16} color={COLORES.bosque} />
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
    backgroundColor: COLORES.fondo,
  },
  circulo: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORES.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    boxShadow: '0px 6px 20px rgba(20, 35, 26, 0.06)',
  },
  mensaje: {
    fontSize: 17,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.texto,
    textAlign: 'center',
  },
  boton: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORES.lima,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: RADIO.grande,
  },
  presionado: {
    transform: [{ scale: 0.96 }],
  },
  textoBoton: {
    color: COLORES.bosque,
    fontSize: 15,
    fontFamily: FUENTES.seminegrita,
  },
});

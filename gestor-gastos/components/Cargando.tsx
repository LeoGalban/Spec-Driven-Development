import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';

import { COLORES, FUENTES } from '../constants/tema';

type Props = {
  texto?: string; // opcional: si no se pasa, dice "Cargando…"
};

// Estado de carga (FR-003): el texto "Cargando…" y, debajo, tarjetas grises "fantasma" con la
// forma del contenido que va a aparecer. Así la pantalla no queda vacía y la espera se siente
// más corta.
export default function Cargando({ texto = 'Cargando…' }: Props) {
  // Opacidad que va y viene entre 0,4 y 1 para que las tarjetas "respiren".
  const opacidad = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidad, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacidad, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    animacion.start();
    return () => animacion.stop(); // al salir de la pantalla se frena la animación
  }, [opacidad]);

  return (
    <View
      style={styles.contenedor}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={texto}
    >
      <View style={styles.filaTexto}>
        <ActivityIndicator color={COLORES.bosque} />
        <Text style={styles.texto}>{texto}</Text>
      </View>

      {[0, 1, 2, 3].map((numero) => (
        <Animated.View key={numero} style={[styles.tarjeta, { opacity: opacidad }]}>
          <View style={styles.icono} />
          <View style={styles.lineas}>
            <View style={[styles.linea, { width: '70%' }]} />
            <View style={[styles.linea, { width: '40%' }]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 16,
    paddingTop: 80, // deja aire arriba, donde va el encabezado
    backgroundColor: COLORES.fondo,
  },
  filaTexto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  texto: {
    fontSize: 15,
    fontFamily: FUENTES.media,
    color: COLORES.textoSecundario,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.superficie,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  icono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORES.borde,
  },
  lineas: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
  },
  linea: {
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORES.borde,
  },
});

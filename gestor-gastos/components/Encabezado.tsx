import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORES, FONDO_PRINCIPAL, FUENTES, RADIO } from '../constants/tema';
import Logo from './Logo';

type Props = {
  titulo: string; // título de la pantalla: "Mis gastos", "Resumen"
  etiqueta: string; // texto chico arriba del monto: "Gastaste en octubre"
  monto: string; // el número grande, ya formateado: "$ 127.351,25"
  children?: ReactNode; // lo que va abajo del monto (un botón, un texto)
};

// Encabezado de las pestañas Gastos y Resumen (FR-015): arriba la marca (logo y nombre) y el
// título; abajo una tarjeta verde bosque con el total del mes.
export default function Encabezado({ titulo, etiqueta, monto, children }: Props) {
  // insets.top es el alto de la barra de estado (hora, batería): el contenido empieza debajo.
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.contenedor, { paddingTop: insets.top + 8 }]}>
      <View style={styles.barra}>
        <View style={styles.marca}>
          <View style={styles.circuloLogo}>
            <Logo tamanio={24} />
          </View>
          <Text style={styles.nombreApp}>Gestor de Gastos</Text>
        </View>
      </View>

      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>

      <View style={styles.tarjeta}>
        {/* Dos círculos translúcidos de adorno, en las esquinas de la tarjeta */}
        <View style={[styles.circuloAdorno, styles.adornoArriba]} />
        <View style={[styles.circuloAdorno, styles.adornoAbajo]} />

        <Text style={styles.etiqueta}>{etiqueta}</Text>
        <Text style={styles.monto} numberOfLines={1} adjustsFontSizeToFit>
          {monto}
        </Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingHorizontal: 16,
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  marca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circuloLogo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORES.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(20, 35, 26, 0.08)',
  },
  nombreApp: {
    fontSize: 14,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.bosque,
  },
  titulo: {
    marginTop: 14,
    marginBottom: 14,
    fontSize: 28,
    fontFamily: FUENTES.negrita,
    color: COLORES.texto,
    letterSpacing: -0.5, // las letras grandes se ven mejor un poco más juntas
  },
  tarjeta: {
    ...FONDO_PRINCIPAL,
    borderRadius: RADIO.grande,
    padding: 22,
    overflow: 'hidden', // recorta los círculos de adorno en los bordes redondeados
  },
  circuloAdorno: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: COLORES.lima,
  },
  adornoArriba: {
    width: 160,
    height: 160,
    top: -70,
    right: -40,
    opacity: 0.18,
  },
  adornoAbajo: {
    width: 110,
    height: 110,
    bottom: -60,
    right: 60,
    opacity: 0.1,
  },
  etiqueta: {
    fontSize: 14,
    fontFamily: FUENTES.media,
    color: '#CFE8C4', // verde muy claro: se lee bien sobre el bosque (contraste 8 a 1)
  },
  monto: {
    marginTop: 4,
    fontSize: 36,
    fontFamily: FUENTES.negrita,
    color: '#fff',
    letterSpacing: -1,
  },
});

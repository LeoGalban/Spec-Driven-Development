import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import Cargando from '../../components/Cargando';
import Encabezado from '../../components/Encabezado';
import IconoCategoria from '../../components/IconoCategoria';
import MensajeError from '../../components/MensajeError';
import MensajeVacio from '../../components/MensajeVacio';
import { COLORES, FUENTES, RADIO, SOMBRA } from '../../constants/tema';
import { obtenerGastos } from '../../services/gastos';
import { Gasto } from '../../types/gasto';
import { resumenPorCategoria, totalDelMes } from '../../utils/calculos';
import { formatearPesos, hoy, mesYAnio } from '../../utils/formato';

// Pantalla 4: cuánto se gastó este mes en cada categoría (Historia 5).
// Es una lista con totales y porcentajes: los gráficos quedaron fuera de alcance en la spec.
export default function PantallaResumen() {
  // null = todavía no llegaron los datos (se muestra "Cargando…").
  const [gastos, setGastos] = useState<Gasto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // true mientras se recarga con el gesto de deslizar hacia abajo.
  const [actualizando, setActualizando] = useState(false);

  const cargarGastos = useCallback(async () => {
    setError(null);
    try {
      setGastos(await obtenerGastos());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
  }, []);

  // Deslizar hacia abajo para recargar: muestra la ruedita arriba mientras se piden los datos.
  async function actualizar() {
    setActualizando(true);
    await cargarGastos();
    setActualizando(false);
  }

  // Se recarga cada vez que se abre la pestaña: si se agregó, editó o eliminó un gasto,
  // los totales ya están actualizados (Historia 5, escenario 3).
  useFocusEffect(
    useCallback(() => {
      cargarGastos();
    }, [cargarGastos]),
  );

  if (error) {
    return <MensajeError mensaje={error} alReintentar={cargarGastos} />;
  }
  if (gastos === null) {
    return <Cargando />;
  }

  const resumen = resumenPorCategoria(gastos);
  if (resumen.length === 0) {
    return <MensajeVacio mensaje="No hay gastos este mes" />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contenedor}
      contentInsetAdjustmentBehavior="never"
      refreshControl={
        <RefreshControl
          refreshing={actualizando}
          onRefresh={actualizar}
          tintColor={COLORES.bosque}
          colors={[COLORES.bosque]}
        />
      }
    >
      <Encabezado
        titulo="Resumen"
        etiqueta={`Total de ${mesYAnio(hoy())}`}
        monto={formatearPesos(totalDelMes(gastos))}
      >
        <Text style={styles.detalleTotal}>
          {resumen.length} {resumen.length === 1 ? 'categoría' : 'categorías'} con gastos este mes
        </Text>
      </Encabezado>

      <Text style={styles.tituloSeccion}>Por categoría</Text>
      {/* Una sola tarjeta blanca con una fila por categoría, de mayor a menor */}
      <View style={styles.tarjeta}>
        {resumen.map((fila, indice) => (
          <View
            key={fila.categoria}
            style={[styles.fila, indice < resumen.length - 1 && styles.conLinea]}
            // El lector de pantalla lee la fila entera de una vez.
            accessible
            accessibilityLabel={`${fila.categoria}: ${formatearPesos(fila.totalCentavos)}, ${fila.porcentaje} por ciento del total`}
          >
            <IconoCategoria categoria={fila.categoria} />
            <View style={styles.centro}>
              <Text style={styles.categoria}>{fila.categoria}</Text>
              <Text style={styles.monto}>{formatearPesos(fila.totalCentavos)}</Text>
            </View>
            {/* Porcentaje en una "pastilla" rosa */}
            <Text style={styles.porcentaje}>{fila.porcentaje} %</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingBottom: 24,
  },
  detalleTotal: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: FUENTES.media,
    color: '#CFE8C4', // verde muy claro: se lee bien sobre el bosque
  },
  tituloSeccion: {
    marginTop: 22,
    marginBottom: 8,
    marginHorizontal: 22,
    fontSize: 13,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tarjeta: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.medio,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    ...SOMBRA,
  },
  fila: {
    flexDirection: 'row', // ícono, textos y porcentaje uno al lado del otro
    alignItems: 'center',
    paddingVertical: 12,
  },
  conLinea: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORES.borde,
  },
  centro: {
    flex: 1,
    marginHorizontal: 12,
  },
  categoria: {
    fontSize: 13,
    fontFamily: FUENTES.regular,
    color: COLORES.textoSecundario,
  },
  monto: {
    marginTop: 1,
    fontSize: 16,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.texto,
  },
  porcentaje: {
    fontSize: 13,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.rosaTexto,
    backgroundColor: COLORES.rosaSuave,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIO.chico,
    overflow: 'hidden', // en iPhone, sin esto el fondo del texto no respeta las esquinas
  },
});

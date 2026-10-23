import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import MensajeVacio from '../../components/MensajeVacio';
import { obtenerGastos } from '../../services/gastos';
import { Gasto } from '../../types/gasto';
import { resumenPorCategoria, totalDelMes } from '../../utils/calculos';
import { formatearPesos } from '../../utils/formato';

// Pantalla 4: cuánto se gastó este mes en cada categoría (Historia 5).
// Es una lista con totales y porcentajes: los gráficos quedaron fuera de alcance en la spec.
export default function PantallaResumen() {
  // null = todavía no llegaron los datos (se muestra "Cargando…").
  const [gastos, setGastos] = useState<Gasto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargarGastos = useCallback(async () => {
    setError(null);
    try {
      setGastos(await obtenerGastos());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
  }, []);

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
    <ScrollView contentContainerStyle={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.totalTitulo}>Total de este mes</Text>
        <Text style={styles.totalMonto}>{formatearPesos(totalDelMes(gastos))}</Text>
      </View>

      <View style={styles.tarjeta}>
        {resumen.map((fila) => (
          <View key={fila.categoria} style={styles.fila}>
            <Text style={styles.categoria}>{fila.categoria}</Text>
            <View style={styles.derecha}>
              <Text style={styles.monto}>{formatearPesos(fila.totalCentavos)}</Text>
              <Text style={styles.porcentaje}>{fila.porcentaje} %</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 16,
  },
  encabezado: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  totalTitulo: {
    fontSize: 14,
    color: '#777',
  },
  totalMonto: {
    marginTop: 4,
    fontSize: 32,
    fontWeight: '700',
    color: '#222',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  fila: {
    flexDirection: 'row', // categoría a la izquierda, monto y porcentaje a la derecha
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  categoria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  derecha: {
    alignItems: 'flex-end',
  },
  monto: {
    fontSize: 16,
    color: '#222',
  },
  porcentaje: {
    marginTop: 2,
    fontSize: 13,
    color: '#777',
  },
});

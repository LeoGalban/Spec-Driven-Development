import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import MensajeVacio from '../../components/MensajeVacio';
import TarjetaGasto from '../../components/TarjetaGasto';
import { obtenerGastos } from '../../services/gastos';
import { Gasto } from '../../types/gasto';
import { totalDelMes } from '../../utils/calculos';
import { formatearPesos } from '../../utils/formato';

// Abre el formulario vacío para cargar un gasto nuevo (Historia 3).
function irAAgregar() {
  router.push('/gasto/formulario');
}

// Pantalla 1: lista de gastos con el total del mes (Historia 1).
export default function PantallaGastos() {
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

  // Se ejecuta cada vez que la pantalla vuelve a verse (por ejemplo, al volver del detalle),
  // así la lista siempre está actualizada.
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
  if (gastos.length === 0) {
    return (
      <MensajeVacio
        mensaje="Todavía no cargaste gastos"
        textoBoton="Agregar gasto"
        alPresionar={irAAgregar}
      />
    );
  }

  return (
    <FlatList
      data={gastos}
      keyExtractor={(gasto) => gasto.id}
      // Lo que va arriba de la lista: el total del mes y el botón para agregar.
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <Text style={styles.totalTitulo}>Total de este mes</Text>
          <Text style={styles.totalMonto}>{formatearPesos(totalDelMes(gastos))}</Text>
          <Pressable style={styles.botonAgregar} onPress={irAAgregar}>
            <Text style={styles.textoBotonAgregar}>+ Agregar gasto</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => (
        // Al tocar una tarjeta se abre su detalle, por encima de las pestañas.
        <TarjetaGasto gasto={item} alPresionar={() => router.push(`/gasto/${item.id}`)} />
      )}
      contentContainerStyle={styles.lista}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    paddingBottom: 16,
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
  botonAgregar: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  textoBotonAgregar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

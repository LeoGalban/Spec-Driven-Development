import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import MensajeVacio from '../../components/MensajeVacio';
import { obtenerGasto } from '../../services/gastos';
import { Gasto } from '../../types/gasto';
import { fechaAMostrar, formatearPesos } from '../../utils/formato';

// Pantalla 2: detalle de un gasto (Historia 2).
// El id llega en la ruta: /gasto/ejemplo-3 → id = "ejemplo-3".
export default function PantallaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [gasto, setGasto] = useState<Gasto | null>(null); // null = no existe
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarGasto = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setGasto(await obtenerGasto(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      // finally se ejecuta siempre, haya salido bien o mal.
      setCargando(false);
    }
  }, [id]);

  // Se recarga cada vez que la pantalla vuelve a verse (por ejemplo, después de editarlo).
  useFocusEffect(
    useCallback(() => {
      cargarGasto();
    }, [cargarGasto]),
  );

  if (cargando) {
    return <Cargando />;
  }
  if (error) {
    return <MensajeError mensaje={error} alReintentar={cargarGasto} />;
  }
  if (gasto === null) {
    return (
      <MensajeVacio
        mensaje="No se encontró el gasto"
        textoBoton="Volver"
        alPresionar={() => router.back()}
      />
    );
  }

  return (
    // contentInsetAdjustmentBehavior="automatic": en iPhone el encabezado es transparente y
    // el contenido quedaba escondido detrás; así el ScrollView deja el espacio necesario.
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.contenedor}>
      <Text style={styles.monto}>{formatearPesos(gasto.montoCentavos)}</Text>
      <Text style={styles.descripcion}>{gasto.descripcion}</Text>

      <View style={styles.tarjeta}>
        <Dato etiqueta="Categoría" valor={gasto.categoria} />
        <Dato etiqueta="Fecha" valor={fechaAMostrar(gasto.fecha)} />
        {/* La nota es opcional: solo se muestra si tiene texto */}
        {gasto.nota !== '' && <Dato etiqueta="Nota" valor={gasto.nota} />}
      </View>

      {/* Abre el mismo formulario de "Agregar", pero con el id: así sabe que tiene que editar */}
      <Pressable
        style={styles.boton}
        onPress={() => router.push({ pathname: '/gasto/formulario', params: { id: gasto.id } })}
      >
        <Text style={styles.textoBoton}>Editar</Text>
      </Pressable>
    </ScrollView>
  );
}

// Una fila "etiqueta: valor" de la tarjeta. Solo la usa esta pantalla, por eso vive acá.
function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 16,
  },
  monto: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  descripcion: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  dato: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, // línea finita entre filas
    borderBottomColor: '#ddd',
  },
  etiqueta: {
    fontSize: 13,
    color: '#777',
  },
  valor: {
    marginTop: 2,
    fontSize: 16,
    color: '#222',
  },
  boton: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

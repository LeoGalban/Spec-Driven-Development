import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native';

import Cargando from '../../components/Cargando';
import Encabezado from '../../components/Encabezado';
import Icono from '../../components/Icono';
import MensajeError from '../../components/MensajeError';
import MensajeVacio from '../../components/MensajeVacio';
import TarjetaGasto from '../../components/TarjetaGasto';
import { COLORES, FUENTES, RADIO } from '../../constants/tema';
import { obtenerGastos } from '../../services/gastos';
import { Gasto } from '../../types/gasto';
import { agruparPorDia, totalDelMes } from '../../utils/calculos';
import { fechaRelativa, formatearPesos, hoy, mesYAnio } from '../../utils/formato';

// Abre el formulario vacío para cargar un gasto nuevo (Historia 3).
function irAAgregar() {
  router.push('/gasto/formulario');
}

// Pantalla 1: lista de gastos con el total del mes (Historia 1).
export default function PantallaGastos() {
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
    // SectionList es como FlatList, pero con grupos: acá, un grupo por día.
    // También dibuja solo lo que se ve en pantalla, así una lista larga no se traba.
    <SectionList
      sections={agruparPorDia(gastos)}
      keyExtractor={(gasto) => gasto.id}
      // Lo que va arriba de todo: el encabezado con el total del mes y el botón para agregar.
      ListHeaderComponent={
        <Encabezado
          titulo="Mis gastos"
          etiqueta={`Total de ${mesYAnio(hoy())}`}
          monto={formatearPesos(totalDelMes(gastos))}
        >
          <Pressable
            style={({ pressed }) => [styles.botonAgregar, pressed && styles.presionado]}
            onPress={irAAgregar}
            accessibilityRole="button"
          >
            <Icono nombre={{ ios: 'plus', android: 'add' }} tamanio={16} color={COLORES.bosque} />
            <Text style={styles.textoBotonAgregar}>Agregar gasto</Text>
          </Pressable>
        </Encabezado>
      }
      // El título de cada grupo: el día y cuánto se gastó ese día.
      renderSectionHeader={({ section }) => (
        <View
          style={styles.tituloDia}
          accessible
          accessibilityRole="header"
          accessibilityLabel={`${fechaRelativa(section.fecha)}, total ${formatearPesos(section.totalCentavos)}`}
        >
          <Text style={styles.fecha}>{fechaRelativa(section.fecha)}</Text>
          <Text style={styles.totalDia}>{formatearPesos(section.totalCentavos)}</Text>
        </View>
      )}
      renderItem={({ item, index, section }) => (
        // Al tocar un gasto se abre su detalle, por encima de las pestañas.
        <TarjetaGasto
          gasto={item}
          alPresionar={() => router.push(`/gasto/${item.id}`)}
          primero={index === 0}
          ultimo={index === section.data.length - 1}
        />
      )}
      stickySectionHeadersEnabled={false} // los títulos se desplazan junto con la lista
      refreshControl={
        <RefreshControl
          refreshing={actualizando}
          onRefresh={actualizar}
          tintColor={COLORES.bosque}
          colors={[COLORES.bosque]}
        />
      }
      contentContainerStyle={styles.lista}
      // El encabezado ya deja el espacio de la barra de estado: sin espacio extra arriba.
      contentInsetAdjustmentBehavior="never"
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    paddingBottom: 24,
  },
  botonAgregar: {
    marginTop: 16,
    alignSelf: 'flex-start', // el botón ocupa solo lo que necesita, a la izquierda
    flexDirection: 'row', // ícono "+" y texto uno al lado del otro
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORES.lima, // verde del billete: resalta sobre el bosque
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: RADIO.grande,
  },
  presionado: {
    transform: [{ scale: 0.96 }],
  },
  textoBotonAgregar: {
    color: COLORES.bosque,
    fontSize: 14,
    fontFamily: FUENTES.seminegrita,
  },
  tituloDia: {
    flexDirection: 'row',
    justifyContent: 'space-between', // el día a la izquierda y el total a la derecha
    alignItems: 'baseline',
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 22,
  },
  fecha: {
    fontSize: 13,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.textoSecundario,
    textTransform: 'uppercase', // "HOY", "JUEVES 15 DE OCTUBRE"
    letterSpacing: 0.6,
  },
  totalDia: {
    fontSize: 13,
    fontFamily: FUENTES.media,
    color: COLORES.textoSecundario,
  },
});

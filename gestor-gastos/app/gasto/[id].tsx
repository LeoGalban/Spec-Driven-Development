import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Cargando from '../../components/Cargando';
import Icono, { NombreIcono } from '../../components/Icono';
import IconoCategoria from '../../components/IconoCategoria';
import MensajeError from '../../components/MensajeError';
import MensajeVacio from '../../components/MensajeVacio';
import {
  colorSuave,
  COLORES,
  estiloDeCategoria,
  FUENTES,
  RADIO,
  SOMBRA,
} from '../../constants/tema';
import { obtenerCategorias } from '../../services/categorias';
import { eliminarGasto, obtenerGasto } from '../../services/gastos';
import { EstiloCategoria, Gasto } from '../../types/gasto';
import { fechaAMostrar, formatearPesos } from '../../utils/formato';

// Pantalla 2: detalle de un gasto (Historia 2).
// El id llega en la ruta: /gasto/ejemplo-3 → id = "ejemplo-3".
export default function PantallaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [gasto, setGasto] = useState<Gasto | null>(null); // null = no existe
  const [estilo, setEstilo] = useState<EstiloCategoria | null>(null); // ícono y color de su categoría
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarGasto = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      // Se piden el gasto y las categorías a la vez (Promise.all) para saber su ícono y color.
      const [encontrado, categorias] = await Promise.all([obtenerGasto(id), obtenerCategorias()]);
      setGasto(encontrado);
      if (encontrado) setEstilo(estiloDeCategoria(encontrado.categoria, categorias));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      // finally se ejecuta siempre, haya salido bien o mal.
      setCargando(false);
    }
  }, [id]);

  // Pide confirmación antes de borrar (FR-009). Si el usuario cancela, no pasa nada.
  function confirmarEliminar() {
    Alert.alert('¿Eliminar este gasto?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: eliminar },
    ]);
  }

  async function eliminar() {
    setEliminando(true);
    try {
      await eliminarGasto(id);
      router.back(); // vuelve a la lista, que se recarga sola y ya no lo muestra
    } catch (e) {
      Alert.alert('No se pudo eliminar', e instanceof Error ? e.message : 'Error desconocido');
      setEliminando(false);
    }
  }

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
  if (gasto === null || estilo === null) {
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
    // el contenido quedaría escondido detrás; así el ScrollView deja el espacio necesario.
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contenedor}
    >
      {/* Arriba: ícono grande, monto, descripción y la categoría en una "pastilla" de su color */}
      <View style={styles.cabecera}>
        <IconoCategoria estilo={estilo} tamanio={64} />
        <Text style={styles.monto} numberOfLines={1} adjustsFontSizeToFit>
          {formatearPesos(gasto.montoCentavos)}
        </Text>
        <Text style={styles.descripcion}>{gasto.descripcion}</Text>
        <Text style={[styles.pastilla, { backgroundColor: colorSuave(estilo.color) }]}>
          {gasto.categoria}
        </Text>
      </View>

      <View style={styles.tarjeta}>
        <Dato
          icono={{ ios: 'calendar', android: 'calendar_today' }}
          etiqueta="Fecha"
          valor={fechaAMostrar(gasto.fecha)}
          ultimo={gasto.nota === ''}
        />
        {/* La nota es opcional: solo se muestra si tiene texto */}
        {gasto.nota !== '' && (
          <Dato
            icono={{ ios: 'text.alignleft', android: 'notes' }}
            etiqueta="Nota"
            valor={gasto.nota}
            ultimo
          />
        )}
      </View>

      <View style={styles.botones}>
        {/* Abre el mismo formulario de "Agregar", pero con el id: así sabe que tiene que editar */}
        <Pressable
          style={({ pressed }) => [styles.boton, styles.botonEditar, pressed && styles.presionado]}
          onPress={() => router.push({ pathname: '/gasto/formulario', params: { id: gasto.id } })}
          accessibilityRole="button"
        >
          <Icono nombre={{ ios: 'pencil', android: 'edit' }} tamanio={16} color="#fff" />
          <Text style={styles.textoEditar}>Editar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            styles.botonEliminar,
            eliminando && styles.botonDeshabilitado,
            pressed && styles.presionado,
          ]}
          onPress={confirmarEliminar}
          disabled={eliminando}
          accessibilityRole="button"
          accessibilityState={{ disabled: eliminando, busy: eliminando }}
        >
          <Icono
            nombre={{ ios: 'trash', android: 'delete' }}
            tamanio={16}
            color={COLORES.rosaTexto}
          />
          <Text style={styles.textoEliminar}>{eliminando ? 'Eliminando…' : 'Eliminar'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

type PropsDato = { icono: NombreIcono; etiqueta: string; valor: string; ultimo: boolean };

// Una fila de la tarjeta: ícono, etiqueta y valor. Solo la usa esta pantalla, por eso vive acá.
function Dato({ icono, etiqueta, valor, ultimo }: PropsDato) {
  return (
    <View style={[styles.dato, !ultimo && styles.conLinea]}>
      <Icono nombre={icono} tamanio={18} color={COLORES.textoSecundario} />
      <View style={styles.textosDato}>
        <Text style={styles.etiqueta}>{etiqueta}</Text>
        <Text style={styles.valor}>{valor}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 16,
  },
  cabecera: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
  },
  monto: {
    marginTop: 14,
    fontSize: 36,
    fontFamily: FUENTES.negrita,
    color: COLORES.texto,
    letterSpacing: -1,
  },
  descripcion: {
    marginTop: 2,
    fontSize: 17,
    fontFamily: FUENTES.media,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  // Texto oscuro sobre el color suave de la categoría: con el color fuerte no se leía bien.
  pastilla: {
    marginTop: 12,
    color: COLORES.texto,
    fontSize: 13,
    fontFamily: FUENTES.seminegrita,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIO.chico,
    overflow: 'hidden', // en iPhone, sin esto el fondo del texto no respeta las esquinas
  },
  tarjeta: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.medio,
    paddingHorizontal: 16,
    ...SOMBRA,
  },
  dato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  conLinea: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORES.borde,
  },
  textosDato: {
    flex: 1,
  },
  etiqueta: {
    fontSize: 12,
    fontFamily: FUENTES.regular,
    color: COLORES.textoSecundario,
  },
  valor: {
    marginTop: 1,
    fontSize: 15,
    fontFamily: FUENTES.media,
    color: COLORES.texto,
  },
  // Los dos botones uno al lado del otro.
  botones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  boton: {
    flex: 1, // los dos ocupan lo mismo
    flexDirection: 'row', // ícono y texto uno al lado del otro
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: RADIO.medio,
  },
  botonEditar: {
    backgroundColor: COLORES.bosque,
  },
  textoEditar: {
    color: '#fff',
    fontSize: 15,
    fontFamily: FUENTES.seminegrita,
  },
  // "Eliminar" con fondo rosa suave y letras rosas, para no confundirlo con "Editar".
  botonEliminar: {
    backgroundColor: COLORES.rosaSuave,
  },
  textoEliminar: {
    color: COLORES.rosaTexto,
    fontSize: 15,
    fontFamily: FUENTES.seminegrita,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  presionado: {
    transform: [{ scale: 0.97 }],
  },
});

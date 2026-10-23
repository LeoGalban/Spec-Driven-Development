import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import Cargando from '../../components/Cargando';
import Encabezado from '../../components/Encabezado';
import Icono from '../../components/Icono';
import IconoCategoria from '../../components/IconoCategoria';
import MensajeError from '../../components/MensajeError';
import { COLORES, estiloDeCategoria, FUENTES, RADIO, SOMBRA } from '../../constants/tema';
import { obtenerCategorias } from '../../services/categorias';
import { obtenerGastos } from '../../services/gastos';
import { Gasto, InfoCategoria } from '../../types/gasto';
import { resumenPorCategoria, totalEnPeriodo } from '../../utils/calculos';
import { formatearPesos } from '../../utils/formato';
import { periodoMes, periodoSemana } from '../../utils/periodos';

type TipoPeriodo = 'semana' | 'mes';

// Pantalla 4: cuánto se gastó en cada categoría, por semana o por mes (Historias 5 y 7).
// Es una lista con totales y porcentajes: los gráficos quedaron fuera de alcance en la spec.
export default function PantallaResumen() {
  // null = todavía no llegaron los datos (se muestra "Cargando…").
  const [gastos, setGastos] = useState<Gasto[] | null>(null);
  const [categorias, setCategorias] = useState<InfoCategoria[]>([]); // para el ícono de cada fila
  const [error, setError] = useState<string | null>(null);
  // true mientras se recarga con el gesto de deslizar hacia abajo.
  const [actualizando, setActualizando] = useState(false);

  // Qué período se mira (FR-017): por defecto, el mes actual.
  const [tipo, setTipo] = useState<TipoPeriodo>('mes');
  const [cuantosAtras, setCuantosAtras] = useState(0); // 0 = el actual, 1 = el anterior, ...

  const cargarGastos = useCallback(async () => {
    setError(null);
    try {
      // Promise.all hace los dos pedidos a la vez y espera a que terminen los dos.
      const [listaGastos, listaCategorias] = await Promise.all([
        obtenerGastos(),
        obtenerCategorias(),
      ]);
      setCategorias(listaCategorias);
      setGastos(listaGastos);
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

  // Al cambiar entre semana y mes se vuelve al período actual.
  function elegirTipo(nuevo: TipoPeriodo) {
    setTipo(nuevo);
    setCuantosAtras(0);
  }

  if (error) {
    return <MensajeError mensaje={error} alReintentar={cargarGastos} />;
  }
  if (gastos === null) {
    return <Cargando />;
  }

  // El período elegido y sus cálculos. No se guardan en el estado: se calculan en cada dibujo a
  // partir de "tipo" y "cuantosAtras", así nunca quedan desactualizados.
  const periodo = tipo === 'mes' ? periodoMes(cuantosAtras) : periodoSemana(cuantosAtras);
  const resumen = resumenPorCategoria(gastos, periodo);
  const esElActual = cuantosAtras === 0;

  let mensajeVacio = 'No hay gastos en este período';
  if (esElActual)
    mensajeVacio = tipo === 'mes' ? 'No hay gastos este mes' : 'No hay gastos esta semana';

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
        etiqueta={tipo === 'mes' ? `Total de ${periodo.titulo}` : `Total del ${periodo.titulo}`}
        monto={formatearPesos(totalEnPeriodo(gastos, periodo))}
      >
        <Text style={styles.detalleTotal}>
          {resumen.length} {resumen.length === 1 ? 'categoría' : 'categorías'} con gastos
        </Text>
      </Encabezado>

      {/* Selector "Semana / Mes": dos botones dentro de una "pastilla" */}
      <View style={styles.selector} accessibilityRole="tablist">
        {(['semana', 'mes'] as const).map((opcion) => {
          const elegida = opcion === tipo;
          return (
            <Pressable
              key={opcion}
              onPress={() => elegirTipo(opcion)}
              accessibilityRole="tab"
              accessibilityState={{ selected: elegida }}
              style={[styles.opcion, elegida && styles.opcionElegida]}
            >
              <Text style={[styles.textoOpcion, elegida && styles.textoOpcionElegida]}>
                {opcion === 'semana' ? 'Semana' : 'Mes'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Flechas para ir al período anterior o al siguiente (nunca más allá del actual) */}
      <View style={styles.navegacion}>
        <BotonFlecha
          direccion="anterior"
          alPresionar={() => setCuantosAtras(cuantosAtras + 1)}
          deshabilitado={false}
        />
        <Text style={styles.tituloPeriodo}>{periodo.titulo}</Text>
        <BotonFlecha
          direccion="siguiente"
          alPresionar={() => setCuantosAtras(cuantosAtras - 1)}
          deshabilitado={esElActual}
        />
      </View>

      {resumen.length === 0 ? (
        // Período sin gastos: se avisa, pero el selector y las flechas siguen visibles.
        <View style={[styles.tarjeta, styles.vacio]}>
          <Icono
            nombre={{ ios: 'tray', android: 'inbox' }}
            tamanio={28}
            color={COLORES.textoSecundario}
          />
          <Text style={styles.textoVacio}>{mensajeVacio}</Text>
        </View>
      ) : (
        // Una sola tarjeta blanca con una fila por categoría, de mayor a menor.
        <View style={styles.tarjeta}>
          {resumen.map((fila, indice) => (
            <View
              key={fila.categoria}
              style={[styles.fila, indice < resumen.length - 1 && styles.conLinea]}
              // El lector de pantalla lee la fila entera de una vez.
              accessible
              accessibilityLabel={`${fila.categoria}: ${formatearPesos(fila.totalCentavos)}, ${fila.porcentaje} por ciento del total`}
            >
              <IconoCategoria estilo={estiloDeCategoria(fila.categoria, categorias)} />
              <View style={styles.centro}>
                <Text style={styles.categoria}>{fila.categoria}</Text>
                <Text style={styles.monto}>{formatearPesos(fila.totalCentavos)}</Text>
              </View>
              {/* Porcentaje en una "pastilla" rosa */}
              <Text style={styles.porcentaje}>{fila.porcentaje} %</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

type PropsFlecha = {
  direccion: 'anterior' | 'siguiente';
  alPresionar: () => void;
  deshabilitado: boolean;
};

// Botón redondo con una flecha. Solo lo usa esta pantalla, por eso vive acá.
function BotonFlecha({ direccion, alPresionar, deshabilitado }: PropsFlecha) {
  return (
    <Pressable
      onPress={alPresionar}
      disabled={deshabilitado}
      hitSlop={8} // amplía la zona que se puede tocar
      accessibilityRole="button"
      accessibilityLabel={direccion === 'anterior' ? 'Período anterior' : 'Período siguiente'}
      accessibilityState={{ disabled: deshabilitado }}
      style={({ pressed }) => [
        styles.flecha,
        deshabilitado && styles.flechaDeshabilitada,
        pressed && styles.presionado,
      ]}
    >
      <Icono
        nombre={
          direccion === 'anterior'
            ? { ios: 'chevron.left', android: 'chevron_left' }
            : { ios: 'chevron.right', android: 'chevron_right' }
        }
        tamanio={16}
        color={COLORES.bosque}
      />
    </Pressable>
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
  selector: {
    flexDirection: 'row',
    marginTop: 18,
    marginHorizontal: 16,
    padding: 4,
    backgroundColor: COLORES.borde,
    borderRadius: RADIO.medio,
  },
  opcion: {
    flex: 1, // las dos opciones ocupan lo mismo
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: RADIO.chico,
  },
  opcionElegida: {
    backgroundColor: COLORES.superficie,
    ...SOMBRA,
  },
  textoOpcion: {
    fontSize: 14,
    fontFamily: FUENTES.media,
    color: COLORES.textoSecundario,
  },
  textoOpcionElegida: {
    fontFamily: FUENTES.seminegrita,
    color: COLORES.bosque,
  },
  navegacion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // flechas en los extremos y el título en el medio
    marginTop: 14,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  tituloPeriodo: {
    fontSize: 16,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.texto,
  },
  flecha: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.superficie,
    ...SOMBRA,
  },
  flechaDeshabilitada: {
    opacity: 0.35,
  },
  presionado: {
    transform: [{ scale: 0.92 }],
  },
  tarjeta: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.medio,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    ...SOMBRA,
  },
  vacio: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 28,
  },
  textoVacio: {
    fontSize: 15,
    fontFamily: FUENTES.media,
    color: COLORES.textoSecundario,
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

import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ReactNode, Ref, useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputInstance,
  View,
} from 'react-native';

import Cargando from '../../components/Cargando';
import Icono, { NombreIcono } from '../../components/Icono';
import MensajeError from '../../components/MensajeError';
import MensajeVacio from '../../components/MensajeVacio';
import SelectorCategoria from '../../components/SelectorCategoria';
import { COLORES, FUENTES, RADIO, SOMBRA } from '../../constants/tema';
import { actualizarGasto, crearGasto, obtenerGasto } from '../../services/gastos';
import { DatosGasto, ErroresFormulario, ValoresFormulario } from '../../types/gasto';
import {
  ayer,
  centavosATexto,
  fechaAGuardar,
  fechaAMostrar,
  hoy,
  textoACentavos,
} from '../../utils/formato';
import { validarGasto } from '../../utils/validacion';

// Pantalla 3: formulario para agregar un gasto (Historia 3) o editarlo (Historia 4).
// Sin parámetros (/gasto/formulario) crea uno nuevo; con id (/gasto/formulario?id=...) edita ese.
export default function PantallaFormulario() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const esEdicion = id !== undefined;

  // Todo lo que escribe el usuario, en un solo objeto. La fecha empieza con la de hoy.
  const [valores, setValores] = useState<ValoresFormulario>({
    descripcion: '',
    monto: '',
    categoria: null,
    fecha: fechaAMostrar(hoy()),
    nota: '',
  });
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [guardando, setGuardando] = useState(false);
  const [errorAlGuardar, setErrorAlGuardar] = useState<string | null>(null);

  // Solo para editar: hay que traer el gasto antes de mostrar el formulario.
  const [cargando, setCargando] = useState(esEdicion);
  const [errorAlCargar, setErrorAlCargar] = useState<string | null>(null);
  const [noEncontrado, setNoEncontrado] = useState(false);

  // useState recién cambia en el próximo dibujo de la pantalla; useRef cambia al instante.
  // Así, si se toca "Guardar" dos veces muy rápido, el segundo toque ya ve que se está guardando
  // y no crea el gasto dos veces (caso borde de la spec).
  const yaGuardando = useRef(false);

  // Referencias a los campos, para pasar al siguiente con la tecla "Siguiente" del teclado.
  const refDescripcion = useRef<TextInputInstance>(null);
  const refFecha = useRef<TextInputInstance>(null);
  const refNota = useRef<TextInputInstance>(null);

  // Trae el gasto a editar y completa los campos con sus datos.
  const cargarGasto = useCallback(async () => {
    if (!esEdicion) return;
    setCargando(true);
    setErrorAlCargar(null);
    try {
      const gasto = await obtenerGasto(id);
      if (gasto === null) {
        setNoEncontrado(true);
      } else {
        setValores({
          descripcion: gasto.descripcion,
          monto: centavosATexto(gasto.montoCentavos),
          categoria: gasto.categoria,
          fecha: fechaAMostrar(gasto.fecha),
          nota: gasto.nota,
        });
      }
    } catch (e) {
      setErrorAlCargar(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  }, [esEdicion, id]);

  // Se usa useEffect (una sola vez al abrir) y no useFocusEffect: si se recargara al volver a la
  // pantalla, se borraría lo que el usuario ya cambió.
  useEffect(() => {
    cargarGasto();
  }, [cargarGasto]);

  // Cambia un solo campo y deja los demás como estaban.
  // Se usa la forma "funcional" de setValores (recibe los valores anteriores): así siempre parte
  // del último valor, aunque se cambien dos campos seguidos antes de que se redibuje la pantalla.
  function cambiar<C extends keyof ValoresFormulario>(campo: C, valor: ValoresFormulario[C]) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  async function guardar() {
    if (yaGuardando.current) return;

    const erroresEncontrados = validarGasto(valores);
    setErrores(erroresEncontrados);
    // Si hay al menos un error, no se guarda nada (los mensajes ya se muestran).
    if (Object.keys(erroresEncontrados).length > 0) return;

    yaGuardando.current = true;
    setGuardando(true);
    setErrorAlGuardar(null);
    const datos: DatosGasto = {
      descripcion: valores.descripcion.trim(),
      montoCentavos: textoACentavos(valores.monto),
      // validarGasto ya comprobó que hay categoría, por eso se puede usar "!"
      categoria: valores.categoria!,
      fecha: fechaAGuardar(valores.fecha),
      nota: valores.nota.trim(),
    };
    try {
      if (esEdicion) {
        await actualizarGasto(id, datos);
      } else {
        await crearGasto(datos);
      }
      // Vuelve a la pantalla anterior (lista o detalle), que se recarga sola (useFocusEffect).
      router.back();
    } catch (e) {
      setErrorAlGuardar(e instanceof Error ? e.message : 'Error desconocido');
      yaGuardando.current = false;
      setGuardando(false);
    }
  }

  // El título cambia según el modo. Stack.Screen dentro de la pantalla configura su encabezado.
  const titulo = (
    <>
      <Stack.Screen options={{ title: esEdicion ? 'Editar gasto' : 'Nuevo gasto' }} />
    </>
  );

  if (cargando) {
    return (
      <>
        {titulo}
        <Cargando />
      </>
    );
  }
  if (errorAlCargar) {
    return (
      <>
        {titulo}
        <MensajeError mensaje={errorAlCargar} alReintentar={cargarGasto} />
      </>
    );
  }
  if (noEncontrado) {
    return (
      <>
        {titulo}
        <MensajeVacio
          mensaje="No se encontró el gasto"
          textoBoton="Volver"
          alPresionar={() => router.back()}
        />
      </>
    );
  }

  return (
    <>
      {titulo}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic" // deja lugar al encabezado transparente de iOS
        automaticallyAdjustKeyboardInsets // en iPhone, el teclado no tapa el campo que se escribe
        keyboardShouldPersistTaps="handled" // permite tocar "Guardar" con el teclado abierto
        contentContainerStyle={styles.contenedor}
      >
        {/* El monto va primero, grande y centrado: es el dato más importante */}
        <View style={[styles.tarjetaMonto, errores.monto && styles.tarjetaMontoConError]}>
          <Text style={styles.etiquetaMonto}>¿Cuánto gastaste?</Text>
          <View style={styles.filaMonto}>
            <Text style={styles.signoPeso}>$</Text>
            <TextInput
              value={valores.monto}
              onChangeText={(texto) => cambiar('monto', texto)}
              placeholder="0,00"
              placeholderTextColor={COLORES.textoSecundario}
              keyboardType="decimal-pad"
              // Al agregar un gasto, el cursor ya está en el monto (al editar no, para no tapar con el teclado).
              autoFocus={!esEdicion}
              accessibilityLabel="Monto en pesos"
              style={styles.inputMonto}
            />
          </View>
          {errores.monto && <Text style={styles.errorMonto}>{errores.monto}</Text>}
        </View>

        <Campo
          etiqueta="Descripción"
          valor={valores.descripcion}
          alCambiar={(texto) => cambiar('descripcion', texto)}
          error={errores.descripcion}
          placeholder="Ej: Supermercado"
          icono={{ ios: 'text.cursor', android: 'edit_note' }}
          ref={refDescripcion}
          alEnviar={() => refFecha.current?.focus()} // "Siguiente" salta a la fecha
        />

        <Text style={styles.etiqueta}>Categoría</Text>
        <SelectorCategoria
          valor={valores.categoria}
          alCambiar={(categoria) => cambiar('categoria', categoria)}
        />
        {errores.categoria && <Text style={styles.error}>{errores.categoria}</Text>}

        <Campo
          etiqueta="Fecha (DD/MM/AAAA)"
          valor={valores.fecha}
          alCambiar={(texto) => cambiar('fecha', texto)}
          error={errores.fecha}
          placeholder="Ej: 23/10/2026"
          teclado="numbers-and-punctuation"
          icono={{ ios: 'calendar', android: 'calendar_today' }}
          ref={refFecha}
          alEnviar={() => refNota.current?.focus()} // "Siguiente" salta a la nota
          // Atajos: con un toque se completa la fecha de hoy o de ayer (lo más común).
          extra={
            <View style={styles.atajos}>
              <Atajo texto="Hoy" alPresionar={() => cambiar('fecha', fechaAMostrar(hoy()))} />
              <Atajo texto="Ayer" alPresionar={() => cambiar('fecha', fechaAMostrar(ayer()))} />
            </View>
          }
        />
        <Campo
          etiqueta="Nota (opcional)"
          valor={valores.nota}
          alCambiar={(texto) => cambiar('nota', texto)}
          error={errores.nota}
          placeholder="Algo que quieras recordar"
          multilinea
          icono={{ ios: 'text.alignleft', android: 'notes' }}
          ref={refNota}
        />

        {errorAlGuardar && <Text style={styles.errorGeneral}>{errorAlGuardar}</Text>}

        <Pressable
          onPress={guardar}
          disabled={guardando}
          accessibilityRole="button"
          accessibilityState={{ disabled: guardando, busy: guardando }}
          style={({ pressed }) => [
            styles.boton,
            guardando && styles.botonDeshabilitado,
            pressed && styles.presionado,
          ]}
        >
          {!guardando && (
            <Icono nombre={{ ios: 'checkmark', android: 'check' }} tamanio={18} color="#fff" />
          )}
          <Text style={styles.textoBoton}>{guardando ? 'Guardando…' : 'Guardar'}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

type PropsCampo = {
  etiqueta: string;
  valor: string;
  alCambiar: (texto: string) => void;
  error?: string;
  placeholder?: string;
  teclado?: KeyboardTypeOptions;
  multilinea?: boolean;
  icono: NombreIcono; // ícono que va adentro del campo, a la izquierda
  ref?: Ref<TextInputInstance>; // para poder darle el foco desde afuera (React 19 lo permite como prop)
  alEnviar?: () => void; // qué hacer al tocar "Siguiente" en el teclado
  extra?: ReactNode; // algo para mostrar a la derecha de la etiqueta (por ejemplo, atajos)
};

// Un campo de texto con su etiqueta arriba, un ícono adentro y su mensaje de error abajo (si tiene).
// Solo lo usa esta pantalla, por eso vive acá.
function Campo({
  etiqueta,
  valor,
  alCambiar,
  error,
  placeholder,
  teclado,
  multilinea,
  icono,
  ref,
  alEnviar,
  extra,
}: PropsCampo) {
  return (
    <View>
      <View style={styles.filaEtiqueta}>
        <Text style={styles.etiqueta}>{etiqueta}</Text>
        {extra}
      </View>
      <View
        style={[
          styles.caja,
          multilinea && styles.cajaMultilinea,
          error !== undefined && styles.cajaConError,
        ]}
      >
        <Icono
          nombre={icono}
          tamanio={18}
          color={error !== undefined ? COLORES.error : COLORES.textoSecundario}
        />
        <TextInput
          ref={ref}
          value={valor}
          onChangeText={alCambiar}
          // Si hay un campo siguiente, la tecla del teclado dice "Siguiente" y salta a él.
          returnKeyType={alEnviar ? 'next' : 'default'}
          onSubmitEditing={alEnviar}
          submitBehavior={alEnviar ? 'submit' : undefined}
          accessibilityLabel={etiqueta}
          accessibilityHint={error}
          placeholder={placeholder}
          placeholderTextColor={COLORES.textoSecundario}
          keyboardType={teclado}
          multiline={multilinea}
          style={[styles.input, multilinea && styles.inputMultilinea]}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

// Botoncito chico para completar un campo con un toque ("Hoy", "Ayer").
function Atajo({ texto, alPresionar }: { texto: string; alPresionar: () => void }) {
  return (
    <Pressable
      onPress={alPresionar}
      accessibilityRole="button"
      accessibilityLabel={`Fecha: ${texto}`}
      hitSlop={8} // amplía la zona que se puede tocar, sin agrandar el botón
      style={({ pressed }) => [styles.atajo, pressed && styles.presionado]}
    >
      <Text style={styles.textoAtajo}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 16,
    paddingBottom: 40,
  },
  // Tarjeta blanca con el monto grande y centrado: es el dato más importante.
  tarjetaMonto: {
    alignItems: 'center',
    backgroundColor: COLORES.superficie,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: RADIO.grande,
    paddingVertical: 22,
    paddingHorizontal: 16,
    ...SOMBRA,
  },
  tarjetaMontoConError: {
    backgroundColor: COLORES.errorSuave,
    borderColor: COLORES.error,
  },
  etiquetaMonto: {
    fontSize: 13,
    fontFamily: FUENTES.media,
    color: COLORES.textoSecundario,
  },
  filaMonto: {
    flexDirection: 'row', // el "$" y el número uno al lado del otro
    alignItems: 'center',
    marginTop: 4,
  },
  signoPeso: {
    fontSize: 28,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.textoSecundario,
    marginRight: 6,
  },
  inputMonto: {
    minWidth: 120,
    fontSize: 38,
    fontFamily: FUENTES.negrita,
    color: COLORES.texto,
    textAlign: 'center',
    letterSpacing: -1,
  },
  errorMonto: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: FUENTES.media,
    color: COLORES.error,
  },
  filaEtiqueta: {
    flexDirection: 'row',
    justifyContent: 'space-between', // la etiqueta a la izquierda y los atajos a la derecha
    alignItems: 'flex-end',
  },
  atajos: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  atajo: {
    backgroundColor: COLORES.limaSuave,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIO.chico,
  },
  textoAtajo: {
    fontSize: 13,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.bosque,
  },
  presionado: {
    transform: [{ scale: 0.97 }],
  },
  etiqueta: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 13,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.textoSecundario,
    textTransform: 'uppercase', // mismo estilo que los títulos de sección de la lista
    letterSpacing: 0.6,
  },
  // La "caja" es el borde redondeado; adentro van el ícono y el campo de texto.
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORES.superficie,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    borderRadius: RADIO.medio,
    paddingHorizontal: 14,
  },
  cajaMultilinea: {
    alignItems: 'flex-start',
    paddingTop: 14,
  },
  cajaConError: {
    borderColor: COLORES.error,
    backgroundColor: COLORES.errorSuave,
  },
  input: {
    flex: 1, // ocupa todo el ancho que deja el ícono
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: FUENTES.regular,
    color: COLORES.texto,
  },
  inputMultilinea: {
    minHeight: 80,
    paddingTop: 0,
    textAlignVertical: 'top', // en Android, el texto empieza arriba y no en el medio
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: FUENTES.media,
    color: COLORES.error,
  },
  errorGeneral: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: FUENTES.media,
    color: COLORES.error,
    textAlign: 'center',
  },
  boton: {
    marginTop: 28,
    flexDirection: 'row', // ícono y texto uno al lado del otro
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORES.bosque,
    paddingVertical: 16,
    borderRadius: RADIO.medio,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FUENTES.seminegrita,
  },
});

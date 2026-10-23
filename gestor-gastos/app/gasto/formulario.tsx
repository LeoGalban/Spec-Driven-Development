import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import SelectorCategoria from '../../components/SelectorCategoria';
import { crearGasto } from '../../services/gastos';
import { ErroresFormulario, ValoresFormulario } from '../../types/gasto';
import { fechaAGuardar, fechaAMostrar, hoy, textoACentavos } from '../../utils/formato';
import { validarGasto } from '../../utils/validacion';

// Pantalla 3: formulario para agregar un gasto (Historia 3).
export default function PantallaFormulario() {
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

  // useState recién cambia en el próximo dibujo de la pantalla; useRef cambia al instante.
  // Así, si se toca "Guardar" dos veces muy rápido, el segundo toque ya ve que se está guardando
  // y no crea el gasto dos veces (caso borde de la spec).
  const yaGuardando = useRef(false);

  // Cambia un solo campo y deja los demás como estaban.
  function cambiar<C extends keyof ValoresFormulario>(campo: C, valor: ValoresFormulario[C]) {
    setValores({ ...valores, [campo]: valor });
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
    try {
      await crearGasto({
        descripcion: valores.descripcion.trim(),
        montoCentavos: textoACentavos(valores.monto),
        // validarGasto ya comprobó que hay categoría, por eso se puede usar "!"
        categoria: valores.categoria!,
        fecha: fechaAGuardar(valores.fecha),
        nota: valores.nota.trim(),
      });
      router.back(); // vuelve a la lista, que se recarga sola (useFocusEffect)
    } catch (e) {
      setErrorAlGuardar(e instanceof Error ? e.message : 'Error desconocido');
      yaGuardando.current = false;
      setGuardando(false);
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic" // deja lugar al encabezado transparente de iOS
      automaticallyAdjustKeyboardInsets // en iPhone, el teclado no tapa el campo que se escribe
      keyboardShouldPersistTaps="handled" // permite tocar "Guardar" con el teclado abierto
      contentContainerStyle={styles.contenedor}
    >
      <Campo
        etiqueta="Descripción"
        valor={valores.descripcion}
        alCambiar={(texto) => cambiar('descripcion', texto)}
        error={errores.descripcion}
        placeholder="Ej: Supermercado"
      />
      <Campo
        etiqueta="Monto ($)"
        valor={valores.monto}
        alCambiar={(texto) => cambiar('monto', texto)}
        error={errores.monto}
        placeholder="Ej: 1500,50"
        teclado="decimal-pad"
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
      />
      <Campo
        etiqueta="Nota (opcional)"
        valor={valores.nota}
        alCambiar={(texto) => cambiar('nota', texto)}
        error={errores.nota}
        placeholder="Algo que quieras recordar"
        multilinea
      />

      {errorAlGuardar && <Text style={styles.errorGeneral}>{errorAlGuardar}</Text>}

      <Pressable
        onPress={guardar}
        disabled={guardando}
        style={[styles.boton, guardando && styles.botonDeshabilitado]}
      >
        <Text style={styles.textoBoton}>{guardando ? 'Guardando…' : 'Guardar'}</Text>
      </Pressable>
    </ScrollView>
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
};

// Un campo de texto con su etiqueta arriba y su mensaje de error abajo (si tiene).
// Solo lo usa esta pantalla, por eso vive acá.
function Campo({ etiqueta, valor, alCambiar, error, placeholder, teclado, multilinea }: PropsCampo) {
  return (
    <View>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        value={valor}
        onChangeText={alCambiar}
        placeholder={placeholder}
        keyboardType={teclado}
        multiline={multilinea}
        style={[styles.input, multilinea && styles.inputMultilinea, error && styles.inputConError]}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 16,
    paddingBottom: 40,
  },
  etiqueta: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputMultilinea: {
    minHeight: 80,
    textAlignVertical: 'top', // en Android, el texto empieza arriba y no en el medio
  },
  inputConError: {
    borderColor: '#C62828',
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    color: '#C62828',
  },
  errorGeneral: {
    marginTop: 20,
    fontSize: 15,
    color: '#C62828',
    textAlign: 'center',
  },
  boton: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

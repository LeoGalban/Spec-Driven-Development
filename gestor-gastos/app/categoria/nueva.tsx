import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import Icono from '../../components/Icono';
import IconoCategoria from '../../components/IconoCategoria';
import {
  COLORES,
  COLORES_CATEGORIA,
  colorSuave,
  FUENTES,
  ICONOS_CATEGORIA,
  RADIO,
  SOMBRA,
} from '../../constants/tema';
import { crearCategoria } from '../../services/categorias';
import { validarCategoria } from '../../utils/validacion';

// Pantalla 5: crear una categoría propia (Historia 6, FR-016).
// Al crearla vuelve al formulario, que la elige sola (ver cargarCategorias en el formulario).
export default function PantallaNuevaCategoria() {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(COLORES_CATEGORIA[0]);
  const [posicionIcono, setPosicionIcono] = useState(0); // cuál de los 8 íconos está elegido
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  // Igual que en el formulario de gasto: evita crear dos veces con un doble toque.
  const yaGuardando = useRef(false);

  const icono = ICONOS_CATEGORIA[posicionIcono];

  async function crear() {
    if (yaGuardando.current) return;

    // Primero se revisa acá lo que no necesita a las otras categorías (vacío, largo).
    // Si el nombre ya existe lo avisa el servicio, que es quien conoce todas.
    const errorNombre = validarCategoria(nombre, []);
    setError(errorNombre);
    if (errorNombre) return;

    yaGuardando.current = true;
    setGuardando(true);
    try {
      await crearCategoria({ nombre, color, icono });
      router.back(); // vuelve al formulario de gasto
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
      yaGuardando.current = false;
      setGuardando(false);
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic" // deja lugar al encabezado transparente de iOS
      automaticallyAdjustKeyboardInsets // en iPhone, el teclado no tapa el campo
      keyboardShouldPersistTaps="handled" // permite tocar los botones con el teclado abierto
      contentContainerStyle={styles.contenedor}
    >
      {/* Vista previa: cómo se va a ver la categoría con lo elegido hasta ahora */}
      <View style={styles.vistaPrevia}>
        <IconoCategoria estilo={{ icono, color }} tamanio={64} />
        <Text style={styles.nombrePrevia} numberOfLines={1}>
          {nombre.trim() === '' ? 'Nueva categoría' : nombre.trim()}
        </Text>
      </View>

      <Text style={styles.etiqueta}>Nombre</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej: Mascotas"
        placeholderTextColor={COLORES.textoSecundario}
        autoFocus
        maxLength={30} // deja escribir un poco de más para que se vea el mensaje de error
        returnKeyType="done"
        accessibilityLabel="Nombre de la categoría"
        style={[styles.input, error !== null && styles.inputConError]}
      />
      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.etiqueta}>Color</Text>
      <View style={styles.filaColores}>
        {COLORES_CATEGORIA.map((opcion) => {
          const elegido = opcion === color;
          return (
            <Pressable
              key={opcion}
              onPress={() => setColor(opcion)}
              accessibilityRole="button"
              accessibilityLabel={`Color ${COLORES_CATEGORIA.indexOf(opcion) + 1}`}
              accessibilityState={{ selected: elegido }}
              // El elegido lleva un anillo de su color alrededor.
              style={[styles.anillo, elegido && { borderColor: opcion }]}
            >
              <View style={[styles.circuloColor, { backgroundColor: opcion }]} />
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.etiqueta}>Ícono</Text>
      <View style={styles.cuadriculaIconos}>
        {ICONOS_CATEGORIA.map((opcion, posicion) => {
          const elegido = posicion === posicionIcono;
          return (
            <Pressable
              key={opcion.ios}
              onPress={() => setPosicionIcono(posicion)}
              accessibilityRole="button"
              accessibilityLabel={`Ícono ${posicion + 1}`}
              accessibilityState={{ selected: elegido }}
              style={[
                styles.opcionIcono,
                elegido && { borderColor: color, backgroundColor: colorSuave(color) },
              ]}
            >
              <Icono
                nombre={opcion}
                tamanio={22}
                color={elegido ? color : COLORES.textoSecundario}
              />
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={crear}
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
        <Text style={styles.textoBoton}>{guardando ? 'Creando…' : 'Crear categoría'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 16,
    paddingBottom: 40,
  },
  vistaPrevia: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.grande,
    paddingVertical: 22,
    ...SOMBRA,
  },
  nombrePrevia: {
    fontSize: 18,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.texto,
    maxWidth: '80%',
  },
  etiqueta: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 13,
    fontFamily: FUENTES.seminegrita,
    color: COLORES.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: COLORES.superficie,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    borderRadius: RADIO.medio,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: FUENTES.regular,
    color: COLORES.texto,
  },
  inputConError: {
    borderColor: COLORES.error,
    backgroundColor: COLORES.errorSuave,
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: FUENTES.media,
    color: COLORES.error,
  },
  filaColores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Anillo alrededor de cada color: transparente, salvo en el elegido.
  anillo: {
    padding: 3,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  circuloColor: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  cuadriculaIconos: {
    flexDirection: 'row',
    flexWrap: 'wrap', // cuatro por fila
    gap: 8,
  },
  opcionIcono: {
    width: '23%',
    aspectRatio: 1, // cuadrado: el alto igual al ancho
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.medio,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  boton: {
    marginTop: 28,
    flexDirection: 'row',
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
  presionado: {
    transform: [{ scale: 0.97 }],
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FUENTES.seminegrita,
  },
});

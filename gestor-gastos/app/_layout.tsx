import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import Logo from '../components/Logo';
import { COLORES, FUENTES } from '../constants/tema';

// Mantiene la pantalla de inicio hasta que cargue la tipografía, así el texto no aparece
// primero con la fuente del sistema y después "salta" a la nuestra.
SplashScreen.preventAutoHideAsync();

// Layout raíz: una pila (Stack) de pantallas.
// Las pestañas van adentro, y el detalle y el formulario se abren por encima de ellas.
export default function LayoutRaiz() {
  const [fuentesCargadas, errorFuentes] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    // Si las fuentes fallan, igual se muestra la app (con la fuente del sistema).
    if (fuentesCargadas || errorFuentes) {
      SplashScreen.hideAsync();
    }
  }, [fuentesCargadas, errorFuentes]);

  if (!fuentesCargadas && !errorFuentes) {
    return null; // mientras tanto se sigue viendo la pantalla de inicio
  }

  return (
    <>
      {/* Hora y batería en oscuro: todas las pantallas tienen fondo claro */}
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: 'Atrás', // texto del botón para volver (en iPhone, al lado de la flecha)
          headerBackTitleStyle: { fontFamily: FUENTES.media },
          headerTintColor: COLORES.bosque, // color de la flecha y del texto "Atrás"
          headerTitleStyle: { fontFamily: FUENTES.seminegrita, color: COLORES.texto },
          headerStyle: { backgroundColor: COLORES.fondo },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: COLORES.fondo },
          headerRight: () => <Logo tamanio={26} />, // el logo también en detalle y formulario
        }}
      >
        {/* Las pestañas dibujan su propio encabezado, por eso se oculta el de la pila */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="gasto/[id]" options={{ title: 'Detalle' }} />
        <Stack.Screen name="gasto/formulario" options={{ title: 'Nuevo gasto' }} />
      </Stack>
    </>
  );
}

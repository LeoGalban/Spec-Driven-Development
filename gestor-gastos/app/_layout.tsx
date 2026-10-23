import { Stack } from 'expo-router';

// Layout raíz: una pila (Stack) de pantallas.
// Las pestañas van adentro, y el detalle y el formulario se abren por encima de ellas.
export default function LayoutRaiz() {
  return (
    // headerBackTitle: texto del botón para volver (en iPhone aparece al lado de la flecha).
    <Stack screenOptions={{ headerBackTitle: 'Atrás' }}>
      {/* Las pestañas tienen su propio encabezado, por eso se oculta el de la pila */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="gasto/[id]" options={{ title: 'Detalle' }} />
    </Stack>
  );
}

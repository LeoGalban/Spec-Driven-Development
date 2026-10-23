import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';

import Icono, { NombreIcono } from '../../components/Icono';
import { COLORES, FUENTES } from '../../constants/tema';

// Ícono de una pestaña: expo-router le pasa el color (activo o inactivo).
function iconoPestania(nombre: NombreIcono) {
  return ({ color }: { color: ColorValue }) => <Icono nombre={nombre} tamanio={22} color={color} />;
}

// Las dos pestañas de la app (FR-014).
export default function LayoutPestanias() {
  return (
    <Tabs
      screenOptions={{
        // Cada pestaña dibuja su propio encabezado (components/Encabezado.tsx).
        headerShown: false,
        tabBarActiveTintColor: COLORES.bosque,
        tabBarInactiveTintColor: COLORES.textoSecundario,
        tabBarLabelStyle: { fontFamily: FUENTES.media, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: COLORES.superficie,
          borderTopWidth: 0, // sin línea arriba: se separa con la sombra
          boxShadow: '0px -2px 12px rgba(20, 35, 26, 0.05)',
          paddingTop: 6,
        },
        sceneStyle: { backgroundColor: COLORES.fondo },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Gastos',
          tabBarIcon: iconoPestania({ ios: 'list.bullet.rectangle.fill', android: 'receipt_long' }),
        }}
      />
      <Tabs.Screen
        name="resumen"
        options={{
          title: 'Resumen',
          tabBarIcon: iconoPestania({ ios: 'chart.pie.fill', android: 'pie_chart' }),
        }}
      />
    </Tabs>
  );
}

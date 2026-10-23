import { Tabs } from 'expo-router';

// Las dos pestañas de la app (FR-014).
export default function LayoutPestanias() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Gastos' }} />
      <Tabs.Screen name="resumen" options={{ title: 'Resumen' }} />
    </Tabs>
  );
}

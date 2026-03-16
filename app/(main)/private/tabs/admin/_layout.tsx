import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Panel de Control' }} />
      <Stack.Screen name="users/index" options={{ title: 'Usuarios' }} />
      <Stack.Screen name="users/[id]" options={{ title: 'Detalle de Usuario' }} />
      <Stack.Screen name="tables/index" options={{ title: 'Gestión de Mesas' }} />
      <Stack.Screen name="menus/index" options={{ title: 'Edición de Menús' }} />
      <Stack.Screen name="reports/index" options={{ title: 'Reportes de Caja' }} />
    </Stack>
  );
}

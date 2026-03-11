import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore } from '../../src/store/useMainStore';

export default function MainLayout() {
  const currentUser = useMainStore((state) => state.currentUser);
  
  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#059432',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      {currentUser.role === 'waiter' && (
        <>
          <Tabs.Screen
            name="private/waiter"
            options={{ title: 'Mesas', tabBarIcon: ({ color, size }) => <MaterialIcons name="table-restaurant" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/tabs/orders"
            options={{ title: 'Pedidos', tabBarIcon: ({ color, size }) => <MaterialIcons name="receipt-long" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/tabs/profile"
            options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} /> }}
          />
        </>
      )}
      {currentUser.role === 'kitchen' && (
        <>
          <Tabs.Screen
            name="private/kitchen"
            options={{ title: 'Pedidos', tabBarIcon: ({ color, size }) => <MaterialIcons name="restaurant-menu" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/tabs/history"
            options={{ title: 'Historial', tabBarIcon: ({ color, size }) => <MaterialIcons name="history" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/tabs/settings"
            options={{ title: 'Ajustes', tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} /> }}
          />
        </>
      )}
      {currentUser.role === 'cashier' && (
        <>
          <Tabs.Screen
            name="private/cashier"
            options={{ title: 'Mesas', tabBarIcon: ({ color, size }) => <MaterialIcons name="table-restaurant" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/tabs/orders"
            options={{ title: 'Pedidos', tabBarIcon: ({ color, size }) => <MaterialIcons name="receipt-long" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/tabs/cash"
            options={{ title: 'Cierre', tabBarIcon: ({ color, size }) => <MaterialIcons name="attach-money" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/tabs/settings"
            options={{ title: 'Ajustes', tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} /> }}
          />
        </>
      )}
      {currentUser.role === 'admin' && (
        <>
          <Tabs.Screen
            name="private/admin"
            options={{ title: 'Panel', tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/admin/users"
            options={{ title: 'Usuarios', tabBarIcon: ({ color, size }) => <MaterialIcons name="people" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/admin/products"
            options={{ title: 'Productos', tabBarIcon: ({ color, size }) => <MaterialIcons name="inventory" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/admin/closures"
            options={{ title: 'Cierres', tabBarIcon: ({ color, size }) => <MaterialIcons name="lock" size={size} color={color} /> }}
          />
          <Tabs.Screen
            name="private/admin/settings"
            options={{ title: 'Ajustes', tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} /> }}
          />
        </>
      )}
    </Tabs>
  );
}

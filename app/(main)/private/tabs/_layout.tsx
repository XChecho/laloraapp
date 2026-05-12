import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Icon, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@src/store/useAuthStore';

type TabKey = 'cancha' | 'mesas' | 'caja' | 'cocina' | 'admin';

const canAccessTab = (userType: string | null, tab: TabKey): boolean => {
  const role = userType?.toLowerCase();
  switch (role) {
    case 'admin':
      return true;
    case 'cashier':
      return ['cancha', 'mesas', 'caja', 'cocina'].includes(tab);
    case 'kitchen':
      return ['cocina', 'mesas'].includes(tab);
    case 'waiter':
    case 'waitress':
      return ['mesas', 'cancha'].includes(tab);
    default:
      return false;
  }
};

const TabsLayout = () => {
  const { userType } = useAuthStore();
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'android') {
    return (
      <Tabs
        // Customize the bottom tab bar specifically for Android to reduce height
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            paddingBottom: insets.bottom,
            height: 65 + insets.bottom,
            paddingTop: 8,
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
          },
          tabBarActiveTintColor: '#16a34a',
          tabBarInactiveTintColor: '#64748b',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="cancha/index"
          options={{
            title: "Cancha",
            href: canAccessTab(userType, 'cancha') ? undefined : null,
            tabBarIcon: ({ color, size }) => <Ionicons name="football-outline" size={size || 24} color={color} />
          }}
        />
        <Tabs.Screen
          name="waitres"
          options={{
            title: "Mesas",
            href: canAccessTab(userType, 'mesas') ? undefined : null,
            tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size || 24} color={color} />
          }}
        />
        <Tabs.Screen
          name="cashier/index"
          options={{
            title: "Caja",
            href: canAccessTab(userType, 'caja') ? undefined : null,
            tabBarIcon: ({ color, size }) => <Ionicons name="cash-outline" size={size || 24} color={color} />
          }}
        />
        <Tabs.Screen
          name="kitchen/index"
          options={{
            title: "Cocina",
            href: canAccessTab(userType, 'cocina') ? undefined : null,
            tabBarIcon: ({ color, size }) => <Ionicons name="flame-outline" size={size || 24} color={color} />
          }}
        />
        <Tabs.Screen
          name="admin"
          options={{
            title: "Admin",
            href: canAccessTab(userType, 'admin') ? undefined : null,
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size || 24} color={color} />
          }}
        />
      </Tabs>
    );
  }

  return (
    <NativeTabs>
      {canAccessTab(userType, 'cancha') && (
        <NativeTabs.Trigger name="cancha/index" options={{ title: "Cancha" }}>
          <Icon src={<VectorIcon family={Ionicons} name="football-outline" />} />
        </NativeTabs.Trigger>
      )}
      {canAccessTab(userType, 'mesas') && (
        <NativeTabs.Trigger name="waitres" options={{ title: "Mesas" }}>
          <Icon src={<VectorIcon family={Ionicons} name="grid-outline" />} />
        </NativeTabs.Trigger>
      )}
      {canAccessTab(userType, 'caja') && (
        <NativeTabs.Trigger name="cashier/index" options={{ title: "Caja" }}>
          <Icon src={<VectorIcon family={Ionicons} name="cash-outline" />} />
        </NativeTabs.Trigger>
      )}
      {canAccessTab(userType, 'cocina') && (
        <NativeTabs.Trigger name="kitchen/index" options={{ title: "Cocina" }}>
          <Icon src={<VectorIcon family={Ionicons} name="flame-outline" />} />
        </NativeTabs.Trigger>
      )}
      {canAccessTab(userType, 'admin') && (
        <NativeTabs.Trigger name="admin" options={{ title: "Admin" }}>
          <Icon src={<VectorIcon family={Ionicons} name="settings-outline" />} />
        </NativeTabs.Trigger>
      )}
    </NativeTabs>
  );
};

export default TabsLayout;

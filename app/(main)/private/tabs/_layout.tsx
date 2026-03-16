import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Icon, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabsLayout = () => {

  const insets = useSafeAreaInsets();

  if (Platform.OS === 'android') {
    return (
      <Tabs
        // Customize the bottom tab bar specifically for Android to reduce height
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            paddingBottom: insets.bottom,
            height: 55 + insets.bottom,
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
            tabBarIcon: ({ color, size }) => <Ionicons name="football-outline" size={size || 24} color={color} />
          }}
        />
        <Tabs.Screen
          name="waitres"
          options={{
            title: "Mesas",
            tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size || 24} color={color} />
          }}
        />
        <Tabs.Screen
          name="cashier/index"
          options={{
            title: "Caja",
            tabBarIcon: ({ color, size }) => <Ionicons name="cash-outline" size={size || 24} color={color} />
          }}
        />
        <Tabs.Screen
          name="kitchen/index"
          options={{
            title: "Cocina",
            tabBarIcon: ({ color, size }) => <Ionicons name="flame-outline" size={size || 24} color={color} />
          }}
        />
        <Tabs.Screen
          name="admin"
          options={{
            title: "Admin",
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size || 24} color={color} />
          }}
        />
      </Tabs>
    );
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="cancha/index" options={{ title: "Cancha" }}>
        <Icon src={<VectorIcon family={Ionicons} name="football-outline" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="waitres" options={{ title: "Mesas" }}>
        <Icon src={<VectorIcon family={Ionicons} name="grid-outline" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cashier/index" options={{ title: "Caja" }}>
        <Icon src={<VectorIcon family={Ionicons} name="cash-outline" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="kitchen/index" options={{ title: "Cocina" }}>
        <Icon src={<VectorIcon family={Ionicons} name="flame-outline" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="admin" options={{ title: "Admin" }}>
        <Icon src={<VectorIcon family={Ionicons} name="settings-outline" />} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;

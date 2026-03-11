import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserRole } from '../store/useMainStore';

type TabKey = 'tables' | 'orders' | 'kitchen' | 'settings';

interface Tab {
  key: TabKey;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface BottomNavProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  role?: UserRole;
}

const tabsByRole: Record<UserRole, Tab[]> = {
  waiter: [
    { key: 'orders', label: 'Pedidos', icon: 'receipt-long' },
    { key: 'tables', label: 'Mesas', icon: 'table-restaurant' },
    { key: 'settings', label: 'Ajustes', icon: 'settings' },
  ],
  kitchen: [
    { key: 'kitchen', label: 'Cocina', icon: 'restaurant' },
    { key: 'orders', label: 'Pedidos', icon: 'receipt-long' },
    { key: 'settings', label: 'Ajustes', icon: 'settings' },
  ],
  cashier: [
    { key: 'tables', label: 'Mesas', icon: 'table-restaurant' },
    { key: 'orders', label: 'Pedidos', icon: 'receipt-long' },
    { key: 'settings', label: 'Ajustes', icon: 'settings' },
  ],
  admin: [
    { key: 'tables', label: 'Mesas', icon: 'table-restaurant' },
    { key: 'orders', label: 'Pedidos', icon: 'receipt-long' },
    { key: 'kitchen', label: 'Cocina', icon: 'restaurant' },
    { key: 'settings', label: 'Ajustes', icon: 'settings' },
  ],
};

export default function BottomNav({ activeTab, onTabPress, role = 'waiter' }: BottomNavProps) {
  const tabs = tabsByRole[role] || tabsByRole.waiter;

  return (
    <View className="bg-white border-t border-gray-200 pb-safe pt-2 px-2">
      <View className="flex-row justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              className={`flex-1 items-center py-2 rounded-xl mx-1 ${
                isActive ? 'bg-green-50' : ''
              }`}
            >
              <MaterialIcons
                name={tab.icon}
                size={28}
                color={isActive ? '#059432' : '#9CA3AF'}
              />
              <Text
                className={`text-xs mt-1 font-semibold ${
                  isActive ? 'text-[#059432]' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

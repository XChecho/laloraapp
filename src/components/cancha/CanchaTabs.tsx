import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface CanchaTabsProps {
  activeTab: 'reservas' | 'ventas';
  onTabChange: (tab: 'reservas' | 'ventas') => void;
  primaryColor: string;
}

export const CanchaTabs: React.FC<CanchaTabsProps> = ({ activeTab, onTabChange, primaryColor }) => {
  return (
    <View style={{ paddingHorizontal: 24, marginTop: 4 }}>
      <View style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: 6, borderRadius: 24, flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' }}>
        <Pressable
          onPress={() => onTabChange('reservas')}
          style={{ flex: 1, paddingVertical: 12, borderRadius: 20, alignItems: 'center', backgroundColor: activeTab === 'reservas' ? primaryColor : 'transparent' }}
        >
          <Text style={{ fontFamily: 'InterBold', color: activeTab === 'reservas' ? 'white' : '#94A3B8' }}>Reservas</Text>
        </Pressable>
        <Pressable
          onPress={() => onTabChange('ventas')}
          style={{ flex: 1, paddingVertical: 12, borderRadius: 20, alignItems: 'center', backgroundColor: activeTab === 'ventas' ? primaryColor : 'transparent' }}
        >
          <Text style={{ fontFamily: 'InterBold', color: activeTab === 'ventas' ? 'white' : '#94A3B8' }}>Ventas Individuales</Text>
        </Pressable>
      </View>
    </View>
  );
};

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdminZones } from '@src/hooks/useAdminZones';

interface TablesSectionProps {
  onPress?: () => void;
}

export const TablesSection: React.FC<TablesSectionProps> = ({ onPress }) => {
  const { data, isLoading } = useAdminZones();

  const zones = Array.isArray(data) ? data : [];
  const totalTables = zones.reduce((sum, z) => sum + (z.tables?.length || 0), 0);

  if (isLoading) {
    return (
      <Pressable className="bg-white rounded-[32px] p-6 mb-4 shadow-sm border border-lora-border/30">
        <Text className="text-xl font-InterBold text-lora-text mb-6">Gestión de Mesas</Text>
        <View className="items-center py-4">
          <ActivityIndicator size="small" color="#94A3B8" />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="bg-white rounded-[32px] p-6 mb-4 shadow-sm border border-lora-border/30 active:opacity-90"
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-InterBold text-lora-text">Gestión de Mesas</Text>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </View>

      <View className="flex-row flex-wrap gap-4">
        {zones.slice(0, 4).map((zone) => {
          const tableCount = zone.tables?.length || 0;
          return (
            <View
              key={zone.id}
              className="bg-lora-bg/50 px-4 py-3 rounded-2xl flex-row items-center border border-lora-border/10"
              style={{ minWidth: '45%' }}
            >
              <View className="w-8 h-8 rounded-lg bg-white items-center justify-center mr-3 shadow-sm">
                <Ionicons name={(zone.icon as any) || 'restaurant'} size={16} color="#0A873A" />
              </View>
              <View>
                <Text className="text-[13px] font-InterBold text-lora-text">{zone.name}</Text>
                <Text className="text-[10px] font-InterMedium text-lora-text-muted">{tableCount} Mesas</Text>
              </View>
            </View>
          );
        })}

        {zones.length === 0 && (
          <View className="w-full py-4 items-center">
            <Text className="text-sm font-InterMedium text-lora-text-muted italic">
              No hay espacios configurados
            </Text>
          </View>
        )}
      </View>

      <View className="mt-6 pt-6 border-t border-lora-border/30 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
          <Text className="text-[11px] font-InterBold text-lora-text-muted uppercase tracking-wider">
            {totalTables} Mesas Totales
          </Text>
        </View>
        <Text className="text-[11px] font-InterBold text-lora-primary uppercase tracking-wider">
          Configurar ahora
        </Text>
      </View>
    </Pressable>
  );
};

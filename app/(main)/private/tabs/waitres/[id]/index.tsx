import { MOCK_DB } from '@core/database/mockDb';
import { formatCOP } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useModalStore } from '@store/useModalStore';

const getTimeElapsed = (dateString: string) => {
    const start = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - start) / 1000 / 60); // minutes
    return `${diff} min`;
};

const TableDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const openModal = useModalStore(state => state.openModal);
  const [now, setNow] = useState(new Date());

  // Update timers every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const table = MOCK_DB.tables.find(t => t.id === Number(id));

  if (!table) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="font-InterBold text-lg">Mesa no encontrada</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
            <Text className="text-lora-primary font-InterBold">Regresar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleCloseTable = () => {
    openModal('CONFIRMATION', {
        title: 'Cerrar Mesa',
        message: `¿Estás seguro de que deseas cerrar la ${table.name}? Total: ${formatCOP(table.total)}`,
        onConfirm: () => {
            console.log("Cerrando mesa...");
            router.replace('/(main)/private/tabs/waitres' as any);
        }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-4 flex-row items-center border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#1B2332" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-xl font-InterBold text-lora-text">{table.name}</Text>
          <Text className="text-xs font-InterMedium text-lora-primary uppercase">
            {table.status} • Abierta hace {table.openedAt ? getTimeElapsed(table.openedAt) : '0 min'}
          </Text>
        </View>
        <Pressable 
            onPress={handleCloseTable}
            className="bg-red-50 px-4 py-2 rounded-xl"
        >
          <Text className="text-red-500 font-InterBold text-xs">Cerrar Mesa</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-end mb-6">
            <View>
                <Text className="text-sm font-InterBold text-gray-400 uppercase tracking-widest">Resumen de Pedido</Text>
                <Text className="text-xs font-InterMedium text-gray-400 mt-1">
                    {table.currentOrder.length} productos solicitados
                </Text>
            </View>
            <View className="items-end">
                <Text className="text-2xl font-InterBold text-lora-text">{formatCOP(table.total)}</Text>
            </View>
        </View>

        {table.currentOrder.length > 0 ? (
          <View className="space-y-4 mb-10">
            {table.currentOrder.map((item, index) => (
              <View key={index} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-row items-center">
                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="font-InterBold text-lora-text text-base">{item.name}</Text>
                        <Text className="font-InterBold text-lora-primary">{formatCOP(item.price)}</Text>
                    </View>
                    
                    {(item.protein || item.term || item.notes) && (
                        <Text className="text-xs text-gray-500 font-InterMedium mb-2">
                            {[item.protein, item.term, item.notes].filter(Boolean).join(' • ')}
                        </Text>
                    )}

                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#94A3B8" />
                        <Text className="text-[11px] text-gray-400 font-InterBold ml-1 uppercase">
                            Hace {item.requestedAt ? getTimeElapsed(item.requestedAt) : '0 min'}
                        </Text>
                        <View className="mx-2 w-1 h-1 rounded-full bg-gray-300" />
                        <View className="bg-orange-100 px-2 py-0.5 rounded-full">
                            <Text className="text-[9px] font-InterBold text-orange-600 uppercase">En preparación</Text>
                        </View>
                    </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="py-20 items-center justify-center">
            <Ionicons name="receipt-outline" size={64} color="#E2E8F0" />
            <Text className="text-gray-400 font-InterBold mt-4">No hay productos en esta mesa</Text>
          </View>
        )}
      </ScrollView>

      {/* Actions */}
      <View className="p-6 bg-white border-t border-gray-100">
        <Pressable
          onPress={() => router.push(`/(main)/private/tabs/waitres/${id}/menu` as any)}
          className="bg-lora-primary py-4 rounded-2xl flex-row items-center justify-center active:opacity-70 shadow-sm"
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white font-InterBold text-lg ml-2">Añadir Productos</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default TableDetailsScreen;

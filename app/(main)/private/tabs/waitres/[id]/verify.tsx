import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMainStore } from '@/src/store/useMainStore';
import { formatCOP } from '@/core/helper/validators';
import { OrderItem } from '@/core/database/mockDb';

const VerifyScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentOrder, clearOrder, removeItem } = useMainStore();
  const [generalNotes, setGeneralNotes] = useState('');

  const total = currentOrder.reduce((acc, item) => acc + item.price, 0);

  // Agrupar ítems idénticos
  const groupedOrder = currentOrder.reduce((acc: { item: OrderItem; count: number; ids: string[] }[], current) => {
    const existingIndex = acc.findIndex((group) => {
      const g = group.item;
      return (
        g.id === current.id &&
        g.term === current.term &&
        g.protein === current.protein &&
        g.sideDrink === current.sideDrink &&
        g.sauce === current.sauce &&
        g.notes === current.notes
      );
    });

    if (existingIndex > -1) {
      acc[existingIndex].count += 1;
      acc[existingIndex].ids.push(current.instanceId);
    } else {
      acc.push({ item: current, count: 1, ids: [current.instanceId] });
    }
    return acc;
  }, []);

  const handleSendToKitchen = () => {
    Alert.alert(
      'Enviar Pedido',
      '¿Está seguro de enviar este pedido a la cocina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => {
            clearOrder();
            router.dismissAll();
            router.replace('/(main)/private/tabs/waitres');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#1B2332" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-InterBold text-lora-text mr-10">
          Verificar Pedido
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <View className="mb-6">
          <Text className="text-2xl font-InterBold text-lora-text">Mesa {id}</Text>
          <Text className="text-gray-500 text-sm">Resumen de los platos seleccionados</Text>
        </View>

        {/* Grouped Items */}
        <View className="space-y-4 mb-8">
          {groupedOrder.map((group, index) => (
            <View
              key={`${group.item.id}-${index}`}
              className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm"
            >
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center">
                    {group.count > 1 && (
                      <View className="bg-lora-primary/10 px-2 py-0.5 rounded-md mr-2">
                        <Text className="text-lora-primary font-InterBold text-xs">x{group.count}</Text>
                      </View>
                    )}
                    <Text className="font-InterBold text-lora-text text-base">{group.item.name}</Text>
                  </View>
                  
                  {/* Item Details */}
                  <View className="mt-2 space-y-1">
                    {group.item.protein && (
                      <Text className="text-gray-500 text-xs font-InterMedium">
                        🥩 Proteína: <Text className="text-lora-text">{group.item.protein}</Text>
                      </Text>
                    )}
                    {group.item.sideDrink && (
                      <Text className="text-gray-500 text-xs font-InterMedium">
                        🥤 Bebida: <Text className="text-lora-text">{group.item.sideDrink}</Text>
                      </Text>
                    )}
                    {group.item.term && (
                      <Text className="text-gray-500 text-xs font-InterMedium">
                        🔥 Término: <Text className="text-lora-text">{group.item.term}</Text>
                      </Text>
                    )}
                    {group.item.notes && (
                      <Text className="text-orange-500 text-xs italic font-InterMedium">
                        📝 "{group.item.notes}"
                      </Text>
                    )}
                  </View>
                </View>
                
                <View className="items-end justify-between">
                  <TouchableOpacity 
                    onPress={() => removeItem(group.ids[0])}
                    className="p-2 bg-red-50 rounded-full"
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                  <Text className="font-InterBold text-lora-primary">{formatCOP(group.item.price * group.count)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* General Notes */}
        <View className="mb-10">
          <Text className="text-sm font-InterBold text-gray-500 mb-2 uppercase tracking-wider ml-1">Notas del Pedido</Text>
          <TextInput
            className="bg-white border border-gray-100 rounded-[24px] p-4 text-sm h-32 shadow-sm"
            placeholder="Comentarios generales para toda la mesa..."
            multiline
            value={generalNotes}
            onChangeText={setGeneralNotes}
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View className="p-4 bg-white border-t border-gray-100">
        <View className="flex-row items-center justify-between mb-4 px-2">
          <Text className="text-gray-500 font-InterBold">Total Pedido</Text>
          <Text className="text-2xl font-InterBold text-lora-text">{formatCOP(total)}</Text>
        </View>
        <TouchableOpacity
          onPress={handleSendToKitchen}
          className="bg-emerald-600 py-5 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-emerald-500/30"
        >
          <Text className="text-white font-InterBold text-lg mr-2">
            Enviar a Cocina
          </Text>
          <Ionicons name="paper-plane" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyScreen;

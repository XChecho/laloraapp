import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { useModalStore } from '@store/useModalStore';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '@core/helper/validators';
import { router } from 'expo-router';
import { MOCK_DB } from '@core/database/mockDb';

export const OrderDetailsModal = () => {
  const { activeModal, modalData, closeModal } = useModalStore();
  const visible = activeModal === 'ORDER_DETAILS';

  const table = MOCK_DB.tables.find(t => t.id === modalData.tableId);

  if (!visible || !table) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[32px] p-6">
          <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-6" />
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-xl font-InterBold text-lora-text">Pedido {table.name}</Text>
              <Text className="text-gray-500 text-sm">Productos en curso</Text>
            </View>
            <Pressable onPress={closeModal}>
              <Ionicons name="close-circle" size={32} color="#94A3B8" />
            </Pressable>
          </View>

          <ScrollView className="max-h-[400px]" showsVerticalScrollIndicator={false}>
            <View className="space-y-3 mb-8">
              {table.currentOrder.length > 0 ? (
                table.currentOrder.map((item, index) => (
                  <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-50">
                    <View>
                      <Text className="font-InterSemiBold text-lora-text">{item.name}</Text>
                      {item.term && <Text className="text-xs text-lora-primary font-InterMedium">{item.term}</Text>}
                    </View>
                    <Text className="font-InterBold text-lora-text">{formatCOP(item.price)}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-center py-4 font-InterMedium">No hay productos en este pedido</Text>
              )}
              
              <View className="flex-row justify-between items-center pt-4 border-t border-gray-100">
                <Text className="text-lg font-InterBold text-lora-text">Total</Text>
                <Text className="text-lg font-InterBold text-lora-primary">{formatCOP(table.total)}</Text>
              </View>
            </View>
          </ScrollView>

          <Pressable
            onPress={() => {
              closeModal();
              router.push(`/(main)/private/tabs/waitres/${table.id}`);
            }}
            className="bg-lora-primary py-4 rounded-xl flex-row items-center justify-center mb-2 active:opacity-70"
          >
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text className="text-white font-InterBold text-base ml-2">Gestionar Mesa</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

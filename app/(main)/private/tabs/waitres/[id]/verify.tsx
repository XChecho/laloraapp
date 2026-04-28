import { formatCOP } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useMainStore } from '@src/store/useMainStore';
import { useActiveOrderByTable, useCreateOrder, useAddOrderItems, useUpdateOrderStatus } from '@src/hooks/useOrders';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const VerifyOrderScreen = () => {
  const { id } = useLocalSearchParams();
  const tableId = id as string;
  const router = useRouter();
  const { currentOrder, removeItem, clearOrder } = useMainStore();
  const { data: activeOrder, isLoading: orderLoading } = useActiveOrderByTable(tableId);
  const createOrder = useCreateOrder();
  const addOrderItems = useAddOrderItems();
  const updateOrderStatus = useUpdateOrderStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = currentOrder.reduce((sum, item) => sum + item.price, 0);

  const handleSendOrder = async () => {
    if (currentOrder.length === 0) return;
    setIsSubmitting(true);

    try {
      let orderId = activeOrder?.id;

      if (!orderId) {
        const newOrder = await createOrder.mutateAsync({ tableId });
        orderId = newOrder.id;
      }

      const itemsToSend = currentOrder.map((item) => ({
        productId: item.id,
        quantity: 1,
        price: item.price,
        notes: item.notes || undefined,
        modifiers: item.modifiers?.map((mod: any) => ({
          modifierName: mod.modifierName,
          selectedOption: mod.selectedOption,
          priceExtra: mod.priceExtra || 0,
          affectsKitchen: mod.affectsKitchen || false,
        })) || [],
      }));

      await addOrderItems.mutateAsync({ orderId, data: { items: itemsToSend } });
      await updateOrderStatus.mutateAsync({ orderId, data: { status: 'CONFIRMED' } });

      clearOrder();
      Alert.alert('Éxito', 'Pedido enviado a cocina correctamente', [
        { text: 'OK', onPress: () => router.replace({
          pathname: '/(main)/private/tabs/waitres/[id]',
          params: { id: tableId },
        } as any) },
      ]);
    } catch (error: any) {
      console.error('Error sending order:', error);
      Alert.alert('Error', error?.message || 'No se pudo enviar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0A873A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#1B2332" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-InterBold text-lora-text mr-10">
          Verificar Pedido - Mesa {id}
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {currentOrder.map((item) => (
          <View key={item.instanceId} className="bg-white p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm border border-gray-100">
            <View className="flex-1">
              <Text className="font-InterBold text-lora-text text-base">{item.name}</Text>
              {item.notes && <Text className="text-xs text-lora-primary font-InterItalic mt-1 italic">{item.notes}</Text>}
            </View>
            <View className="items-center">
              <Text className="font-InterBold text-lora-primary mb-2">{formatCOP(item.price)}</Text>
              <Pressable onPress={() => removeItem(item.instanceId)} className="p-2">
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </Pressable>
            </View>
          </View>
        ))}

        {currentOrder.length === 0 && (
          <View className="items-center justify-center py-20">
            <Ionicons name="cart-outline" size={64} color="#CBD5E1" />
            <Text className="text-gray-400 font-InterMedium mt-4">No hay productos en el pedido</Text>
          </View>
        )}
      </ScrollView>

      {currentOrder.length > 0 && (
        <View className="px-6 pt-6 pb-12 bg-white border-t border-gray-100">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-gray-500 font-InterBold text-lg">Total del Pedido</Text>
            <Text className="text-2xl font-InterBold text-lora-primary">{formatCOP(total)}</Text>
          </View>
          <Pressable
            onPress={handleSendOrder}
            disabled={isSubmitting}
            className={`py-4 rounded-2xl items-center shadow-lg active:opacity-70 ${isSubmitting ? 'bg-lora-primary/50' : 'bg-lora-primary'}`}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-InterBold text-lg">Confirmar y Enviar a Cocina</Text>
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VerifyOrderScreen;

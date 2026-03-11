import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Order, OrderItem } from '../store/useMainStore';

interface OrderCardProps {
  order: Order;
  onMarkReady?: () => void;
  onPress?: () => void;
}

function formatTimeElapsed(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} min`;
  }
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
}

export default function OrderCard({ order, onMarkReady, onPress }: OrderCardProps) {
  const isReady = order.status === 'ready';
  const pendingItems = order.items.filter((item: OrderItem) => item.status === 'pending');
  const hasPendingItems = pendingItems.length > 0;

  return (
    <Pressable
      onPress={onPress}
      className={`bg-white rounded-2xl shadow-md mb-4 overflow-hidden ${
        isReady ? 'border-2 border-green-500' : ''
      }`}
    >
      <View className={`px-4 py-3 ${isReady ? 'bg-green-500' : 'bg-red-500'}`}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-xl font-bold">
              {order.tableName || `Pedido #${order.id.slice(-4)}`}
            </Text>
            {order.customerName && (
              <Text className="text-white/90 text-sm">{order.customerName}</Text>
            )}
          </View>
          <View className="bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white font-semibold">{formatTimeElapsed(order.createdAt)}</Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        <View className="space-y-2 mb-4">
          {order.items.map((item: OrderItem) => (
            <View key={item.id} className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-lg font-bold text-gray-800">{item.quantity}x</Text>
                  <Text className="text-base text-gray-700 ml-2">{item.productName}</Text>
                  {item.meatDoneness && (
                    <View className="ml-2 bg-amber-100 px-2 py-0.5 rounded">
                      <Text className="text-xs text-amber-800">
                        {item.meatDoneness === 'blue' ? 'Azul' : 
                         item.meatDoneness === 'medium' ? 'Medio' :
                         item.meatDoneness === 'threequarters' ? '3/4' : 'Bien cocido'}
                      </Text>
                    </View>
                  )}
                </View>
                {item.notes && (
                  <Text className="text-sm text-gray-500 ml-6 italic">Nota: {item.notes}</Text>
                )}
              </View>
              <View className={`px-2 py-1 rounded ${
                item.status === 'ready' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Text className={`text-xs font-semibold ${
                  item.status === 'ready' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {item.status === 'ready' ? 'Listo' : 'Pendiente'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="border-t border-gray-200 pt-3 flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-800">
            Total: ${order.total.toLocaleString('es-CO')}
          </Text>
          {hasPendingItems && onMarkReady && (
            <TouchableOpacity
              onPress={onMarkReady}
              className="bg-green-500 px-6 py-2 rounded-xl"
            >
              <Text className="text-white font-bold text-base">Marcar Listo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  );
}

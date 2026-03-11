import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Order, useMainStore } from '@/store/useMainStore';

const PRIMARY_COLOR = '#059432';

interface OrderCardProps {
  order: Order;
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

export default function OrderCard({ order }: OrderCardProps) {
  const { updateOrderStatus } = useMainStore();
  const isReady = order.status === 'ready';
  
  const handleMarkReady = () => {
    updateOrderStatus(order.id, 'ready');
  };

  const headerBgColor = isReady ? PRIMARY_COLOR : '#DC2626';
  const displayName = order.tableName || order.customerName || `Orden ${order.id}`;
  const orderNumber = order.tableName ? order.tableName.replace('Mesa ', '#') : `#${order.id.slice(-4)}`;

  const allItemsWithNotes = order.items.filter(item => item.notes || item.meatDoneness);
  const regularItems = order.items.filter(item => !item.notes && !item.meatDoneness);

  const meatDonenessLabels: Record<string, string> = {
    blue: 'Azul',
    medium: 'Medio',
    threequarters: '3/4',
    welldone: 'Bien cocido',
  };

  return (
    <View className="bg-white rounded-lg overflow-hidden mb-4 shadow-lg">
      <View 
        className="flex-row justify-between items-center px-4 py-3"
        style={{ backgroundColor: headerBgColor }}
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-white text-2xl font-bold">{orderNumber}</Text>
          {order.type === 'takeout' && (
            <MaterialIcons name="takeout-dining" size={24} color="white" />
          )}
        </View>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="access-time" size={24} color="white" />
          <Text className="text-white text-xl font-bold">{formatTimeElapsed(order.createdAt)}</Text>
        </View>
      </View>

      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-3">{displayName}</Text>

        <View className="mb-3">
          {regularItems.map((item) => (
            <View key={item.id} className="flex-row justify-between items-center py-1 border-b border-gray-100">
              <View className="flex-row items-center gap-2 flex-1">
                <Text className="text-2xl font-bold text-gray-800 w-8">{item.quantity}x</Text>
                <Text className="text-xl text-gray-700 flex-1">{item.productName}</Text>
              </View>
              <View className="flex-row gap-2">
                {item.meatDoneness && (
                  <View className="bg-amber-100 px-2 py-1 rounded">
                    <Text className="text-lg font-semibold text-amber-800">
                      {meatDonenessLabels[item.meatDoneness]}
                    </Text>
                  </View>
                )}
                {item.notes && (
                  <View className="bg-amber-100 px-2 py-1 rounded">
                    <Text className="text-lg font-semibold text-amber-800">{item.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {allItemsWithNotes.length > 0 && regularItems.length > 0 && (
          <View className="mb-3">
            {allItemsWithNotes.map((item) => (
              <View key={item.id} className="py-1">
                <Text className="text-lg font-bold text-gray-800 mb-1">{item.productName}</Text>
                <View className="flex-row gap-2 flex-wrap">
                  {item.meatDoneness && (
                    <View className="bg-amber-100 px-2 py-1 rounded">
                      <Text className="text-lg font-semibold text-amber-800">
                        {meatDonenessLabels[item.meatDoneness]}
                      </Text>
                    </View>
                  )}
                  {item.notes && (
                    <View className="bg-yellow-200 px-2 py-1 rounded">
                      <Text className="text-lg font-bold text-yellow-900">{item.notes}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {!isReady && (
          <TouchableOpacity
            className="mt-4 py-4 rounded-lg items-center"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onPress={handleMarkReady}
          >
            <Text className="text-white text-2xl font-bold">MARCAR LISTO</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

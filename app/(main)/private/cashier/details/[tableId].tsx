import useMainStore from '@/src/store/useMainStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const PRIMARY_COLOR = '#059432';
const TAX_RATE = 0.0;

export default function TableDetailsScreen() {
  const router = useRouter();
  const { tableId } = useLocalSearchParams<{ tableId: string }>();
  const { tables, orders, currentTable, currentOrder, closeTable, updateOrderStatus } = useMainStore();

  const table = useMemo(() => {
    return tables.find((t) => t.id === tableId);
  }, [tables, tableId]);

  const order = useMemo(() => {
    if (!table?.orderId) return null;
    return orders.find((o) => o.id === table.orderId);
  }, [table, orders]);

  const subtotal = order?.items.reduce((sum, item) => sum + item.price, 0) || 0;
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;

  const handleCobrar = () => {
    if (!order) return;

    Alert.alert(
      'Confirmar Cobro',
      `¿Cobrar $${total.toLocaleString('es-CO')} a ${table?.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Cobro',
          onPress: () => {
            if (order) {
              updateOrderStatus(order.id, 'completed');
              if (table) {
                closeTable(table.id);
              }
              Alert.alert('Éxito', 'Cobro realizado correctamente', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            }
          },
        },
      ]
    );
  };

  const handleCerrarMesa = () => {
    Alert.alert(
      'Cerrar Mesa',
      `¿Está seguro que desea cerrar ${table?.name} sin cobrar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Mesa',
          style: 'destructive',
          onPress: () => {
            if (table) {
              closeTable(table.id);
              router.back();
            }
          },
        },
      ]
    );
  };

  const handlePrintReceipt = () => {
    Alert.alert(
      'Imprimir Recibo',
      'Funcionalidad de impresión en desarrollo',
      [{ text: 'OK' }]
    );
  };

  if (!table) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <MaterialIcons name="error-outline" size={64} color="#D1D5DB" />
        <Text className="text-xl text-gray-400 mt-4">Mesa no encontrada</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-[#059432] px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 py-5">
        <View className="flex-row items-center gap-3 mb-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-3xl font-bold text-white">{table.name}</Text>
            <Text className="text-white/80 text-lg">
              {table.status === 'occupied' ? 'Mesa Ocupada' : 'Mesa Libre'}
            </Text>
          </View>
        </View>
      </View>

      {table.status === 'free' || !order || order.items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <MaterialIcons name="receipt-long" size={80} color="#D1D5DB" />
          <Text className="text-2xl text-gray-400 mt-4 text-center">
            {table.status === 'free' ? 'Mesa Libre' : 'Sin pedidos'}
          </Text>
          <Text className="text-lg text-gray-400 mt-2 text-center">
            {table.status === 'free'
              ? 'Esta mesa no tiene pedidos activos'
              : 'No hay items en esta orden'}
          </Text>

          {table.status === 'occupied' && (
            <TouchableOpacity
              onPress={handleCerrarMesa}
              className="mt-6 bg-red-600 px-8 py-4 rounded-xl"
            >
              <Text className="text-white font-bold text-xl">Cerrar Mesa</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
            <View className="bg-white rounded-2xl shadow-lg p-4 mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-700">Pedido #{order.id}</Text>
                <Text className="text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>

              <View className="border-t border-b border-gray-200 py-4">
                {order.items.map((item) => (
                  <View key={item.id} className="flex-row justify-between items-start py-2">
                    <View className="flex-1 flex-row gap-2">
                      <Text className="text-lg font-bold text-gray-700">
                        {item.quantity}x
                      </Text>
                      <View className="flex-1">
                        <Text className="text-lg text-gray-800">{item.productName}</Text>
                        {item.notes && (
                          <Text className="text-sm text-gray-500 italic">{item.notes}</Text>
                        )}
                        {item.meatDoneness && (
                          <Text className="text-sm text-gray-500">
                            Termino: {item.meatDoneness}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text className="text-lg font-semibold text-gray-800">
                      ${item.price.toLocaleString('es-CO')}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="pt-4 space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-lg text-gray-600">Subtotal</Text>
                  <Text className="text-lg text-gray-800">
                    ${subtotal.toLocaleString('es-CO')}
                  </Text>
                </View>

                {taxes > 0 && (
                  <View className="flex-row justify-between">
                    <Text className="text-lg text-gray-600">Impuestos</Text>
                    <Text className="text-lg text-gray-800">
                      ${taxes.toLocaleString('es-CO')}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between border-t border-gray-200 pt-2 mt-2">
                  <Text className="text-xl font-bold text-gray-800">Total</Text>
                  <Text className="text-2xl font-bold text-[#059432]">
                    ${total.toLocaleString('es-CO')}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handlePrintReceipt}
              className="bg-gray-200 py-4 rounded-xl flex-row items-center justify-center gap-2 mb-4"
            >
              <MaterialIcons name="print" size={24} color="#4B5563" />
              <Text className="text-gray-700 font-bold text-lg">Imprimir Recibo</Text>
            </TouchableOpacity>
          </ScrollView>

          <View className="bg-white border-t border-gray-200 px-4 py-4 space-y-3">
            <TouchableOpacity
              onPress={handleCobrar}
              className="bg-[#059432] py-4 rounded-xl flex-row items-center justify-center gap-2"
            >
              <MaterialIcons name="payment" size={28} color="white" />
              <Text className="text-white font-bold text-xl">Cobrar ${total.toLocaleString('es-CO')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCerrarMesa}
              className="bg-red-100 py-3 rounded-xl flex-row items-center justify-center gap-2"
            >
              <MaterialIcons name="close" size={24} color="#DC2626" />
              <Text className="text-red-600 font-bold text-lg">Cerrar Mesa</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

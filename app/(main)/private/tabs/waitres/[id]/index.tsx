import { formatCOP } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useActiveOrderByTable } from '@src/hooks/useOrders';
import { useTable } from '@src/hooks/useZones';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getTimeElapsed = (dateString: string) => {
  const start = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diff = Math.floor((now - start) / 1000 / 60);
  if (diff < 1) return 'Ahora';
  if (diff < 60) return `${diff} min`;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hours}h ${mins}m`;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    IN_PREPARATION: 'En preparación',
    READY: 'Listo',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
    CLOSED: 'Cerrado',
  };
  return labels[status] || status;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: '#F59E0B',
    CONFIRMED: '#3B82F6',
    IN_PREPARATION: '#F97316',
    READY: '#22C55E',
    DELIVERED: '#06B6D4',
    CANCELLED: '#EF4444',
    CLOSED: '#6B7280',
  };
  return colors[status] || '#6B7280';
};

const TableDetailsScreen = () => {
  const { id, from } = useLocalSearchParams();
  const tableId = id as string;
  const router = useRouter();
  const { data: activeOrder, isLoading } = useActiveOrderByTable(tableId);
  const { data: tableData } = useTable(tableId);

  const handleBack = () => {
    if (from === 'cashier') {
      router.push('/(main)/private/tabs/cashier' as any);
    } else {
      router.back();
    }
  };

  const handleAddProducts = () => {
    router.push({
      pathname: '/(main)/private/tabs/waitres/[id]/menu',
      params: { id: tableId },
    } as any);
  };

  const handleCloseTable = () => {
    Alert.alert('Próximamente', 'El cierre de mesas estará disponible pronto');
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0A873A" />
      </SafeAreaView>
    );
  }

  if (!activeOrder) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="receipt-outline" size={64} color="#CBD5E1" />
        <Text className="mt-4 font-InterBold text-gray-400 text-lg">No hay orden activa</Text>
        <Text className="mt-2 font-InterMedium text-gray-400 text-sm">Esta mesa no tiene una orden abierta</Text>
        <Pressable onPress={handleBack} className="mt-6 bg-lora-primary px-8 py-3 rounded-xl">
          <Text className="text-white font-InterBold">Regresar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-4 flex-row items-center border-b border-gray-100">
        <Pressable onPress={handleBack} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#1B2332" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-xl font-InterBold text-lora-text">
            {activeOrder.table?.name || tableData?.name || `Mesa ${id}`}
          </Text>
          <View className="flex-row items-center mt-1">
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: getStatusColor(activeOrder.status), marginRight: 4 }} />
            <Text className="text-xs font-InterMedium text-lora-primary uppercase">
              {getStatusLabel(activeOrder.status)} • Abierta hace {getTimeElapsed(activeOrder.createdAt)}
            </Text>
          </View>
          {activeOrder.customerName && (
            <Text className="text-xs font-InterMedium text-gray-500 mt-0.5">
              Cliente: {activeOrder.customerName}
            </Text>
          )}
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
              {activeOrder.items.length} producto{activeOrder.items.length !== 1 ? 's' : ''} solicitado{activeOrder.items.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-InterBold text-lora-text">{formatCOP(activeOrder.total)}</Text>
          </View>
        </View>

        {activeOrder.items.length > 0 ? (
          <View className="mb-10">
            {activeOrder.items.map((item) => (
              <View key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-3">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="font-InterBold text-lora-text text-base">{item.product?.name || 'Producto'}</Text>
                  <Text className="font-InterBold text-lora-primary">{formatCOP(item.price)}</Text>
                </View>

                {item.quantity > 1 && (
                  <Text className="text-xs text-gray-500 font-InterMedium mb-1">Cantidad: {item.quantity}</Text>
                )}

                {item.modifiers && item.modifiers.length > 0 && (
                  <View className="mb-2">
                    {item.modifiers.map((mod, idx) => (
                      <Text key={idx} className="text-xs text-gray-500 font-InterMedium">
                        {mod.modifierName}: {mod.selectedOption}
                      </Text>
                    ))}
                  </View>
                )}

                {item.notes && (
                  <Text className="text-xs text-lora-primary font-InterItalic italic">
                    <Text style={{ fontFamily: 'Inter-Italic' }}>&ldquo;{item.notes}&rdquo;</Text>
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View className="py-20 items-center justify-center">
            <Ionicons name="receipt-outline" size={64} color="#E2E8F0" />
            <Text className="text-gray-400 font-InterBold mt-4">No hay productos en esta orden</Text>
          </View>
        )}
      </ScrollView>

      {/* Actions */}
      <View className={`px-6 pt-6 bg-white border-t border-gray-100 ${Platform.OS === 'ios' ? 'pb-16' : ''}`}>
        <Pressable
          onPress={handleAddProducts}
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

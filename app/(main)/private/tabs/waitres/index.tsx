import { formatCOP } from '@core/helper/validators';
import { Table } from '@core/actions/tables';
import { Order } from '@core/actions/orders';
import { Ionicons } from '@expo/vector-icons';
import { useZones, useTablesByZone } from '@hooks/useZones';
import { useCreateOrder, useActiveOrderByTable } from '@hooks/useOrders';
import { ScreenHeader } from '@src/components/ui/ScreenHeader';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TableCard = ({ table, activeOrder, onOpenTable, onViewDetails }: {
  table: Table;
  activeOrder: Order | null | undefined;
  onOpenTable: () => void;
  onViewDetails: () => void;
}) => {
  const isOccupied = table.status === 'OCCUPIED' || !!activeOrder;

  return (
    <View className={`bg-white rounded-2xl p-4 mb-4 border-2 ${isOccupied ? 'border-red-500' : 'border-teal-500'} shadow-sm`}>
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-2xl font-InterBold text-lora-text uppercase">{table.name}</Text>
          <View className={`flex-row items-center mt-1 px-2 py-0.5 rounded-full ${isOccupied ? 'bg-red-100' : 'bg-teal-100'}`}>
            <View className={`w-2 h-2 rounded-full mr-1.5 ${isOccupied ? 'bg-red-500' : 'bg-teal-500'}`} />
            <Text className={`text-[10px] font-InterBold ${isOccupied ? 'text-red-800' : 'text-teal-800'}`}>
              {isOccupied ? 'OCUPADA' : 'LIBRE'}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-500 font-InterMedium">Capacidad</Text>
          <Text className="text-xl font-InterBold text-lora-text">{table.capacity || 4}</Text>
        </View>
      </View>

      {isOccupied && activeOrder && (
        <View className="mb-3">
          {activeOrder.customerName && (
            <Text className="text-xs text-gray-500 font-InterMedium">Cliente: {activeOrder.customerName}</Text>
          )}
          <Text className="text-lg font-InterBold text-lora-primary">{formatCOP(activeOrder.total)}</Text>
        </View>
      )}

      <View className="flex-row gap-2">
        {isOccupied ? (
          <Pressable
            className="flex-1 bg-lora-primary py-3 rounded-xl items-center justify-center active:opacity-70"
            onPress={onViewDetails}
          >
            <Text className="text-white font-InterBold text-sm">Ver Detalles</Text>
          </Pressable>
        ) : (
          <Pressable
            className="w-full bg-lora-primary py-3 rounded-xl items-center justify-center active:opacity-70"
            onPress={onOpenTable}
          >
            <Text className="text-white font-InterBold text-sm">Abrir Mesa</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const TableWithOrder = ({ table, onOpenTable, onViewDetails }: { table: Table; onOpenTable: (tableId: string) => void; onViewDetails: (tableId: string) => void }) => {
  const { data: activeOrder } = useActiveOrderByTable(table.id);

  return (
    <TableCard
      table={table}
      activeOrder={activeOrder}
      onOpenTable={() => onOpenTable(table.id)}
      onViewDetails={() => onViewDetails(table.id)}
    />
  );
};

const ZoneSection = ({ zone, onOpenTable, onViewDetails }: { zone: { id: string; name: string }; onOpenTable: (tableId: string) => void; onViewDetails: (tableId: string) => void }) => {
  const { data: tablesData, isLoading } = useTablesByZone(zone.id);
  const tables = tablesData || [];

  if (isLoading) {
    return (
      <View className="mb-8 px-6">
        <ActivityIndicator size="small" color="#94A3B8" />
      </View>
    );
  }

  if (tables.length === 0) return null;

  return (
    <View className="mb-8">
      <View className="flex-row items-center px-6 mb-4">
        <View className="w-1 h-5 bg-lora-primary rounded-full mr-3" />
        <Text className="text-lg font-InterBold text-lora-text">{zone.name}</Text>
        <View className="ml-3 bg-slate-200 px-2 py-0.5 rounded-md">
          <Text className="text-[10px] font-InterBold text-slate-600">{tables.length}</Text>
        </View>
      </View>

      <View className="px-4">
        {tables.map((table) => (
          <TableWithOrder key={table.id} table={table} onOpenTable={onOpenTable} onViewDetails={onViewDetails} />
        ))}
      </View>
    </View>
  );
};

const WaitresScreen = () => {
  const router = useRouter();
  const { data: zonesData, isLoading: zonesLoading } = useZones();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const createOrder = useCreateOrder();

  const zones = zonesData || [];

  const handleOpenTable = (tableId: string) => {
    setSelectedTable(tableId);
    setCustomerName('');
    setIsModalVisible(true);
  };

  const handleConfirmOpenTable = async () => {
    if (!selectedTable) return;
    try {
      await createOrder.mutateAsync({
        tableId: selectedTable,
        customerName: customerName.trim() || undefined,
      });
      const tableId = selectedTable;
      setIsModalVisible(false);
      setSelectedTable(null);
      setCustomerName('');
      router.push(`/(main)/private/tabs/waitres/${tableId}/menu` as any);
    } catch (error: any) {
      console.error('Error creating order:', error);
      Alert.alert('Error', error?.message || 'No se pudo abrir la mesa');
    }
  };

  const handleViewDetails = (tableId: string) => {
    router.push(`/(main)/private/tabs/waitres/${tableId}/index` as any);
  };

  if (zonesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0A873A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-gray-50">
      <ScreenHeader title="Mesas" subtitle="Restaurante La Lora" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 40, paddingTop: 10 }}>
        {zones.map((zone) => (
          <ZoneSection key={zone.id} zone={zone} onOpenTable={handleOpenTable} onViewDetails={handleViewDetails} />
        ))}

        {zones.length === 0 && (
          <View className="items-center justify-center py-20 opacity-40">
            <Ionicons name="restaurant-outline" size={48} color="#94A3B8" />
            <Text className="mt-4 font-InterBold text-slate-500">No hay espacios configurados</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-black/60 justify-center px-6">
          <View className="bg-white rounded-[32px] p-8 shadow-xl">
            <Text className="text-2xl font-InterBold text-lora-text mb-2">Abrir Mesa</Text>
            <Text className="text-sm font-InterMedium text-lora-text-muted mb-6">Nombre del cliente (opcional)</Text>
            <TextInput
              placeholder="Nombre del cliente..."
              className="bg-lora-bg rounded-2xl p-4 font-InterMedium text-lora-text mb-8 border border-lora-border/20"
              value={customerName}
              onChangeText={setCustomerName}
              autoFocus
            />
            <View className="flex-row gap-4">
              <Pressable onPress={() => { setIsModalVisible(false); setSelectedTable(null); setCustomerName(''); }} className="flex-1 py-4 items-center">
                <Text className="text-lora-text-muted font-InterBold">Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleConfirmOpenTable} disabled={createOrder.isPending} className={`flex-1 py-4 rounded-2xl items-center shadow-sm ${createOrder.isPending ? 'bg-lora-primary/50' : 'bg-lora-primary'}`}>
                {createOrder.isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-InterBold">Abrir</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default WaitresScreen;

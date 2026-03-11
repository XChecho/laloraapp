import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, Table, TableZone } from '@/store/useMainStore';
import TableCard from './components/TableCard';

const PRIMARY_COLOR = '#059432';

const zoneTabs: { key: TableZone; label: string }[] = [
  { key: 'main', label: 'Salón Principal' },
  { key: 'terrace', label: 'Terraza Exterior' },
  { key: 'vip', label: 'VIP / Eventos' },
  { key: 'bar', label: 'Barra' },
];

export default function CashierScreen() {
  const router = useRouter();
  const { tables, orders, currentUser, setCurrentTable, closeTable } = useMainStore();
  const [selectedZone, setSelectedZone] = useState<TableZone>('main');

  const filteredTables = useMemo(() => {
    return tables.filter((table) => table.zone === selectedZone);
  }, [tables, selectedZone]);

  const occupiedTables = useMemo(() => {
    return filteredTables.filter((t) => t.status === 'occupied');
  }, [filteredTables]);

  const freeTables = useMemo(() => {
    return filteredTables.filter((t) => t.status === 'free');
  }, [filteredTables]);

  const dailyStats = useMemo(() => {
    const completedOrders = orders.filter(
      (o) => o.status === 'completed' || o.status === 'ready'
    );
    const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      occupied: tables.filter((t) => t.status === 'occupied').length,
      free: tables.filter((t) => t.status === 'free').length,
      totalSales,
    };
  }, [tables, orders]);

  const handleTablePress = (table: Table) => {
    if (table.status === 'occupied') {
      setCurrentTable(table);
      router.push(`/cashier/details/${table.id}`);
    } else {
      Alert.alert(
        'Abrir Mesa',
        `¿Desea abrir ${table.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abrir',
            onPress: () => {
              setCurrentTable(table);
              router.push(`/cashier/details/${table.id}`);
            },
          },
        ]
      );
    }
  };

  const handleCloseTable = (table: Table) => {
    Alert.alert(
      'Cerrar Mesa',
      `¿Está seguro que desea cerrar ${table.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar',
          style: 'destructive',
          onPress: () => closeTable(table.id),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 py-5">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-3xl font-bold text-white">Caja</Text>
            <Text className="text-white/80 text-lg">Gestión de Mesas</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="account-circle" size={40} color="white" />
            <Text className="text-white font-semibold text-lg">
              {currentUser?.name || 'Cajero'}
            </Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
          <View className="flex-row gap-2">
            {zoneTabs.map((zone) => (
              <TouchableOpacity
                key={zone.key}
                onPress={() => setSelectedZone(zone.key)}
                className={`px-4 py-2 rounded-full ${
                  selectedZone === zone.key
                    ? 'bg-white text-[#059432]'
                    : 'bg-white/20 text-white'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedZone === zone.key ? 'text-[#059432]' : 'text-white'
                  }`}
                >
                  {zone.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {occupiedTables.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-700 mb-3 flex-row items-center gap-2">
              <MaterialIcons name="event-seat" size={24} color="#DC2626" />
              Ocupadas ({occupiedTables.length})
            </Text>
            <View className="flex-row flex-wrap -mx-2">
              {occupiedTables.map((table) => (
                <View key={table.id} className="w-full sm:w-1/2 px-2">
                  <TableCard
                    table={table}
                    onPress={() => handleTablePress(table)}
                    onClose={() => handleCloseTable(table)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {freeTables.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-700 mb-3 flex-row items-center gap-2">
              <MaterialIcons name="event-seat" size={24} color="#059432" />
              Libres ({freeTables.length})
            </Text>
            <View className="flex-row flex-wrap -mx-2">
              {freeTables.map((table) => (
                <View key={table.id} className="w-full sm:w-1/2 px-2">
                  <TableCard
                    table={table}
                    onPress={() => handleTablePress(table)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {filteredTables.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialIcons name="table-restaurant" size={80} color="#D1D5DB" />
            <Text className="text-2xl text-gray-400 mt-4">No hay mesas</Text>
            <Text className="text-lg text-gray-400 mt-2">
              No hay mesas en esta zona
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-gray-500 text-sm">Ocupadas</Text>
            <Text className="text-2xl font-bold text-red-600">
              {dailyStats.occupied}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 text-sm">Libres</Text>
            <Text className="text-2xl font-bold text-green-600">
              {dailyStats.free}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 text-sm">Ventas del Día</Text>
            <Text className="text-2xl font-bold text-[#059432]">
              ${dailyStats.totalSales.toLocaleString('es-CO')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

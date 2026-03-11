import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, Table, OrderType, orderTypeLabels } from '@/store/useMainStore';
import TableCard from '@/components/TableCard';

export default function WaiterScreen() {
  const router = useRouter();
  const { tables, setCurrentTable, currentOrder, openTable, closeTable } = useMainStore();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [orderTypeModalVisible, setOrderTypeModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('dine-in');

  const handleTablePress = (table: Table) => {
    if (table.status === 'occupied') {
      setCurrentTable(table);
      router.push('/waiter/current');
    } else {
      setSelectedTable(table);
      setCustomerName('');
      setSelectedOrderType('dine-in');
      setOrderTypeModalVisible(true);
    }
  };

  const handleOpenTable = () => {
    if (selectedTable) {
      openTable(selectedTable.id, selectedOrderType, selectedOrderType === 'takeout' ? customerName : undefined);
      setOrderTypeModalVisible(false);
      router.push('/waiter/menu');
    }
  };

  const handleCloseTable = (table: Table) => {
    closeTable(table.id);
  };

  const freeTables = tables.filter(t => t.status === 'free');
  const occupiedTables = tables.filter(t => t.status === 'occupied');

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 py-4">
        <Text className="text-2xl font-bold text-white">Mesas</Text>
        <Text className="text-white/80">{tables.length} mesas en total</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {occupiedTables.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-700 mb-3">
              Occupied ({occupiedTables.length})
            </Text>
            {occupiedTables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                onPress={() => handleTablePress(table)}
                onClose={() => handleCloseTable(table)}
              />
            ))}
          </View>
        )}

        {freeTables.length > 0 && (
          <View>
            <Text className="text-lg font-bold text-gray-700 mb-3">
              Libre ({freeTables.length})
            </Text>
            {freeTables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                onPress={() => handleTablePress(table)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={orderTypeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOrderTypeModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Abrir {selectedTable?.name}
              </Text>
              <TouchableOpacity onPress={() => setOrderTypeModalVisible(false)}>
                <MaterialIcons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="text-lg font-semibold text-gray-700 mb-4">
              Tipo de pedido
            </Text>

            <View className="space-y-3 mb-6">
              {(Object.keys(orderTypeLabels) as OrderType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedOrderType(type)}
                  className={`p-4 rounded-xl border-2 ${
                    selectedOrderType === type
                      ? 'border-[#059432] bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Text className={`text-lg font-semibold ${
                    selectedOrderType === type ? 'text-[#059432]' : 'text-gray-700'
                  }`}>
                    {orderTypeLabels[type]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedOrderType === 'takeout' && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-700 mb-3">
                  Nombre del cliente
                </Text>
                <TextInput
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="Ingrese nombre"
                  className="bg-gray-100 p-4 rounded-xl text-lg"
                />
              </View>
            )}

            <TouchableOpacity
              onPress={handleOpenTable}
              className="bg-[#059432] py-4 rounded-xl"
            >
              <Text className="text-white text-xl font-bold text-center">
                Continuar al Menú
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

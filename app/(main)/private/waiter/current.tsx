import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, OrderItem, Order } from '@/store/useMainStore';

export default function CurrentOrderScreen() {
  const router = useRouter();
  const { currentTable, currentOrder, removeItemFromOrder, updateOrderStatus, orders } = useMainStore();
  
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editQuantity, setEditQuantity] = useState(1);

  const order = currentOrder || (currentTable?.orderId ? orders.find(o => o.id === currentTable.orderId) : null);

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Eliminar item',
      '¿Estás seguro de eliminar este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => removeItemFromOrder(itemId)
        },
      ]
    );
  };

  const handleEditItem = (item: OrderItem) => {
    setEditingItem(item);
    setEditNotes(item.notes || '');
    setEditQuantity(item.quantity);
    setShowEditModal(true);
  };

  const handleSendToKitchen = () => {
    if (order) {
      updateOrderStatus(order.id, 'active');
      Alert.alert(
        'Enviado a cocina',
        'El pedido ha sido enviado a cocina',
        [{ text: 'OK', onPress: () => router.push('/waiter') }]
      );
    }
  };

  const handleCloseOrder = () => {
    if (currentTable) {
      Alert.alert(
        'Cerrar mesa',
        `¿Cerrar ${currentTable.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Cerrar', 
            onPress: () => {
              useMainStore.getState().closeTable(currentTable.id);
              router.push('/waiter');
            }
          },
        ]
      );
    }
  };

  if (!order || !currentTable) {
    return (
      <View className="flex-1 bg-gray-100">
        <View className="bg-[#059432] px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center p-6">
          <MaterialIcons name="receipt-long" size={64} color="#ccc" />
          <Text className="text-xl text-gray-600 mt-4 text-center">
            No hay pedido activo
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/waiter')}
            className="mt-6 bg-[#059432] px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Volver a mesas</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-2">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">{currentTable.name}</Text>
        <Text className="text-white/80">
          {order.type === 'dine-in' ? 'Comer aquí' : order.type === 'takeout' ? 'Para llevar' : 'Bar'}
          {order.customerName && ` - ${order.customerName}`}
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Items del pedido</Text>
          
          {order.items.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">No hay items en el pedido</Text>
          ) : (
            <View className="space-y-3">
              {order.items.map((item) => (
                <View key={item.id} className="border-b border-gray-100 pb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-xl font-bold text-[#059432]">{item.quantity}x</Text>
                        <Text className="text-lg text-gray-800 ml-2">{item.productName}</Text>
                      </View>
                      {item.meatDoneness && (
                        <View className="ml-6 mt-1 bg-amber-100 px-2 py-0.5 rounded self-start">
                          <Text className="text-xs text-amber-800">
                            {item.meatDoneness === 'blue' ? 'Azul' : 
                             item.meatDoneness === 'medium' ? 'Medio' :
                             item.meatDoneness === 'threequarters' ? '3/4' : 'Bien cocido'}
                          </Text>
                        </View>
                      )}
                      {item.notes && (
                        <Text className="text-sm text-gray-500 ml-6 mt-1 italic">
                          Nota: {item.notes}
                        </Text>
                      )}
                      <Text className="text-gray-600 mt-1">
                        ${item.price.toLocaleString('es-CO')}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleEditItem(item)}
                        className="p-2 bg-gray-100 rounded-lg"
                      >
                        <MaterialIcons name="edit" size={20} color="#666" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item.id)}
                        className="p-2 bg-red-100 rounded-lg"
                      >
                        <MaterialIcons name="delete" size={20} color="#E74C3C" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/waiter/menu')}
          className="bg-white rounded-2xl shadow-md p-4 mb-4 flex-row items-center justify-center"
        >
          <MaterialIcons name="add" size={24} color="#059432" />
          <Text className="text-[#059432] font-bold ml-2">Agregar más items</Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="bg-white p-4 shadow-lg">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">Total:</Text>
          <Text className="text-2xl font-bold text-[#059432]">
            ${order.total.toLocaleString('es-CO')}
          </Text>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleCloseOrder}
            className="flex-1 bg-red-500 py-4 rounded-xl"
          >
            <Text className="text-white font-bold text-center">Cerrar Mesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSendToKitchen}
            className="flex-2 bg-[#059432] py-4 rounded-xl flex-[2]"
          >
            <Text className="text-white font-bold text-center text-lg">
              Enviar a Cocina
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Editar item
              </Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {editingItem && (
              <>
                <View className="mb-4 p-3 bg-gray-100 rounded-xl">
                  <Text className="text-lg font-semibold">{editingItem.productName}</Text>
                </View>

                <Text className="text-lg font-semibold text-gray-700 mb-3">
                  Cantidad
                </Text>
                <View className="flex-row items-center justify-center mb-6 gap-4">
                  <TouchableOpacity
                    onPress={() => setEditQuantity(Math.max(1, editQuantity - 1))}
                    className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center"
                  >
                    <MaterialIcons name="remove" size={24} color="#666" />
                  </TouchableOpacity>
                  <Text className="text-3xl font-bold w-16 text-center">{editQuantity}</Text>
                  <TouchableOpacity
                    onPress={() => setEditQuantity(editQuantity + 1)}
                    className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center"
                  >
                    <MaterialIcons name="add" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <Text className="text-lg font-semibold text-gray-700 mb-3">
                  Notas
                </Text>
                <TextInput
                  value={editNotes}
                  onChangeText={setEditNotes}
                  placeholder="Notas especiales..."
                  multiline
                  numberOfLines={3}
                  className="bg-gray-100 p-4 rounded-xl text-lg mb-6"
                />

                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  className="bg-[#059432] py-4 rounded-xl"
                >
                  <Text className="text-white text-xl font-bold text-center">
                    Guardar cambios
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

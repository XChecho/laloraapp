import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, Order } from '@/store/useMainStore';

const PRIMARY_COLOR = '#059432';

interface Closure {
  id: string;
  date: Date;
  income: number;
  expenses: number;
  balance: number;
  orders: number;
}

const mockClosures: Closure[] = [
  { id: 'c1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), income: 1250000, expenses: 450000, balance: 800000, orders: 45 },
  { id: 'c2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), income: 980000, expenses: 380000, balance: 600000, orders: 38 },
  { id: 'c3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), income: 1450000, expenses: 520000, balance: 930000, orders: 52 },
  { id: 'c4', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), income: 870000, expenses: 320000, balance: 550000, orders: 32 },
  { id: 'c5', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), income: 1100000, expenses: 410000, balance: 690000, orders: 41 },
  { id: 'c6', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), income: 1320000, expenses: 480000, balance: 840000, orders: 48 },
  { id: 'c7', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), income: 950000, expenses: 350000, balance: 600000, orders: 35 },
];

export default function ClosuresManagement() {
  const { orders } = useMainStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedClosure, setSelectedClosure] = useState<Closure | null>(null);

  const totalStats = useMemo(() => {
    return mockClosures.reduce(
      (acc, c) => ({
        income: acc.income + c.income,
        expenses: acc.expenses + c.expenses,
        balance: acc.balance + c.balance,
        orders: acc.orders + c.orders,
      }),
      { income: 0, expenses: 0, balance: 0, orders: 0 }
    );
  }, []);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const handleViewClosure = (closure: Closure) => {
    setSelectedClosure(closure);
    setShowModal(true);
  };

  const handleNewClosure = () => {
    setSelectedClosure(null);
    setShowModal(true);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-3xl font-bold text-white">Cierres Diarios</Text>
            <Text className="text-white/80 text-lg">Contabilidad</Text>
          </View>
          <TouchableOpacity
            onPress={handleNewClosure}
            className="bg-white px-4 py-2 rounded-lg flex-row items-center gap-2"
          >
            <MaterialIcons name="add" size={20} color="#059432" />
            <Text className="text-[#059432] font-semibold">Nuevo Cierre</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row -mx-2">
          <View className="w-1/3 px-2">
            <View className="bg-white/10 rounded-lg p-3">
              <Text className="text-white/70 text-xs">Ingresos 7 días</Text>
              <Text className="text-white font-bold text-lg">{formatCurrency(totalStats.income)}</Text>
            </View>
          </View>
          <View className="w-1/3 px-2">
            <View className="bg-white/10 rounded-lg p-3">
              <Text className="text-white/70 text-xs">Gastos 7 días</Text>
              <Text className="text-white font-bold text-lg">{formatCurrency(totalStats.expenses)}</Text>
            </View>
          </View>
          <View className="w-1/3 px-2">
            <View className="bg-white/10 rounded-lg p-3">
              <Text className="text-white/70 text-xs">Balance 7 días</Text>
              <Text className="text-white font-bold text-lg">{formatCurrency(totalStats.balance)}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row">
            <Text className="flex-1 font-semibold text-gray-600">Fecha</Text>
            <Text className="w-24 font-semibold text-gray-600 text-right">Ingresos</Text>
            <Text className="w-24 font-semibold text-gray-600 text-right">Gastos</Text>
            <Text className="w-28 font-semibold text-gray-600 text-right">Balance</Text>
          </View>
          
          {mockClosures.map((closure, index) => (
            <TouchableOpacity
              key={closure.id}
              onPress={() => handleViewClosure(closure)}
              className={`px-4 py-4 flex-row items-center ${
                index !== mockClosures.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">{formatDate(closure.date)}</Text>
                <Text className="text-gray-500 text-sm">{closure.orders} pedidos</Text>
              </View>
              
              <Text className="w-24 text-right text-gray-600">
                {formatCurrency(closure.income)}
              </Text>
              
              <Text className="w-24 text-right text-red-600">
                {formatCurrency(closure.expenses)}
              </Text>
              
              <Text className="w-28 text-right font-bold text-green-600">
                {formatCurrency(closure.balance)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <Text className="font-bold text-gray-700 mb-4">Resumen del Mes</Text>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600">Total Ingresos</Text>
            <Text className="font-bold text-green-600">{formatCurrency(totalStats.income)}</Text>
          </View>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600">Total Gastos</Text>
            <Text className="font-bold text-red-600">{formatCurrency(totalStats.expenses)}</Text>
          </View>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600">Balance Neto</Text>
            <Text className="font-bold text-[#059432] text-xl">{formatCurrency(totalStats.balance)}</Text>
          </View>
          <View className="flex-row justify-between items-center py-3">
            <Text className="text-gray-600">Promedio por Día</Text>
            <Text className="font-bold text-gray-800">{formatCurrency(Math.round(totalStats.balance / 7))}</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                {selectedClosure ? 'Detalle del Cierre' : 'Nuevo Cierre'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Fecha</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <Text className="text-gray-800">
                  {selectedClosure ? formatDate(selectedClosure.date) : formatDate(new Date())}
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Ingresos del Día</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                placeholder="0"
                keyboardType="numeric"
                defaultValue={selectedClosure ? selectedClosure.income.toString() : ''}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Gastos del Día</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                placeholder="0"
                keyboardType="numeric"
                defaultValue={selectedClosure ? selectedClosure.expenses.toString() : ''}
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-600 font-medium mb-2">Notas</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Notas adicionales..."
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="bg-[#059432] py-4 rounded-xl"
            >
              <Text className="text-white text-center font-bold text-lg">
                {selectedClosure ? 'Cerrar' : 'Registrar Cierre'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, OrderStatus } from '@/store/useMainStore';
import OrderCard from './components/OrderCard';

type TabType = 'active' | 'ready' | 'history';

const PRIMARY_COLOR = '#059432';

export default function KitchenDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [refreshing, setRefreshing] = useState(false);
  const orders = useMainStore((state) => state.orders);

  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return orders.filter((order) => order.status === 'active');
      case 'ready':
        return orders.filter((order) => order.status === 'ready');
      case 'history':
        return orders.filter((order) => order.status === 'completed');
      default:
        return orders;
    }
  }, [orders, activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { 
      key: 'active', 
      label: 'Activos', 
      count: orders.filter((o) => o.status === 'active').length 
    },
    { 
      key: 'ready', 
      label: 'Listos', 
      count: orders.filter((o) => o.status === 'ready').length 
    },
    { 
      key: 'history', 
      label: 'Historial', 
      count: orders.filter((o) => o.status === 'completed').length 
    },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-white px-4 pb-4 pt-2 shadow-md">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-3xl font-bold text-gray-800">Tablero de Cocina</Text>
          <TouchableOpacity 
            className="p-2 bg-gray-100 rounded-full"
            onPress={onRefresh}
          >
            <MaterialIcons name="refresh" size={28} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className={`flex-1 py-3 rounded-lg items-center ${
                activeTab === tab.key ? 'bg-green-600' : 'bg-gray-200'
              }`}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text className={`text-xl font-bold ${
                activeTab === tab.key ? 'text-white' : 'text-gray-700'
              }`}>
                {tab.label}
              </Text>
              <Text className={`text-lg font-semibold mt-1 ${
                activeTab === tab.key ? 'text-white' : 'text-gray-600'
              }`}>
                {tab.count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_COLOR}
          />
        }
      >
        {filteredOrders.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialIcons name="restaurant" size={80} color="#D1D5DB" />
            <Text className="text-2xl text-gray-400 mt-4">No hay órdenes</Text>
            <Text className="text-lg text-gray-400 mt-2">
              {activeTab === 'active' && 'No hay órdenes activas'}
              {activeTab === 'ready' && 'No hay órdenes listas'}
              {activeTab === 'history' && 'No hay historial'}
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap -mx-2">
            {filteredOrders.map((order) => (
              <View key={order.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2">
                <OrderCard order={order} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

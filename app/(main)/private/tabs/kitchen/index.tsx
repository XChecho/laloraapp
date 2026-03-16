import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { ZoomOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KitchenItem, KitchenOrder, useKitchenStore } from '../../../../../src/store/useKitchenStore';

const KitchenScreen = () => {
  const [activeTab, setActiveTab] = useState<'ACTIVOS' | 'LISTOS'>('ACTIVOS');
  const { orders, markOrderReady, markItemReady, markSopaReady, markBandejaReady } = useKitchenStore();

  const filteredOrders = orders.filter((o) =>
    activeTab === 'ACTIVOS' ? o.status === 'ACTIVE' : o.status === 'READY'
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white border-b border-slate-200 p-4 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="flex size-10 items-center justify-center bg-slate-100 rounded-lg">
            <MaterialIcons name="menu" size={24} color="#0f172a" />
          </View>
          <View>
            <Text className="text-xl font-bold text-slate-900">Tablero de Cocina</Text>
            <Text className="text-xs text-slate-500 font-medium uppercase tracking-wider">Restaurante Central</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="hidden md:flex flex-col items-end mr-4">
            <Text className="text-sm font-bold text-green-600">Sistema Online</Text>
            <Text className="text-xs text-slate-400">Última sinc: Ahora</Text>
          </View>
          <Pressable className="flex size-12 items-center justify-center rounded-xl bg-slate-100">
            <MaterialIcons name="refresh" size={24} color="#0f172a" />
          </Pressable>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View className="bg-white px-4 border-b border-slate-200">
        <View className="flex-row gap-8">
          <Pressable
            onPress={() => setActiveTab('ACTIVOS')}
            className={`border-b-[3px] pb-3 pt-4 ${activeTab === 'ACTIVOS' ? 'border-green-600' : 'border-transparent'}`}
          >
            <Text className={`text-sm font-bold ${activeTab === 'ACTIVOS' ? 'text-green-600' : 'text-slate-500'}`}>
              Activos ({orders.filter(o => o.status === 'ACTIVE').length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('LISTOS')}
            className={`border-b-[3px] pb-3 pt-4 ${activeTab === 'LISTOS' ? 'border-green-600' : 'border-transparent'}`}
          >
            <Text className={`text-sm font-bold ${activeTab === 'LISTOS' ? 'text-green-600' : 'text-slate-500'}`}>
              Listos ({orders.filter(o => o.status === 'READY').length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Main Content Grid */}
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 20 }}>
        <View className="flex-row flex-wrap gap-6 justify-between">
          {filteredOrders.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20 w-full">
              <Text className="text-slate-400 text-lg font-medium">No hay órdenes {activeTab === 'ACTIVOS' ? 'activas' : 'listas'}</Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onMarkReady={() => markOrderReady(order.id)}
                onMarkItemReady={(itemId) => markItemReady(order.id, itemId)}
                onMarkSopaReady={(itemId) => markSopaReady(order.id, itemId)}
                onMarkBandejaReady={(itemId) => markBandejaReady(order.id, itemId)}
                isActiveTab={activeTab === 'ACTIVOS'}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const OrderCard = ({
  order,
  onMarkReady,
  onMarkItemReady,
  onMarkSopaReady,
  onMarkBandejaReady,
  isActiveTab,
}: {
  order: KitchenOrder;
  onMarkReady: () => void;
  onMarkItemReady: (itemId: string) => void;
  onMarkSopaReady: (itemId: string) => void;
  onMarkBandejaReady: (itemId: string) => void;
  isActiveTab: boolean;
}) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState<number | null>(null);

  useEffect(() => {
    const requestedTime = new Date(order.requestedAt).getTime();
    if (isActiveTab) {
      const calculateTime = () => {
        const now = new Date().getTime();
        const diffMins = Math.floor((now - requestedTime) / (1000 * 60));
        setElapsedMinutes(diffMins);
      };
      calculateTime();
      const interval = setInterval(calculateTime, 60000); // Update every minute
      return () => clearInterval(interval);
    } else {
      // If it's ready, calculate total time taken
      const completedTime = order.completedAt ? new Date(order.completedAt).getTime() : new Date().getTime();
      const diffMins = Math.floor((completedTime - requestedTime) / (1000 * 60));
      setTotalMinutes(diffMins);
    }
  }, [order.requestedAt, order.completedAt, isActiveTab]);

  const hasAlaCarta = order.items.some(item => item.category !== 'almuerzo');
  const delayThreshold = hasAlaCarta ? 30 : 25;
  const isDelayed = isActiveTab && elapsedMinutes >= delayThreshold;
  const isWarning = isActiveTab && elapsedMinutes >= 20 && elapsedMinutes < delayThreshold;

  const headerBgColor = isDelayed ? 'bg-red-600' : (isWarning ? 'bg-yellow-600' : (isActiveTab ? 'bg-blue-600' : 'bg-slate-600'));
  const cardBorderColor = isDelayed ? 'border-red-400' : (isWarning ? 'border-yellow-400' : 'border-slate-200');

  return (
    <Animated.View exiting={ZoomOut.duration(400)} className={`w-full md:w-[48%] xl:w-[32%] flex-col bg-white rounded-xl shadow-md border ${cardBorderColor} overflow-hidden ${isDelayed || isWarning ? 'border-2' : ''}`}>
      {/* Card Header */}
      <View className={`${headerBgColor} p-4 flex-row justify-between items-center`}>
        <Text className="text-2xl font-black italic tracking-tighter text-white">#{order.id.replace('o', '').padStart(2, '0')}</Text>
        <View className="flex-col items-end">
          {isDelayed && (
            <Text className="text-xs font-bold uppercase bg-white text-red-600 px-1 rounded mb-1">Retrasado</Text>
          )}
          <View className="flex-row items-center">
            {isWarning && (
              <MaterialIcons name="warning" size={14} color="#fef08a" className="mr-1" style={{ marginRight: 4 }} />
            )}
            <Text className="text-xs font-bold uppercase text-white opacity-80">
              {isActiveTab ? `Hace ${elapsedMinutes} min` : `Tardó ${totalMinutes !== null ? totalMinutes : 0} min`}
            </Text>
          </View>
          <Text className="text-sm font-medium text-white">
            {order.type === 'LLEVAR' ? 'Para Llevar' : order.tableName}
          </Text>
        </View>
      </View>

      {/* Card Body */}
      <View className="p-5 flex-1">
        <View className="flex-col gap-4">
          {order.items.map((item) => (
            <OrderItemRow
              key={item.instanceId}
              item={item}
              onMarkReady={() => onMarkItemReady(item.instanceId)}
              onMarkSopaReady={() => onMarkSopaReady(item.instanceId)}
              onMarkBandejaReady={() => onMarkBandejaReady(item.instanceId)}
              isActiveTab={isActiveTab}
            />
          ))}
        </View>
      </View>

      {/* Card Footer */}
      {isActiveTab && (
        <View className="p-4 bg-slate-50 border-t border-slate-100">
          <Pressable
            onPress={onMarkReady}
            className="w-full bg-green-600 flex-row items-center justify-center py-4 rounded-lg shadow-sm"
          >
            <MaterialIcons name="check-circle" size={24} color="white" className="mr-2" />
            <Text className="text-white font-bold text-lg ml-2">MARCAR ORDEN LISTA</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};

const OrderItemRow = ({
  item,
  onMarkReady,
  onMarkSopaReady,
  onMarkBandejaReady,
  isActiveTab,
}: {
  item: KitchenItem;
  onMarkReady: () => void;
  onMarkSopaReady: () => void;
  onMarkBandejaReady: () => void;
  isActiveTab: boolean;
}) => {
  const isLunchMenu = item.category === 'almuerzo';
  const hasSopa = isLunchMenu && item.name !== 'Bandeja (Sin Sopa)';

  // Custom Lunch Flow
  if (isLunchMenu) {
    return (
      <View className="flex-col gap-2 border-b border-slate-100 pb-2">
        {hasSopa && (
          <Pressable
            disabled={!isActiveTab || item.sopaStatus === 'READY'}
            onPress={onMarkSopaReady}
            className={`flex-row items-start gap-3 ${item.sopaStatus === 'READY' ? 'opacity-40' : ''}`}
          >
            <Text className="flex-none font-bold text-lg text-green-600">1x</Text>
            <View className="flex-1">
              <Text className={`text-lg font-semibold text-slate-800 uppercase ${item.sopaStatus === 'READY' ? 'line-through' : ''}`}>
                🍲 Sopa ({item.name})
              </Text>
            </View>
            {item.sopaStatus === 'READY' && <MaterialIcons name="check-circle" size={20} color="#16a34a" />}
          </Pressable>
        )}
        <Pressable
          disabled={!isActiveTab || item.bandejaStatus === 'READY'}
          onPress={onMarkBandejaReady}
          className={`flex-row items-start gap-3 ${item.bandejaStatus === 'READY' ? 'opacity-40' : ''}`}
        >
          <Text className="flex-none font-bold text-lg text-green-600">1x</Text>
          <View className="flex-1">
            <Text className={`text-lg font-semibold text-slate-800 uppercase ${item.bandejaStatus === 'READY' ? 'line-through' : ''}`}>
              🍛 Bandeja: {item.protein || 'Sin Proteína'}
            </Text>
            {item.notes && (
              <View className="bg-yellow-100 p-2 rounded-lg border-l-4 border-yellow-500 mt-2">
                <Text className="text-sm italic font-bold text-yellow-800">{item.notes}</Text>
              </View>
            )}
          </View>
          {item.bandejaStatus === 'READY' && <MaterialIcons name="check-circle" size={20} color="#16a34a" />}
        </Pressable>
      </View>
    );
  }

  // Regular Item Flow
  return (
    <Pressable
      disabled={!isActiveTab || item.status === 'READY'}
      onPress={onMarkReady}
      className={`flex-col gap-1 border-b border-slate-100 pb-2 ${item.status === 'READY' ? 'opacity-40' : ''}`}
    >
      <View className="flex-row items-start gap-3">
        <Text className="flex-none font-bold text-lg text-green-600">1x</Text>
        <View className="flex-1 flex-col">
          <Text className={`text-lg font-semibold text-slate-800 uppercase ${item.status === 'READY' ? 'line-through' : ''}`}>
            {item.name}
          </Text>

          <View className="flex-row flex-wrap gap-2 mt-1">
            {(item.requiresTerm || item.subcategory === 'Res') && item.term && (
              <Text className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Término: {item.term}
              </Text>
            )}
            {item.requiresSauce && item.sauce && (
              <Text className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                Salsa: {item.sauce}
              </Text>
            )}
          </View>

          {item.notes && (
            <View className="bg-yellow-100 p-2 rounded-lg border-l-4 border-yellow-500 mt-2">
              <Text className="text-sm italic font-bold text-yellow-800 flex-row items-center">
                {item.notes}
              </Text>
            </View>
          )}
        </View>
        {item.status === 'READY' && <MaterialIcons name="check-circle" size={20} color="#16a34a" />}
      </View>
    </Pressable>
  );
};

export default KitchenScreen;
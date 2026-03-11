import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, Order, User } from '@/store/useMainStore';

const PRIMARY_COLOR = '#059432';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  waiter: 'Mesero',
  kitchen: 'Cocina',
  cashier: 'Cajero',
};

const users: User[] = [
  { id: 'u1', name: 'Juan Pérez', role: 'admin' },
  { id: 'u2', name: 'María García', role: 'waiter' },
  { id: 'u3', name: 'Carlos López', role: 'cashier' },
  { id: 'u4', name: 'Ana Martínez', role: 'kitchen' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { orders, tables, currentUser } = useMainStore();

  const todayOrders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter((o: Order) => new Date(o.createdAt) >= today);
  }, [orders]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCompleted = orders.filter(
      (o: Order) => new Date(o.createdAt) >= today && (o.status === 'completed' || o.status === 'ready')
    );
    
    const todaySales = todayCompleted.reduce((sum: number, o: Order) => sum + o.total, 0);
    const restaurantOrders = todayCompleted.filter((o: Order) => o.type === 'dine-in' || o.type === 'bar').length;
    const takeoutOrders = todayCompleted.filter((o: Order) => o.type === 'takeout').length;
    
    return {
      sales: todaySales,
      reservations: tables.filter((t: any) => t.status === 'occupied').length,
      restaurantOrders,
      takeoutOrders,
    };
  }, [orders, tables]);

  const recentClosures = useMemo(() => {
    return orders
      .filter((o: Order) => o.status === 'completed')
      .slice(0, 5);
  }, [orders]);

  const menuItems = [
    { id: 'users', icon: 'people', label: 'Usuarios', route: '/private/admin/users' },
    { id: 'products', icon: 'restaurant-menu', label: 'Productos', route: '/private/admin/products' },
    { id: 'closures', icon: 'receipt-long', label: 'Cierres', route: '/private/admin/closures' },
    { id: 'settings', icon: 'settings', label: 'Configuración', route: '/private/admin/settings' },
  ];

  const users: User[] = [
    { id: 'u1', name: 'Juan Pérez', role: 'admin' },
    { id: 'u2', name: 'María García', role: 'waiter' },
    { id: 'u3', name: 'Carlos López', role: 'cashier' },
    { id: 'u4', name: 'Ana Martínez', role: 'kitchen' },
  ];

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 pt-12 pb-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-white">Panel de Control</Text>
            <Text className="text-white/80 text-lg">Administración</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="bg-white/20 p-2 rounded-full">
              <MaterialIcons name="account-circle" size={40} color="white" />
            </View>
            <Text className="text-white font-semibold text-lg">
              {currentUser?.name || 'Admin'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="flex-row flex-wrap -mx-2 mb-6">
          <View className="w-full sm:w-1/2 px-2 mb-4">
            <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-gray-500 text-sm">Ventas de Hoy</Text>
                  <Text className="text-2xl font-bold text-[#059432] mt-1">
                    {formatCurrency(stats.sales)}
                  </Text>
                </View>
                <View className="bg-green-100 p-2 rounded-lg">
                  <MaterialIcons name="attach-money" size={24} color="#059432" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View className="w-full sm:w-1/2 px-2 mb-4">
            <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-gray-500 text-sm">Reservas de Cancha</Text>
                  <Text className="text-2xl font-bold text-blue-600 mt-1">
                    {stats.reservations}
                  </Text>
                </View>
                <View className="bg-blue-100 p-2 rounded-lg">
                  <MaterialIcons name="sports-tennis" size={24} color="#2563EB" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View className="w-full sm:w-1/2 px-2 mb-4">
            <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-gray-500 text-sm">Pedidos Restaurante</Text>
                  <Text className="text-2xl font-bold text-orange-600 mt-1">
                    {stats.restaurantOrders}
                  </Text>
                </View>
                <View className="bg-orange-100 p-2 rounded-lg">
                  <MaterialIcons name="restaurant" size={24} color="#EA580C" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View className="w-full sm:w-1/2 px-2 mb-4">
            <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-gray-500 text-sm">Nuevos Usuarios</Text>
                  <Text className="text-2xl font-bold text-purple-600 mt-1">
                    {users.length}
                  </Text>
                </View>
                <View className="bg-purple-100 p-2 rounded-lg">
                  <MaterialIcons name="person-add" size={24} color="#9333EA" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row flex-wrap -mx-2">
          <View className="w-full lg:w-1/2 px-2 mb-6">
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
                <MaterialIcons name="inventory-2" size={20} color="#059432" />
                <Text className="font-bold text-gray-700">Inventario / Productos</Text>
              </View>
              <View className="p-4">
                <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                  <Text className="text-gray-600">Total Productos</Text>
                  <Text className="font-bold text-gray-800">45</Text>
                </View>
                <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                  <Text className="text-gray-600">Categorías</Text>
                  <Text className="font-bold text-gray-800">8</Text>
                </View>
                <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                  <Text className="text-gray-600">Disponibles</Text>
                  <Text className="font-bold text-green-600">42</Text>
                </View>
                <View className="flex-row justify-between items-center py-3">
                  <Text className="text-gray-600">No disponibles</Text>
                  <Text className="font-bold text-red-600">3</Text>
                </View>
              </View>
            </View>

            <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
              <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
                <MaterialIcons name="close-fullscreen" size={20} color="#059432" />
                <Text className="font-bold text-gray-700">Cierres Recientes</Text>
              </View>
              <View className="p-4">
                {recentClosures.length > 0 ? (
                  recentClosures.map((order: Order) => (
                    <View key={order.id} className="flex-row justify-between items-center py-2 border-b border-gray-50">
                      <View>
                        <Text className="text-gray-800 font-medium">{order.tableName || 'Para llevar'}</Text>
                        <Text className="text-gray-500 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('es-CO')}
                        </Text>
                      </View>
                      <Text className="font-bold text-green-600">{formatCurrency(order.total)}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-400 text-center py-4">Sin cierres recientes</Text>
                )}
              </View>
            </View>
          </View>

          <View className="w-full lg:w-1/2 px-2 mb-6">
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
                <MaterialIcons name="people" size={20} color="#059432" />
                <Text className="font-bold text-gray-700">Personal / Usuarios</Text>
              </View>
              <View className="p-4">
                {users.map((user) => (
                  <View key={user.id} className="flex-row justify-between items-center py-3 border-b border-gray-50">
                    <View className="flex-row items-center gap-3">
                      <View className="bg-gray-100 p-2 rounded-full">
                        <MaterialIcons name="person" size={20} color="#6B7280" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-medium">{user.name}</Text>
                        <Text className="text-gray-500 text-sm">{roleLabels[user.role]}</Text>
                      </View>
                    </View>
                    <TouchableOpacity className="p-2">
                      <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
              <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
                <MaterialIcons name="volunteer-activism" size={20} color="#059432" />
                <Text className="font-bold text-gray-700">Propinas del Día</Text>
              </View>
              <View className="p-4">
                <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                  <Text className="text-gray-600">Total Propinas</Text>
                  <Text className="font-bold text-[#059432]">$125,000</Text>
                </View>
                <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                  <Text className="text-gray-600">Meseros</Text>
                  <Text className="font-bold text-gray-800">$85,000</Text>
                </View>
                <View className="flex-row justify-between items-center py-3">
                  <Text className="text-gray-600">Cocina</Text>
                  <Text className="font-bold text-gray-800">$40,000</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <Text className="font-bold text-gray-700">Accesos Rápidos</Text>
          </View>
          <View className="p-4">
            <View className="flex-row flex-wrap -mx-2">
              {menuItems.map((item) => (
                <View key={item.id} className="w-1/2 px-2 mb-3">
                  <TouchableOpacity
                    onPress={() => router.push(item.route as any)}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-row items-center gap-3"
                  >
                    <View className="bg-[#059432]/10 p-2 rounded-lg">
                      <MaterialIcons name={item.icon as any} size={24} color="#059432" />
                    </View>
                    <Text className="text-gray-700 font-medium">{item.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

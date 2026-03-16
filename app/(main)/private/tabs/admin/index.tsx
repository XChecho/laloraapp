import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { AdminSummaryCard } from '@src/components/admin/AdminSummaryCard';
import { InventorySection } from '@src/components/admin/InventorySection';
import { ManagementTipSection, StaffSection } from '@src/components/admin/StaffSection';
import { RecentClosuresSection } from '@src/components/admin/RecentClosuresSection';

const AdminDashboard = () => {
  const router = useRouter();

  const summaryData = [
    {
      id: '1',
      title: 'Ventas de Hoy',
      value: '$1,245,000',
      trend: '+12.5%',
      icon: 'cash-outline' as const,
      iconColor: '#0A873A',
      iconBg: '#DCFCE7',
      onPress: () => router.push('/private/tabs/admin/reports'),
    },
    {
      id: '2',
      title: 'Reservas de Cancha',
      value: '18',
      trend: '+4',
      icon: 'calendar-outline' as const,
      iconColor: '#2563EB',
      iconBg: '#DBEAFE',
    },
    {
      id: '3',
      title: 'Pedidos Restaurante',
      value: '42',
      trend: 'Estable',
      icon: 'cart-outline' as const,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      trendColor: '#94A3B8',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-InterBold text-lora-text mb-1">Panel de Control</Text>
          <Text className="text-sm font-InterMedium text-lora-text-muted">
            Bienvenido al sistema de Cancha y Restaurante La Lora.
          </Text>
        </View>

        {/* Summary Cards Grid */}
        <View className="flex-row flex-wrap justify-between mb-4">
          {summaryData.map((item) => (
            <View key={item.id} style={{ width: '48%' }}>
              <AdminSummaryCard {...item} />
            </View>
          ))}
        </View>

        {/* Recent Closures */}
        <RecentClosuresSection />

        {/* Staff & Usuarios */}
        <StaffSection onPress={() => router.push('/private/tabs/admin/users')} />

        {/* Tips */}
        <ManagementTipSection />
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;

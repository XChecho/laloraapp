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
import { TablesSection } from '@src/components/admin/TablesSection';
import { ScreenHeader } from '@src/components/ui/ScreenHeader';

const AdminDashboard = () => {
  const router = useRouter();

  const summaryData = [
    {
      id: '1',
      title: 'Ventas de Hoy',
      value: '$1,245,000',
      icon: 'cash-outline' as const,
      iconColor: '#0A873A',
      iconBg: '#DCFCE7',
      onPress: () => router.push('/private/tabs/admin/reports'),
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
      <ScreenHeader 
        title="Administración" 
        subtitle="Panel de Control General" 
      />
      
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
      >
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

        {/* Tables & Spaces */}
        <TablesSection onPress={() => router.push('/private/tabs/admin/tables')} />

        {/* Staff & Usuarios */}
        <StaffSection onPress={() => router.push('/private/tabs/admin/users')} />

        {/* Tips */}
        <ManagementTipSection />
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;

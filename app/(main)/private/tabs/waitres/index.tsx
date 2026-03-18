import { MOCK_DB, Table } from '@core/database/mockDb';
import { formatCOP } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useModalStore } from '@store/useModalStore';
import { useAdminStore } from '@store/admin/useAdminStore';
import { ScreenHeader } from '@src/components/ui/ScreenHeader';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  android: {
    elevation: 3,
  },
});

const TableCard = ({ table, onOpenDetails, onOpenMesa }: { table: Table; onOpenDetails: (id: number) => void; onOpenMesa: (id: number) => void }) => {
  const isOccupied = table.status === 'OCUPADA';

  return (
    <View
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-4 mx-2"
      style={[cardShadow, { width: '45%' }]}
    >
      {/* Image */}
      <View className="relative h-24">
        <Image
          source={{ uri: table.image }}
          className="w-full h-full"
          resizeMode="cover"
          style={isOccupied ? {} : { opacity: 0.4 }}
        />
        <View
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full ${isOccupied ? 'bg-red-500' : 'bg-emerald-500'
            }`}
        >
          <Text className="text-white text-[9px] font-InterBold uppercase tracking-tighter">
            {table.status}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View className="p-3">
        <Text className="text-sm font-InterBold text-lora-text" numberOfLines={1}>{table.name}</Text>
        <Text
          className={`text-xs font-InterBold mt-0.5 ${isOccupied ? 'text-lora-primary' : 'text-gray-400'
            }`}
        >
          {isOccupied ? formatCOP(table.total) : formatCOP(0)}
        </Text>

        <Pressable
          onPress={() => isOccupied ? onOpenDetails(table.id) : onOpenMesa(table.id)}
          className={`mt-3 py-2 rounded-xl items-center justify-center active:opacity-70 ${isOccupied
            ? 'bg-gray-50 border border-gray-100'
            : 'bg-lora-primary'
            }`}
        >
          <Text
            className={`text-[11px] font-InterBold text-center ${isOccupied ? 'text-lora-text' : 'text-white'
              }`}
          >
            {isOccupied ? 'Ver Detalles' : 'Abrir Mesa'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const WaitresScreen = () => {
  const router = useRouter();
  const openModal = useModalStore(state => state.openModal);
  const { zones, tables: adminTables } = useAdminStore();

  const handleOpenDetails = (tableId: number) => {
    openModal('ORDER_DETAILS', { tableId });
  };

  const handleOpenMesa = (tableId: number) => {
    router.push(`/(main)/private/tabs/waitres/${tableId}`);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-gray-50">
      <ScreenHeader 
        title="Mesas" 
        subtitle="Restaurante La Lora" 
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
      >
        {zones.map((zone) => {
          const zoneAdminTables = adminTables.filter(t => t.zoneId === zone.id);
          if (zoneAdminTables.length === 0) return null;

          return (
            <View key={zone.id} className="mb-8">
              <View className="flex-row items-center px-6 mb-4">
                <View className="w-1 h-5 bg-lora-primary rounded-full mr-3" />
                <Text className="text-lg font-InterBold text-lora-text">{zone.name}</Text>
                <View className="ml-3 bg-slate-200 px-2 py-0.5 rounded-md">
                  <Text className="text-[10px] font-InterBold text-slate-600">{zoneAdminTables.length}</Text>
                </View>
              </View>

              <View className="flex-row flex-wrap px-4">
                {zoneAdminTables.map((adminTable) => {
                  // Find detailed data in MOCK_DB or use admin info
                  const dbTable = MOCK_DB.tables.find(t => t.id === adminTable.dbId);
                  const tableData: Table = dbTable || {
                    id: parseInt(adminTable.id),
                    name: adminTable.name,
                    status: adminTable.status,
                    total: 0,
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
                    currentOrder: [],
                    zone: 'SALON'
                  } as Table;

                  return (
                    <TableCard 
                      key={adminTable.id} 
                      table={tableData} 
                      onOpenDetails={handleOpenDetails}
                      onOpenMesa={handleOpenMesa}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
        
        {zones.length === 0 && (
          <View className="items-center justify-center py-20 opacity-40">
            <Ionicons name="restaurant-outline" size={48} color="#94A3B8" />
            <Text className="mt-4 font-InterBold text-slate-500">No hay espacios configurados</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaitresScreen;

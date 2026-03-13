import { MOCK_DB, Table } from '@core/database/mockDb';
import { formatCOP } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useModalStore } from '@store/useModalStore';
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

const TableCard = ({ table }: { table: Table }) => {
  const isOccupied = table.status === 'OCUPADA';
  const router = useRouter();
  const openModal = useModalStore(state => state.openModal);

  const handleAction = () => {
    if (isOccupied) {
      openModal('ORDER_DETAILS', { tableId: table.id });
    } else {
      router.push(`/(main)/private/tabs/waitres/${table.id}`);
    }
  };

  return (
    <View
      className="flex-1 bg-white rounded-2xl overflow-hidden border border-gray-200 mx-2 mb-4"
      style={cardShadow}
    >
      {/* Image */}
      <View className="relative h-28">
        <Image
          source={{ uri: table.image }}
          className="w-full h-full"
          resizeMode="cover"
          style={isOccupied ? {} : { opacity: 0.4 }}
        />
        {/* Status Badge */}
        <View
          className={`absolute top-2 right-2 px-3 py-1 rounded-full ${isOccupied ? 'bg-red-500' : 'bg-gray-400'
            }`}
        >
          <Text className="text-white text-[10px] font-InterBold tracking-wider">
            {table.status}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View className="p-3">
        <Text className="text-base font-InterBold text-lora-text">{table.name}</Text>
        <Text
          className={`text-sm font-InterBold mt-0.5 ${isOccupied ? 'text-lora-primary' : 'text-gray-400'
            }`}
        >
          {isOccupied ? formatCOP(table.total) : formatCOP(0)}
        </Text>

        {/* Action Button */}
        <Pressable
          onPress={handleAction}
          className={`mt-3 py-2.5 rounded-xl items-center justify-center active:opacity-70 ${isOccupied
            ? 'bg-gray-50 border border-gray-200'
            : 'bg-lora-primary'
            }`}
        >
          <Text
            className={`text-xs font-InterBold text-center ${isOccupied ? 'text-lora-text' : 'text-white'
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
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <Pressable className="p-1">
          <Ionicons name="menu" size={26} color="#1B2332" />
        </Pressable>
        <Text className="text-xl font-InterBold text-lora-text">Mis Mesas</Text>
        <Pressable className="p-1">
          <Ionicons name="notifications-outline" size={24} color="#1B2332" />
        </Pressable>
      </View>
      <Text className="px-5 text-sm font-InterMedium text-lora-primary mb-4">
        Restaurante La Lora
      </Text>

      {/* Tables Grid */}
      <ScrollView
        className="flex-1 px-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 10 }}
      >
        <View className="flex-row flex-wrap">
          {MOCK_DB.tables.map((table) => (
            <View key={table.id} className="w-1/2">
              <TableCard table={table} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaitresScreen;

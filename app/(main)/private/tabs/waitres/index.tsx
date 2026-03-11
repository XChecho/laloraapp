import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { formatCOP } from '@/core/helper/validators';
import { Ionicons } from '@expo/vector-icons';

type TableStatus = 'OCUPADA' | 'LIBRE';

interface TableData {
  id: number;
  name: string;
  status: TableStatus;
  total: number;
  image: string;
}

const MOCK_TABLES: TableData[] = [
  {
    id: 1,
    name: 'MESA 01',
    status: 'OCUPADA',
    total: 45000,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'MESA 02',
    status: 'LIBRE',
    total: 0,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'MESA 03',
    status: 'OCUPADA',
    total: 120500,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'MESA 04',
    status: 'LIBRE',
    total: 0,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    name: 'MESA 05',
    status: 'LIBRE',
    total: 0,
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    name: 'MESA 06',
    status: 'OCUPADA',
    total: 28750,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
  },
];

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#1B2332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  android: {
    elevation: 5,
  },
});

const TableCard = ({ table }: { table: TableData }) => {
  const isOccupied = table.status === 'OCUPADA';

  return (
    <View
      className="flex-1 bg-white rounded-2xl overflow-hidden border border-lora-primary mx-2 mb-4"
      style={cardShadow}
    >
      {/* Image */}
      <View className="relative h-28">
        <Image
          source={{ uri: table.image }}
          className="w-full h-full"
          resizeMode="cover"
          style={isOccupied ? {} : { opacity: 0.6 }}
        />
        {/* Status Badge */}
        <View
          className={`absolute top-2 right-2 px-3 py-1 rounded-full ${
            isOccupied ? 'bg-red-500' : 'bg-lora-primary'
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
          className={`text-sm font-InterBold mt-0.5 ${
            isOccupied ? 'text-lora-primary' : 'text-lora-text-muted'
          }`}
        >
          {isOccupied ? formatCOP(table.total) : formatCOP(0)}
        </Text>

        {/* Action Button */}
        <TouchableOpacity
          className={`mt-3 py-2.5 rounded-xl items-center justify-center ${
            isOccupied
              ? 'bg-white border border-lora-border'
              : 'bg-lora-primary'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-xs font-InterBold text-center ${
              isOccupied ? 'text-lora-text' : 'text-white'
            }`}
          >
            {isOccupied ? 'Ver Detalles /\nAgregar' : 'Abrir Mesa'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const WaitresScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-lora-bg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <TouchableOpacity className="p-1">
          <Ionicons name="menu" size={26} color="#1B2332" />
        </TouchableOpacity>
        <Text className="text-xl font-InterBold text-lora-text">Mis Mesas</Text>
        <TouchableOpacity className="p-1">
          <Ionicons name="notifications-outline" size={24} color="#1B2332" />
        </TouchableOpacity>
      </View>
      <Text className="px-5 text-sm font-InterMedium text-lora-primary mb-4">
        Restaurante La Lora
      </Text>

      {/* Tables Grid */}
      <ScrollView
        className="flex-1 px-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex-row flex-wrap">
          {MOCK_TABLES.map((table) => (
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
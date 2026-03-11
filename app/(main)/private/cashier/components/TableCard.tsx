import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Table } from '@/store/useMainStore';

interface TableCardProps {
  table: Table;
  onPress: () => void;
  onClose?: () => void;
}

const PRIMARY_COLOR = '#059432';
const OCCUPIED_COLOR = '#DC2626';
const FREE_COLOR = '#059432';

export default function TableCard({ table, onPress, onClose }: TableCardProps) {
  const isOccupied = table.status === 'occupied';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-2xl shadow-lg p-5 mb-4 ${
        isOccupied ? 'border-2 border-red-200' : 'border-2 border-green-200'
      }`}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-800">{table.name}</Text>
          <View className={`inline-block mt-2 px-3 py-1 rounded-full ${
            isOccupied ? 'bg-red-100' : 'bg-green-100'
          }`}>
            <Text className={`text-sm font-bold uppercase ${
              isOccupied ? 'text-red-700' : 'text-green-700'
            }`}>
              {isOccupied ? 'Ocupada' : 'Libre'}
            </Text>
          </View>
        </View>
        {isOccupied && table.total > 0 && (
          <View className="bg-gray-100 px-4 py-3 rounded-xl">
            <Text className="text-2xl font-bold text-gray-800">
              ${table.total.toLocaleString('es-CO')}
            </Text>
          </View>
        )}
      </View>

      {isOccupied ? (
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onPress}
            className="flex-1 bg-[#059432] py-3 rounded-xl flex-row items-center justify-center gap-2"
          >
            <MaterialIcons name="visibility" size={20} color="white" />
            <Text className="text-white font-bold text-lg">Ver Detalles</Text>
          </TouchableOpacity>
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-red-600 py-3 rounded-xl flex-row items-center justify-center gap-2"
            >
              <MaterialIcons name="close" size={20} color="white" />
              <Text className="text-white font-bold text-lg">Cerrar</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          className="bg-[#059432] py-3 rounded-xl flex-row items-center justify-center gap-2"
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text className="text-white font-bold text-lg">Abrir Mesa</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Table } from '../store/useMainStore';

interface TableCardProps {
  table: Table;
  onPress: () => void;
  onClose?: () => void;
}

export default function TableCard({ table, onPress, onClose }: TableCardProps) {
  const isOccupied = table.status === 'occupied';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-2xl shadow-md p-4 mb-4 ${
        isOccupied ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
      }`}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-xl font-bold text-gray-800">{table.name}</Text>
          <View className={`inline-block mt-1 px-2 py-1 rounded-full ${
            isOccupied ? 'bg-red-100' : 'bg-green-100'
          }`}>
            <Text className={`text-xs font-semibold ${
              isOccupied ? 'text-red-700' : 'text-green-700'
            }`}>
              {isOccupied ? 'Ocupada' : 'Libre'}
            </Text>
          </View>
        </View>
        {isOccupied && table.total > 0 && (
          <View className="bg-gray-100 px-3 py-2 rounded-xl">
            <Text className="text-lg font-bold text-gray-800">
              ${table.total.toLocaleString('es-CO')}
            </Text>
          </View>
        )}
      </View>

      {isOccupied ? (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onPress}
            className="flex-1 bg-[#059432] py-2 rounded-xl"
          >
            <Text className="text-white font-bold text-center">Ver Detalles</Text>
          </TouchableOpacity>
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-red-500 py-2 rounded-xl"
            >
              <Text className="text-white font-bold text-center">Cerrar</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          className="bg-[#059432] py-2 rounded-xl"
        >
          <Text className="text-white font-bold text-center">Abrir Mesa</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

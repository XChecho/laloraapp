import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../store/useMainStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  selected?: boolean;
}

export default function ProductCard({ product, onPress, selected }: ProductCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!product.available}
      className={`bg-white rounded-2xl shadow-md p-4 mb-3 ${
        selected ? 'border-2 border-[#059432]' : ''
      } ${!product.available ? 'opacity-50' : ''}`}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{product.name}</Text>
          {product.description && (
            <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
              {product.description}
            </Text>
          )}
          <View className="flex-row items-center mt-2">
            <Text className="text-xl font-bold text-[#059432]">
              ${product.price.toLocaleString('es-CO')}
            </Text>
            {!product.available && (
              <View className="ml-3 bg-red-100 px-2 py-1 rounded">
                <Text className="text-xs text-red-700 font-semibold">No disponible</Text>
              </View>
            )}
          </View>
        </View>
        <View className="ml-3">
          {selected ? (
            <View className="w-8 h-8 bg-[#059432] rounded-full items-center justify-center">
              <MaterialIcons name="check" size={20} color="white" />
            </View>
          ) : (
            <View className="w-8 h-8 border-2 border-gray-300 rounded-full" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

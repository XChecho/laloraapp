import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, Category } from '@/store/useMainStore';

const categoryIcons: Record<string, string> = {
  almuerzo: 'restaurant',
  res: 'set-meal',
  cerdo: 'set-meal',
  pollo: 'set-meal',
  pescados: 'set-meal',
  vegetariano: 'eco',
  bebidas: 'local-cafe',
  mecato: 'fastfood',
  picateadero: 'whatshot',
};

const categoryColors: Record<string, string> = {
  almuerzo: '#FF6B6B',
  res: '#4ECDC4',
  cerdo: '#FF8C42',
  pollo: '#F7DC6F',
  pescados: '#5DADE2',
  vegetariano: '#58D68D',
  bebidas: '#9B59B6',
  mecato: '#F39C12',
  picateadero: '#E74C3C',
};

export default function MenuScreen() {
  const router = useRouter();
  const { categories } = useMainStore();

  const handleCategoryPress = (category: Category) => {
    router.push(`/waiter/products/${category.id}`);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 py-4">
        <Text className="text-2xl font-bold text-white">Menú</Text>
        <Text className="text-white/80">Selecciona una categoría</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryPress(category)}
              className="bg-white rounded-2xl shadow-md p-5"
              style={{ borderTopWidth: 4, borderTopColor: categoryColors[category.id] || '#059432' }}
            >
              <View 
                className="w-14 h-14 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: `${categoryColors[category.id] || '#059432'}20` }}
              >
                <MaterialIcons 
                  name={(categoryIcons[category.id] as any) || 'restaurant'} 
                  size={32} 
                  color={categoryColors[category.id] || '#059432'} 
                />
              </View>
              <Text className="text-lg font-bold text-gray-800 text-center">
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

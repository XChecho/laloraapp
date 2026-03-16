import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MenuManagement = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([
    { id: '1', name: 'Almuerzos del Día', itemsCount: 5, active: true },
    { id: '2', name: 'Platos a la Carta', itemsCount: 15, active: true },
    { id: '3', name: 'Bebidas', itemsCount: 12, active: true },
    { id: '4', name: 'Postres', itemsCount: 4, active: false },
    { id: '5', name: 'Cancha / Snacks', itemsCount: 8, active: true },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8 mt-4">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#1B2332" />
            </Pressable>
            <Text className="text-2xl font-InterBold text-lora-text">Edición de Menús</Text>
          </View>
          <Pressable className="bg-lora-primary w-10 h-10 rounded-full items-center justify-center">
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>

        <Text className="text-sm font-InterMedium text-lora-text-muted mb-6">
          Gestiona las categorías de tu menú y los platos disponibles para la venta.
        </Text>

        {/* Categories List */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable 
              className="bg-white rounded-[28px] p-6 mb-4 border border-lora-border/30 shadow-sm"
            >
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3">
                    <Ionicons name="restaurant" size={20} color="#F97316" />
                  </View>
                  <View>
                    <Text className="text-lg font-InterBold text-lora-text">{item.name}</Text>
                    <Text className="text-xs font-InterMedium text-lora-text-muted">{item.itemsCount} productos registrados</Text>
                  </View>
                </View>
                
                <View className={`w-10 h-5 rounded-full px-1 justify-center ${item.active ? 'bg-emerald-500' : 'bg-gray-300'} items-end`}>
                  <View className="w-3 h-3 bg-white rounded-full" />
                </View>
              </View>
              
              <View className="flex-row items-center justify-between pt-4 border-t border-lora-border/40">
                <Pressable className="flex-row items-center py-2 px-4 rounded-xl bg-lora-bg/50">
                  <Ionicons name="list" size={16} color="#475569" className="mr-2" />
                  <Text className="text-xs font-InterBold text-slate-600">Ver Items</Text>
                </Pressable>
                
                <View className="flex-row space-x-2">
                  <Pressable className="p-2 bg-slate-50 rounded-lg ml-2">
                    <Ionicons name="create-outline" size={18} color="#64748B" />
                  </Pressable>
                  <Pressable className="p-2 bg-slate-50 rounded-lg ml-2">
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default MenuManagement;

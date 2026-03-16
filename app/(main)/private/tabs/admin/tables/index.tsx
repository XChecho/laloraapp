import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TablesManagement = () => {
  const router = useRouter();
  
  // Mock data for spaces
  const [spaces, setSpaces] = useState([
    { id: '1', name: 'Salón Principal', tables: 12, icon: 'restaurant-outline' },
    { id: '2', name: 'Terraza / Exterior', tables: 8, icon: 'sunny-outline' },
    { id: '3', name: 'Bar / Barra', tables: 5, icon: 'beer-outline' },
    { id: '4', name: 'Zona VIP', tables: 4, icon: 'star-outline' },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setSpaces(prev => prev.map(s => 
      s.id === id ? { ...s, tables: Math.max(0, s.tables + delta) } : s
    ));
  };

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8 mt-4">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#1B2332" />
            </Pressable>
            <Text className="text-2xl font-InterBold text-lora-text">Gestión de Mesas</Text>
          </View>
          <Pressable className="bg-emerald-50 w-10 h-10 rounded-full items-center justify-center border border-emerald-100">
            <Ionicons name="add" size={24} color="#0A873A" />
          </Pressable>
        </View>

        <Text className="text-sm font-InterMedium text-lora-text-muted mb-8 italic">
          Aquí puedes configurar las áreas de tu restaurante y el número de mesas disponibles en cada una.
        </Text>

        {/* Spaces List */}
        {spaces.map((space) => (
          <View key={space.id} className="bg-white rounded-[32px] p-6 mb-6 shadow-sm border border-lora-border/30">
            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 rounded-2xl bg-lora-bg items-center justify-center mr-4">
                <Ionicons name={space.icon as any} size={24} color="#0A873A" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-InterBold text-lora-text">{space.name}</Text>
                <Text className="text-xs font-InterMedium text-lora-text-muted">ID: {space.id}00-AREA</Text>
              </View>
              <Pressable className="p-2">
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </Pressable>
            </View>

            <View className="bg-lora-bg/50 rounded-2xl p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-1">Cantidad de Mesas</Text>
                <Text className="text-2xl font-InterBold text-lora-text">{space.tables}</Text>
              </View>
              
              <View className="flex-row items-center space-x-4">
                <Pressable 
                  onPress={() => updateQuantity(space.id, -1)}
                  className="w-10 h-10 rounded-full bg-white border border-lora-border items-center justify-center active:scale-95"
                >
                  <Ionicons name="remove" size={20} color="#1B2332" />
                </Pressable>
                
                <Pressable 
                  onPress={() => updateQuantity(space.id, 1)}
                  className="w-10 h-10 rounded-full bg-lora-primary items-center justify-center active:scale-95 ml-3"
                >
                  <Ionicons name="add" size={20} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TablesManagement;

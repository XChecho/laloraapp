import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdminCategories } from '@src/hooks/useAdminCategories';

interface MenuSectionProps {
  onPress?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onPress }) => {
  const { data: categories, isLoading, error } = useAdminCategories();

  const categoriesList = Array.isArray(categories) ? categories : [];
  
  const activeCategories = categoriesList.filter((c) => c.enabled).length;
  const totalProducts = categoriesList.reduce((sum, c) => sum + (c.productsCount || 0), 0);

  if (isLoading) {
    return (
      <Pressable className="bg-white rounded-[32px] p-6 mb-4 shadow-sm border border-lora-border/30">
        <Text className="text-xl font-InterBold text-lora-text">Gestión de Menú</Text>
      </Pressable>
    );
  }

  return (
    <Pressable 
      onPress={onPress}
      disabled={!onPress}
      className="bg-white rounded-[32px] p-6 mb-4 shadow-sm border border-lora-border/30 active:opacity-90"
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-InterBold text-lora-text">Gestión de Menú</Text>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </View>
      
      <View className="flex-row flex-wrap gap-4">
        {categoriesList.slice(0, 4).map((category) => (
          <View 
            key={category.id} 
            className={`px-4 py-3 rounded-2xl flex-row items-center border ${
              category.enabled 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
            style={{ minWidth: '45%' }}
          >
            <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
              category.enabled ? 'bg-emerald-100' : 'bg-gray-200'
            }`}>
              <Ionicons 
                name={(category.icon as any) || 'restaurant'} 
                size={16} 
                color={category.enabled ? '#059669' : '#64748B'} 
              />
            </View>
            <View>
              <Text className="text-[13px] font-InterBold text-lora-text" numberOfLines={1}>
                {category.name}
              </Text>
              <Text className="text-[10px] font-InterMedium text-lora-text-muted">
                {category.productsCount || 0} productos
              </Text>
            </View>
          </View>
        ))}
        
        {categoriesList.length === 0 && (
          <View className="w-full py-4 items-center">
            <Text className="text-sm font-InterMedium text-lora-text-muted italic">
              No hay categorías creadas
            </Text>
          </View>
        )}
      </View>

      <View className="mt-6 pt-6 border-t border-lora-border/30 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
          <Text className="text-[11px] font-InterBold text-lora-text-muted uppercase tracking-wider">
            {activeCategories} categorías activas • {totalProducts} productos
          </Text>
        </View>
        <Text className="text-[11px] font-InterBold text-lora-primary uppercase tracking-wider">
          Editar menús
        </Text>
      </View>
    </Pressable>
  );
};
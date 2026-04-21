import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMenuStore } from '@src/store/useMenuStore';
import { CategoryModal } from '@src/components/modals/CategoryModal';
import { useAdminCategories, useCreateAdminCategory, useUpdateAdminCategory, useDeleteAdminCategory, useToggleAdminCategoryStatus } from '@src/hooks/useAdminCategories';
import { AdminCategory } from '@core/actions/admin/categories';

const MenuManagement = () => {
  const router = useRouter();
  const { data: categories, isLoading } = useAdminCategories();
  const createCategory = useCreateAdminCategory();
  const updateCategory = useUpdateAdminCategory();
  const deleteCategory = useDeleteAdminCategory();
  const toggleStatus = useToggleAdminCategoryStatus();
  const setSelectedCategory = useMenuStore((state) => state.setSelectedCategory);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (category: AdminCategory) => {
    setEditingCategory(category);
    setCategoryModalVisible(true);
  };

  const handleSaveCategory = async (data: { name: string; description?: string; icon?: string }) => {
    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory.id, data });
    } else {
      await createCategory.mutateAsync(data);
    }
    setCategoryModalVisible(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    Alert.alert(
      'Eliminar Categoría',
      `¿Estás seguro de eliminar "${name}"? Esto também eliminará todos los productos asociados.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deleteCategory.mutateAsync(id)
        },
      ]
    );
  };

  const handleToggleActive = async (id: string, currentEnabled: boolean) => {
    await toggleStatus.mutateAsync({ id, enabled: !currentEnabled });
  };

  const handleViewProducts = (category: AdminCategory) => {
    setSelectedCategory(category.id);
    router.push(`/private/tabs/admin/menus/${category.id}` as any);
  };

  const renderCategory = ({ item }: { item: AdminCategory }) => (
    <Pressable 
      className={`bg-white rounded-[28px] p-6 mb-4 border border-lora-border/30 shadow-sm`}
    >
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3">
            <Ionicons name={(item.icon as any) || 'restaurant'} size={20} color="#F97316" />
          </View>
          <View>
            <Text className="text-lg font-InterBold text-lora-text">{item.name}</Text>
            <Text className="text-xs font-InterMedium text-lora-text-muted">
              {item.productsCount || 0} productos registrados
            </Text>
          </View>
        </View>
        
        <Pressable 
          className={`w-12 h-6 rounded-full px-1 justify-center ${item.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
          onPress={() => handleToggleActive(item.id, item.enabled)}
        >
          <View className={`w-4 h-4 bg-white rounded-full ${item.enabled ? 'self-end' : 'self-start'}`} />
        </Pressable>
      </View>
      
      <View className="flex-row items-center justify-between pt-4 border-t border-lora-border/40">
        <Pressable 
          className="flex-row items-center py-2 px-4 rounded-xl bg-lora-bg/50"
          onPress={() => handleViewProducts(item)}
        >
          <Ionicons name="list" size={16} color="#475569" className="mr-2" />
          <Text className="text-xs font-InterBold text-slate-600">Ver Items</Text>
        </Pressable>
        
        <View className="flex-row space-x-2">
          <Pressable 
            className="p-2 bg-slate-50 rounded-lg"
            onPress={() => handleEditCategory(item)}
          >
            <Ionicons name="create-outline" size={18} color="#64748B" />
          </Pressable>
          <Pressable 
            className="p-2 bg-slate-50 rounded-lg"
            onPress={() => handleDeleteCategory(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <View className="flex-1 px-6">
        <View className="flex-row items-center justify-between mb-6 mt-4">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#1B2332" />
            </Pressable>
            <Text className="text-2xl font-InterBold text-lora-text">Edición de Menús</Text>
          </View>
          <Pressable 
            onPress={handleCreateCategory}
            className="bg-lora-primary w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>

        <Text className="text-sm font-InterMedium text-lora-text-muted mb-6">
          Gestiona las categorías de tu menú y los platos disponibles para la venta.
        </Text>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#16a34a" />
          </View>
        ) : (
          <FlatList
            data={categories || []}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={renderCategory}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons name="restaurant-outline" size={64} color="#cbd5e1" />
                <Text className="text-lg font-InterMedium text-lora-text-muted mt-4">
                  No hay categorías creadas
                </Text>
                <Text className="text-sm font-InterRegular text-lora-text-muted mt-1">
                  Crea tu primera categoría para empezar
                </Text>
              </View>
            }
          />
        )}
      </View>

      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </SafeAreaView>
  );
};

export default MenuManagement;
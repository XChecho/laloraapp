import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductModal } from '@src/components/modals/ProductModal';
import { useAdminProductsByCategory, useCreateAdminProduct, useUpdateAdminProduct, useToggleAdminProductStatus, useDeleteAdminProduct } from '@src/hooks/useAdminProducts';
import { useAdminCategories } from '@src/hooks/useAdminCategories';
import { AdminProduct } from '@core/actions/admin/products';
import { formatCOP } from '@core/helper/validators';

const CategoryProductsScreen = () => {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  
  const { data: categories } = useAdminCategories();
  const { data: products, isLoading } = useAdminProductsByCategory(categoryId || '');
  const createProduct = useCreateAdminProduct();
  const updateProduct = useUpdateAdminProduct();
  const toggleStatus = useToggleAdminProductStatus();
  const deleteProduct = useDeleteAdminProduct();

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  const category = categories?.find((c) => c.id === categoryId);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductModalVisible(true);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProduct(product);
    setProductModalVisible(true);
  };

  const handleSaveProduct = async (data: { 
    name: string; 
    description?: string; 
    price: number; 
    categoryId: string; 
    image?: string; 
    available?: boolean;
  }) => {
    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, data });
    } else {
      await createProduct.mutateAsync(data);
    }
    setProductModalVisible(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de eliminar "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deleteProduct.mutateAsync({ id, categoryId: categoryId || '' })
        },
      ]
    );
  };

  const handleToggleAvailable = async (id: string, currentAvailable: boolean) => {
    await toggleStatus.mutateAsync({ id, categoryId: categoryId || '', enabled: !currentAvailable });
  };

  const renderProduct = ({ item }: { item: AdminProduct }) => (
    <Pressable 
      className={`bg-white rounded-2xl p-4 mb-3 border border-lora-border/20 shadow-sm flex-row items-center ${!item.available ? 'opacity-60' : ''}`}
    >
      <View className="w-16 h-16 rounded-xl bg-gray-100 items-center justify-center overflow-hidden mr-4">
        {item.image ? (
          <Image source={{ uri: item.image }} className="w-full h-full" />
        ) : (
          <Ionicons name="restaurant-outline" size={24} color="#94A3B8" />
        )}
      </View>

      <View className="flex-1">
        <Text className="text-base font-InterBold text-lora-text" numberOfLines={1}>
          {item.name}
        </Text>
        {item.description && (
          <Text className="text-xs font-InterRegular text-lora-text-muted mt-0.5" numberOfLines={1}>
            {item.description}
          </Text>
        )}
        <Text className="text-sm font-InterSemiBold text-lora-primary mt-1">
          {formatCOP(item.price)}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable 
          className={`w-10 h-6 rounded-full px-1 justify-center ${item.available ? 'bg-emerald-500' : 'bg-gray-300'}`}
          onPress={() => handleToggleAvailable(item.id, item.available)}
        >
          <View className={`w-4 h-4 bg-white rounded-full ${item.available ? 'self-end' : 'self-start'}`} />
        </Pressable>

        <Pressable 
          className="p-2"
          onPress={() => handleEditProduct(item)}
        >
          <Ionicons name="create-outline" size={18} color="#64748B" />
        </Pressable>
        
        <Pressable 
          className="p-2"
          onPress={() => handleDeleteProduct(item.id, item.name)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <View className="flex-1 px-6">
        <View className="flex-row items-center justify-between mb-6 mt-4">
          <View className="flex-row items-center flex-1">
            <Pressable onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#1B2332" />
            </Pressable>
            <View className="flex-1">
              <Text className="text-xl font-InterBold text-lora-text" numberOfLines={1}>
                {category?.name || 'Productos'}
              </Text>
              <Text className="text-xs font-InterMedium text-lora-text-muted">
                {(products || []).length} productos
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Pressable 
              onPress={() => router.push(`/private/tabs/admin/menus/${categoryId}/lists` as any)}
              className="w-10 h-10 rounded-full items-center justify-center bg-orange-50"
            >
              <Ionicons name="list" size={20} color="#F97316" />
            </Pressable>
            <Pressable 
              onPress={handleCreateProduct}
              className="bg-lora-primary w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#16a34a" />
          </View>
        ) : (
          <FlatList
            data={products || []}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={renderProduct}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons name="restaurant-outline" size={64} color="#cbd5e1" />
                <Text className="text-lg font-InterMedium text-lora-text-muted mt-4">
                  No hay productos en esta categoría
                </Text>
                <Text className="text-sm font-InterRegular text-lora-text-muted mt-1">
                  Crea tu primer producto
                </Text>
              </View>
            }
          />
        )}
      </View>

      <ProductModal
        visible={productModalVisible}
        onClose={() => setProductModalVisible(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categoryId={categoryId}
      />
    </SafeAreaView>
  );
};

export default CategoryProductsScreen;
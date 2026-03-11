import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, Product, Category, CategoryType } from '@/store/useMainStore';

const PRIMARY_COLOR = '#059432';

export default function ProductsManagement() {
  const { products, categories } = useMainStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    filteredProducts.forEach(p => {
      if (!grouped[p.categoryId]) {
        grouped[p.categoryId] = [];
      }
      grouped[p.categoryId].push(p);
    });
    return grouped;
  }, [filteredProducts]);

  const availableCount = products.filter(p => p.available).length;
  const unavailableCount = products.filter(p => !p.available).length;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleToggleAvailability = (product: Product) => {
    Alert.alert(
      product.available ? 'Desactivar Producto' : 'Activar Producto',
      `¿${product.available ? 'Desactivar' : 'Activar'} "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => {} },
      ]
    );
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de eliminar "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-3xl font-bold text-white">Productos</Text>
            <Text className="text-white/80 text-lg">Menú y Catálogo</Text>
          </View>
          <TouchableOpacity
            onPress={handleAddProduct}
            className="bg-white px-4 py-2 rounded-lg flex-row items-center gap-2"
          >
            <MaterialIcons name="add" size={20} color="#059432" />
            <Text className="text-[#059432] font-semibold">Nuevo</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white/10 rounded-lg px-4 py-3 flex-row items-center gap-2">
          <MaterialIcons name="search" size={20} color="white" />
          <TextInput
            className="flex-1 text-white placeholder-white/70"
            placeholder="Buscar producto..."
            placeholderTextColor="white/70"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 -mx-4 px-4">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === null ? 'bg-white' : 'bg-white/20'
              }`}
            >
              <Text className={`font-semibold ${
                selectedCategory === null ? 'text-[#059432]' : 'text-white'
              }`}>
                Todos
              </Text>
            </TouchableOpacity>
            {categories.map((cat: Category) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full flex-row items-center gap-1 ${
                  selectedCategory === cat.id ? 'bg-white' : 'bg-white/20'
                }`}
              >
                <Text className={`font-semibold ${
                  selectedCategory === cat.id ? 'text-[#059432]' : 'text-white'
                }`}>
                  {cat.icon} {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="px-4 pt-4">
        <View className="flex-row gap-2 mb-4">
          <View className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <Text className="text-gray-500 text-sm">Disponibles</Text>
            <Text className="text-2xl font-bold text-green-600">{availableCount}</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <Text className="text-gray-500 text-sm">No disponibles</Text>
            <Text className="text-2xl font-bold text-red-600">{unavailableCount}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {Object.entries(productsByCategory).map(([categoryId, prods]) => {
          const category = categories.find((c: Category) => c.id === categoryId);
          return (
            <View key={categoryId} className="mb-6">
              <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-xl font-bold text-gray-800">
                  {category?.icon} {category?.name}
                </Text>
                <Text className="text-gray-500">({prods.length})</Text>
              </View>
              
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {prods.map((product: Product, index: number) => (
                  <View
                    key={product.id}
                    className={`px-4 py-4 flex-row items-center ${
                      index !== prods.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-gray-800 font-medium">{product.name}</Text>
                        {!product.available && (
                          <View className="bg-red-100 px-2 py-0.5 rounded">
                            <Text className="text-red-600 text-xs font-medium">No disponible</Text>
                          </View>
                        )}
                      </View>
                      {product.description && (
                        <Text className="text-gray-500 text-sm mt-1">{product.description}</Text>
                      )}
                      <Text className="text-[#059432] font-bold mt-1">
                        {formatCurrency(product.price)}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => handleToggleAvailability(product)}
                        className={`p-2 rounded-lg ${product.available ? 'bg-green-100' : 'bg-gray-100'}`}
                      >
                        <MaterialIcons
                          name={product.available ? 'visibility' : 'visibility-off'}
                          size={20}
                          color={product.available ? '#059432' : '#6B7280'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleEditProduct(product)}
                        className="p-2 bg-gray-100 rounded-lg"
                      >
                        <MaterialIcons name="edit" size={20} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteProduct(product)}
                        className="p-2 bg-red-50 rounded-lg"
                      >
                        <MaterialIcons name="delete" size={20} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {filteredProducts.length === 0 && (
          <View className="items-center py-12">
            <MaterialIcons name="restaurant-menu" size={60} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-lg">No se encontraron productos</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="text-gray-600 font-medium mb-2">Nombre del Producto</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="Ej: Carne Asada"
                  value={editingProduct?.name || ''}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-600 font-medium mb-2">Precio</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="0"
                  keyboardType="numeric"
                  value={editingProduct?.price.toString() || ''}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-600 font-medium mb-2">Categoría</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {categories.map((cat: Category) => (
                      <TouchableOpacity
                        key={cat.id}
                        className={`px-4 py-2 rounded-lg border ${
                          editingProduct?.categoryId === cat.id
                            ? 'bg-[#059432] border-[#059432]'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <Text className={`font-medium ${
                          editingProduct?.categoryId === cat.id ? 'text-white' : 'text-gray-600'
                        }`}>
                          {cat.icon} {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View className="mb-4">
                <Text className="text-gray-600 font-medium mb-2">Descripción</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="Descripción del producto..."
                  multiline
                  numberOfLines={3}
                  value={editingProduct?.description || ''}
                />
              </View>

              <View className="mb-6 flex-row justify-between items-center">
                <Text className="text-gray-600 font-medium">Disponible</Text>
                <Switch
                  value={editingProduct?.available ?? true}
                  trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                  thumbColor={editingProduct?.available ? '#059432' : '#9CA3AF'}
                />
              </View>

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="bg-[#059432] py-4 rounded-xl"
              >
                <Text className="text-white text-center font-bold text-lg">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, Product, MeatDoneness, meatDonenessOptions } from '@/store/useMainStore';
import ProductCard from '@/components/ProductCard';

export default function ProductsScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { products, categories, addItemToOrder, currentTable } = useMainStore();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDonenessModal, setShowDonenessModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedDoneness, setSelectedDoneness] = useState<MeatDoneness>('medium');

  const category = categories.find(c => c.id === categoryId);
  const categoryProducts = products.filter(p => p.categoryId === categoryId);

  const handleProductSelect = (product: Product) => {
    if (!currentTable) {
      return;
    }

    setSelectedProduct(product);
    
    if (product.requiresMeatDoneness) {
      setShowDonenessModal(true);
    } else if (categoryId === 'almuerzo') {
      router.push('/waiter/wizard');
    } else {
      setShowNotesModal(true);
    }
  };

  const handleDonenessSelect = () => {
    setShowDonenessModal(false);
    setShowNotesModal(true);
  };

  const handleAddToOrder = () => {
    if (!selectedProduct) return;

    addItemToOrder(
      selectedProduct,
      1,
      notes || undefined,
      selectedProduct.requiresMeatDoneness ? selectedDoneness : undefined
    );
    
    setShowNotesModal(false);
    setNotes('');
    setSelectedProduct(null);
  };

  if (!category) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center">
        <Text className="text-xl text-gray-600">Categoría no encontrada</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-2">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">{category.name}</Text>
        <Text className="text-white/80">{categoryProducts.length} productos</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {categoryProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => handleProductSelect(product)}
          />
        ))}
      </ScrollView>

      <Modal
        visible={showDonenessModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDonenessModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Punto de carne
              </Text>
              <TouchableOpacity onPress={() => setShowDonenessModal(false)}>
                <MaterialIcons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="text-lg font-semibold text-gray-700 mb-4">
              Selecciona cómo quieres la carne
            </Text>

            <View className="space-y-3 mb-6">
              {meatDonenessOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setSelectedDoneness(option.value);
                    handleDonenessSelect();
                  }}
                  className={`p-4 rounded-xl border-2 ${
                    selectedDoneness === option.value
                      ? 'border-[#059432] bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Text className={`text-lg font-semibold ${
                    selectedDoneness === option.value ? 'text-[#059432]' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNotesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Agregar nota
              </Text>
              <TouchableOpacity onPress={() => setShowNotesModal(false)}>
                <MaterialIcons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedProduct && (
              <View className="mb-4 p-3 bg-gray-100 rounded-xl">
                <Text className="text-lg font-semibold">{selectedProduct.name}</Text>
                <Text className="text-[#059432] font-bold">
                  ${selectedProduct.price.toLocaleString('es-CO')}
                </Text>
              </View>
            )}

            <Text className="text-lg font-semibold text-gray-700 mb-3">
              Notas especiales (opcional)
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Ej: Sin cebolla, extra salsa, etc."
              multiline
              numberOfLines={3}
              className="bg-gray-100 p-4 rounded-xl text-lg mb-6"
            />

            <TouchableOpacity
              onPress={handleAddToOrder}
              className="bg-[#059432] py-4 rounded-xl"
            >
              <Text className="text-white text-xl font-bold text-center">
                Agregar al pedido
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import { formatCOP } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useMenuCategories } from '@src/hooks/useMenuCategories';
import { useMenuProductsByCategory } from '@src/hooks/useMenuProducts';
import { useMainStore } from '@src/store/useMainStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: { elevation: 3 },
  default: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }
});

const MenuScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentOrder, addItem } = useMainStore();
  const { data: categoriesData, isLoading: categoriesLoading } = useMenuCategories();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const { data: productsData, isLoading: productsLoading } = useMenuProductsByCategory(activeCategoryId || '');

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [modifierStep, setModifierStep] = useState(0);
  const [modifierSelections, setModifierSelections] = useState<Record<string, string[]>>({});
  const [showModifierModal, setShowModifierModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [extraNotes, setExtraNotes] = useState('');

  const categories = categoriesData || [];

  React.useEffect(() => {
    if (categoriesData && categoriesData.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categoriesData[0].id);
    }
  }, [categoriesData, activeCategoryId]);

  const handleSelectProduct = (product: any) => {
    if (!product.available) return;
    setSelectedProduct(product);
    setExtraNotes('');

    if (product.modifiers && product.modifiers.length > 0) {
      setModifierStep(0);
      setModifierSelections({});
      setShowModifierModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleModifierConfirm = () => {
    setShowModifierModal(false);
    setShowConfirmModal(true);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const modifiersText = Object.entries(modifierSelections)
      .filter(([, opts]) => opts.length > 0)
      .map(([name, opts]) => `${name}: ${opts.join(', ')}`)
      .join(' | ');

    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      notes: [modifiersText, extraNotes].filter(Boolean).join(' - '),
    });

    setShowConfirmModal(false);
    setSelectedProduct(null);
    setModifierSelections({});
    setExtraNotes('');
  };

  if (categoriesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0A873A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#1B2332" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-InterBold text-lora-text mr-10">
          Mesa {id}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white border-b border-gray-100 px-4">
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => setActiveCategoryId(cat.id)}
            className={`py-4 mr-6 border-b-4 ${activeCategoryId === cat.id ? 'border-lora-primary' : 'border-transparent'}`}
          >
            <Text className={`font-InterBold ${activeCategoryId === cat.id ? 'text-lora-primary' : 'text-gray-400'}`}>
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 px-3 pt-4">
        {productsLoading ? (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color="#94A3B8" />
          </View>
        ) : (
          <View className="flex-row flex-wrap">
            {(productsData || []).map((product) => (
              <Pressable
                key={product.id}
                onPress={() => handleSelectProduct(product)}
                disabled={!product.available}
                className="w-1/2 p-1.5"
              >
                <View className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  {product.image ? (
                    <Image source={{ uri: product.image }} className="w-full h-32" resizeMode="cover" />
                  ) : (
                    <View className="w-full h-32 bg-gray-100 items-center justify-center">
                      <Ionicons name="restaurant-outline" size={32} color="#CBD5E1" />
                    </View>
                  )}
                  <View className="p-3">
                    <Text className="text-sm font-InterBold text-lora-text" numberOfLines={2}>{product.name}</Text>
                    <Text className="text-xs font-InterBold text-lora-primary mt-1">{formatCOP(product.price)}</Text>
                    {!product.available && <Text className="text-[10px] font-InterBold text-red-500 uppercase mt-1">Agotado</Text>}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {(!productsData || productsData.length === 0) && !productsLoading && (
          <View className="items-center justify-center py-20 opacity-40">
            <Ionicons name="restaurant-outline" size={48} color="#94A3B8" />
            <Text className="mt-4 font-InterBold text-slate-500">No hay productos en esta categoría</Text>
          </View>
        )}
      </ScrollView>

      {currentOrder.length > 0 && (
        <View className="px-4 pt-4 pb-12 bg-white border-t border-gray-100">
          <Pressable
            onPress={() => router.push(`/(main)/private/tabs/waitres/${id}/verify` as any)}
            style={shadowStyle}
            className="bg-lora-primary py-4 rounded-2xl flex-row items-center justify-center active:opacity-70"
          >
            <Text className="text-white font-InterBold text-base mr-2">Verificar Pedido ({currentOrder.length})</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </Pressable>
        </View>
      )}

      <Modal visible={showModifierModal} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] p-6 max-h-[80%]">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
            {selectedProduct && selectedProduct.modifiers && selectedProduct.modifiers[modifierStep] && (
              <>
                <Text className="text-xl font-InterBold text-lora-text mb-2">
                  {selectedProduct.name}
                </Text>
                <Text className="text-sm font-InterBold text-gray-500 mb-4 uppercase tracking-wider">
                  {selectedProduct.modifiers[modifierStep].name}
                  {selectedProduct.modifiers[modifierStep].required ? ' *' : ' (opcional)'}
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {selectedProduct.modifiers[modifierStep].options.map((option: string) => {
                    const isSelected = (modifierSelections[selectedProduct.modifiers[modifierStep].name] || []).includes(option);
                    return (
                      <Pressable
                        key={option}
                        onPress={() => {
                          const modName = selectedProduct.modifiers[modifierStep].name;
                          const current = modifierSelections[modName] || [];
                          const allowsMultiple = selectedProduct.modifiers[modifierStep].multiple;
                          let updated;
                          if (allowsMultiple) {
                            updated = current.includes(option) ? current.filter((o: string) => o !== option) : [...current, option];
                          } else {
                            updated = current.includes(option) ? [] : [option];
                          }
                          setModifierSelections({ ...modifierSelections, [modName]: updated });
                        }}
                        className={`flex-row items-center justify-between p-4 rounded-xl border mb-2 ${isSelected ? 'bg-lora-primary/5 border-lora-primary' : 'bg-gray-50 border-gray-100'}`}
                      >
                        <Text className={`font-InterSemiBold ${isSelected ? 'text-lora-primary' : 'text-gray-700'}`}>{option}</Text>
                        <View className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'border-lora-primary bg-lora-primary' : 'border-gray-300'}`}>
                          {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <View className="flex-row gap-3 mt-4">
                  {modifierStep > 0 && (
                    <Pressable
                      onPress={() => setModifierStep(modifierStep - 1)}
                      className="flex-1 bg-gray-100 py-4 rounded-xl items-center"
                    >
                      <Text className="text-gray-500 font-InterBold">Anterior</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => {
                      const currentMod = selectedProduct.modifiers[modifierStep];
                      const currentSelections = modifierSelections[currentMod.name] || [];
                      if (currentMod.required && currentSelections.length === 0) return;
                      if (modifierStep < selectedProduct.modifiers.length - 1) {
                        setModifierStep(modifierStep + 1);
                      } else {
                        handleModifierConfirm();
                      }
                    }}
                    disabled={selectedProduct.modifiers[modifierStep].required && (modifierSelections[selectedProduct.modifiers[modifierStep].name] || []).length === 0}
                    className={`flex-1 py-4 rounded-xl items-center ${selectedProduct.modifiers[modifierStep].required && (modifierSelections[selectedProduct.modifiers[modifierStep].name] || []).length === 0 ? 'bg-gray-300' : 'bg-lora-primary'}`}
                  >
                    <Text className="text-white font-InterBold">
                      {modifierStep < selectedProduct.modifiers.length - 1 ? 'Siguiente' : 'Confirmar'}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
            <Pressable onPress={() => { setShowModifierModal(false); setSelectedProduct(null); }} className="py-4 items-center mt-2">
              <Text className="text-gray-400 font-InterBold">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center p-6">
          <View className="bg-white rounded-[32px] p-6 shadow-2xl">
            {selectedProduct && (
              <>
                {selectedProduct.image ? (
                  <Image source={{ uri: selectedProduct.image }} className="w-full h-40 rounded-2xl mb-4" />
                ) : (
                  <View className="w-full h-40 bg-gray-100 rounded-2xl mb-4 items-center justify-center">
                    <Ionicons name="restaurant-outline" size={48} color="#CBD5E1" />
                  </View>
                )}
                <Text className="text-lg font-InterBold text-lora-text mb-2">{selectedProduct.name}</Text>
                <Text className="text-sm font-InterBold text-lora-primary mb-4">{formatCOP(selectedProduct.price)}</Text>

                {Object.entries(modifierSelections).filter(([, opts]) => opts.length > 0).length > 0 && (
                  <View className="mb-4">
                    {Object.entries(modifierSelections).filter(([, opts]) => opts.length > 0).map(([name, opts]) => (
                      <Text key={name} className="text-xs text-gray-500 font-InterMedium">{name}: {opts.join(', ')}</Text>
                    ))}
                  </View>
                )}

                <TextInput
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm h-20 mb-6"
                  placeholder="Notas (opcional)..."
                  multiline
                  value={extraNotes}
                  onChangeText={setExtraNotes}
                />

                <View className="flex-row gap-3">
                  <Pressable onPress={() => { setShowConfirmModal(false); setSelectedProduct(null); }} className="flex-1 bg-gray-100 py-4 rounded-xl items-center">
                    <Text className="text-gray-500 font-InterBold">Cancelar</Text>
                  </Pressable>
                  <Pressable onPress={handleAddToCart} className="flex-1 bg-lora-primary py-4 rounded-xl items-center">
                    <Text className="text-white font-InterBold">Agregar</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MenuScreen;

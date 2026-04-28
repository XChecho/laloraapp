import { formatCOP } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useMenuCategories } from '@src/hooks/useMenuCategories';
import { useMenuAllProducts } from '@src/hooks/useMenuProducts';
import { useActiveOrderByTable } from '@src/hooks/useOrders';
import { useTable } from '@src/hooks/useZones';
import { useMainStore } from '@src/store/useMainStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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

function getAllModifiers(product: any) {
  const fromProduct = (product.modifiers || []).map((m: any) => ({
    name: m.name,
    options: (m.options || []).map((opt: any) => ({
      name: typeof opt === 'string' ? opt : opt.name,
      priceExtra: typeof opt === 'string' ? 0 : opt.priceExtra || 0,
    })),
    required: m.required || false,
    multiple: m.multiple || false,
    affectsKitchen: m.affectsKitchen || false,
  }));

  const fromCategory = (product.category?.modifierLists || []).map((list: any) => ({
    name: list.name,
    options: (list.options || []).map((opt: any) => ({
      name: opt.name,
      priceExtra: opt.priceExtra || 0,
    })),
    required: list.required || false,
    multiple: list.multiple || false,
    affectsKitchen: list.affectsKitchen || false,
  }));

  return [...fromProduct, ...fromCategory];
}

const MenuScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentOrder, addItem } = useMainStore();
  const { data: categoriesData, isLoading: categoriesLoading } = useMenuCategories();
  const { data: allProductsData, isLoading: allProductsLoading } = useMenuAllProducts();
  const { data: activeOrder, isLoading: orderLoading } = useActiveOrderByTable(id as string);
  const { data: tableData } = useTable(id as string);

  const categoryPositions = useRef<Record<string, number>>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [modifiers, setModifiers] = useState<any[]>([]);
  const [modifierStep, setModifierStep] = useState(0);
  const [modifierSelections, setModifierSelections] = useState<Record<string, string[]>>({});
  const [showModifierModal, setShowModifierModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [extraNotes, setExtraNotes] = useState('');

  const categories = categoriesData || [];
  const categoriesWithProducts = allProductsData || [];

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;
    let total = selectedProduct.price;

    Object.entries(modifierSelections).forEach(([modName, selectedOptions]) => {
      const modifier = modifiers.find(m => m.name === modName);
      if (modifier) {
        selectedOptions.forEach((optionName) => {
          const option = modifier.options.find((o: any) => o.name === optionName);
          if (option && option.priceExtra) {
            total += option.priceExtra;
          }
        });
      }
    });

    return total;
  };

  React.useEffect(() => {
    if (categoriesData && categoriesData.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categoriesData[0].id);
    }
  }, [categoriesData, activeCategoryId]);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const headerOffset = 120;

    const positions = Object.entries(categoryPositions.current);
    let currentCategory = categories[0]?.id;

    for (const [catId, position] of positions) {
      if (scrollY + headerOffset >= position) {
        currentCategory = catId;
      }
    }

    if (currentCategory !== activeCategoryId) {
      setActiveCategoryId(currentCategory);
    }
  };

  const scrollToCategory = (catId: string) => {
    const position = categoryPositions.current[catId];
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: position - 120,
        animated: true,
      });
    }
  };

  const handleSelectProduct = (product: any) => {
    if (!product.available) return;
    setSelectedProduct(product);
    setExtraNotes('');

    const allModifiers = getAllModifiers(product);
    setModifiers(allModifiers);

    if (allModifiers.length > 0) {
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

    const modifiersData = Object.entries(modifierSelections)
      .filter(([, opts]) => opts.length > 0)
      .map(([modName, selectedOptions]) => {
        const modifier = modifiers.find(m => m.name === modName);
        return selectedOptions.map((optionName) => {
          const option = modifier?.options.find((o: any) => o.name === optionName);
          return {
            modifierName: modName,
            selectedOption: optionName,
            priceExtra: option?.priceExtra || 0,
            affectsKitchen: modifier?.affectsKitchen || false,
          };
        });
      })
      .flat();

    const modifiersText = modifiersData
      .map((m) => `${m.modifierName}: ${m.selectedOption}`)
      .join(' | ');

    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: calculateTotalPrice(),
      notes: [modifiersText, extraNotes].filter(Boolean).join(' - '),
      modifiers: modifiersData,
    });

    setShowConfirmModal(false);
    setSelectedProduct(null);
    setModifiers([]);
    setModifierSelections({});
    setExtraNotes('');
  };

  if (categoriesLoading || allProductsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0A873A" />
      </SafeAreaView>
    );
  }

  const tableName = activeOrder?.table?.name || tableData?.name || `Mesa ${id}`;
  const customerText = activeOrder?.customerName ? ` - ${activeOrder.customerName}` : '';

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#1B2332" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-InterBold text-lora-text mr-10" numberOfLines={1}>
          {orderLoading ? 'Cargando...' : tableName}{customerText}
        </Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(cat) => cat.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        style={{ maxHeight: 48 }}
        className="bg-white border-b border-gray-100"
        renderItem={({ item: cat }) => (
          <Pressable
            onPress={() => scrollToCategory(cat.id)}
            className={`py-1 mr-6 border-b-4 ${activeCategoryId === cat.id ? 'border-lora-primary' : 'border-transparent'}`}
          >
            <Text className={`font-InterBold ${activeCategoryId === cat.id ? 'text-lora-primary' : 'text-gray-400'}`}>
              {cat.name}
            </Text>
          </Pressable>
        )}
      />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {categoriesWithProducts.length === 0 ? (
          <View className="items-center justify-center py-20 opacity-40">
            <Ionicons name="restaurant-outline" size={48} color="#94A3B8" />
            <Text className="mt-4 font-InterBold text-slate-500">No hay productos disponibles</Text>
          </View>
        ) : (
          categoriesWithProducts.map((category: any) => (
            <View
              key={category.id}
              onLayout={(e) => {
                categoryPositions.current[category.id] = e.nativeEvent.layout.y;
              }}
              className="px-3 pt-4 pb-2"
            >
              <Text className="text-base font-InterBold text-lora-text mb-3">{category.name}</Text>
              {category.products && category.products.length > 0 ? (
                <View className="flex-row flex-wrap">
                  {category.products.map((product: any) => (
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
              ) : (
                <View className="items-center py-8 opacity-40">
                  <Text className="font-InterMedium text-slate-500">Sin productos</Text>
                </View>
              )}
            </View>
          ))
        )}
        <View className="h-4" />
      </ScrollView>

      {currentOrder.length > 0 && (
        <View className="px-4 pt-4 pb-12 bg-white border-t border-gray-100">
          <Pressable
            onPress={() => router.push({
              pathname: '/(main)/private/tabs/waitres/[id]/verify',
              params: { id: id as string },
            } as any)}
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
            {selectedProduct && modifiers.length > 0 && modifiers[modifierStep] && (
              <>
                <Text className="text-xl font-InterBold text-lora-text mb-2">
                  {selectedProduct.name}
                </Text>
                <Text className="text-sm font-InterBold text-gray-500 mb-4 uppercase tracking-wider">
                  {modifiers[modifierStep].name}
                  {modifiers[modifierStep].required ? ' *' : ' (opcional)'}
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {modifiers[modifierStep].options.map((option: any) => {
                    const optionName = option.name || option;
                    const optionPrice = option.priceExtra || 0;
                    const modName = modifiers[modifierStep].name;
                    const isSelected = (modifierSelections[modName] || []).includes(optionName);
                    return (
                      <Pressable
                        key={optionName}
                        onPress={() => {
                          const current = modifierSelections[modName] || [];
                          const allowsMultiple = modifiers[modifierStep].multiple;
                          let updated;
                          if (allowsMultiple) {
                            updated = current.includes(optionName) ? current.filter((o: string) => o !== optionName) : [...current, optionName];
                          } else {
                            updated = current.includes(optionName) ? [] : [optionName];
                          }
                          setModifierSelections({ ...modifierSelections, [modName]: updated });
                        }}
                        className={`flex-row items-center justify-between p-4 rounded-xl border mb-2 ${isSelected ? 'bg-lora-primary/5 border-lora-primary' : 'bg-gray-50 border-gray-100'}`}
                      >
                        <Text className={`font-InterSemiBold flex-1 ${isSelected ? 'text-lora-primary' : 'text-gray-700'}`}>{optionName}</Text>
                        {optionPrice > 0 && (
                          <Text className={`font-InterBold text-sm mr-2 ${isSelected ? 'text-lora-primary' : 'text-gray-500'}`}>
                            + {formatCOP(optionPrice)}
                          </Text>
                        )}
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
                      const currentMod = modifiers[modifierStep];
                      const currentSelections = modifierSelections[currentMod.name] || [];
                      if (currentMod.required && currentSelections.length === 0) return;
                      if (modifierStep < modifiers.length - 1) {
                        setModifierStep(modifierStep + 1);
                      } else {
                        handleModifierConfirm();
                      }
                    }}
                    disabled={modifiers[modifierStep].required && (modifierSelections[modifiers[modifierStep].name] || []).length === 0}
                    className={`flex-1 py-4 rounded-xl items-center ${modifiers[modifierStep].required && (modifierSelections[modifiers[modifierStep].name] || []).length === 0 ? 'bg-gray-300' : 'bg-lora-primary'}`}
                  >
                    <Text className="text-white font-InterBold">
                      {modifierStep < modifiers.length - 1 ? 'Siguiente' : 'Confirmar'}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
            <Pressable onPress={() => { setShowModifierModal(false); setSelectedProduct(null); setModifiers([]); }} className="py-4 items-center mt-2">
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
                <Text className="text-sm font-InterBold text-lora-primary mb-4">{formatCOP(calculateTotalPrice())}</Text>

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
                  <Pressable onPress={() => { setShowConfirmModal(false); setSelectedProduct(null); setModifiers([]); }} className="flex-1 bg-gray-100 py-4 rounded-xl items-center">
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

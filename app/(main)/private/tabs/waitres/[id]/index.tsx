import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DB, MenuItem, OrderItem } from '@/core/database/mockDb';
import { useMainStore } from '@/src/store/useMainStore';
import { formatCOP } from '@/core/helper/validators';

const CATEGORIES = [
  { id: 'almuerzo', name: 'Almuerzo del Día', icon: 'restaurant', subtitle: 'Día' },
  { id: 'carta', name: 'A la Carta', icon: 'book' },
  { id: 'bebida', name: 'Bebidas', icon: 'wine' },
] as const;

const ALACARTE_SUBCATS = ['Entradas', 'Res', 'Cerdo', 'Pollo', 'Pez y Mariscos', 'Pastas'];

const COOKING_TERMS = ['Azul (Sellado)', 'Medio', '3/4 (Al punto)', 'Bien asado'];

const MenuScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentOrder, addItem } = useMainStore();
  
  const [activeCategory, setActiveCategory] = useState<'almuerzo' | 'carta' | 'bebida'>('almuerzo');
  const [activeSubcat, setActiveSubcat] = useState('Entradas');
  
  // Modals visibility
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showLunchModal, setShowLunchModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showSauceModal, setShowSauceModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Flow selections
  const [lunchProtein, setLunchProtein] = useState('');
  const [lunchDrink, setLunchDrink] = useState('');
  const [lunchNotes, setLunchNotes] = useState('');
  const [termSelection, setTermSelection] = useState('');
  const [sauceSelection, setSauceSelection] = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  const filteredItems = MOCK_DB.menu.filter((item) => {
    if (activeCategory === 'carta') {
      return item.category === 'carta' && item.subcategory === activeSubcat;
    }
    return item.category === activeCategory;
  });

  const handleSelectItem = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setSelectedItem(item);
    setExtraNotes('');

    if (item.requiresLunchFlow) {
      setLunchProtein('');
      setLunchDrink('');
      setLunchNotes('');
      setShowLunchModal(true);
    } else if (item.requiresTerm) {
      setTermSelection('');
      setShowTermModal(true);
    } else if (item.requiresSauce) {
      setSauceSelection('');
      setShowSauceModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmOrder = (type: 'lunch' | 'term' | 'sauce' | 'simple') => {
    if (!selectedItem) return;

    const baseItem = {
      ...selectedItem,
      price: selectedItem.price + (selectedItem.surcharge || 0),
    };

    if (type === 'lunch') {
      addItem({ ...baseItem, protein: lunchProtein, sideDrink: lunchDrink, notes: lunchNotes });
      setShowLunchModal(false);
    } else if (type === 'term') {
      addItem({ ...baseItem, term: termSelection, notes: extraNotes });
      setShowTermModal(false);
    } else if (type === 'sauce') {
      addItem({ ...baseItem, sauce: sauceSelection, notes: extraNotes });
      setShowSauceModal(false);
    } else {
      addItem({ ...baseItem, notes: extraNotes });
      setShowConfirmModal(false);
    }
    setSelectedItem(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#1B2332" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-InterBold text-lora-text mr-10">
          Mesa {id}
        </Text>
      </View>

      {/* Main Categories */}
      <View className="flex-row bg-white border-b border-gray-100">
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setActiveCategory(cat.id)}
            className={`flex-1 items-center py-4 border-b-2 ${
              activeCategory === cat.id ? 'border-lora-primary' : 'border-transparent'
            }`}
          >
            <Text className={`text-[10px] font-InterBold uppercase ${activeCategory === cat.id ? 'text-lora-primary' : 'text-gray-400'}`}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Large Subcategories */}
      {activeCategory === 'carta' && (
        <View className="bg-white border-b border-gray-100">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3">
            {ALACARTE_SUBCATS.map((sub) => (
              <TouchableOpacity
                key={sub}
                onPress={() => setActiveSubcat(sub)}
                className={`mr-3 px-6 py-3 rounded-2xl border ${
                  activeSubcat === sub ? 'bg-lora-primary border-lora-primary shadow-md' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`text-sm font-InterBold ${activeSubcat === sub ? 'text-white' : 'text-gray-500'}`}>
                  {sub}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView className="flex-1 px-3 pt-4">
        <View className="flex-row flex-wrap">
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleSelectItem(item)}
              disabled={!item.isAvailable}
              className="w-1/2 p-1.5"
            >
              <View className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <Image source={{ uri: item.image }} className="w-full h-32" resizeMode="cover" />
                <View className="p-3">
                  <Text className="text-sm font-InterBold text-lora-text" numberOfLines={2}>{item.name}</Text>
                  <Text className="text-xs font-InterBold text-lora-primary mt-1">{formatCOP(item.price)}</Text>
                  {!item.isAvailable && <Text className="text-[10px] font-InterBold text-red-500 uppercase mt-1">Agotado</Text>}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      {currentOrder.length > 0 && (
        <View className="p-4 bg-white border-t border-gray-100">
          <TouchableOpacity
            onPress={() => router.push(`/(main)/private/tabs/waitres/${id}/verify`)}
            className="bg-lora-primary py-4 rounded-2xl flex-row items-center justify-center shadow-lg"
          >
            <Text className="text-white font-InterBold text-base mr-2">Verificar Pedido ({currentOrder.length})</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Lunch Flow Modal */}
      <Modal visible={showLunchModal} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] p-6 max-h-[90%]">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
            <Text className="text-xl font-InterBold text-lora-text mb-6">Configurar Almuerzo: {selectedItem?.name}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-sm font-InterBold text-gray-500 mb-3 uppercase tracking-wider">Seleccione Proteína</Text>
              <View className="space-y-2 mb-6">
                {MOCK_DB.proteins.map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setLunchProtein(p)}
                    className={`flex-row items-center justify-between p-4 rounded-xl border ${lunchProtein === p ? 'bg-lora-primary/5 border-lora-primary' : 'bg-gray-50 border-gray-100'}`}
                  >
                    <Text className={`font-InterSemiBold ${lunchProtein === p ? 'text-lora-primary' : 'text-gray-700'}`}>{p}</Text>
                    <View className={`w-6 h-6 rounded-full border-2 ${lunchProtein === p ? 'border-lora-primary bg-lora-primary' : 'border-gray-300'}`}>
                      {lunchProtein === p && <Ionicons name="checkmark" size={14} color="white" className="self-center" />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-sm font-InterBold text-gray-500 mb-3 uppercase tracking-wider">Seleccione Bebida</Text>
              <View className="space-y-2 mb-6">
                {MOCK_DB.lunchDrinks.map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setLunchDrink(d)}
                    className={`flex-row items-center justify-between p-4 rounded-xl border ${lunchDrink === d ? 'bg-lora-primary/5 border-lora-primary' : 'bg-gray-50 border-gray-100'}`}
                  >
                    <Text className={`font-InterSemiBold ${lunchDrink === d ? 'text-lora-primary' : 'text-gray-700'}`}>{d}</Text>
                    <View className={`w-6 h-6 rounded-full border-2 ${lunchDrink === d ? 'border-lora-primary bg-lora-primary' : 'border-gray-300'}`}>
                      {lunchDrink === d && <Ionicons name="checkmark" size={14} color="white" className="self-center" />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-sm font-InterBold text-gray-500 mb-3 uppercase tracking-wider">Notas Especiales</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm h-24 mb-8"
                placeholder="Ej: Sin arroz, sin papá, sin ensalada..."
                multiline
                value={lunchNotes}
                onChangeText={setLunchNotes}
              />

              <TouchableOpacity
                onPress={() => handleConfirmOrder('lunch')}
                disabled={!lunchProtein || !lunchDrink}
                className={`py-4 rounded-2xl items-center shadow-md ${lunchProtein && lunchDrink ? 'bg-lora-primary' : 'bg-gray-300'}`}
              >
                <Text className="text-white font-InterBold text-base">Agregar al Pedido</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowLunchModal(false)} className="py-4 items-center">
                <Text className="text-gray-400 font-InterBold">Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Term Modal */}
      <Modal visible={showTermModal} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] p-6">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
            <Text className="text-xl font-InterBold text-lora-text mb-6">Término de Carne: {selectedItem?.name}</Text>
            
            <View className="space-y-2 mb-6">
              {COOKING_TERMS.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTermSelection(t)}
                  className={`flex-row items-center justify-between p-4 rounded-xl border ${termSelection === t ? 'bg-lora-primary/5 border-lora-primary' : 'bg-gray-50 border-gray-100'}`}
                >
                  <Text className={`font-InterSemiBold ${termSelection === t ? 'text-lora-primary' : 'text-gray-700'}`}>{t}</Text>
                  <View className={`w-6 h-6 rounded-full border-2 ${termSelection === t ? 'border-lora-primary bg-lora-primary' : 'border-gray-300'}`}>
                    {termSelection === t && <Ionicons name="checkmark" size={14} color="white" className="self-center" />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm h-20 mb-8"
              placeholder="Notas adicionales..."
              multiline
              value={extraNotes}
              onChangeText={setExtraNotes}
            />

            <TouchableOpacity
              onPress={() => handleConfirmOrder('term')}
              disabled={!termSelection}
              className={`py-4 rounded-2xl items-center ${termSelection ? 'bg-lora-primary' : 'bg-gray-300'}`}
            >
              <Text className="text-white font-InterBold text-base">Confirmar y Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTermModal(false)} className="py-4 items-center">
              <Text className="text-gray-400 font-InterBold">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Generic Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center p-6">
          <View className="bg-white rounded-[32px] p-6 shadow-2xl">
            <Image source={{ uri: selectedItem?.image }} className="w-full h-40 rounded-2xl mb-4" />
            <Text className="text-lg font-InterBold text-lora-text mb-2">{selectedItem?.name}</Text>
            <Text className="text-sm font-InterBold text-lora-primary mb-6">{formatCOP(selectedItem?.price || 0)}</Text>
            
            <TextInput
              className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm h-20 mb-6"
              placeholder="Notas (opcional)..."
              multiline
              value={extraNotes}
              onChangeText={setExtraNotes}
            />

            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={() => setShowConfirmModal(false)} className="flex-1 bg-gray-100 py-4 rounded-xl items-center">
                <Text className="text-gray-500 font-InterBold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleConfirmOrder('simple')} className="flex-1 bg-lora-primary py-4 rounded-xl items-center">
                <Text className="text-white font-InterBold">Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MenuScreen;

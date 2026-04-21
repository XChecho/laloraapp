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
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategoryLists, useCreateModifier, useDeleteModifier, useAddModifierOption, useDeleteModifierOption } from '@src/hooks/useCategoryLists';
import { useAdminCategories } from '@src/hooks/useAdminCategories';
import { CategoryModifier, ModifierOption } from '@core/actions/admin/category-lists';

const CategoryListsScreen = () => {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  
  const { data: categories } = useAdminCategories();
  const { data: categoryData, isLoading } = useCategoryLists(categoryId || '');
  const createModifier = useCreateModifier();
  const deleteModifier = useDeleteModifier();
  const addOption = useAddModifierOption();
  const deleteOption = useDeleteModifierOption();

  const [modalVisible, setModalVisible] = useState(false);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [selectedModifier, setSelectedModifier] = useState<CategoryModifier | null>(null);
  
  const [newListName, setNewListName] = useState('');
  const [newListRequired, setNewListRequired] = useState(false);
  const [newListMultiple, setNewListMultiple] = useState(false);
  
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState('');

  const category = categories?.find((c) => c.id === categoryId);
  const modifiers = categoryData?.modifiers || [];

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    
    try {
      await createModifier.mutateAsync({
        categoryId: categoryId || '',
        data: {
          name: newListName.trim(),
          required: newListRequired,
          multiple: newListMultiple,
        },
      });
      setModalVisible(false);
      setNewListName('');
      setNewListRequired(false);
      setNewListMultiple(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la lista');
    }
  };

  const handleDeleteList = (modifier: CategoryModifier) => {
    Alert.alert(
      'Eliminar Lista',
      `¿Eliminar "${modifier.name}" y todas sus opciones?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteModifier.mutateAsync({ categoryId: categoryId || '', modifierId: modifier.id }),
        },
      ]
    );
  };

  const handleAddOption = async () => {
    if (!newOptionName.trim() || !newOptionPrice.trim() || !selectedModifier) return;

    const price = parseFloat(newOptionPrice);
    if (isNaN(price)) {
      Alert.alert('Error', 'Precio inválido');
      return;
    }

    try {
      await addOption.mutateAsync({
        categoryId: categoryId || '',
        modifierId: selectedModifier.id,
        data: { name: newOptionName.trim(), price },
      });
      setOptionModalVisible(false);
      setNewOptionName('');
      setNewOptionPrice('');
      setSelectedModifier(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la opción');
    }
  };

  const handleDeleteOption = (modifierId: string, option: ModifierOption) => {
    Alert.alert(
      'Eliminar Opción',
      `¿Eliminar "${option.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteOption.mutateAsync({ 
            categoryId: categoryId || '', 
            modifierId, 
            optionId: option.id 
          }),
        },
      ]
    );
  };

  const openOptionModal = (modifier: CategoryModifier) => {
    setSelectedModifier(modifier);
    setOptionModalVisible(true);
  };

  const renderModifier = ({ item }: { item: CategoryModifier }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-lora-border/20 shadow-sm">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3">
            <Ionicons name="list" size={20} color="#F97316" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-InterBold text-lora-text">{item.name}</Text>
            <Text className="text-xs text-lora-text-muted">
              {item.required && <Text className="text-orange-500">Obligatorio</Text>}
              {item.required && item.multiple && <Text> • </Text>}
              {item.multiple && <Text>Selección múltiple</Text>}
              {!item.required && !item.multiple && <Text>Opcional</Text>}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <Pressable 
            className="p-2 bg-emerald-50 rounded-lg"
            onPress={() => openOptionModal(item)}
          >
            <Ionicons name="add" size={18} color="#059669" />
          </Pressable>
          <Pressable 
            className="p-2 bg-red-50 rounded-lg"
            onPress={() => handleDeleteList(item)}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      <View className="pl-13">
        {item.options.length === 0 ? (
          <Text className="text-sm text-lora-text-muted italic">Sin opciones agregadas</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {item.options.map((option) => (
              <Pressable 
                key={option.id}
                className="flex-row items-center bg-lora-bg px-3 py-2 rounded-lg"
                onLongPress={() => handleDeleteOption(item.id, option)}
              >
                <Text className="text-sm font-InterMedium text-lora-text">{option.name}</Text>
                {option.price > 0 && (
                  <Text className="text-sm text-lora-primary ml-2">+${option.price}</Text>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
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
                Listas - {category?.name}
              </Text>
              <Text className="text-xs font-InterMedium text-lora-text-muted">
                {modifiers.length} listas configuradas
              </Text>
            </View>
          </View>
          <Pressable 
            onPress={() => setModalVisible(true)}
            className="bg-lora-primary w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>

        <Text className="text-sm text-lora-text-muted mb-4">
          Configura listas de opciones que aparecerán al seleccionar productos de esta categoría.
        </Text>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#16a34a" />
          </View>
        ) : (
          <FlatList
            data={modifiers}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={renderModifier}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons name="list-outline" size={64} color="#cbd5e1" />
                <Text className="text-lg font-InterMedium text-lora-text-muted mt-4">
                  No hay listas configuradas
                </Text>
                <Text className="text-sm font-InterRegular text-lora-text-muted mt-1">
                  Crea listas como "Proteína" o "Bebida"
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Create List Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-InterBold text-lora-text mb-4">Nueva Lista</Text>
            
            <Text className="text-sm font-InterMedium text-lora-text-muted mb-1">Nombre</Text>
            <TextInput
              value={newListName}
              onChangeText={setNewListName}
              placeholder="Ej: Proteína, Bebida, Acompañamiento"
              className="bg-lora-bg border border-lora-border/20 rounded-xl p-3 mb-4"
            />

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-InterMedium text-lora-text">Obligatorio</Text>
              <Pressable 
                className={`w-12 h-6 rounded-full px-1 justify-center ${newListRequired ? 'bg-emerald-500' : 'bg-gray-300'}`}
                onPress={() => setNewListRequired(!newListRequired)}
              >
                <View className={`w-4 h-4 bg-white rounded-full ${newListRequired ? 'self-end' : 'self-start'}`} />
              </Pressable>
            </View>

            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-sm font-InterMedium text-lora-text">Selección múltiple</Text>
              <Pressable 
                className={`w-12 h-6 rounded-full px-1 justify-center ${newListMultiple ? 'bg-emerald-500' : 'bg-gray-300'}`}
                onPress={() => setNewListMultiple(!newListMultiple)}
              >
                <View className={`w-4 h-4 bg-white rounded-full ${newListMultiple ? 'self-end' : 'self-start'}`} />
              </Pressable>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 py-4 bg-slate-100 rounded-2xl items-center"
              >
                <Text className="font-InterBold text-slate-500">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateList}
                className="flex-1 py-4 bg-lora-primary rounded-2xl items-center"
              >
                <Text className="font-InterBold text-white">Crear</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Option Modal */}
      <Modal visible={optionModalVisible} transparent animationType="slide" onRequestClose={() => setOptionModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-InterBold text-lora-text mb-4">
              Agregar a {selectedModifier?.name}
            </Text>
            
            <Text className="text-sm font-InterMedium text-lora-text-muted mb-1">Nombre</Text>
            <TextInput
              value={newOptionName}
              onChangeText={setNewOptionName}
              placeholder="Ej: Pollo, Carne, Jugo"
              className="bg-lora-bg border border-lora-border/20 rounded-xl p-3 mb-4"
            />

            <Text className="text-sm font-InterMedium text-lora-text-muted mb-1">Precio adicional</Text>
            <TextInput
              value={newOptionPrice}
              onChangeText={setNewOptionPrice}
              placeholder="0"
              keyboardType="numeric"
              className="bg-lora-bg border border-lora-border/20 rounded-xl p-3 mb-6"
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setOptionModalVisible(false)}
                className="flex-1 py-4 bg-slate-100 rounded-2xl items-center"
              >
                <Text className="font-InterBold text-slate-500">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleAddOption}
                className="flex-1 py-4 bg-lora-primary rounded-2xl items-center"
              >
                <Text className="font-InterBold text-white">Agregar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CategoryListsScreen;
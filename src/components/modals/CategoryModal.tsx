import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string; icon?: string }) => void;
  category?: { id: string; name: string; description?: string; icon?: string } | null;
}

const ICON_OPTIONS = [
  { name: 'restaurant', label: 'Restaurante' },
  { name: 'leaf', label: 'Vegetales' },
  { name: 'sunny', label: 'Desayuno' },
  { name: 'bonfire', label: ' Parrilla' },
  { name: 'football', label: 'Cancha' },
  { name: 'pricetag', label: 'Promoción' },
  { name: 'wine', label: 'Vinos' },
  { name: 'pizza', label: 'Pizza' },
  { name: 'beer', label: 'Cerveza' },
  { name: 'ice-cream', label: 'Postre' },
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  onSave,
  category,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('restaurant');

  useEffect(() => {
    if (category && visible) {
      setName(category.name);
      setDescription(category.description || '');
      setSelectedIcon(category.icon || 'restaurant');
    } else if (visible) {
      setName('');
      setDescription('');
      setSelectedIcon('restaurant');
    }
  }, [category, visible]);

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      icon: selectedIcon,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
          <Pressable className="bg-white rounded-t-[40px] p-6 pb-10 max-h-[85%]" onPress={(e) => e.stopPropagation()}>
            <View className="w-full items-center pb-4 -mt-2">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>
            
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-InterBold text-lora-text">
                {category ? 'Editar Categoría' : 'Nueva Categoría'}
              </Text>
              <Pressable onPress={onClose} className="p-2 -mr-2">
                <Ionicons name="close" size={24} color="#94A3B8" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="space-y-5">
              {/* Name */}
              <View>
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Nombre de Categoría</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Ej. Almuerzos del Día"
                  className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text border border-lora-border/20"
                />
              </View>

              {/* Description */}
              <View>
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Descripción (Opcional)</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Descripción breve de la categoría"
                  multiline
                  numberOfLines={2}
                  className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text border border-lora-border/20"
                />
              </View>

              {/* Icon Selection */}
              <View>
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-3">Icono</Text>
                <View className="flex-row flex-wrap gap-3">
                  {ICON_OPTIONS.map((icon) => (
                    <Pressable
                      key={icon.name}
                      onPress={() => setSelectedIcon(icon.name)}
                      className={`w-14 h-14 rounded-2xl items-center justify-center border-2 ${
                        selectedIcon === icon.name
                          ? 'border-lora-primary bg-lora-primary/10'
                          : 'border-lora-border/30 bg-white'
                      }`}
                    >
                      <Ionicons 
                        name={icon.name as any} 
                        size={24} 
                        color={selectedIcon === icon.name ? '#16a34a' : '#64748B'} 
                      />
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3 mt-4">
                <Pressable
                  onPress={onClose}
                  className="flex-1 py-4 bg-slate-100 rounded-2xl items-center"
                >
                  <Text className="font-InterBold text-slate-500">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  disabled={!name.trim()}
                  className={`flex-[2] py-4 rounded-2xl items-center shadow-lg ${
                    name.trim() ? 'bg-lora-primary' : 'bg-gray-300'
                  }`}
                >
                  <Text className="font-InterBold text-white">
                    {category ? 'Guardar Cambios' : 'Crear Categoría'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
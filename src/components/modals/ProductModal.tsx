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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { 
    name: string; 
    description?: string; 
    price: number; 
    categoryId: string; 
    image?: string; 
    enabled?: boolean;
  }) => void;
  product?: { id: string; name: string; description?: string; price: number; categoryId: string; image?: string; enabled?: boolean } | null;
  categoryId: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  onSave,
  product,
  categoryId,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setImage(product.image || '');
      setIsEnabled(product.enabled ?? true);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setIsEnabled(true);
    }
  }, [product]);

  const handleSave = () => {
    if (!name.trim() || !price.trim()) return;
    
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber)) return;

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      price: priceNumber,
      categoryId,
      image: image.trim() || undefined,
      enabled: isEnabled,
    });
    onClose();
  };

  const isValid = name.trim() && price.trim() && !isNaN(parseFloat(price));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
          <Pressable className="bg-white rounded-t-[40px] p-6 pb-10 max-h-[90%]" onPress={(e) => e.stopPropagation()}>
            <View className="w-full items-center pb-4 -mt-2">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>
            
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-InterBold text-lora-text">
                {product ? 'Editar Producto' : 'Nuevo Producto'}
              </Text>
              <Pressable onPress={onClose} className="p-2 -mr-2">
                <Ionicons name="close" size={24} color="#94A3B8" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="space-y-5">
              {/* Name */}
              <View>
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Nombre del Producto</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Ej. Hamburguesa Especial"
                  className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text border border-lora-border/20"
                />
              </View>

              {/* Description */}
              <View>
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Descripción (Opcional)</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Descripción del producto"
                  multiline
                  numberOfLines={2}
                  className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text border border-lora-border/20"
                />
              </View>

              {/* Price */}
              <View>
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Precio (COP)</Text>
                <View className="flex-row items-center bg-lora-bg rounded-2xl p-4 border border-lora-border/20">
                  <Text className="text-lg font-InterBold text-lora-text mr-2">$</Text>
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0"
                    keyboardType="numeric"
                    className="flex-1 text-lg font-InterBold text-lora-text"
                  />
                </View>
              </View>

              {/* Image URL */}
              <View>
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">URL de Imagen (Opcional)</Text>
                <View className="flex-row items-center bg-lora-bg rounded-2xl p-4 border border-lora-border/20">
                  <Ionicons name="image-outline" size={20} color="#94A3B8" className="mr-3" />
                  <TextInput
                    value={image}
                    onChangeText={setImage}
                    placeholder="https://..."
                    autoCapitalize="none"
                    className="flex-1 font-InterSemiBold text-lora-text"
                  />
                </View>
              </View>

              {/* Available Toggle */}
              <View className="flex-row items-center justify-between bg-lora-bg rounded-2xl p-4 border border-lora-border/20">
                <View className="flex-row items-center">
                  <Ionicons 
                    name={isEnabled ? 'checkbox' : 'square-outline'} 
                    size={22} 
                    color={isEnabled ? '#16a34a' : '#94A3B8'} 
                    className="mr-3"
                  />
                  <Text className="font-InterSemiBold text-lora-text">Disponible para venta</Text>
                </View>
                <Switch
                  value={isEnabled}
                  onValueChange={setIsEnabled}
                  trackColor={{ false: '#e2e8f0', true: '#86efac' }}
                  thumbColor={isEnabled ? '#16a34a' : '#94a3b8'}
                />
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
                  disabled={!isValid}
                  className={`flex-[2] py-4 rounded-2xl items-center shadow-lg ${
                    isValid ? 'bg-lora-primary' : 'bg-gray-300'
                  }`}
                >
                  <Text className="font-InterBold text-white">
                    {product ? 'Guardar Cambios' : 'Crear Producto'}
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
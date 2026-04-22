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
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    image?: string;
    imageFile?: {
      uri: string;
      name: string;
      type: string;
    };
    stock?: number;
    available?: boolean;
  }) => void;
  product?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    image?: string;
    stock: number;
    available?: boolean;
  } | null;
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
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setStock(product.stock?.toString() || '0');
      setImage(product.image || '');
      setIsEnabled(product.available ?? true);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setImage('');
      setImageFile(null);
      setIsEnabled(true);
    }
  }, [product]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Necesitas permiso para acceder a la galería de imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageFile({
        uri: asset.uri,
        name: asset.fileName || 'product-image.jpg',
        type: asset.type || 'image/jpeg',
      });
      setImage('');
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Necesitas permiso para acceder a la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageFile({
        uri: asset.uri,
        name: asset.fileName || 'product-image.jpg',
        type: asset.type || 'image/jpeg',
      });
      setImage('');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Agregar Imagen',
      'Selecciona una opción',
      [
        { text: 'Tomar Foto', onPress: takePhoto },
        { text: 'Elegir de Galería', onPress: pickImage },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim()) return;

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber)) return;

    const stockNumber = stock.trim() ? parseInt(stock, 10) : 0;

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      price: priceNumber,
      categoryId,
      image: image.trim() || undefined,
      imageFile: imageFile || undefined,
      stock: stockNumber,
      available: isEnabled,
    });
    onClose();
  };

  const displayImage = imageFile?.uri || image;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
          <Pressable className="bg-white rounded-t-[40px] p-6 pb-10 max-h-[95%]" onPress={(e) => e.stopPropagation()}>
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
              {/* Image Picker */}
              <View>
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Imagen del Producto</Text>
                <View className="flex-row items-center gap-3">
                  <Pressable
                    onPress={showImageOptions}
                    className="w-24 h-24 rounded-2xl bg-lora-bg border border-lora-border/20 items-center justify-center overflow-hidden"
                  >
                    {displayImage ? (
                      <Image source={{ uri: displayImage }} className="w-full h-full" />
                    ) : (
                      <Ionicons name="camera-outline" size={32} color="#94A3B8" />
                    )}
                  </Pressable>
                  <View className="flex-1">
                    <Pressable
                      onPress={showImageOptions}
                      className="py-3 px-4 bg-lora-bg rounded-xl border border-lora-border/20 items-center mb-2"
                    >
                      <Text className="font-InterSemiBold text-lora-primary">Seleccionar Imagen</Text>
                    </Pressable>
                    {imageFile && (
                      <Pressable
                        onPress={() => setImageFile(null)}
                        className="py-2 px-4 bg-red-50 rounded-xl items-center"
                      >
                        <Text className="font-InterSemiBold text-red-500">Eliminar Imagen</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>

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

              {/* Price and Stock Row */}
              <View className="flex-row gap-3">
                {/* Price */}
                <View className="flex-1">
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

                {/* Stock */}
                <View className="flex-1">
                  <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Stock</Text>
                  <View className="flex-row items-center bg-lora-bg rounded-2xl p-4 border border-lora-border/20">
                    <Ionicons name="cube-outline" size={20} color="#94A3B8" className="mr-2" />
                    <TextInput
                      value={stock}
                      onChangeText={setStock}
                      placeholder="0"
                      keyboardType="numeric"
                      className="flex-1 text-lg font-InterBold text-lora-text"
                    />
                  </View>
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
                  disabled={!name.trim() || !price.trim()}
                  className={`flex-[2] py-4 rounded-2xl items-center shadow-lg ${
                    name.trim() && price.trim() ? 'bg-lora-primary' : 'bg-gray-300'
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

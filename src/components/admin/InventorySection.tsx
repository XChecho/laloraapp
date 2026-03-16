import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  icon?: any;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Pizza Familiar Peperoni', category: 'Cocina', price: '$15.00' },
  { id: '2', name: 'Coca-Cola 600ml', category: 'Bebidas', price: '$1.50' },
  { id: '3', name: 'Alquiler Cancha (1 Hora)', category: 'Cancha', price: '$25.00' },
];

interface InventorySectionProps {
  onPress?: () => void;
}

export const InventorySection: React.FC<InventorySectionProps> = ({ onPress }) => {
  return (
    <Pressable 
      onPress={onPress}
      disabled={!onPress}
      className="bg-white rounded-[32px] p-6 mb-4 shadow-sm border border-lora-border/30 active:opacity-90"
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-InterBold text-lora-text">Inventario de Productos</Text>
        <Pressable>
          <Text className="text-lora-primary font-InterSemiBold text-sm">Ver todos</Text>
        </Pressable>
      </View>
      
      <View className="flex-row mb-4 opacity-50 px-2">
        <Text className="flex-1 text-[11px] font-InterBold text-lora-text-muted uppercase tracking-wider">Producto</Text>
        <Text className="flex-1 text-[11px] font-InterBold text-lora-text-muted uppercase tracking-wider text-center">Categoría</Text>
        <Text className="w-16 text-[11px] font-InterBold text-lora-text-muted uppercase tracking-wider text-right">Precio</Text>
      </View>
      
      {mockProducts.map((item, index) => (
        <View key={item.id} className={`flex-row items-center py-4 ${index !== mockProducts.length - 1 ? 'border-b border-lora-border/40' : ''}`}>
          <View className="flex-1 flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-lora-bg items-center justify-center mr-3">
              <View className="w-6 h-6 bg-slate-800 rounded-md" />
            </View>
            <Text className="text-sm font-InterSemiBold text-lora-text flex-shrink" numberOfLines={2}>
              {item.name}
            </Text>
          </View>
          
          <View className="flex-1 items-center">
            <View 
              className={`px-2 py-1 rounded-lg ${
                item.category === 'Cocina' ? 'bg-orange-100' : 
                item.category === 'Bebidas' ? 'bg-blue-100' : 'bg-emerald-100'
              }`}
            >
              <Text 
                className={`text-[10px] font-InterBold ${
                  item.category === 'Cocina' ? 'text-orange-600' : 
                  item.category === 'Bebidas' ? 'text-blue-600' : 'text-emerald-600'
                }`}
              >
                {item.category}
              </Text>
            </View>
          </View>
          
          <Text className="w-16 text-sm font-InterBold text-lora-text text-right">{item.price}</Text>
        </View>
      ))}
    </Pressable>
  );
};

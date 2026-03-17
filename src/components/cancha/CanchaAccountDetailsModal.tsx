import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '@core/helper/validators';
import { CanchaAccount } from '@core/database/mockDb';

interface CanchaAccountDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  activeAccount: CanchaAccount | null;
  onUpdateQty: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onAddMore: () => void;
  onConfirm: () => void;
  isDraft: boolean;
  primaryColor: string;
}

export const CanchaAccountDetailsModal: React.FC<CanchaAccountDetailsModalProps> = ({
  visible,
  onClose,
  activeAccount,
  onUpdateQty,
  onRemoveItem,
  onAddMore,
  onConfirm,
  isDraft,
  primaryColor
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-[40px] px-6 py-8 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-xl font-InterBold text-lora-text">Pedido {activeAccount?.name}</Text>
              <Text className="text-slate-500 text-sm">Productos en curso</Text>
            </View>
            <Pressable onPress={onClose}>
              <Ionicons name="close-circle" size={32} color="#94A3B8" />
            </Pressable>
          </View>

          <ScrollView 
            className="mb-6 flex-grow-0" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            <Text className="text-xs font-InterBold text-slate-400 uppercase mb-3 tracking-widest">Resumen de Productos</Text>
            
            {activeAccount?.items && activeAccount.items.length > 0 ? (
              activeAccount.items.map((item: any, idx: number) => (
                <View key={item.id || idx} className="flex-row justify-between items-center py-4 border-b border-lora-border/10">
                  <View className="flex-1 mr-4">
                    <Text className="font-InterBold text-lora-text text-base" numberOfLines={1}>{item.name}</Text>
                    <Text className="font-InterSemiBold text-lora-primary text-sm">{formatCOP(item.price)} c/u</Text>
                  </View>
                  
                  <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center bg-slate-50 rounded-xl p-1 border border-lora-border/10">
                      <Pressable 
                        onPress={() => onUpdateQty(item.id, -1)} 
                        className="w-8 h-8 items-center justify-center rounded-lg active:bg-slate-200"
                      >
                        <Ionicons name="remove" size={18} color={item.qty > 1 ? primaryColor : "#94A3B8"} />
                      </Pressable>
                      <Text className="w-8 text-center font-InterExtraBold text-lora-text text-base">{item.qty}</Text>
                      <Pressable 
                        onPress={() => onUpdateQty(item.id, 1)} 
                        className="w-8 h-8 items-center justify-center rounded-lg active:bg-slate-200"
                      >
                        <Ionicons name="add" size={18} color={primaryColor} />
                      </Pressable>
                    </View>
                    
                    <Pressable 
                      onPress={() => onRemoveItem(item.id)} 
                      className="w-10 h-10 items-center justify-center bg-red-50 rounded-xl active:bg-red-100"
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <View className="bg-lora-bg rounded-3xl p-8 items-center justify-center border border-dashed border-slate-300">
                <Ionicons name="cart-outline" size={32} color="#94A3B8" className="mb-2" />
                <Text className="text-center font-InterMedium text-slate-400">No hay productos en esta cuenta</Text>
              </View>
            )}
            
            <View className="flex-row justify-between items-center py-6 mt-2 border-t border-lora-border/20">
              <Text className="text-xl font-InterExtraBold text-lora-text">Total a Pagar</Text>
              <Text className="text-2xl font-InterExtraBold text-lora-primary">{formatCOP(activeAccount?.total || 0)}</Text>
            </View>
          </ScrollView>

          <View className="flex-row gap-3">
            <Pressable 
              onPress={onAddMore} 
              className="flex-[2] bg-lora-primary py-4 rounded-2xl items-center justify-center flex-row shadow-lg shadow-lora-primary/30"
            >
              <Ionicons name={isDraft ? "add-circle" : "cart"} size={20} color="white" className="mr-2" />
              <Text style={{ color: 'white', fontFamily: 'InterBold', fontSize: 16 }}>
                {isDraft ? 'Más Items' : 'Agregar'}
              </Text>
            </Pressable>
            
            <Pressable 
              onPress={onConfirm} 
              className={`flex-[3] py-4 rounded-2xl items-center justify-center shadow-lg flex-row ${isDraft ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-red-500 shadow-red-500/30'}`}
            >
              <Ionicons name={isDraft ? "checkmark-circle" : "card"} size={20} color="white" className="mr-2" />
              <Text className="text-white font-InterBold text-base">
                {isDraft ? 'Confirmar Pedido' : 'Cerrar Cuenta'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

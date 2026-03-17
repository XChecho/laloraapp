import React from 'react';
import { Modal, View, Text, Pressable, TextInput, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '@core/helper/validators';
import { CanchaAccount, MOCK_DB } from '@core/database/mockDb';

interface CanchaMenuModalProps {
  visible: boolean;
  onClose: () => void;
  activeAccount: CanchaAccount | null;
  onAddItem: (item: any) => void;
  onViewOrder: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  menuTab: string;
  setMenuTab: (tab: any) => void;
  primaryColor: string;
}

export const CanchaMenuModal: React.FC<CanchaMenuModalProps> = ({
  visible,
  onClose,
  activeAccount,
  onAddItem,
  onViewOrder,
  searchQuery,
  setSearchQuery,
  menuTab,
  setMenuTab,
  primaryColor
}) => {
  const menuCategories = ['Bebidas', 'Mecato', 'Piqueteadero'];

  const getItemsToShow = () => {
    const canchaMenu = MOCK_DB.menu.filter(item => item.category === 'cancha');
    if (searchQuery.trim().length > 0) {
      return canchaMenu.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return canchaMenu.filter(i => i.subcategory === menuTab);
  };

  const itemsToShow = getItemsToShow();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-lora-bg h-[90%] rounded-t-[40px] overflow-hidden">
          <View className="px-6 pt-8 pb-4 bg-white shadow-sm">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-2xl font-InterBold text-lora-text">Menú de Productos</Text>
                <Text className="text-slate-400 font-InterMedium text-xs uppercase tracking-widest mt-0.5">Cliente: {activeAccount?.name}</Text>
              </View>
              <Pressable onPress={onClose} className="bg-slate-100 p-2 rounded-xl">
                <Ionicons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <View className="flex-row items-center bg-lora-bg px-4 py-3 rounded-2xl mb-6 border border-lora-border/10">
              <Ionicons name="search" size={20} color="#94A3B8" className="mr-3" />
              <TextInput
                placeholder="Buscar productos..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 font-InterMedium text-lora-text"
                placeholderTextColor="#94A3B8"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                </Pressable>
              )}
            </View>

            <View className="flex-row gap-2">
              {menuCategories.map(tab => (
                <Pressable 
                  key={tab} 
                  onPress={() => { setMenuTab(tab); setSearchQuery(''); }}
                  className={`px-6 py-2.5 rounded-xl border ${menuTab === tab && !searchQuery ? 'bg-lora-primary border-lora-primary' : 'bg-white border-lora-border/20'}`}
                >
                  <Text className={`font-InterBold text-xs ${menuTab === tab && !searchQuery ? 'text-white' : 'text-slate-500'}`}>{tab}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <ScrollView className="flex-1 px-4 pt-4">
            <View className="flex-row flex-wrap justify-between">
              {itemsToShow.length === 0 ? (
                <View className="w-full py-20 items-center justify-center">
                  <Ionicons name="search-outline" size={48} color="#CBD5E1" className="mb-4" />
                  <Text className="text-slate-400 font-InterBold">No encontramos productos</Text>
                </View>
              ) : (
                itemsToShow.map(item => {
                  const itemInAcct = activeAccount?.items.find((i: any) => i.id === item.id);
                  return (
                    <Pressable 
                      key={item.id} 
                      onPress={() => onAddItem(item)}
                      className="w-[48%] mb-4 active:opacity-70"
                    >
                      <View className="bg-white rounded-3xl overflow-hidden border border-lora-border/10 shadow-sm relative">
                        {itemInAcct && (
                          <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: primaryColor, borderRadius: 12, minWidth: 24, paddingVertical: 2, alignItems: 'center', zIndex: 10 }}>
                            <Text style={{ color: 'white', fontFamily: 'InterExtraBold', fontSize: 12 }}>{itemInAcct.qty}</Text>
                          </View>
                        )}
                        <Image source={{ uri: item.image }} className="w-full h-32" />
                        <View className="p-4">
                          <Text className="font-InterBold text-lora-text text-sm mb-1" numberOfLines={2}>{item.name}</Text>
                          <Text className="font-InterBold text-lora-primary">{formatCOP(item.price)}</Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })
              )}
            </View>
            <View className="h-32" />
          </ScrollView>

          <View className="absolute bottom-10 left-6 right-6">
            <Pressable 
              onPress={onViewOrder} 
              className="bg-[#111A2C] py-5 rounded-[24px] items-center justify-between px-8 flex-row shadow-xl"
            >
              <View>
                <Text className="text-white/60 text-[10px] font-InterExtraBold uppercase tracking-widest">Total Cuenta</Text>
                <Text className="text-white font-InterBold text-lg">{formatCOP(activeAccount?.total || 0)}</Text>
              </View>
              <View className="flex-row items-center bg-white/10 py-2 px-4 rounded-xl">
                <Text className="text-white font-InterBold mr-2">Ver Pedido</Text>
                <Ionicons name="chevron-forward" size={16} color="white" />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

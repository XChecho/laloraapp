import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '@core/helper/validators';
import { CanchaAccount } from '@core/database/mockDb';

interface CanchaHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  historyAccounts: CanchaAccount[];
  primaryColor: string;
}

export const CanchaHistoryModal: React.FC<CanchaHistoryModalProps> = ({
  visible,
  onClose,
  historyAccounts,
  primaryColor
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-lora-bg h-[85%] rounded-t-[40px] overflow-hidden">
          <View className="px-6 pt-8 pb-6 bg-white shadow-sm">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-2xl font-InterBold text-lora-text">Historial de Ventas</Text>
                <Text className="text-slate-400 font-InterMedium text-xs uppercase tracking-widest mt-0.5">
                  {historyAccounts.length} Cuentas Pagadas
                </Text>
              </View>
              <Pressable onPress={onClose} className="bg-slate-100 p-2 rounded-xl active:opacity-70">
                <Ionicons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
            {historyAccounts.length > 0 ? (
              historyAccounts.map(acc => (
                <View key={acc.id || Math.random()} className="bg-white rounded-[28px] p-5 mb-4 border border-lora-border/10 shadow-sm opacity-90 overflow-hidden relative">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-4">
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="checkmark-circle" size={14} color="#10B981" className="mr-1" />
                        <Text className="text-[10px] font-InterExtraBold text-slate-400 uppercase tracking-wider">{acc.closedAt || 'Desconocido'}</Text>
                      </View>
                      <Text className="text-xl font-InterBold text-slate-700" numberOfLines={1}>{acc.name || 'Sin nombre'}</Text>
                      <Text className="text-sm font-InterMedium text-slate-400 mt-1" numberOfLines={1}>{acc.summary || 'Sin productos'}</Text>
                    </View>
                    <Text className="text-2xl font-InterExtraBold text-slate-500">{formatCOP(acc.total || 0)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-20 bg-white/40 rounded-[40px] border border-dashed border-slate-300">
                <Ionicons name="time-outline" size={48} color="#CBD5E1" className="mb-4" />
                <Text className="text-lg font-InterBold text-slate-400">No hay historial disponible</Text>
              </View>
            )}
            <View className="h-20" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

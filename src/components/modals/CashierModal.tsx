import React, { useState, useMemo } from 'react';
import { Modal, View, Text, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '@core/helper/validators';
import { useModalStore } from '@store/useModalStore';

const DENOMINATIONS = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50];

export const CashierModal = () => {
  const { activeModal, modalData, closeModal } = useModalStore();
  const visible = activeModal === 'CASHIER';
  const type = modalData.type || 'ABRIR';

  const [counts, setCounts] = useState<{ [key: number]: string }>({});
  const [nequi, setNequi] = useState('');

  const totalDenominations = useMemo(() => {
    return Object.entries(counts).reduce((acc, [denom, count]) => {
      const val = parseInt(count) || 0;
      return acc + (parseInt(denom) * val);
    }, 0);
  }, [counts]);

  const totalGeneral = totalDenominations + (parseInt(nequi) || 0);

  const handleSave = () => {
    Alert.alert("Éxito", `Caja ${type === 'ABRIR' ? 'abierta' : 'cerrada'} con éxito. Total: ${formatCOP(totalGeneral)}`);
    closeModal();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <SafeAreaView edges={['top']} className="bg-white rounded-t-[32px] h-[95%]">
          <View className="p-6 flex-1">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-InterBold text-lora-text">{type === 'ABRIR' ? 'Abrir Caja' : 'Cerrar Caja'}</Text>
              <Pressable onPress={closeModal}>
                <Ionicons name="close-circle" size={32} color="#94A3B8" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-sm font-InterBold text-gray-500 mb-4 uppercase tracking-wider">Efectivo en Base</Text>
              
              <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                {DENOMINATIONS.map((denom) => (
                  <View key={denom} className="flex-row items-center justify-between py-4 border-b border-gray-200/50">
                    <View className="w-28">
                        <Text className="font-InterBold text-lora-text text-base">{formatCOP(denom)}</Text>
                    </View>
                    <TextInput
                      className="w-16 bg-white border-2 border-gray-200 rounded-xl px-2 py-2 text-center font-InterBold text-base"
                      keyboardType="numeric"
                      placeholder="0"
                      value={counts[denom] || ''}
                      onChangeText={(val) => setCounts({ ...counts, [denom]: val })}
                    />
                    <View className="flex-1 items-end ml-3">
                        <Text className="font-InterBold text-lora-primary text-base">
                        {formatCOP((parseInt(counts[denom]) || 0) * denom)}
                        </Text>
                    </View>
                  </View>
                ))}
              </View>

              <Text className="text-sm font-InterBold text-gray-500 mb-2 uppercase tracking-wider">Otros Medios</Text>
              <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                <View className="flex-row items-center justify-between">
                  <Text className="font-InterBold text-lora-text text-lg">Saldo Nequi</Text>
                  <TextInput
                    className="w-48 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-right font-InterBold text-xl"
                    keyboardType="numeric"
                    placeholder="$ 0"
                    value={nequi}
                    onChangeText={setNequi}
                  />
                </View>
              </View>
            </ScrollView>

            <View className="pt-4 border-t border-gray-100">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-InterBold text-gray-500">Total en Caja</Text>
                <Text className="text-2xl font-InterBold text-lora-primary">{formatCOP(totalGeneral)}</Text>
              </View>
              <Pressable 
                onPress={handleSave}
                className="bg-lora-primary py-4 rounded-2xl items-center justify-center active:opacity-70"
              >
                <Text className="text-white font-InterBold text-lg">Confirmar {type === 'ABRIR' ? 'Apertura' : 'Cierre'}</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

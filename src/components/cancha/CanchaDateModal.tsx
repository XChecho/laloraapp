import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CanchaDateModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  primaryColor: string;
}

export const CanchaDateModal: React.FC<CanchaDateModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
  primaryColor
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-center items-center px-6" onPress={onClose}>
        <View className="bg-white rounded-[40px] p-8 w-full shadow-2xl" onStartShouldSetResponder={() => true}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-InterBold text-lora-text">Seleccionar Fecha</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </Pressable>
          </View>
          
          <View className="bg-lora-bg rounded-[32px] p-4 mb-6">
            <View className="flex-row justify-between items-center mb-4 px-2">
              <Text className="font-InterBold text-lora-text">Marzo 2024</Text>
              <View className="flex-row gap-4">
                <Ionicons name="chevron-back" size={20} color={primaryColor} />
                <Ionicons name="chevron-forward" size={20} color={primaryColor} />
              </View>
            </View>
            <View className="flex-row flex-wrap gap-2 justify-center">
              {[13, 14, 15, 16, 17, 18, 19].map(d => {
                const dateStr = `${d} Mar 2024`;
                const isSelected = selectedDate === dateStr;
                return (
                  <Pressable 
                    key={d}
                    onPress={() => onSelectDate(dateStr)}
                    className={`w-10 h-10 rounded-full items-center justify-center ${isSelected ? 'bg-lora-primary' : 'bg-white'}`}
                  >
                    <Text className={`font-InterBold ${isSelected ? 'text-white' : 'text-slate-600'}`}>{d}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

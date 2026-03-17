import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CanchaHeaderProps {
  selectedDate: string;
  onOpenDatePicker: () => void;
}

export const CanchaHeader: React.FC<CanchaHeaderProps> = ({ selectedDate, onOpenDatePicker }) => {
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <Text className="text-2xl font-InterBold text-lora-text">
        La Lora - <Text className="text-lora-primary">Cancha</Text>
      </Text>
      <View className="flex-row items-center gap-3">
        <Pressable 
            onPress={onOpenDatePicker}
            className="bg-white px-4 py-2.5 rounded-2xl flex-row items-center border border-lora-border/20 shadow-sm"
        >
            <Ionicons name="calendar-outline" size={18} color="#0A873A" className="mr-2" />
            <Text className="text-[13px] font-InterExtraBold text-lora-text">{selectedDate}</Text>
        </Pressable>
        <Pressable className="w-11 h-11 bg-emerald-50 rounded-2xl items-center justify-center border border-emerald-100/50">
          <Ionicons name="notifications-outline" size={22} color="#059669" />
        </Pressable>
      </View>
    </View>
  );
};

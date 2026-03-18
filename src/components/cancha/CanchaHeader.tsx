import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@src/components/ui/ScreenHeader';

interface CanchaHeaderProps {
  selectedDate: string;
  onOpenDatePicker: () => void;
}

export const CanchaHeader: React.FC<CanchaHeaderProps> = ({ selectedDate, onOpenDatePicker }) => {
  return (
    <ScreenHeader 
      title="Cancha" 
      subtitle="La Lora - Eventos"
      rightElement={
        <Pressable 
            onPress={onOpenDatePicker}
            className="bg-white px-4 h-11 rounded-2xl flex-row items-center border border-gray-100 shadow-sm active:opacity-70"
        >
            <Ionicons name="calendar-outline" size={18} color="#0A873A" className="mr-2" />
            <Text className="text-[13px] font-InterExtraBold text-lora-text">{selectedDate}</Text>
        </Pressable>
      }
    />
  );
};

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuPress?: () => void;
  rightAction?: {
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
  };
}

export default function Header({ title, subtitle, onMenuPress, rightAction }: HeaderProps) {
  return (
    <View className="bg-[#059432] px-4 pt-safe pb-4">
      <View className="flex-row items-center justify-between">
        <View className="w-12 items-start">
          {onMenuPress && (
            <TouchableOpacity onPress={onMenuPress} className="p-2">
              <MaterialIcons name="menu" size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-bold text-center">{title}</Text>
          {subtitle && (
            <Text className="text-white/80 text-sm text-center">{subtitle}</Text>
          )}
        </View>

        <View className="w-12 items-end">
          {rightAction && (
            <TouchableOpacity onPress={rightAction.onPress} className="p-2">
              <MaterialIcons name={rightAction.icon} size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

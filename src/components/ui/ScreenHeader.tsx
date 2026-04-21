import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  showUserButton?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  subtitle = "Restaurante La Lora", 
  rightElement,
  showUserButton = true
}) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-6 pt-4 pb-4 bg-lora-bg">
      <View className="flex-1 mr-4">
        <Text className="text-2xl font-InterBold text-lora-text" numberOfLines={1}>{title}</Text>
        <Text className="text-xs font-InterMedium text-lora-primary uppercase tracking-widest mt-0.5">
          {subtitle}
        </Text>
      </View>
      
      <View className="flex-row items-center gap-3">
        {rightElement}
        {showUserButton && (
          <Pressable 
            className="bg-white w-11 h-11 rounded-2xl items-center justify-center border border-gray-100 shadow-sm active:opacity-70"
            onPress={() => router.push('/(main)/private/profile')}
          >
            <Ionicons name="person-circle-outline" size={22} color="#1B2332" />
          </Pressable>
        )}
        <Pressable className="bg-white w-11 h-11 rounded-2xl items-center justify-center border border-gray-100 shadow-sm active:opacity-70">
          <Ionicons name="notifications-outline" size={22} color="#1B2332" />
        </Pressable>
      </View>
    </View>
  );
};
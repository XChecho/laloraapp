import React, { useEffect } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAlertStore } from '@store/useAlertStore';

export const AlertModal = () => {
  const { alert, hideAlert } = useAlertStore();
  const insets = useSafeAreaInsets();
  const visible = alert !== null;

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, hideAlert]);

  if (!visible || !alert) return null;

  const isSuccess = alert.type === 'success';

  const bgColor = isSuccess ? 'bg-green-800' : 'bg-red-700';
  const borderColor = isSuccess ? 'border-green-300' : 'border-red-300';
  const iconColor = isSuccess ? '#86efac' : '#fca5a5';
  const iconName = isSuccess ? 'checkmark-circle' : 'close-circle';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={hideAlert}
    >
      <Pressable className="flex-1" onPress={hideAlert}>
        <View className="px-4 pt-4" style={{ paddingTop: insets.top + 16 }}>
          <Pressable 
            className={`w-full rounded-2xl p-4 ${bgColor} border ${borderColor} border-2`}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-row items-center flex-1">
                <Ionicons name={iconName as any} size={24} color={iconColor} />
                <View className="flex-1 ml-3">
                  <Text className="text-white text-base font-InterBold">{alert.title}</Text>
                  <Text className="text-white/80 text-sm font-InterRegular mt-0.5">
                    {alert.description}
                  </Text>
                </View>
              </View>
              <Pressable onPress={hideAlert} className="p-1">
                <Ionicons name="close" size={18} color="#fff" />
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};
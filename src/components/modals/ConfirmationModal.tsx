import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { useModalStore } from '@store/useModalStore';
import { Ionicons } from '@expo/vector-icons';

export const ConfirmationModal = () => {
  const { activeModal, modalData, closeModal } = useModalStore();
  const visible = activeModal === 'CONFIRMATION';

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <View className="bg-white rounded-[32px] p-8 w-full shadow-2xl">
          <View className="items-center mb-6">
            <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
              <Ionicons name="alert-circle" size={40} color="#EF4444" />
            </View>
            <Text className="text-2xl font-InterBold text-lora-text text-center">{modalData.title || '¿Estás seguro?'}</Text>
          </View>
          
          <Text className="text-gray-500 font-InterMedium text-center mb-8 leading-5">
            {modalData.message || 'Esta acción no se puede deshacer.'}
          </Text>

          <View className="flex-row gap-3">
            <Pressable 
              onPress={closeModal}
              className="flex-1 bg-gray-100 py-4 rounded-2xl items-center justify-center active:opacity-70"
            >
              <Text className="text-gray-500 font-InterBold text-base">Cancelar</Text>
            </Pressable>
            <Pressable 
              onPress={() => {
                if (modalData.onConfirm) modalData.onConfirm();
                closeModal();
              }}
              className="flex-1 bg-red-500 py-4 rounded-2xl items-center justify-center active:opacity-70"
            >
              <Text className="text-white font-InterBold text-base">Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CanchaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

export const CanchaModal: React.FC<CanchaModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
  isEditing = false,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('16 Mar 2024');
  const [timeSlot, setTimeSlot] = useState('');

  const timeSlots = [
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
    '20:00 - 21:00',
    '21:00 - 22:00',
    '22:00 - 23:00',
  ];

  useEffect(() => {
    if (visible) {
      if (initialData) {
        const nameParts = initialData.customerName ? initialData.customerName.split(' ') : ['', ''];
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setPhone(initialData.phone || '');
        setTimeSlot(`${initialData.startTime} - ${initialData.endTime}`);
        // If it was an 'Espacio Disponible' being converted, we might want to clear names
        if (initialData.customerName === 'Espacio Disponible') {
            setFirstName('');
            setLastName('');
            setPhone('');
        }
      } else {
        setFirstName('');
        setLastName('');
        setPhone('');
        setTimeSlot('');
      }
    }
  }, [visible, initialData]);

  const hasUnsavedChanges = () => {
    if (!isEditing && !initialData) {
      return !!firstName || !!lastName || !!phone || !!timeSlot;
    }
    // Simple check for now
    return true; 
  };

  const handleCloseRequest = () => {
    if (hasUnsavedChanges() && visible) {
        onClose(); // Simplified for now, or add Alert if preferred
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    if (!firstName || !lastName || !timeSlot) {
      Alert.alert('Faltan datos', 'Por favor completa el nombre y la franja horaria.');
      return;
    }
    const [start, end] = timeSlot.split(' - ');
    onSave({
      firstName,
      lastName,
      customerName: `${firstName} ${lastName}`,
      phone,
      date,
      startTime: start,
      endTime: end,
    });
    onClose();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) onClose();
      },
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCloseRequest}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <Pressable className="flex-1 justify-end bg-black/50" onPress={handleCloseRequest}>
          <Pressable className="bg-white rounded-t-[40px] p-8 pb-10 max-h-[90%]" onPress={(e) => e.stopPropagation()}>
            <View {...panResponder.panHandlers} className="w-full items-center pb-6 pt-2 -mt-4">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>

            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-InterBold text-lora-text">
                {isEditing ? 'Editar Reserva' : 'Nueva Reserva'}
              </Text>
              <Pressable onPress={handleCloseRequest} className="p-2 -mr-2">
                <Ionicons name="close" size={24} color="#94A3B8" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="space-y-6">
              <View className="flex-row gap-4 mb-6">
                <View className="flex-1">
                  <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Nombre</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Ej. Juan"
                    className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Apellido</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Ej. Pérez"
                    className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Teléfono</Text>
                <View className="flex-row items-center bg-lora-bg rounded-2xl p-4">
                  <Ionicons name="call-outline" size={18} color="#94A3B8" className="mr-3" />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="300 123 4567"
                    keyboardType="phone-pad"
                    className="flex-1 font-InterSemiBold text-lora-text"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Fecha</Text>
                <Pressable className="flex-row items-center bg-lora-bg rounded-2xl p-4">
                  <Ionicons name="calendar-outline" size={18} color="#94A3B8" className="mr-3" />
                  <Text className="flex-1 font-InterSemiBold text-lora-text">{date}</Text>
                  <Ionicons name="chevron-down" size={16} color="#94A3B8" />
                </Pressable>
              </View>

              <View className="mb-8">
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-3">Franja Horaria</Text>
                <View className="flex-row flex-wrap gap-2">
                  {timeSlots.map((slot) => (
                    <Pressable
                      key={slot}
                      onPress={() => setTimeSlot(slot)}
                      className={`px-4 py-3 rounded-2xl border ${
                        timeSlot === slot
                          ? 'bg-lora-primary border-lora-primary'
                          : 'bg-white border-lora-border/50'
                      }`}
                    >
                      <Text className={`text-xs font-InterBold ${timeSlot === slot ? 'text-white' : 'text-slate-500'}`}>
                        {slot}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="flex-row gap-4 mt-4">
                <Pressable onPress={handleCloseRequest} className="flex-1 py-4 bg-slate-100 rounded-2xl items-center">
                  <Text className="font-InterBold text-slate-500">Cancelar</Text>
                </Pressable>
                <Pressable onPress={handleSave} className="flex-[2] py-4 bg-lora-primary rounded-2xl items-center shadow-lg">
                  <Text className="font-InterBold text-white">{isEditing ? 'Guardar Cambios' : 'Crear Reserva'}</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

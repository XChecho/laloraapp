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

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
  isEditing = false,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [role, setRole] = useState('mesero');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [entryDate, setEntryDate] = useState('');

  const roles = [
    { label: 'Mesero', value: 'mesero' },
    { label: 'Cajero', value: 'cajero' },
    { label: 'Cocina', value: 'cocina' },
    { label: 'Administrador', value: 'administrador' },
  ];

  useEffect(() => {
    if (initialData && visible) {
      // Split name if it comes as a single string
      const nameParts = initialData.name ? initialData.name.split(' ') : ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setBirthdate(initialData.birthdate || '');
      setRole(initialData.role?.toLowerCase() || 'mesero');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setEntryDate(initialData.entryDate || '');
    } else if (visible) {
      // Reset for new user
      setFirstName('');
      setLastName('');
      setBirthdate('');
      setRole('mesero');
      setEmail('');
      setPhone('');
      setEntryDate('');
    }
  }, [initialData, visible]);

  const hasUnsavedChanges = () => {
    if (!initialData) {
      // New user: check if any fields are not empty
      return !!firstName || !!lastName || !!birthdate || !!email || !!phone || !!entryDate || role !== 'mesero';
    } else {
      // Edit user: check if any fields differ
      const nameParts = initialData.name ? initialData.name.split(' ') : ['', ''];
      const initialFirstName = nameParts[0] || '';
      const initialLastName = nameParts.slice(1).join(' ') || '';
      
      return (
        firstName !== initialFirstName ||
        lastName !== initialLastName ||
        birthdate !== (initialData.birthdate || '') ||
        role !== (initialData.role?.toLowerCase() || 'mesero') ||
        email !== (initialData.email || '') ||
        phone !== (initialData.phone || '') ||
        entryDate !== (initialData.entryDate || '')
      );
    }
  };

  const handleCloseRequest = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Cambios sin guardar',
        '¿Estás seguro de cerrar? Se perderá la información ingresada.',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Sí, cerrar', style: 'destructive', onPress: onClose }
        ]
      );
    } else {
      onClose();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only trigger swipe down if not scrolling horizontally too much
        return gestureState.dy > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          handleCloseRequest();
        }
      },
    })
  ).current;

  const handleSave = () => {
    onSave({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      birthdate,
      role,
      email,
      phone,
      entryDate,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCloseRequest}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={handleCloseRequest}>
          <Pressable className="bg-white rounded-t-[40px] p-8 pb-10 max-h-[90%]" onPress={(e) => e.stopPropagation()}>
            <View {...panResponder.panHandlers} className="w-full items-center pb-6 pt-2 -mt-4">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>
            
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-InterBold text-lora-text">
                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
              </Text>
              <Pressable onPress={handleCloseRequest} className="p-2 -mr-2">
                <Ionicons name="close" size={24} color="#94A3B8" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="space-y-6">
              {/* Names */}
              <View className="flex-row gap-4 mb-6">
                <View className="flex-1">
                  <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Nombre</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Ej. Carlos"
                    className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Apellido</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Ej. Rodriguez"
                    className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text"
                  />
                </View>
              </View>

              {/* Role Selection */}
              <View className="mb-6">
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-3">Rol</Text>
                <View className="flex-row flex-wrap gap-2">
                  {roles.map((r) => (
                    <Pressable
                      key={r.value}
                      onPress={() => setRole(r.value)}
                      className={`px-4 py-3 rounded-2xl border ${
                        role === r.value
                          ? 'bg-lora-primary border-lora-primary'
                          : 'bg-white border-lora-border/50'
                      }`}
                    >
                      <Text
                        className={`text-xs font-InterBold ${
                          role === r.value ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {r.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Birthdate */}
              <View className="mb-6">
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Fecha de Nacimiento</Text>
                <View className="flex-row items-center bg-lora-bg rounded-2xl p-4">
                  <Ionicons name="calendar-clear-outline" size={18} color="#94A3B8" className="mr-3" />
                  <TextInput
                    value={birthdate}
                    onChangeText={setBirthdate}
                    placeholder="DD / MM / AAAA"
                    className="flex-1 font-InterSemiBold text-lora-text"
                  />
                </View>
              </View>

              {/* Contact Info */}
              <View className="mb-6">
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Correo Electrónico</Text>
                <View className="flex-row items-center bg-lora-bg rounded-2xl p-4">
                  <Ionicons name="mail-outline" size={18} color="#94A3B8" className="mr-3" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="correo@ejemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 font-InterSemiBold text-lora-text"
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
                    placeholder="+57 3XX XXX XXXX"
                    keyboardType="phone-pad"
                    className="flex-1 font-InterSemiBold text-lora-text"
                  />
                </View>
              </View>

              {/* Entry Date */}
              <View className="mb-8">
                <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-2">Fecha de Ingreso</Text>
                <View className="flex-row items-center bg-lora-bg rounded-2xl p-4">
                  <Ionicons name="time-outline" size={18} color="#94A3B8" className="mr-3" />
                  <TextInput
                    value={entryDate}
                    onChangeText={setEntryDate}
                    placeholder="DD / MM / AAAA"
                    className="flex-1 font-InterSemiBold text-lora-text"
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-4 mt-4">
                <Pressable
                  onPress={handleCloseRequest}
                  className="flex-1 py-4 bg-slate-100 rounded-2xl items-center"
                >
                  <Text className="font-InterBold text-slate-500">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  className="flex-[2] py-4 bg-lora-primary rounded-2xl items-center shadow-lg"
                >
                  <Text className="font-InterBold text-white">
                    {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserModal } from './UserModal';

interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
  bgColor: string;
  textColor: string;
  birthdate?: string;
  email?: string;
  phone?: string;
  entryDate?: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Carlos Rodriguez', role: 'Cajero / Barman', initials: 'CR', bgColor: '#DCFCE7', textColor: '#166534', birthdate: '12/05/1990', email: 'carlos@ejemplo.com', phone: '3001234567', entryDate: '10/10/2023' },
  { id: '2', name: 'María Acevedo', role: 'Admin Restaurante', initials: 'MA', bgColor: '#DBEAFE', textColor: '#1E40AF', birthdate: '25/01/1985', email: 'maria@ejemplo.com', phone: '3109876543', entryDate: '15/05/2022' },
  { id: '3', name: 'Juan Sanchez', role: 'Mantenimiento', initials: 'JS', bgColor: '#F3E8FF', textColor: '#6B21A8', birthdate: '03/09/1992', email: 'juan@ejemplo.com', phone: '3205554433', entryDate: '20/12/2023' },
];

interface StaffSectionProps {
  onPress?: () => void;
}

export const StaffSection: React.FC<StaffSectionProps> = ({ onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleOptionsPress = (user: User) => {
    Alert.alert(
      'Opciones de Staff',
      `¿Qué acción deseas realizar para ${user.name}?`,
      [
        { text: 'Editar Usuario', onPress: () => {
            setSelectedUser(user);
            setModalVisible(true);
        }},
        { text: 'Editar Rol', onPress: () => console.log('Edit role') },
        { text: 'Deshabilitar', onPress: () => Alert.alert(
          'Deshabilitar', 
          '¿Estás seguro de deshabilitar este usuario?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Deshabilitar', style: 'destructive', onPress: () => console.log('Disabled') }
          ]
        ), style: 'destructive' },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <View className="mb-4">
      <Pressable 
        onPress={onPress}
        disabled={!onPress}
        className="bg-white rounded-[32px] p-6 shadow-sm border border-lora-border/30 active:opacity-95"
      >
        <Text className="text-xl font-InterBold text-lora-text mb-6">Staff & Usuarios</Text>
        
        {mockUsers.map((user) => (
          <View key={user.id} className="flex-row items-center mb-6">
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: user.bgColor }}
            >
              <Text className="font-InterBold text-sm" style={{ color: user.textColor }}>
                {user.initials}
              </Text>
            </View>
            
            <View className="flex-1">
              <Text className="text-[15px] font-InterBold text-lora-text">{user.name}</Text>
              <Text className="text-xs font-InterMedium text-lora-text-muted">{user.role}</Text>
            </View>
            
            <Pressable 
              onPress={() => handleOptionsPress(user)}
              className="p-2"
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#94A3B8" />
            </Pressable>
          </View>
        ))}
        
        <Pressable 
          onPress={() => {
            setSelectedUser(null);
            setModalVisible(true);
          }}
          className="flex-row items-center justify-center py-4 border border-dashed border-lora-border rounded-2xl active:bg-lora-bg/50"
        >
          <Ionicons name="add" size={20} color="#94A3B8" className="mr-2" />
          <Text className="text-sm font-InterBold text-lora-text-muted">Agregar Miembro</Text>
        </Pressable>
      </Pressable>

      <UserModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialData={selectedUser}
        isEditing={!!selectedUser}
        onSave={(data) => console.log('Save user:', data)}
      />
    </View>
  );
};

export const ManagementTipSection = () => {
  return (
    <View className="bg-emerald-50 rounded-[28px] p-6 mb-10 border border-emerald-100/50">
      <View className="flex-row items-center mb-3">
        <Ionicons name="bulb" size={20} color="#059669" className="mr-2" />
        <Text className="text-sm font-InterBold text-emerald-700">Tip de Gestión</Text>
      </View>
      <Text className="text-xs font-InterMedium text-emerald-800 leading-5">
        Recuerda realizar el cierre de caja cada noche antes de las 11:00 PM para mantener la contabilidad sincronizada con el inventario del restaurante.
      </Text>
    </View>
  );
};

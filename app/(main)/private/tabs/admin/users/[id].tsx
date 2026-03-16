import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserModal } from '../../../../../../src/components/admin/UserModal';
import { useState } from 'react';
import { Alert } from 'react-native';

const UserDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  // In a real app, fetch user by ID
  const user = {
    id,
    name: 'Carlos Rodriguez',
    role: 'Cajero / Barman',
    birthdate: '12 May 1990',
    email: 'carlos.r@lalora.com',
    phone: '+57 300 123 4567',
    color: '#10B981',
    joined: '10 Oct 2023',
  };

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8 mt-4">
          <Pressable onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#1B2332" />
          </Pressable>
          <Text className="text-xl font-InterBold text-lora-text">Detalle de Usuario</Text>
          <Pressable 
            onPress={() => setModalVisible(true)}
            className="p-2"
          >
            <Ionicons name="create-outline" size={24} color="#0A873A" />
          </Pressable>
        </View>

        {/* Profile Header */}
        <View className="items-center mb-10">
          <View 
            className="w-28 h-28 rounded-[40px] items-center justify-center mb-6 shadow-sm"
            style={{ backgroundColor: `${user.color}15` }}
          >
            <Ionicons name="person" size={56} color={user.color} />
          </View>
          <Text className="text-2xl font-InterBold text-lora-text mb-1">{user.name}</Text>
          <View className="bg-emerald-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-InterBold text-emerald-700 uppercase">{user.role}</Text>
          </View>
        </View>

        {/* Info Card */}
        <View className="bg-white rounded-[32px] p-8 shadow-sm border border-lora-border/30 mb-6">
          <Text className="text-xs font-InterBold text-lora-text-muted uppercase tracking-widest mb-6">Información Personal</Text>
          
          <View className="space-y-6">
            <View className="mb-6">
              <Text className="text-xs font-InterMedium text-lora-text-muted mb-1">Fecha de Nacimiento</Text>
              <View className="flex-row items-center">
                <Ionicons name="gift-outline" size={16} color="#94A3B8" className="mr-2" />
                <Text className="text-base font-InterSemiBold text-lora-text ml-2">{user.birthdate}</Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xs font-InterMedium text-lora-text-muted mb-1">Correo Electrónico</Text>
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={16} color="#94A3B8" className="mr-2" />
                <Text className="text-base font-InterSemiBold text-lora-text ml-2">{user.email}</Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xs font-InterMedium text-lora-text-muted mb-1">Teléfono</Text>
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={16} color="#94A3B8" className="mr-2" />
                <Text className="text-base font-InterSemiBold text-lora-text ml-2">{user.phone}</Text>
              </View>
            </View>

            <View>
              <Text className="text-xs font-InterMedium text-lora-text-muted mb-1">Fecha de Ingreso</Text>
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#94A3B8" className="mr-2" />
                <Text className="text-base font-InterSemiBold text-lora-text ml-2">{user.joined}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delete / Danger Zone */}
        <Pressable 
          onPress={() => Alert.alert(
            'Deshabilitar', 
            '¿Estás seguro de deshabilitar este usuario?',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Deshabilitar', style: 'destructive', onPress: () => console.log('Disabled') }
            ]
          )}
          className="bg-red-50 py-4 rounded-2xl items-center border border-red-100 mb-10"
        >
          <Text className="text-red-500 font-InterBold">Deshabilitar Usuario</Text>
        </Pressable>
      </ScrollView>

      <UserModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isEditing={true}
        initialData={user}
        onSave={(data) => console.log('Update user:', data)}
      />
    </SafeAreaView>
  );
};

export default UserDetail;

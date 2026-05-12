import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserModal } from '../../../../../../src/components/admin/UserModal';
import { useUser, useUpdateUser, useToggleUserStatus } from '@src/hooks/useUsers';
import { ROLE_LABELS, ROLE_COLORS, ROLE_MAP_FROM_BACKEND, type FrontendRole } from '@src/types/user';

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'No especificado';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
};

const UserDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const userId = id as string;
  const [modalVisible, setModalVisible] = useState(false);

  const { data: user, isLoading, error } = useUser(userId);
  const updateUser = useUpdateUser();
  const toggleStatus = useToggleUserStatus();

  const name = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '';
  const roleLabel = user ? ROLE_LABELS[user.role] : '';
  const color = user ? ROLE_COLORS[user.role] : '#94A3B8';

  const handleSave = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: FrontendRole;
    birthdate: string;
    entryDate: string;
  }) => {
    if (!user) return;
    updateUser.mutate({
      id: userId,
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phone || undefined,
        birthdate: data.birthdate || undefined,
        entryDate: data.entryDate || undefined,
      },
    });
  };

  const handleToggleStatus = () => {
    if (!user) return;
    Alert.alert(
      user.active ? 'Deshabilitar Usuario' : 'Habilitar Usuario',
      user.active
        ? `¿Estás seguro de deshabilitar a ${name}?`
        : `¿Estás seguro de habilitar a ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: user.active ? 'Deshabilitar' : 'Habilitar',
          style: user.active ? 'destructive' : 'default',
          onPress: () => {
            toggleStatus.mutate({ id: userId, data: { active: !user.active } });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0A873A" />
          <Text className="mt-4 text-lora-text-muted font-InterMedium">Cargando usuario...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-lg font-InterBold text-lora-text">Error al cargar</Text>
          <Text className="mt-2 text-center text-lora-text-muted font-InterMedium">
            No se pudo cargar la información del usuario.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-6 bg-lora-primary px-6 py-3 rounded-2xl"
          >
            <Text className="text-white font-InterBold">Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
            style={{ backgroundColor: `${color}15` }}
          >
            <Ionicons name="person" size={56} color={color} />
          </View>
          <Text className="text-2xl font-InterBold text-lora-text mb-1">{name}</Text>
          <View className="flex-row items-center gap-2">
            <View style={{ backgroundColor: `${color}15` }} className="px-3 py-1 rounded-full">
              <Text className="text-xs font-InterBold uppercase" style={{ color }}>{roleLabel}</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${user.active ? 'bg-emerald-100' : 'bg-red-100'}`}>
              <Text className={`text-xs font-InterBold ${user.active ? 'text-emerald-700' : 'text-red-700'}`}>
                {user.active ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
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
                <Text className="text-base font-InterSemiBold text-lora-text ml-2">{formatDate(user.birthdate)}</Text>
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
                <Text className="text-base font-InterSemiBold text-lora-text ml-2">{user.phoneNumber || 'No especificado'}</Text>
              </View>
            </View>

            <View>
              <Text className="text-xs font-InterMedium text-lora-text-muted mb-1">Fecha de Ingreso</Text>
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#94A3B8" className="mr-2" />
                <Text className="text-base font-InterSemiBold text-lora-text ml-2">{formatDate(user.entryDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <Pressable
          onPress={handleToggleStatus}
          className={`py-4 rounded-2xl items-center border mb-10 ${
            user.active
              ? 'bg-red-50 border-red-100'
              : 'bg-emerald-50 border-emerald-100'
          }`}
        >
          <Text className={`font-InterBold ${user.active ? 'text-red-500' : 'text-emerald-600'}`}>
            {user.active ? 'Deshabilitar Usuario' : 'Habilitar Usuario'}
          </Text>
        </Pressable>
      </ScrollView>

      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isEditing={true}
        initialData={{
          id: user.id,
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email,
          phoneNumber: user.phoneNumber ?? '',
          role: ROLE_MAP_FROM_BACKEND[user.role],
          birthdate: user.birthdate ?? '',
          entryDate: user.entryDate ?? '',
        }}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
};

export default UserDetail;

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserModal } from '../../../../../../src/components/admin/UserModal';
import { useUsers, useCreateUser } from '@src/hooks/useUsers';
import { ROLE_LABELS, ROLE_ICONS, ROLE_COLORS, type User, type FrontendRole } from '@src/types/user';

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return 'N/A';
  }
};

const UsersList = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => {
      const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.toLowerCase();
      const roleLabel = ROLE_LABELS[user.role]?.toLowerCase() ?? '';
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || roleLabel.includes(query);
    });
  }, [users, searchQuery]);

  const handleSaveUser = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: FrontendRole;
    birthdate: string;
    entryDate: string;
  }) => {
    createUser.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phone,
        userType: data.role,
      },
      {
        onSuccess: () => {
          Alert.alert('Usuario creado', 'El usuario ha sido creado exitosamente.');
        },
        onError: (err: Error) => {
          Alert.alert('Error', `No se pudo crear el usuario: ${err.message}`);
        },
      }
    );
  };

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
        <View className="flex-1 px-6 items-center justify-center">
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-lg font-InterBold text-lora-text mt-4">Error al cargar usuarios</Text>
          <Text className="text-sm font-InterMedium text-lora-text-muted mt-2 text-center">
            {error.message}
          </Text>
          <Pressable
            onPress={() => window.location.reload()}
            className="bg-lora-primary px-6 py-3 rounded-2xl mt-6"
          >
            <Text className="font-InterBold text-white">Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8 mt-4">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#1B2332" />
            </Pressable>
            <Text className="text-2xl font-InterBold text-lora-text">Usuarios</Text>
          </View>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="bg-lora-primary w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>

        {/* Search / Filter */}
        <View className="bg-white rounded-2xl p-4 mb-6 flex-row items-center border border-lora-border/30">
          <Ionicons name="search" size={20} color="#94A3B8" className="mr-3" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nombre o rol..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-lora-text font-InterMedium"
          />
        </View>

        {/* List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text className="text-sm font-InterMedium text-lora-text-muted mt-4">Cargando usuarios...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center mt-12">
                <Ionicons name="people-outline" size={48} color="#94A3B8" />
                <Text className="text-lg font-InterBold text-lora-text mt-4">No se encontraron usuarios</Text>
                <Text className="text-sm font-InterMedium text-lora-text-muted mt-2 text-center">
                  {searchQuery ? 'Intenta con otra búsqueda' : 'Agrega un nuevo usuario con el botón +'}
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const icon = ROLE_ICONS[item.role] as keyof typeof Ionicons.glyphMap;
              const color = ROLE_COLORS[item.role];
              const name = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || 'Sin nombre';
              const roleLabel = ROLE_LABELS[item.role] ?? item.role;
              const birthdate = formatDate(item.birthdate);

              return (
                <Pressable
                  onPress={() => router.push(`/private/tabs/admin/users/${item.id}`)}
                  className="bg-white rounded-[24px] p-5 mb-4 border border-lora-border/20 shadow-sm flex-row items-center"
                >
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Ionicons name={icon} size={28} color={color} />
                  </View>

                  <View className="flex-1">
                    <Text className="text-lg font-InterBold text-lora-text mb-1">{name}</Text>
                    <View className="flex-row items-center">
                      <View
                        className="px-2 py-0.5 rounded-lg mr-3"
                        style={{ backgroundColor: `${color}10` }}
                      >
                        <Text className="text-[10px] font-InterBold" style={{ color }}>
                          {roleLabel.toUpperCase()}
                        </Text>
                      </View>
                      <Text className="text-xs font-InterMedium text-lora-text-muted">
                        {birthdate !== 'N/A' ? `🎂 ${birthdate}` : ''}
                      </Text>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#E2E8F0" />
                </Pressable>
              );
            }}
          />
        )}
      </View>

      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveUser}
      />
    </SafeAreaView>
  );
};

export default UsersList;

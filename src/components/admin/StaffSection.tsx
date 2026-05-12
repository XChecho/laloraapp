import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserModal } from './UserModal';
import {
  useRecentUsers,
  useCreateUser,
  useUpdateUserRole,
  useToggleUserStatus,
  useUpdateUser,
} from '@src/hooks/useUsers';
import {
  ROLE_LABELS,
  ROLE_COLORS,
  ROLE_MAP_FROM_BACKEND,
  type User,
  type FrontendRole,
} from '@src/types/user';

const getInitials = (user: User) => {
  const first = user.firstName?.[0] || '';
  const last = user.lastName?.[0] || '';
  return (first + last).toUpperCase();
};

const getRoleColor = (role: User['role']) => {
  const color = ROLE_COLORS[role];
  return {
    bgColor: `${color}20`,
    textColor: color,
  };
};

interface StaffSectionProps {
  onPress?: () => void;
}

export const StaffSection: React.FC<StaffSectionProps> = ({ onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, error, refetch } = useRecentUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const updateUserRoleMutation = useUpdateUserRole();
  const toggleUserStatusMutation = useToggleUserStatus();

  const activeUsers = useMemo(
    () => (data || []).filter((u) => u.active),
    [data]
  );

  const handleSaveUser = (userData: {
    firstName: string;
    lastName: string;
    role: FrontendRole;
    email: string;
    phone: string;
    birthdate: string;
    entryDate: string;
  }) => {
    const backendRole = userData.role ? userData.role.toUpperCase() : 'WAITRESS';

    if (selectedUser) {
      updateUserMutation.mutate(
        {
          id: selectedUser.id,
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phone || undefined,
            birthdate: userData.birthdate || undefined,
            entryDate: userData.entryDate || undefined,
          },
        },
        {
          onSuccess: () => {
            if (backendRole !== selectedUser.role) {
              updateUserRoleMutation.mutate({
                id: selectedUser.id,
                data: { role: backendRole as User['role'] },
              });
            }
            Alert.alert('Éxito', 'Usuario actualizado correctamente');
          },
          onError: (err: Error) => {
            Alert.alert('Error', err.message || 'No se pudo actualizar el usuario');
          },
        }
      );
    } else {
      createUserMutation.mutate(
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phone || '',
          userType: userData.role,
        },
        {
          onSuccess: () => {
            Alert.alert('Éxito', 'Usuario creado correctamente');
          },
          onError: (err: Error) => {
            Alert.alert('Error', err.message || 'No se pudo crear el usuario');
          },
        }
      );
    }
  };

  const handleOptionsPress = (user: User) => {
    Alert.alert(
      'Opciones de Staff',
      `¿Qué acción deseas realizar para ${user.firstName} ${user.lastName}?`,
      [
        {
          text: 'Editar Usuario',
          onPress: () => {
            setSelectedUser(user);
            setModalVisible(true);
          },
        },
        {
          text: 'Editar Rol',
          onPress: () => {
            const newRoleOptions = Object.entries(ROLE_LABELS)
              .filter(([key]) => key !== user.role)
              .map(([key, label]) => ({
                text: label,
                onPress: () => {
                  updateUserRoleMutation.mutate(
                    { id: user.id, data: { role: key as User['role'] } },
                    {
                      onSuccess: () => {
                        Alert.alert('Éxito', `Rol cambiado a ${label}`);
                      },
                      onError: (err: Error) => {
                        Alert.alert('Error', err.message || 'No se pudo cambiar el rol');
                      },
                    }
                  );
                },
              }));

            Alert.alert(
              'Seleccionar Rol',
              `Rol actual: ${ROLE_LABELS[user.role]}`,
              [
                ...newRoleOptions,
                { text: 'Cancelar', style: 'cancel' },
              ]
            );
          },
        },
        {
          text: 'Deshabilitar',
          onPress: () =>
            Alert.alert(
              'Deshabilitar',
              `¿Estás seguro de deshabilitar a ${user.firstName} ${user.lastName}?`,
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Deshabilitar',
                  style: 'destructive',
                  onPress: () => {
                    toggleUserStatusMutation.mutate(
                      { id: user.id, data: { active: false } },
                      {
                        onSuccess: () => {
                          Alert.alert('Éxito', 'Usuario deshabilitado');
                        },
                        onError: (err: Error) => {
                          Alert.alert('Error', err.message || 'No se pudo deshabilitar el usuario');
                        },
                      }
                    );
                  },
                },
              ]
            ),
          style: 'destructive',
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="mb-4">
        <Pressable
          onPress={onPress}
          disabled={!onPress}
          className="bg-white rounded-[32px] p-6 shadow-sm border border-lora-border/30"
        >
          <Text className="text-xl font-InterBold text-lora-text mb-6">Staff & Usuarios</Text>
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#94A3B8" />
            <Text className="text-sm font-InterMedium text-lora-text-muted mt-3">
              Cargando staff...
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-4">
        <Pressable
          onPress={onPress}
          disabled={!onPress}
          className="bg-white rounded-[32px] p-6 shadow-sm border border-lora-border/30"
        >
          <Text className="text-xl font-InterBold text-lora-text mb-6">Staff & Usuarios</Text>
          <View className="items-center py-8">
            <Ionicons name="alert-circle" size={32} color="#EF4444" />
            <Text className="text-sm font-InterMedium text-red-500 mt-3">
              Error al cargar el staff
            </Text>
            <Pressable
              onPress={() => refetch()}
              className="mt-4 px-6 py-3 bg-lora-primary rounded-2xl active:opacity-90"
            >
              <Text className="text-sm font-InterBold text-white">Reintentar</Text>
            </Pressable>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="mb-4">
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        className="bg-white rounded-[32px] p-6 shadow-sm border border-lora-border/30 active:opacity-95"
      >
        <Text className="text-xl font-InterBold text-lora-text mb-6">Staff & Usuarios</Text>

        {activeUsers.map((user) => {
          const initials = getInitials(user);
          const colors = getRoleColor(user.role);
          const roleLabel = ROLE_LABELS[user.role];

          return (
            <View key={user.id} className="flex-row items-center mb-6">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: colors.bgColor }}
              >
                <Text className="font-InterBold text-sm" style={{ color: colors.textColor }}>
                  {initials}
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-[15px] font-InterBold text-lora-text">
                  {user.firstName} {user.lastName}
                </Text>
                <Text className="text-xs font-InterMedium text-lora-text-muted">
                  {roleLabel}
                </Text>
              </View>

              <Pressable
                onPress={() => handleOptionsPress(user)}
                className="p-2 active:opacity-60"
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#94A3B8" />
              </Pressable>
            </View>
          );
        })}

        <Pressable
          onPress={() => {
            setSelectedUser(null);
            setModalVisible(true);
          }}
          className="flex-row items-center justify-center py-4 border border-dashed border-lora-border rounded-2xl active:bg-lora-bg/50"
        >
          <Ionicons name="add" size={20} color="#94A3B8" />
          <Text className="text-sm font-InterBold text-lora-text-muted ml-2">Agregar Miembro</Text>
        </Pressable>
      </Pressable>

      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialData={
          selectedUser
            ? {
                id: selectedUser.id,
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
                email: selectedUser.email,
                phoneNumber: selectedUser.phoneNumber,
                role: ROLE_MAP_FROM_BACKEND[selectedUser.role],
                birthdate: selectedUser.birthdate,
                entryDate: selectedUser.entryDate,
              }
            : undefined
        }
        isEditing={!!selectedUser}
        onSave={handleSaveUser}
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

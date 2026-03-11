import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, User, UserRole } from '@store/useMainStore';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PRIMARY_COLOR = '#059432';

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  waiter: 'Mesero',
  kitchen: 'Cocina',
  cashier: 'Cajero',
};

const roleColors: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  waiter: 'bg-blue-100 text-blue-700',
  kitchen: 'bg-orange-100 text-orange-700',
  cashier: 'bg-green-100 text-green-700',
};

export default function UsersManagement() {
  const { currentUser } = useMainStore();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const users: User[] = useMemo(() => [
    { id: 'u1', name: 'Juan Pérez', role: 'admin' },
    { id: 'u2', name: 'María García', role: 'waiter' },
    { id: 'u3', name: 'Carlos López', role: 'cashier' },
    { id: 'u4', name: 'Ana Martínez', role: 'kitchen' },
    { id: 'u5', name: 'Roberto Sánchez', role: 'waiter' },
    { id: 'u6', name: 'Laura Torres', role: 'waiter' },
    { id: 'u7', name: 'Miguel Rodríguez', role: 'kitchen' },
  ], []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roleLabels[u.role].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (user: User) => {
    if (user.id === currentUser?.id) {
      Alert.alert('Error', 'No puedes eliminarte a ti mismo');
      return;
    }
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de eliminar a ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => { } },
      ]
    );
  };

  const handleSaveUser = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-3xl font-bold text-white">Usuarios</Text>
            <Text className="text-white/80 text-lg">Gestión de Personal</Text>
          </View>
          <TouchableOpacity
            onPress={handleAddUser}
            className="bg-white px-4 py-2 rounded-lg flex-row items-center gap-2"
          >
            <MaterialIcons name="person-add" size={20} color="#059432" />
            <Text className="text-[#059432] font-semibold">Nuevo</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white/10 rounded-lg px-4 py-3 flex-row items-center gap-2">
          <MaterialIcons name="search" size={20} color="white" />
          <TextInput
            className="flex-1 text-white placeholder-white/70"
            placeholder="Buscar usuario..."
            placeholderTextColor="white/70"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row">
            <Text className="flex-1 font-semibold text-gray-600">Usuario</Text>
            <Text className="w-28 font-semibold text-gray-600 text-center">Rol</Text>
            <Text className="w-20 font-semibold text-gray-600 text-right">Acciones</Text>
          </View>

          {filteredUsers.map((user, index) => (
            <View
              key={user.id}
              className={`px-4 py-4 flex-row items-center ${index !== filteredUsers.length - 1 ? 'border-b border-gray-100' : ''
                }`}
            >
              <View className="flex-1 flex-row items-center gap-3">
                <View className="bg-gray-100 p-2 rounded-full">
                  <MaterialIcons name="person" size={24} color="#6B7280" />
                </View>
                <View>
                  <Text className="text-gray-800 font-medium">{user.name}</Text>
                  <Text className="text-gray-500 text-sm">ID: {user.id}</Text>
                </View>
              </View>

              <View className="w-28 items-center">
                <View className={`px-3 py-1 rounded-full ${roleColors[user.role]}`}>
                  <Text className="text-sm font-medium">{roleLabels[user.role]}</Text>
                </View>
              </View>

              <View className="w-20 flex-row justify-end gap-1">
                <TouchableOpacity
                  onPress={() => handleEditUser(user)}
                  className="p-2 bg-gray-100 rounded-lg"
                >
                  <MaterialIcons name="edit" size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteUser(user)}
                  className="p-2 bg-red-50 rounded-lg"
                >
                  <MaterialIcons name="delete" size={20} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <Text className="font-bold text-gray-700 mb-4">Resumen por Rol</Text>
          <View className="flex-row flex-wrap -mx-2">
            {Object.entries(roleLabels).map(([role, label]) => {
              const count = users.filter(u => u.role === role).length;
              return (
                <View key={role} className="w-1/2 px-2 mb-3">
                  <View className={`p-4 rounded-xl ${roleColors[role as UserRole]}`}>
                    <Text className="text-2xl font-bold">{count}</Text>
                    <Text className="text-sm font-medium">{label}{count !== 1 ? 's' : ''}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Nombre</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Nombre completo"
                value={editingUser?.name || ''}
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-600 font-medium mb-2">Rol</Text>
              <View className="flex-row flex-wrap gap-2">
                {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                  <TouchableOpacity
                    key={role}
                    className={`px-4 py-2 rounded-lg border ${editingUser?.role === role
                      ? 'bg-[#059432] border-[#059432]'
                      : 'bg-white border-gray-200'
                      }`}
                  >
                    <Text className={`font-medium ${editingUser?.role === role ? 'text-white' : 'text-gray-600'
                      }`}>
                      {roleLabels[role]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSaveUser}
              className="bg-[#059432] py-4 rounded-xl"
            >
              <Text className="text-white text-center font-bold text-lg">
                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

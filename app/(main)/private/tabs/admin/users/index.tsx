import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserModal } from '../../../../../../src/components/admin/UserModal';
import { useState } from 'react';

const mockUsers = [
  { id: '1', name: 'Carlos Rodriguez', role: 'Cajero', birthdate: '12 May 1990', icon: 'person', color: '#10B981', email: 'carlos@ejemplo.com', phone: '3001234567', entryDate: '10/10/2023' },
  { id: '2', name: 'María Acevedo', role: 'Administrador', birthdate: '25 Jan 1985', icon: 'shield-checkmark', color: '#3B82F6', email: 'maria@ejemplo.com', phone: '3109876543', entryDate: '15/05/2022' },
  { id: '3', name: 'Juan Sanchez', role: 'Cocina', birthdate: '03 Sep 1992', icon: 'restaurant', color: '#F59E0B', email: 'juan@ejemplo.com', phone: '3205554433', entryDate: '20/12/2023' },
  { id: '4', name: 'Laura Restrepo', role: 'Mesero', birthdate: '15 Jul 1998', icon: 'walk', color: '#8B5CF6', email: 'laura@ejemplo.com', phone: '3008887766', entryDate: '01/01/2024' },
];

const UsersList = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable 
              onPress={() => router.push(`/private/tabs/admin/users/${item.id}`)}
              className="bg-white rounded-[24px] p-5 mb-4 border border-lora-border/20 shadow-sm flex-row items-center"
            >
              <View 
                className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Ionicons name={item.icon as any} size={28} color={item.color} />
              </View>
              
              <View className="flex-1">
                <Text className="text-lg font-InterBold text-lora-text mb-1">{item.name}</Text>
                <View className="flex-row items-center">
                  <View 
                    className="px-2 py-0.5 rounded-lg mr-3"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <Text className="text-[10px] font-InterBold" style={{ color: item.color }}>
                      {item.role.toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-xs font-InterMedium text-lora-text-muted">
                    🎂 {item.birthdate}
                  </Text>
                </View>
              </View>
              
              <Ionicons name="chevron-forward" size={20} color="#E2E8F0" />
            </Pressable>
          )}
        />
      </View>

      <UserModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(data) => console.log('Save user:', data)}
      />
    </SafeAreaView>
  );
};

export default UsersList;

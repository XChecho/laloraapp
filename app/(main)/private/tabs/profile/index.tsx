import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore } from '../../../../src/store/useMainStore';

const ProfileTab = () => {
  const router = useRouter();
  const currentUser = useMainStore((state) => state.currentUser);
  const setCurrentUser = useMainStore((state) => state.setCurrentUser);

  const handleLogout = () => {
    setCurrentUser(null);
    router.replace('/login');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'waiter': return 'Mesero';
      case 'kitchen': return 'Cocinero';
      case 'cashier': return 'Cajero';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={48} color="#059432" />
        </View>
        <Text style={styles.name}>{currentUser?.name || 'Usuario'}</Text>
        <Text style={styles.role}>{currentUser?.role ? getRoleLabel(currentUser.role) : ''}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <MaterialIcons name="badge" size={24} color="#6b7280" />
          <Text style={styles.infoLabel}>ID</Text>
          <Text style={styles.infoValue}>{currentUser?.id || '-'}</Text>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="white" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  role: {
    fontSize: 16,
    color: '#059432',
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    marginHorizontal: 16,
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileTab;

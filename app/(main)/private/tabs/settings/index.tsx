import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore } from '../../../../src/store/useMainStore';

const SettingsTab = () => {
  const router = useRouter();
  const currentUser = useMainStore((state) => state.currentUser);
  const setCurrentUser = useMainStore((state) => state.setCurrentUser);

  const handleLogout = () => {
    setCurrentUser(null);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usuario</Text>
        <View style={styles.userInfo}>
          <MaterialIcons name="person" size={24} color="#059432" />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{currentUser?.name}</Text>
            <Text style={styles.userRole}>{currentUser?.role}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notificaciones</Text>
          <Switch value={true} />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Sonido</Text>
          <Switch value={true} />
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  userRole: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1f2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 'auto',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsTab;

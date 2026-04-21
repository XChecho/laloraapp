import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  TextInput,
  Alert,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@src/store/useAuthStore';
import { updateProfileAction, changePasswordAction } from '@core/actions/update-profile.action';

const userTypeLabels: Record<string, string> = {
  Admin: 'Administrador',
  Cashier: 'Cajero',
  Kitchen: 'Cocina',
  Waitress: 'Mesero',
  CanchaManager: 'Encargado de Cancha',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { firstName, lastName, email, userType, phone, profileImage, logout, updateProfile } = useAuthStore();
  
  const [localPhone, setLocalPhone] = useState(phone || '');
  const [localProfileImage, setLocalProfileImage] = useState(profileImage || '');
  
  useEffect(() => {
    if (phone) setLocalPhone(phone);
    if (profileImage) setLocalProfileImage(profileImage);
  }, [phone, profileImage]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState('');
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEditField = (field: string, value: string) => {
    setEditingField(field);
    setFieldValue(value || '');
  };

  const handleSaveField = async () => {
    if (!editingField || !fieldValue.trim()) return;

    setIsLoading(true);
    try {
      const updateData: any = { [editingField]: fieldValue.trim() };
      await updateProfileAction(updateData);
      
      if (editingField === 'phone') {
        setLocalPhone(fieldValue.trim());
      } else if (editingField === 'profileImage') {
        setLocalProfileImage(fieldValue.trim());
      }
      
      await updateProfile(updateData);
      setIsEditing(false);
      setEditingField(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el campo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await changePasswordAction(currentPassword, newPassword);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(main)/login');
          }
        },
      ]
    );
  };

  const renderField = (
    field: string, 
    label: string, 
    value: string | null, 
    icon: keyof typeof Ionicons.glyphMap,
    isEditable: boolean = true
  ) => (
    <View className="bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between border border-gray-100">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full bg-lora-primary/10 items-center justify-center mr-3">
          <Ionicons name={icon} size={20} color="#16a34a" />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-500 font-InterMedium">{label}</Text>
          <Text className="text-base text-lora-text font-InterSemiBold mt-0.5">
            {value || 'No configurado'}
          </Text>
        </View>
      </View>
      {isEditable && (
        <Pressable 
          className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
          onPress={() => handleEditField(field, value || '')}
        >
          <Ionicons name="pencil" size={16} color="#64748b" />
        </Pressable>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-lora-bg">
      <View className="flex-row items-center justify-between px-6 pt-4 pb-4 bg-lora-bg">
        <Pressable 
          className="w-10 h-10 rounded-full bg-white items-center justify-center border border-gray-100"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#1B2332" />
        </Pressable>
        <Text className="text-xl font-InterBold text-lora-text">Mi Perfil</Text>
        <Pressable 
          className="w-10 h-10 rounded-full bg-red-50 items-center justify-center"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="items-center py-6">
          <View className="relative">
            <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {localProfileImage ? (
                <Image source={{ uri: localProfileImage }} className="w-full h-full" />
              ) : (
                <Ionicons name="person" size={48} color="#9ca3af" />
              )}
            </View>
            <Pressable 
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-lora-primary items-center justify-center border-2 border-white"
              onPress={() => handleEditField('profileImage', localProfileImage)}
            >
              <Ionicons name="camera" size={14} color="#fff" />
            </Pressable>
          </View>
          <Text className="text-xl font-InterBold text-lora-text mt-3">
            {firstName} {lastName}
          </Text>
          <View className="bg-lora-primary/10 px-3 py-1 rounded-full mt-1">
            <Text className="text-sm font-InterMedium text-lora-primary">
              {userTypeLabels[userType || ''] || userType}
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-InterBold text-gray-500 mb-3 uppercase tracking-wider">
            Información Personal
          </Text>
          {renderField('firstName', 'Nombre', firstName, 'person-outline')}
          {renderField('lastName', 'Apellido', lastName, 'person-outline')}
          {renderField('phone', 'Teléfono', localPhone, 'call-outline')}
          {renderField('email', 'Correo Electrónico', email, 'mail-outline', false)}
        </View>

        <View className="mb-8">
          <Text className="text-sm font-InterBold text-gray-500 mb-3 uppercase tracking-wider">
            Seguridad
          </Text>
          <Pressable 
            className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-gray-100"
            onPress={() => setShowPasswordModal(true)}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-lora-primary/10 items-center justify-center mr-3">
                <Ionicons name="lock-closed-outline" size={20} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 font-InterMedium">Cambiar Contraseña</Text>
                <Text className="text-base text-lora-text font-InterSemiBold mt-0.5">
                  Actualizar tu contraseña
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={editingField !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingField(null)}
      >
        <KeyboardAvoidingView 
          className="flex-1 bg-black/50 justify-center items-center px-6"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-InterBold text-lora-text mb-4">
              Editar {editingField === 'firstName' ? 'Nombre' : 
                      editingField === 'lastName' ? 'Apellido' : 
                      editingField === 'phone' ? 'Teléfono' : 
                      editingField === 'profileImage' ? 'Foto de Perfil' : ''}
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-base font-InterRegular mb-4"
              placeholder={editingField === 'profileImage' ? 'URL de la imagen' : 'Valor'}
              value={fieldValue}
              onChangeText={setFieldValue}
              autoFocus
            />
            <View className="flex-row gap-3">
              <Pressable 
                className="flex-1 bg-gray-100 py-3 rounded-xl"
                onPress={() => setEditingField(null)}
              >
                <Text className="text-center font-InterSemiBold text-gray-600">Cancelar</Text>
              </Pressable>
              <Pressable 
                className="flex-1 bg-lora-primary py-3 rounded-xl"
                onPress={handleSaveField}
                disabled={isLoading}
              >
                <Text className="text-center font-InterSemiBold text-white">
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <KeyboardAvoidingView 
          className="flex-1 bg-black/50 justify-center items-center px-6"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-InterBold text-lora-text mb-4">
              Cambiar Contraseña
            </Text>
            
            <Text className="text-sm font-InterMedium text-gray-500 mb-1">Contraseña Actual</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-base font-InterRegular mb-3"
              placeholder="Ingresa tu contraseña actual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />

            <Text className="text-sm font-InterMedium text-gray-500 mb-1">Nueva Contraseña</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-base font-InterRegular mb-3"
              placeholder="Ingresa la nueva contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <Text className="text-sm font-InterMedium text-gray-500 mb-1">Confirmar Contraseña</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-base font-InterRegular mb-4"
              placeholder="Confirma la nueva contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View className="flex-row gap-3">
              <Pressable 
                className="flex-1 bg-gray-100 py-3 rounded-xl"
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text className="text-center font-InterSemiBold text-gray-600">Cancelar</Text>
              </Pressable>
              <Pressable 
                className="flex-1 bg-lora-primary py-3 rounded-xl"
                onPress={handleChangePassword}
                disabled={isLoading}
              >
                <Text className="text-center font-InterSemiBold text-white">
                  {isLoading ? 'Cambiando...' : 'Cambiar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStore } from '@store/admin/useAdminStore';

const TablesManagement = () => {
  const router = useRouter();
  const { zones, tables, addZone, deleteZone, addTable, deleteTable } = useAdminStore();
  
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isZoneModalVisible, setIsZoneModalVisible] = useState(false);
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newTableName, setNewTableName] = useState('');

  const handleAddZone = () => {
    if (newZoneName.trim()) {
      addZone({ name: newZoneName, icon: 'restaurant-outline' });
      setNewZoneName('');
      setIsZoneModalVisible(false);
    }
  };

  const handleAddTable = () => {
    if (tables.length >= 30) {
      Alert.alert(
        'Límite alcanzado',
        'El sistema permite un máximo de 30 mesas en total para garantizar un rendimiento óptimo.'
      );
      return;
    }

    if (newTableName.trim() && selectedZone) {
      addTable({ name: newTableName, zoneId: selectedZone });
      setNewTableName('');
      setIsTableModalVisible(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8 mt-4">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#1B2332" />
            </Pressable>
            <Text className="text-2xl font-InterBold text-lora-text">Gestión de Espacios</Text>
          </View>
          <Pressable 
            onPress={() => setIsZoneModalVisible(true)}
            className="bg-lora-primary w-10 h-10 rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>

        <Text className="text-sm font-InterMedium text-lora-text-muted mb-6">
          Configura los ambientes de tu restaurante (Salón, Terraza, etc.) y gestiona las mesas en cada uno.
        </Text>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {zones.map((zone) => {
            const isExpanded = selectedZone === zone.id;
            const zoneTables = tables.filter(t => t.zoneId === zone.id);

            return (
              <View 
                key={zone.id} 
                className={`bg-white rounded-[32px] mb-4 border border-lora-border/30 overflow-hidden ${isExpanded ? 'shadow-md border-lora-primary/20' : 'shadow-sm'}`}
              >
                <Pressable 
                  onPress={() => setSelectedZone(isExpanded ? null : zone.id)}
                  className="p-6 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-2xl bg-lora-bg items-center justify-center mr-4">
                      <Ionicons name={zone.icon as any} size={24} color={isExpanded ? "#0A873A" : "#64748B"} />
                    </View>
                    <View>
                      <Text className={`text-lg font-InterBold ${isExpanded ? 'text-lora-primary' : 'text-lora-text'}`}>
                        {zone.name}
                      </Text>
                      <Text className="text-xs font-InterMedium text-lora-text-muted">
                        {zoneTables.length} mesas configuradas
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    {!isExpanded && (
                      <Pressable 
                        onPress={() => deleteZone(zone.id)}
                        className="p-2 mr-2"
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </Pressable>
                    )}
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#94A3B8" 
                    />
                  </View>
                </Pressable>

                {isExpanded && (
                  <View className="px-6 pb-6 pt-2 bg-slate-50/50">
                    <View className="flex-row items-center justify-between mb-4">
                      <Text className="text-xs font-InterBold text-lora-text-muted uppercase tracking-wider">
                        Lista de Mesas
                      </Text>
                      <Pressable 
                        onPress={() => setIsTableModalVisible(true)}
                        className="bg-emerald-100 px-3 py-1.5 rounded-lg flex-row items-center"
                      >
                        <Ionicons name="add-circle" size={16} color="#059669" className="mr-1" />
                        <Text className="text-[11px] font-InterBold text-emerald-700">Agregar Mesa</Text>
                      </Pressable>
                    </View>

                    <View className="flex-row flex-wrap">
                      {zoneTables.length > 0 ? (
                        zoneTables.map((table) => (
                          <View 
                            key={table.id}
                            className="bg-white px-4 py-2.5 rounded-2xl border border-lora-border/20 shadow-sm mr-2 mb-2 flex-row items-center justify-between"
                            style={{ minWidth: '45%' }}
                          >
                            <Text className="text-sm font-InterBold text-lora-text">{table.name}</Text>
                            <Pressable onPress={() => deleteTable(table.id)}>
                              <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                            </Pressable>
                          </View>
                        ))
                      ) : (
                        <View className="w-full py-6 items-center border border-dashed border-slate-300 rounded-3xl bg-white/50">
                          <Text className="text-xs font-InterMedium text-slate-400">No hay mesas en este espacio</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
          <View className="h-20" />
        </ScrollView>
      </View>

      {/* Modal Nueva Zona */}
      <Modal visible={isZoneModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/60 justify-center px-6"
        >
          <View className="bg-white rounded-[32px] p-8 shadow-xl">
            <Text className="text-2xl font-InterBold text-lora-text mb-2">Nuevo Espacio</Text>
            <Text className="text-sm font-InterMedium text-lora-text-muted mb-6">Ej: Terraza, Salón VIP, Segundo Piso.</Text>
            
            <TextInput
              placeholder="Nombre del espacio..."
              className="bg-lora-bg rounded-2xl p-4 font-InterMedium text-lora-text mb-8 border border-lora-border/20"
              value={newZoneName}
              onChangeText={setNewZoneName}
              autoFocus
            />
            
            <View className="flex-row gap-4">
              <Pressable 
                onPress={() => { setIsZoneModalVisible(false); setNewZoneName(''); }}
                className="flex-1 py-4 items-center"
              >
                <Text className="text-lora-text-muted font-InterBold">Cancelar</Text>
              </Pressable>
              <Pressable 
                onPress={handleAddZone}
                className="flex-1 bg-lora-primary py-4 rounded-2xl items-center shadow-sm"
              >
                <Text className="text-white font-InterBold">Crear Espacio</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Nueva Mesa */}
      <Modal visible={isTableModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/60 justify-center px-6"
        >
          <View className="bg-white rounded-[32px] p-8 shadow-xl">
            <Text className="text-2xl font-InterBold text-lora-text mb-2">Nueva Mesa</Text>
            <Text className="text-sm font-InterMedium text-lora-text-muted mb-6">
              Asignando a: <Text className="text-lora-primary">{zones.find(z => z.id === selectedZone)?.name}</Text>
            </Text>
            
            <TextInput
              placeholder="Nombre o Número de mesa..."
              className="bg-lora-bg rounded-2xl p-4 font-InterMedium text-lora-text mb-8 border border-lora-border/20"
              value={newTableName}
              onChangeText={setNewTableName}
              autoFocus
            />
            
            <View className="flex-row gap-4">
              <Pressable 
                onPress={() => { setIsTableModalVisible(false); setNewTableName(''); }}
                className="flex-1 py-4 items-center"
              >
                <Text className="text-lora-text-muted font-InterBold">Cancelar</Text>
              </Pressable>
              <Pressable 
                onPress={handleAddTable}
                className="flex-1 bg-emerald-600 py-4 rounded-2xl items-center shadow-sm"
              >
                <Text className="text-white font-InterBold">Guardar Mesa</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default TablesManagement;

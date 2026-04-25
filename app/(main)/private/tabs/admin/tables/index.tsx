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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminZones, useCreateAdminZone, useDeleteAdminZone, useAddTableToZone, useRemoveTableFromZone, useAddTablesToZone } from '@src/hooks/useAdminZones';
import { useUpdateAdminTable } from '@src/hooks/useAdminTables';
import { ZoneWithTables, TableData } from '@core/actions/admin/zones';

const TablesManagement = () => {
  const router = useRouter();
  const { data: zonesData, isLoading } = useAdminZones();
  const createZone = useCreateAdminZone();
  const deleteZone = useDeleteAdminZone();
  const addTable = useAddTableToZone();
  const addTables = useAddTablesToZone();
  const removeTable = useRemoveTableFromZone();
  const updateTable = useUpdateAdminTable();
  
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isZoneModalVisible, setIsZoneModalVisible] = useState(false);
  const [isAddMultipleModalVisible, setIsAddMultipleModalVisible] = useState(false);
  const [isEditTableModalVisible, setIsEditTableModalVisible] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [tablesToAdd, setTablesToAdd] = useState('1');
  const [singleTableName, setSingleTableName] = useState('');
  const [singleTableCapacity, setSingleTableCapacity] = useState('4');
  const [editingTable, setEditingTable] = useState<{ id: string; name: string; capacity: number; zoneId: string } | null>(null);
  const [editTableName, setEditTableName] = useState('');
  const [editTableCapacity, setEditTableCapacity] = useState('');
  const [editCapacityError, setEditCapacityError] = useState('');

  const handleAddZone = async () => {
    if (newZoneName.trim()) {
      try {
        await createZone.mutateAsync({ name: newZoneName, icon: 'restaurant-outline' });
        setNewZoneName('');
        setIsZoneModalVisible(false);
        Alert.alert('Éxito', 'Espacio creado correctamente');
      } catch (error: any) {
        console.error('Error creating zone:', error);
        Alert.alert('Error', error?.message || 'No se pudo crear la zona');
      }
    }
  };

  const handleDeleteZone = (zoneId: string, zoneName: string) => {
    Alert.alert(
      'Eliminar Zona',
      `¿Estás seguro de eliminar "${zoneName}"? Esto también eliminará todas las mesas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteZone.mutateAsync(zoneId);
            } catch (error: any) {
              console.error('Error deleting zone:', error);
              Alert.alert('Error', error?.message || 'No se pudo eliminar la zona');
            }
          }
        },
      ]
    );
  };

  const handleAddTables = async () => {
    if (!selectedZone || !tablesToAdd) return;
    
    const quantity = parseInt(tablesToAdd, 10);
    if (isNaN(quantity) || quantity < 1 || quantity > 20) {
      Alert.alert('Error', 'Puedes agregar entre 1 y 20 mesas a la vez');
      return;
    }

    try {
      if (quantity === 1 && singleTableName.trim()) {
        const capacity = parseInt(singleTableCapacity, 10);
        if (isNaN(capacity) || capacity < 1) {
          Alert.alert('Error', 'La capacidad debe ser al menos 1');
          return;
        }
        await addTable.mutateAsync({ zoneId: selectedZone, data: { name: singleTableName, capacity } });
      } else {
        await addTables.mutateAsync({ zoneId: selectedZone, quantity });
      }
      setIsAddMultipleModalVisible(false);
      setTablesToAdd('1');
      setSingleTableName('');
      setSingleTableCapacity('4');
      setSelectedZone(null);
      Alert.alert('Éxito', quantity === 1 ? 'Mesa agregada correctamente' : 'Mesas agregadas correctamente');
    } catch (error: any) {
      console.error('Error adding tables:', error);
      Alert.alert('Error', error?.message || 'No se pudieron agregar las mesas');
    }
  };

  const handleRemoveTable = async (zoneId: string, tableId: string, tableName: string) => {
    Alert.alert(
      'Eliminar Mesa',
      `¿Estás seguro de eliminar "${tableName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTable.mutateAsync({ zoneId, tableId });
            } catch (error: any) {
              console.error('Error removing table:', error);
              Alert.alert('Error', error?.message || 'No se pudo eliminar la mesa');
            }
          }
        },
      ]
    );
  };

  const openTableModal = (zoneId: string) => {
    setSelectedZone(zoneId);
    setIsAddMultipleModalVisible(true);
  };

  const openEditTable = (table: { id: string; name: string; capacity: number; zoneId: string }) => {
    setEditingTable(table);
    setEditTableName(table.name);
    setEditTableCapacity(String(table.capacity));
    setEditCapacityError('');
    setIsEditTableModalVisible(true);
  };

  const handleSaveTable = async () => {
    if (!editingTable || !editTableName.trim()) return;
    const capacity = parseInt(editTableCapacity, 10);
    if (isNaN(capacity) || capacity < 1) {
      setEditCapacityError('La capacidad debe ser al menos 1');
      return;
    }
    setEditCapacityError('');
    
    try {
      await updateTable.mutateAsync({
        id: editingTable.id,
        data: { name: editTableName, capacity },
      });
      setIsEditTableModalVisible(false);
      setEditingTable(null);
      Alert.alert('Éxito', 'Mesa actualizada correctamente');
    } catch (error: any) {
      console.error('Error updating table:', error);
      Alert.alert('Error', error?.message || 'No se pudo actualizar la mesa');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return '#22C55E';
      case 'OCCUPIED': return '#EF4444';
      case 'RESERVED': return '#F59E0B';
      default: return '#CBD5E1';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-lora-bg items-center justify-center">
        <ActivityIndicator size="large" color="#0A873A" />
      </SafeAreaView>
    );
  }

  const zones = zonesData || [];

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
            const zoneTables = zone.tables || [];

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
                      <Ionicons name={(zone.icon as any) || 'restaurant'} size={24} color={isExpanded ? "#0A873A" : "#64748B"} />
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
                        onPress={() => handleDeleteZone(zone.id, zone.name)}
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
                        onPress={() => openTableModal(zone.id)}
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
                            <Pressable onPress={() => openEditTable({ id: table.id, name: table.name, capacity: table.capacity, zoneId: zone.id })} className="flex-row items-center">
                              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getStatusColor(table.status), marginRight: 6 }} />
                              <Text className="text-sm font-InterBold text-lora-text">{table.name}</Text>
                              <Text className="text-xs font-InterMedium text-lora-text-muted ml-2">· {table.capacity} pax</Text>
                            </Pressable>
                            <Pressable onPress={() => handleRemoveTable(zone.id, table.id, table.name)} disabled={removeTable.isPending}>
                              {removeTable.isPending ? (
                                <ActivityIndicator size="small" color="#CBD5E1" />
                              ) : (
                                <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                              )}
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
                disabled={createZone.isPending || !newZoneName.trim()}
                className={`flex-1 py-4 rounded-2xl items-center shadow-sm ${createZone.isPending || !newZoneName.trim() ? 'bg-lora-primary/50' : 'bg-lora-primary'}`}
              >
                {createZone.isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-InterBold">Crear Espacio</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Agregar Mesas */}
      <Modal visible={isAddMultipleModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/60 justify-center px-6"
        >
          <View className="bg-white rounded-[32px] p-8 shadow-xl">
            <Text className="text-2xl font-InterBold text-lora-text mb-2">Agregar Mesas</Text>
            <Text className="text-sm font-InterMedium text-lora-text-muted mb-6">
              {parseInt(tablesToAdd, 10) === 1 ? 'Configura la nueva mesa' : 'Cantidad de mesas a agregar (1-20)'}
            </Text>
            
            <TextInput
              placeholder="Cantidad..."
              className="bg-lora-bg rounded-2xl p-4 font-InterMedium text-lora-text mb-4 border border-lora-border/20"
              value={tablesToAdd}
              onChangeText={setTablesToAdd}
              keyboardType="number-pad"
              maxLength={2}
            />

            {parseInt(tablesToAdd, 10) === 1 && (
              <>
                <TextInput
                  placeholder="Nombre de la mesa..."
                  className="bg-lora-bg rounded-2xl p-4 font-InterMedium text-lora-text mb-4 border border-lora-border/20"
                  value={singleTableName}
                  onChangeText={setSingleTableName}
                  autoFocus
                />
                <TextInput
                  placeholder="Capacidad (personas)..."
                  className="bg-lora-bg rounded-2xl p-4 font-InterMedium text-lora-text mb-8 border border-lora-border/20"
                  value={singleTableCapacity}
                  onChangeText={setSingleTableCapacity}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </>
            )}
            
            <View className="flex-row gap-4">
              <Pressable 
                onPress={() => { setIsAddMultipleModalVisible(false); setTablesToAdd('1'); setSingleTableName(''); setSingleTableCapacity('4'); setSelectedZone(null); }}
                className="flex-1 py-4 items-center"
              >
                <Text className="text-lora-text-muted font-InterBold">Cancelar</Text>
              </Pressable>
              <Pressable 
                onPress={handleAddTables}
                disabled={addTable.isPending || addTables.isPending || !tablesToAdd}
                className={`flex-1 py-4 rounded-2xl items-center shadow-sm ${addTable.isPending || addTables.isPending || !tablesToAdd ? 'bg-emerald-600/50' : 'bg-emerald-600'}`}
              >
                {(addTable.isPending || addTables.isPending) ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-InterBold">Agregar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Editar Mesa */}
      <Modal visible={isEditTableModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/60 justify-center px-6"
        >
          <View className="bg-white rounded-[32px] p-8 shadow-xl">
            <Text className="text-2xl font-InterBold text-lora-text mb-2">Editar Mesa</Text>
            <Text className="text-sm font-InterMedium text-lora-text-muted mb-6">Modifica el nombre y capacidad.</Text>
            
            <TextInput
              placeholder="Nombre de la mesa..."
              className="bg-lora-bg rounded-2xl p-4 font-InterMedium text-lora-text mb-4 border border-lora-border/20"
              value={editTableName}
              onChangeText={setEditTableName}
              autoFocus
            />
            <TextInput
              placeholder="Capacidad (personas)..."
              className={`bg-lora-bg rounded-2xl p-4 font-InterMedium text-lora-text mb-2 border ${editCapacityError ? 'border-red-400' : 'border-lora-border/20'}`}
              value={editTableCapacity}
              onChangeText={(text) => { setEditTableCapacity(text); setEditCapacityError(''); }}
              keyboardType="number-pad"
              maxLength={2}
            />
            {editCapacityError ? (
              <Text className="text-xs text-red-500 font-InterMedium mb-4">{editCapacityError}</Text>
            ) : (
              <View className="mb-4" />
            )}
            
            <View className="flex-row gap-4">
              <Pressable 
                onPress={() => { setIsEditTableModalVisible(false); setEditingTable(null); }}
                className="flex-1 py-4 items-center"
              >
                <Text className="text-lora-text-muted font-InterBold">Cancelar</Text>
              </Pressable>
              <Pressable 
                onPress={handleSaveTable}
                disabled={updateTable.isPending || !editTableName.trim()}
                className={`flex-1 py-4 rounded-2xl items-center shadow-sm ${updateTable.isPending || !editTableName.trim() ? 'bg-lora-primary/50' : 'bg-lora-primary'}`}
              >
                {updateTable.isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-InterBold">Guardar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default TablesManagement;
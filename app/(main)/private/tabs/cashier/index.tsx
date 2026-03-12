import { MOCK_DB, Table } from '@core/database/mockDb';
import { formatCOP } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DENOMINATIONS = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50];

const TableCard = ({ table }: { table: Table }) => {
  const isOccupied = table.status === 'OCUPADA';
  const router = useRouter();

  return (
    <View className={`bg-white rounded-2xl p-4 mb-4 border-2 ${isOccupied ? 'border-red-500' : 'border-teal-500'} shadow-sm`}>
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-2xl font-InterBold text-lora-text uppercase">{table.name}</Text>
          <View className={`flex-row items-center mt-1 px-2 py-0.5 rounded-full ${isOccupied ? 'bg-red-100' : 'bg-teal-100'}`}>
            <View className={`w-2 h-2 rounded-full mr-1.5 ${isOccupied ? 'bg-red-500' : 'bg-teal-500'}`} />
            <Text className={`text-[10px] font-InterBold ${isOccupied ? 'text-red-800' : 'text-teal-800'}`}>
              {table.status}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-500 font-InterMedium">Total Cuenta</Text>
          <Text className={`text-xl font-InterBold ${isOccupied ? 'text-lora-text' : 'text-gray-400'}`}>
            {formatCOP(table.total)}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        {isOccupied ? (
          <>
            <Pressable 
              className="flex-1 bg-gray-100 py-3 rounded-xl items-center justify-center active:opacity-70"
              onPress={() => router.push(`/(main)/private/tabs/waitres/${table.id}`)}
            >
              <Text className="text-lora-text font-InterBold text-sm">Detalles</Text>
            </Pressable>
            <Pressable className="flex-1 bg-lora-primary py-3 rounded-xl items-center justify-center active:opacity-70">
              <Text className="text-white font-InterBold text-sm">Cerrar</Text>
            </Pressable>
          </>
        ) : (
          <Pressable 
            className="w-full bg-lora-primary py-3 rounded-xl items-center justify-center active:opacity-70"
            onPress={() => router.push(`/(main)/private/tabs/waitres/${table.id}`)}
          >
            <Text className="text-white font-InterBold text-sm">Abrir Mesa</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const CajaModal = ({ visible, onClose, type }: { visible: boolean, onClose: () => void, type: 'ABRIR' | 'CERRAR' }) => {
  const [counts, setCounts] = useState<{ [key: number]: string }>({});
  const [nequi, setNequi] = useState('');

  const totalDenominations = useMemo(() => {
    return Object.entries(counts).reduce((acc, [denom, count]) => {
      const val = parseInt(count) || 0;
      return acc + (parseInt(denom) * val);
    }, 0);
  }, [counts]);

  const totalGeneral = totalDenominations + (parseInt(nequi) || 0);

  const handleSave = () => {
    Alert.alert("Éxito", `Caja ${type === 'ABRIR' ? 'abierta' : 'cerrada'} con éxito. Total: ${formatCOP(totalGeneral)}`);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <SafeAreaView edges={['top']} className="bg-white rounded-t-[32px] h-[90%]">
          <View className="p-6 flex-1">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-InterBold text-lora-text">{type === 'ABRIR' ? 'Abrir Caja' : 'Cerrar Caja'}</Text>
              <Pressable onPress={onClose}>
                <Ionicons name="close-circle" size={32} color="#94A3B8" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-sm font-InterBold text-gray-500 mb-4 uppercase tracking-wider">Efectivo en Base</Text>
              
              <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                {DENOMINATIONS.map((denom) => (
                  <View key={denom} className="flex-row items-center justify-between py-2 border-b border-gray-200/50">
                    <Text className="font-InterSemiBold text-lora-text w-24">{formatCOP(denom)}</Text>
                    <TextInput
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1 text-right font-InterBold"
                      keyboardType="numeric"
                      placeholder="0"
                      value={counts[denom] || ''}
                      onChangeText={(val) => setCounts({ ...counts, [denom]: val })}
                    />
                    <Text className="w-28 text-right font-InterBold text-lora-primary ml-2">
                      {formatCOP((parseInt(counts[denom]) || 0) * denom)}
                    </Text>
                  </View>
                ))}
              </View>

              <Text className="text-sm font-InterBold text-gray-500 mb-2 uppercase tracking-wider">Otros Medios</Text>
              <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                <View className="flex-row items-center justify-between">
                  <Text className="font-InterSemiBold text-lora-text">Saldo Nequi</Text>
                  <TextInput
                    className="w-40 bg-white border border-gray-200 rounded-lg px-3 py-2 text-right font-InterBold"
                    keyboardType="numeric"
                    placeholder="$ 0"
                    value={nequi}
                    onChangeText={setNequi}
                  />
                </View>
              </View>
            </ScrollView>

            <View className="pt-4 border-t border-gray-100">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-InterBold text-gray-500">Total en Caja</Text>
                <Text className="text-2xl font-InterBold text-lora-primary">{formatCOP(totalGeneral)}</Text>
              </View>
              <Pressable 
                onPress={handleSave}
                className="bg-lora-primary py-4 rounded-2xl items-center justify-center active:opacity-70"
              >
                <Text className="text-white font-InterBold text-lg">Confirmar {type === 'ABRIR' ? 'Apertura' : 'Cierre'}</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const CashierScreen = () => {
  const [activeZone, setActiveZone] = useState<'SALON' | 'TERRAZA'>('SALON');
  const [cajaModal, setCajaModal] = useState<{ visible: boolean, type: 'ABRIR' | 'CERRAR' }>({ visible: false, type: 'ABRIR' });

  const filteredTables = MOCK_DB.tables.filter(t => t.zone === activeZone);
  const totalSales = MOCK_DB.tables.reduce((acc, t) => acc + t.total, 0);
  const occupiedCount = MOCK_DB.tables.filter(t => t.status === 'OCUPADA').length;
  const freeCount = MOCK_DB.tables.filter(t => t.status === 'LIBRE').length;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white px-5 py-4 flex-row justify-between items-center border-b border-gray-200">
        <View>
          <Text className="text-xl font-InterBold text-lora-text">Caja - Gestión</Text>
          <Text className="text-xs font-InterMedium text-lora-primary">Cajero: Juan Pérez • Turno Tarde</Text>
        </View>
        <Pressable className="bg-lora-primary/10 p-2 rounded-full">
          <Ionicons name="person-circle" size={28} color="#059432" />
        </Pressable>
      </View>

      {/* Zone Tabs */}
      <View className="bg-white px-5 flex-row border-b border-gray-200">
        <Pressable 
          onPress={() => setActiveZone('SALON')}
          className={`py-3 mr-6 border-b-4 ${activeZone === 'SALON' ? 'border-lora-primary' : 'border-transparent'}`}
        >
          <Text className={`font-InterBold ${activeZone === 'SALON' ? 'text-lora-primary' : 'text-gray-400'}`}>Salón Principal</Text>
        </Pressable>
        <Pressable 
          onPress={() => setActiveZone('TERRAZA')}
          className={`py-3 border-b-4 ${activeZone === 'TERRAZA' ? 'border-lora-primary' : 'border-transparent'}`}
        >
          <Text className={`font-InterBold ${activeZone === 'TERRAZA' ? 'text-lora-primary' : 'text-gray-400'}`}>Terraza Exterior</Text>
        </Pressable>
      </View>

      {/* Table Grid */}
      <FlatList
        data={filteredTables}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TableCard table={item} />}
        contentContainerStyle={{ padding: 16 }}
        numColumns={1} // Replaced grid with list for better mobile interaction as per design feel
        showsVerticalScrollIndicator={false}
      />

      {/* Footer Info */}
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row gap-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <Text className="text-xs font-InterBold text-gray-600">{occupiedCount} Ocupadas</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-teal-500 mr-2" />
              <Text className="text-xs font-InterBold text-gray-600">{freeCount} Libres</Text>
            </View>
          </View>
          <View className="bg-lora-primary/5 px-4 py-2 rounded-full items-end">
            <Text className="text-[10px] font-InterBold text-gray-400 uppercase">Venta del día</Text>
            <Text className="text-lg font-InterBold text-lora-primary">{formatCOP(totalSales)}</Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <Pressable 
            onPress={() => setCajaModal({ visible: true, type: 'ABRIR' })}
            className="flex-1 bg-white border border-lora-primary py-3 rounded-xl items-center justify-center active:opacity-70"
          >
            <Text className="text-lora-primary font-InterBold">Abrir Caja</Text>
          </Pressable>
          <Pressable 
            onPress={() => setCajaModal({ visible: true, type: 'CERRAR' })}
            className="flex-1 bg-lora-primary py-3 rounded-xl items-center justify-center active:opacity-70"
          >
            <Text className="text-white font-InterBold">Cerrar Caja</Text>
          </Pressable>
        </View>
      </View>

      <CajaModal 
        visible={cajaModal.visible} 
        onClose={() => setCajaModal({ ...cajaModal, visible: false })} 
        type={cajaModal.type} 
      />
    </SafeAreaView>
  );
};

export default CashierScreen;

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#059432';

interface Zone {
  id: string;
  name: string;
  enabled: boolean;
}

export default function SettingsScreen() {
  const [restaurantName, setRestaurantName] = useState('Restaurante La Lora');
  const [taxRate, setTaxRate] = useState('19');
  const [serviceCharge, setServiceCharge] = useState('10');
  const [currency, setCurrency] = useState('COP');
  const [zones, setZones] = useState<Zone[]>([
    { id: 'main', name: 'Salón Principal', enabled: true },
    { id: 'terrace', name: 'Terraza', enabled: true },
    { id: 'vip', name: 'VIP', enabled: true },
    { id: 'bar', name: 'Barra', enabled: true },
  ]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSave = () => {
    Alert.alert('Guardado', 'Configuración guardada exitosamente');
  };

  const toggleZone = (zoneId: string) => {
    setZones(zones.map(z => 
      z.id === zoneId ? { ...z, enabled: !z.enabled } : z
    ));
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 pt-12 pb-6">
        <View>
          <Text className="text-3xl font-bold text-white">Configuración</Text>
          <Text className="text-white/80 text-lg">Ajustes del Sistema</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
            <MaterialIcons name="storefront" size={20} color="#059432" />
            <Text className="font-bold text-gray-700">Información del Restaurante</Text>
          </View>
          
          <View className="p-4">
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Nombre del Restaurante</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                value={restaurantName}
                onChangeText={setRestaurantName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Zona Horaria</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <Text className="text-gray-800">America/Bogota (GMT-5)</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Moneda</Text>
              <View className="flex-row gap-2">
                {['COP', 'USD', 'EUR'].map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    onPress={() => setCurrency(curr)}
                    className={`px-4 py-2 rounded-lg border ${
                      currency === curr
                        ? 'bg-[#059432] border-[#059432]'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`font-medium ${
                      currency === curr ? 'text-white' : 'text-gray-600'
                    }`}>
                      {curr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
            <MaterialIcons name="receipt-long" size={20} color="#059432" />
            <Text className="font-bold text-gray-700">Impuestos y Servicios</Text>
          </View>
          
          <View className="p-4">
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Porcentaje de IVA (%)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                value={taxRate}
                onChangeText={setTaxRate}
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Cobro por Servicio (%)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                value={serviceCharge}
                onChangeText={setServiceCharge}
                keyboardType="numeric"
              />
            </View>

            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="info" size={20} color="#CA8A04" />
                <Text className="text-yellow-800 text-sm">
                  Los impuestos se aplican automáticamente a los pedidos
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
            <MaterialIcons name="meeting-room" size={20} color="#059432" />
            <Text className="font-bold text-gray-700">Configuración de Zonas</Text>
          </View>
          
          <View className="p-4">
            <Text className="text-gray-600 text-sm mb-4">
              Habilita o desactiva las zonas de mesas disponibles en el sistema
            </Text>
            
            {zones.map((zone) => (
              <View key={zone.id} className="flex-row justify-between items-center py-3 border-b border-gray-100">
                <View className="flex-row items-center gap-3">
                  <View className="bg-gray-100 p-2 rounded-lg">
                    <MaterialIcons name="meeting-room" size={20} color="#6B7280" />
                  </View>
                  <Text className="text-gray-800 font-medium">{zone.name}</Text>
                </View>
                <Switch
                  value={zone.enabled}
                  onValueChange={() => toggleZone(zone.id)}
                  trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                  thumbColor={zone.enabled ? '#059432' : '#9CA3AF'}
                />
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
            <MaterialIcons name="notifications" size={20} color="#059432" />
            <Text className="font-bold text-gray-700">Notificaciones</Text>
          </View>
          
          <View className="p-4">
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <View>
                <Text className="text-gray-800 font-medium">Notificaciones Push</Text>
                <Text className="text-gray-500 text-sm">Recibir alertas de pedidos</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                thumbColor={notificationsEnabled ? '#059432' : '#9CA3AF'}
              />
            </View>

            <View className="flex-row justify-between items-center py-3">
              <View>
                <Text className="text-gray-800 font-medium">Sonido</Text>
                <Text className="text-gray-500 text-sm">Reproducir sonido al recibir pedidos</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                thumbColor={soundEnabled ? '#059432' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
            <MaterialIcons name="info" size={20} color="#059432" />
            <Text className="font-bold text-gray-700">Acerca de</Text>
          </View>
          
          <View className="p-4">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Versión de la App</Text>
              <Text className="text-gray-800 font-medium">1.0.0</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Desarrollado por</Text>
              <Text className="text-gray-800 font-medium">La Lora Tech</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-[#059432] py-4 rounded-xl"
        >
          <Text className="text-white text-center font-bold text-lg">
            Guardar Configuración
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

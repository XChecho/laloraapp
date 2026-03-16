import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ReservationCard, ReservationStatus } from '../../../../../src/components/cancha/ReservationCard';
import { CanchaModal } from '../../../../../src/components/cancha/CanchaModal';

const mockReservationsData = [
  { id: '1', customer: 'Juan Pérez', phone: '3001112233', start: '17:00', end: '18:00', status: 'CONFIRMADA' as ReservationStatus },
  { id: '2', customer: 'María García', phone: '3104445566', start: '18:00', end: '19:00', status: 'PENDIENTE' as ReservationStatus },
  { id: '3', customer: 'Club de Tenis S.A.', phone: '3207778899', start: '19:00', end: '20:00', status: 'PENDIENTE' as ReservationStatus },
  { id: '4', customer: '', phone: '', start: '20:00', end: '21:00', status: 'PENDIENTE' as ReservationStatus },
  { id: '5', customer: '', phone: '', start: '21:00', end: '22:00', status: 'PENDIENTE' as ReservationStatus },
  { id: '6', customer: '', phone: '', start: '22:00', end: '23:00', status: 'PENDIENTE' as ReservationStatus },
];

const quickSaleProducts = [
  { id: '1', name: 'Agua 600ml', price: '$2,500', icon: 'water-outline' },
  { id: '2', name: 'Gatorade', price: '$8,500', icon: 'flash-outline' },
  { id: '3', name: 'Tubo Pelotas', price: '$25,000', icon: 'tennisball-outline' },
  { id: '4', name: 'Barra Proteica', price: '$6,000', icon: 'nutrition-outline' },
];

const CanchaScreen = () => {
  const [activeTab, setActiveTab] = useState('reservas');
  const [reservations, setReservations] = useState(mockReservationsData);
  const [selectedDate, setSelectedDate] = useState('16 Mar 2024');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [editingRes, setEditingRes] = useState<any>(null);

  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status: newStatus } : res));
  };

  const hasActiveReservation = reservations.some(res => res.status === 'EN CURSO');

  const openNewReservation = (slotInfo?: string) => {
    let initialData = null;
    if (slotInfo) {
      const [start, end] = slotInfo.split(' - ');
      initialData = { startTime: start, endTime: end, customerName: 'Espacio Disponible' };
    }
    setEditingRes(initialData);
    setModalVisible(true);
  };

  const handleSaveReservation = (data: any) => {
    if (editingRes && editingRes.id) {
        // Edit existing logic
        setReservations(prev => prev.map(res => res.id === editingRes.id ? { ...res, customer: data.customerName, phone: data.phone, start: data.startTime, end: data.endTime } : res));
    } else {
        // Find if slot exists and update or add new
        const slotIdx = reservations.findIndex(r => r.start === data.startTime && !r.customer);
        if (slotIdx !== -1) {
            setReservations(prev => {
                const newRes = [...prev];
                newRes[slotIdx] = { ...newRes[slotIdx], customer: data.customerName, phone: data.phone };
                return newRes;
            });
        }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-2xl font-InterBold text-lora-text">
            La Lora - <Text className="text-lora-primary">Cancha</Text>
          </Text>
          <View className="flex-row items-center gap-3">
            <Pressable 
                onPress={() => setDateModalVisible(true)}
                className="bg-white px-4 py-2.5 rounded-2xl flex-row items-center border border-lora-border/20 shadow-sm"
            >
                <Ionicons name="calendar-outline" size={18} color="#0A873A" className="mr-2" />
                <Text className="text-[13px] font-InterExtraBold text-lora-text">{selectedDate}</Text>
            </Pressable>
            <Pressable className="w-11 h-11 bg-emerald-50 rounded-2xl items-center justify-center border border-emerald-100/50">
              <Ionicons name="notifications-outline" size={22} color="#059669" />
            </Pressable>
          </View>
        </View>

        {/* Action Tabs */}
        <View className="px-6 mt-4">
          <View className="bg-white/50 p-1.5 rounded-3xl flex-row border border-lora-border/20">
            <Pressable 
              onPress={() => setActiveTab('reservas')}
              className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'reservas' ? 'bg-lora-primary shadow-sm' : ''}`}
            >
              <Text className={`font-InterBold ${activeTab === 'reservas' ? 'text-white' : 'text-lora-text-muted'}`}>Reservas</Text>
            </Pressable>
            <Pressable 
              onPress={() => setActiveTab('ventas')}
              className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'ventas' ? 'bg-lora-primary shadow-sm' : ''}`}
            >
              <Text className={`font-InterBold ${activeTab === 'ventas' ? 'text-white' : 'text-lora-text-muted'}`}>Ventas Individuales</Text>
            </Pressable>
          </View>
        </View>

        {/* Global Action */}
        <View className="px-6 mt-6">
          <Pressable 
            onPress={() => openNewReservation()}
            className="bg-lora-primary py-4 rounded-3xl flex-row items-center justify-center shadow-lg shadow-lora-primary/30"
          >
            <Ionicons name="add-circle" size={24} color="white" className="mr-2" />
            <Text className="text-white font-InterExtraBold text-lg">Nueva Reserva</Text>
          </Pressable>
        </View>

        {/* Reservations List */}
        <View className="px-6 mt-10">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-InterBold text-lora-text">Próximas Reservas</Text>
            <Text className="text-xs font-InterBold text-lora-primary bg-emerald-50 px-3 py-1.5 rounded-xl">Hoy, {selectedDate.split(' ').slice(0, 2).join(' ')}</Text>
          </View>

          {reservations.map((res) => (
            <ReservationCard 
              key={`${res.id}-${res.customer}`}
              id={res.id}
              customerName={res.customer || 'Espacio Disponible'}
              startTime={res.start}
              endTime={res.end}
              phone={res.phone}
              initialStatus={res.status}
              canStart={!hasActiveReservation}
              onStatusChange={handleStatusChange}
              onNewReservationRequested={(slot) => openNewReservation(slot)}
              onCancel={() => handleStatusChange(res.id, 'CANCELADA')}
              onEdit={() => {
                setEditingRes({ ...res, customerName: res.customer, startTime: res.start, endTime: res.end });
                setModalVisible(true);
              }}
            />
          ))}
        </View>

        {/* Quick Sale Section */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-InterBold text-lora-text mb-6">Venta Rápida</Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {quickSaleProducts.map((product) => (
              <Pressable 
                key={product.id}
                className="bg-white rounded-[32px] p-6 w-[48%] border border-lora-border/10 shadow-sm"
              >
                <View className="w-12 h-12 rounded-2xl bg-lora-bg items-center justify-center mb-4">
                  <Ionicons name={product.icon as any} size={24} color="#0A873A" />
                </View>
                <Text className="font-InterBold text-lora-text text-[15px] mb-1">{product.name}</Text>
                <Text className="font-InterBold text-lora-primary">{product.price}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      <Pressable className="absolute bottom-6 right-6 w-16 h-16 bg-lora-primary rounded-full items-center justify-center shadow-xl shadow-lora-primary/40 border-4 border-white">
        <Ionicons name="cart" size={28} color="white" />
        <View className="absolute -top-1 -right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center border-2 border-white">
          <Text className="text-white text-[10px] font-InterExtraBold">2</Text>
        </View>
      </Pressable>

      <CanchaModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveReservation}
        initialData={editingRes}
        isEditing={!!editingRes && editingRes.customerName !== 'Espacio Disponible'}
      />

      {/* Basic Date Picker Modal (Visual only for now as proof of concept) */}
      <Modal visible={dateModalVisible} transparent animationType="fade" onRequestClose={() => setDateModalVisible(false)}>
        <Pressable className="flex-1 bg-black/40 justify-center items-center px-6" onPress={() => setDateModalVisible(false)}>
            <View className="bg-white rounded-[40px] p-8 w-full shadow-2xl" onStartShouldSetResponder={() => true}>
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-InterBold text-lora-text">Seleccionar Fecha</Text>
                    <Pressable onPress={() => setDateModalVisible(false)}>
                        <Ionicons name="close" size={24} color="#94A3B8" />
                    </Pressable>
                </View>
                
                {/* Visual Calendar Placeholder */}
                <View className="bg-lora-bg rounded-[32px] p-4 mb-6">
                    <View className="flex-row justify-between items-center mb-4 px-2">
                        <Text className="font-InterBold text-lora-text">Marzo 2024</Text>
                        <View className="flex-row gap-4">
                            <Ionicons name="chevron-back" size={20} color="#0A873A" />
                            <Ionicons name="chevron-forward" size={20} color="#0A873A" />
                        </View>
                    </View>
                    <View className="flex-row flex-wrap gap-2 justify-center">
                        {[13, 14, 15, 16, 17, 18, 19].map(d => (
                            <Pressable 
                                key={d}
                                onPress={() => {
                                    setSelectedDate(`${d} Mar 2024`);
                                    setDateModalVisible(false);
                                }}
                                className={`w-10 h-10 rounded-full items-center justify-center ${d === 16 ? 'bg-lora-primary' : 'bg-white'}`}
                            >
                                <Text className={`font-InterBold ${d === 16 ? 'text-white' : 'text-slate-600'}`}>{d}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default CanchaScreen;

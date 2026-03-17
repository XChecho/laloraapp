import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '@core/helper/validators';
import { MOCK_DB, CanchaAccount, ReservationStatus } from '@core/database/mockDb';

// Components
import { ReservationCard } from '@src/components/cancha/ReservationCard';
import { CanchaModal } from '@src/components/cancha/CanchaModal';
import { CanchaHeader } from '@src/components/cancha/CanchaHeader';
import { CanchaTabs } from '@src/components/cancha/CanchaTabs';
import { CanchaVentasContent } from '@src/components/cancha/CanchaVentasContent';
import { CanchaMenuModal } from '@src/components/cancha/CanchaMenuModal';
import { CanchaAccountDetailsModal } from '@src/components/cancha/CanchaAccountDetailsModal';
import { CanchaDateModal } from '@src/components/cancha/CanchaDateModal';
import { CanchaHistoryModal } from '@src/components/cancha/CanchaHistoryModal';

const PRIMARY = '#0A873A';

const CanchaScreen = () => {
  const [activeTab, setActiveTab] = useState<'reservas' | 'ventas'>('reservas');
  const insets = useSafeAreaInsets();
  
  // Reservations State
  const [reservations, setReservations] = useState(MOCK_DB.reservations);
  const [selectedDate, setSelectedDate] = useState('16 Mar 2024');
  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [editingRes, setEditingRes] = useState<any>(null);

  // Ventas Individuales State
  const [accounts, setAccounts] = useState<CanchaAccount[]>(MOCK_DB.canchaAccounts);
  const [historyAccounts, setHistoryAccounts] = useState<CanchaAccount[]>(MOCK_DB.canchaHistory);
  const [historyVisible, setHistoryVisible] = useState(false);
  
  const [activeAccount, setActiveAccount] = useState<CanchaAccount | null>(null);
  const [newAccountVisible, setNewAccountVisible] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuTab, setMenuTab] = useState('Bebidas');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [closeConfirmVisible, setCloseConfirmVisible] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Reservation Handlers
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
        setReservations(prev => prev.map(res => res.id === editingRes.id ? { ...res, customer: data.customerName, phone: data.phone, start: data.startTime, end: data.endTime } : res));
    } else {
        const slotIdx = reservations.findIndex(r => r.start === data.startTime && !r.customer);
        if (slotIdx !== -1) {
            setReservations(prev => {
                const newRes = [...prev];
                newRes[slotIdx] = { ...newRes[slotIdx], customer: data.customerName, phone: data.phone };
                return newRes;
            });
        }
    }
    setModalVisible(false);
  };

  // Account Handlers
  const handleCreateAccount = () => {
    if (!newAccountName) return;
    const newId = `A${Date.now()}`;
    const newAcc: CanchaAccount = { id: newId, name: newAccountName, summary: '', total: 0, items: [] };
    setActiveAccount(newAcc);
    setIsDraft(true);
    setNewAccountVisible(false);
    setNewAccountName('');
    setMenuVisible(true);
  };

  const handleConfirmDraftAccount = () => {
    if (!activeAccount) return;
    setAccounts([activeAccount, ...accounts]);
    setIsDraft(false);
    setDetailsVisible(false);
  };

  const handleCloseAccount = () => {
    if (!activeAccount) return;
    const closedAcc = { 
      ...activeAccount, 
      closedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };
    setHistoryAccounts(prev => [closedAcc, ...prev]);
    setAccounts(prev => prev.filter(a => a.id !== activeAccount.id));
    setCloseConfirmVisible(false);
    setDetailsVisible(false);
    setActiveAccount(null);
  };

  const updateAccountState = (newItems: any[]) => {
    if (!activeAccount) return;
    const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const newSummary = newItems.map(i => `${i.qty} ${i.name}`).join(', ');
    const updatedAccount = { ...activeAccount, items: newItems, total: newTotal, summary: newSummary };
    setActiveAccount(updatedAccount);
    if (!isDraft) {
      setAccounts(prev => prev.map(a => a.id === activeAccount.id ? updatedAccount : a));
    }
  };

  const handleAddItem = (item: any) => {
    if (!activeAccount) return;
    const existingIdx = activeAccount.items.findIndex((i: any) => i.id === item.id);
    let newItems = [...activeAccount.items];
    if (existingIdx !== -1) {
      newItems[existingIdx] = { ...newItems[existingIdx], qty: newItems[existingIdx].qty + 1 };
    } else {
      newItems.push({ ...item, qty: 1 });
    }
    updateAccountState(newItems);
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    if (!activeAccount) return;
    const newItems = activeAccount.items.map((i: any) => 
      i.id === itemId ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    );
    updateAccountState(newItems);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!activeAccount) return;
    const newItems = activeAccount.items.filter((i: any) => i.id !== itemId);
    updateAccountState(newItems);
  };

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top', 'left', 'right']}>
      <View style={{ backgroundColor: '#F8FAFC' }}>
        <CanchaHeader selectedDate={selectedDate} onOpenDatePicker={() => setDateModalVisible(true)} />
        <CanchaTabs activeTab={activeTab} onTabChange={setActiveTab} primaryColor={PRIMARY} />

        <View style={{ paddingHorizontal: 24, marginVertical: 20 }}>
          <Pressable
            onPress={activeTab === 'reservas' ? () => openNewReservation() : () => setNewAccountVisible(true)}
            style={{ 
              backgroundColor: activeTab === 'reservas' ? PRIMARY : '#111A2C', 
              paddingVertical: 16, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 
            }}
          >
            <Ionicons name={activeTab === 'reservas' ? "add-circle" : "receipt-outline"} size={24} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: 'white', fontFamily: 'InterExtraBold', fontSize: 18 }}>
              {activeTab === 'reservas' ? 'Nueva Reserva' : 'Abrir Nueva Cuenta'}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 120 : 80 }}>
        {activeTab === 'reservas' ? (
          <View className="px-6 mt-4">
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
                onNewReservationRequested={openNewReservation}
                onCancel={() => handleStatusChange(res.id, 'CANCELADA')}
                onEdit={() => {
                  setEditingRes({ ...res, customerName: res.customer, startTime: res.start, endTime: res.end });
                  setModalVisible(true);
                }}
              />
            ))}
          </View>
        ) : (
          <CanchaVentasContent 
            accounts={accounts} 
            historyCount={historyAccounts.length}
            onOpenDetails={(acc) => { setActiveAccount(acc); setIsDraft(false); setDetailsVisible(true); }}
            onOpenCloseConfirm={(acc) => { setActiveAccount(acc); setCloseConfirmVisible(true); }}
            onOpenHistory={() => setHistoryVisible(true)}
            primaryColor={PRIMARY}
          />
        )}
      </ScrollView>

      {/* Modals */}
      <CanchaModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleSaveReservation} initialData={editingRes} isEditing={!!editingRes && editingRes.customerName !== 'Espacio Disponible'} />
      <CanchaDateModal visible={dateModalVisible} onClose={() => setDateModalVisible(false)} selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setDateModalVisible(false); }} primaryColor={PRIMARY} />
      
      <CanchaMenuModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
        activeAccount={activeAccount} 
        onAddItem={handleAddItem} 
        onViewOrder={() => { setMenuVisible(false); setDetailsVisible(true); }} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        menuTab={menuTab} 
        setMenuTab={setMenuTab} 
        primaryColor={PRIMARY} 
      />

      <CanchaAccountDetailsModal 
        visible={detailsVisible} 
        onClose={() => setDetailsVisible(false)} 
        activeAccount={activeAccount} 
        onUpdateQty={handleUpdateQty} 
        onRemoveItem={handleRemoveItem} 
        onAddMore={() => { setDetailsVisible(false); setMenuVisible(true); }} 
        onConfirm={() => { if (isDraft) handleConfirmDraftAccount(); else { setDetailsVisible(false); setCloseConfirmVisible(true); } }} 
        isDraft={isDraft} 
        primaryColor={PRIMARY} 
      />

      <CanchaHistoryModal 
        visible={historyVisible} 
        onClose={() => setHistoryVisible(false)} 
        historyAccounts={historyAccounts} 
        primaryColor={PRIMARY} 
      />

      {/* New Account Name Modal */}
      <Modal visible={newAccountVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] p-8 pb-12">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
            <Text className="text-2xl font-InterBold text-lora-text mb-6">Nueva Cuenta</Text>
            <Text className="text-xs font-InterBold text-slate-500 uppercase mb-2">Nombre del Cliente</Text>
            <TextInput value={newAccountName} onChangeText={setNewAccountName} placeholder="Ej. Carlos Rodríguez" className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text mb-8" autoFocus />
            <View className="flex-row gap-4">
              <Pressable onPress={() => setNewAccountVisible(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl items-center"><Text className="font-InterBold text-slate-500">Cancelar</Text></Pressable>
              <Pressable onPress={handleCreateAccount} className={`flex-[2] py-4 rounded-2xl items-center shadow-sm ${newAccountName ? 'bg-lora-primary' : 'bg-slate-300'}`} disabled={!newAccountName}><Text className="font-InterBold text-white">Continuar al Menú</Text></Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Close Confirm Modal */}
      <Modal visible={closeConfirmVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center px-8">
          <View className="bg-white rounded-[32px] p-8 items-center shadow-2xl">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-6"><Ionicons name="alert-circle" size={36} color="#EF4444" /></View>
            <Text className="text-2xl font-InterBold text-lora-text text-center mb-2">¿Cerrar Cuenta?</Text>
            <Text className="text-center text-slate-500 font-InterMedium mb-8">Esta acción cerrará la cuenta temporal para {activeAccount?.name} por {formatCOP(activeAccount?.total || 0)}.</Text>
            <View className="flex-row w-full gap-3">
              <Pressable onPress={() => setCloseConfirmVisible(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl items-center"><Text className="font-InterBold text-slate-500">Volver</Text></Pressable>
              <Pressable onPress={handleCloseAccount} className="flex-1 py-4 bg-red-500 rounded-2xl items-center shadow-lg shadow-red-500/30"><Text className="font-InterBold text-white">Sí, Cerrar</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CanchaScreen;

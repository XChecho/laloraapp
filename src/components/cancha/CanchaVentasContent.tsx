import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '@core/helper/validators';
import { CanchaAccount } from '@core/database/mockDb';

interface CanchaVentasContentProps {
  salesView: 'activas' | 'historial';
  setSalesView: (view: 'activas' | 'historial') => void;
  accounts: CanchaAccount[];
  historyAccounts: CanchaAccount[];
  onOpenDetails: (acc: CanchaAccount) => void;
  onOpenCloseConfirm: (acc: CanchaAccount) => void;
  primaryColor: string;
}

export const CanchaVentasContent: React.FC<CanchaVentasContentProps> = ({
  salesView,
  setSalesView,
  accounts,
  historyAccounts,
  onOpenDetails,
  onOpenCloseConfirm,
  primaryColor
}) => {
  const currentList = salesView === 'activas' ? accounts : historyAccounts;

  return (
    <View className="px-6 mt-4">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row bg-slate-100 p-1 rounded-2xl border border-lora-border/10">
          <Pressable 
            onPress={() => setSalesView('activas')}
            className={`px-4 py-2 rounded-xl flex-row items-center ${salesView === 'activas' ? 'bg-white shadow-sm' : ''}`}
          >
            <Ionicons name="list" size={16} color={salesView === 'activas' ? primaryColor : '#94A3B8'} className="mr-2" />
            <Text className={`font-InterBold text-xs ${salesView === 'activas' ? 'text-lora-text' : 'text-slate-500'}`}>Activas</Text>
            {accounts.length > 0 && salesView === 'activas' && (
              <View className="ml-2 bg-lora-primary px-1.5 py-0.5 rounded-md">
                <Text className="text-[10px] text-white font-InterBold">{accounts.length}</Text>
              </View>
            )}
          </Pressable>
          <Pressable 
            onPress={() => setSalesView('historial')}
            className={`px-4 py-2 rounded-xl flex-row items-center ${salesView === 'historial' ? 'bg-white shadow-sm' : ''}`}
          >
            <Ionicons name="time" size={16} color={salesView === 'historial' ? primaryColor : '#94A3B8'} className="mr-2" />
            <Text className={`font-InterBold text-xs ${salesView === 'historial' ? 'text-lora-text' : 'text-slate-500'}`}>Historial</Text>
          </Pressable>
        </View>
        <Text className="text-xs font-InterBold text-lora-primary bg-emerald-50 px-3 py-1.5 rounded-xl uppercase">
          {salesView === 'activas' ? `${accounts.length} Pendientes` : `${historyAccounts.length} Pagadas`}
        </Text>
      </View>

      {currentList.length > 0 ? (
        currentList.map(acc => (
          <View key={acc.id || Math.random()} className={`bg-white rounded-[28px] p-5 mb-4 border border-lora-border/20 shadow-sm ${salesView === 'historial' ? 'opacity-90 overflow-hidden' : ''}`}>
            {salesView === 'historial' && (
              <View style={{ position: 'absolute', right: -15, top: 15, backgroundColor: '#F1F5F9', paddingVertical: 4, paddingHorizontal: 25, transform: [{ rotate: '45deg' }] }}>
                <Text style={{ fontSize: 9, fontFamily: 'InterBold', color: '#64748B', textAlign: 'center' }}>PAGADA</Text>
              </View>
            )}
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 mr-4">
                {salesView === 'activas' ? (
                  <Text className="text-[10px] font-InterExtraBold text-emerald-600 uppercase mb-1 tracking-wider">PENDIENTE</Text>
                ) : (
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" className="mr-1" />
                    <Text className="text-[10px] font-InterExtraBold text-slate-400 uppercase tracking-wider">{acc.closedAt || 'Desconocido'}</Text>
                  </View>
                )}
                <Text className="text-xl font-InterBold text-lora-text" numberOfLines={salesView === 'activas' ? 2 : 1}>{acc.name || 'Sin nombre'}</Text>
                <Text className="text-sm font-InterMedium text-slate-500 mt-1" numberOfLines={salesView === 'activas' ? 2 : 1}>{acc.summary || 'Sin productos'}</Text>
              </View>
              <Text className={`text-2xl font-InterExtraBold ${salesView === 'activas' ? 'text-lora-primary' : 'text-slate-500'}`}>{formatCOP(acc.total || 0)}</Text>
            </View>
            
            {salesView === 'activas' && (
              <View className="flex-row items-center gap-3 mt-4">
                <Pressable 
                  onPress={() => onOpenDetails(acc)}
                  className="flex-1 bg-lora-primary py-3 rounded-2xl flex-row items-center justify-center shadow-sm"
                >
                  <Ionicons name="add-circle" size={18} color="white" className="mr-2" />
                  <Text className="font-InterBold text-white">Detalles/Agregar</Text>
                </Pressable>
                <Pressable 
                  onPress={() => onOpenCloseConfirm(acc)}
                  style={{ backgroundColor: '#FEE2E2', paddingHorizontal: 16, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 1, borderColor: '#FECACA' }}
                >
                  <Ionicons name="close-circle-outline" size={20} color="#EF4444" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#EF4444', fontFamily: 'InterBold', fontSize: 13 }}>Cerrar</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))
      ) : (
        <View className="items-center justify-center py-20 bg-white/40 rounded-[40px] border border-dashed border-slate-300">
          <Ionicons name={salesView === 'activas' ? "receipt-outline" : "time-outline"} size={48} color="#CBD5E1" className="mb-4" />
          <Text className="text-lg font-InterBold text-slate-400">No hay cuentas {salesView === 'activas' ? 'activas' : 'en el historial'}</Text>
          <Text className="text-sm font-InterMedium text-slate-300 mt-1">Presiona "Abrir Nueva Cuenta" para empezar</Text>
        </View>
      )}
    </View>
  );
};

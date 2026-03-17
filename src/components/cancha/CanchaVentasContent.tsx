import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '@core/helper/validators';
import { CanchaAccount } from '@core/database/mockDb';

interface CanchaVentasContentProps {
  accounts: CanchaAccount[];
  onOpenDetails: (acc: CanchaAccount) => void;
  onOpenCloseConfirm: (acc: CanchaAccount) => void;
  onOpenHistory: () => void;
  historyCount: number;
  primaryColor: string;
}

export const CanchaVentasContent: React.FC<CanchaVentasContentProps> = ({
  accounts,
  onOpenDetails,
  onOpenCloseConfirm,
  onOpenHistory,
  historyCount,
  primaryColor
}) => {
  return (
    <View className="px-6 mt-4">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center bg-slate-100 p-1.5 rounded-2xl border border-lora-border/10">
          <View className="px-4 py-2 rounded-xl flex-row items-center bg-white shadow-sm">
            <Ionicons name="list" size={16} color={primaryColor} className="mr-2" />
            <Text className="font-InterBold text-xs text-lora-text">Activas</Text>
            {accounts.length > 0 && (
              <View className="ml-2 bg-lora-primary px-1.5 py-0.5 rounded-md">
                <Text className="text-[10px] text-white font-InterBold">{accounts.length}</Text>
              </View>
            )}
          </View>
          
          <Pressable 
            onPress={onOpenHistory}
            className="px-4 py-2 rounded-xl flex-row items-center active:bg-slate-200"
          >
            <Ionicons name="time" size={16} color="#94A3B8" className="mr-2" />
            <Text className="font-InterBold text-xs text-slate-500">Ver Historial</Text>
          </Pressable>
        </View>
        
        <Text className="text-xs font-InterBold text-lora-primary bg-emerald-50 px-3 py-1.5 rounded-xl uppercase">
          {accounts.length} Pendientes
        </Text>
      </View>

      {accounts.length > 0 ? (
        accounts.map(acc => (
          <View key={acc.id || Math.random()} className="bg-white rounded-[28px] p-5 mb-4 border border-lora-border/20 shadow-sm">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 mr-4">
                <Text className="text-[10px] font-InterExtraBold text-emerald-600 uppercase mb-1 tracking-wider">PENDIENTE</Text>
                <Text className="text-xl font-InterBold text-lora-text" numberOfLines={2}>{acc.name || 'Sin nombre'}</Text>
                <Text className="text-sm font-InterMedium text-slate-500 mt-1" numberOfLines={2}>{acc.summary || 'Sin productos'}</Text>
              </View>
              <Text className="text-2xl font-InterExtraBold text-lora-primary">{formatCOP(acc.total || 0)}</Text>
            </View>
            
            <View className="flex-row items-center gap-3 mt-4">
              <Pressable 
                onPress={() => onOpenDetails(acc)}
                className="flex-1 bg-lora-primary py-3 rounded-2xl flex-row items-center justify-center shadow-sm active:opacity-80"
              >
                <Ionicons name="add-circle" size={18} color="white" className="mr-2" />
                <Text className="font-InterBold text-white">Detalles/Agregar</Text>
              </Pressable>
              <Pressable 
                onPress={() => onOpenCloseConfirm(acc)}
                style={{ backgroundColor: '#FEE2E2', paddingHorizontal: 16, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 1, borderColor: '#FECACA' }}
                className="active:opacity-80"
              >
                <Ionicons name="close-circle-outline" size={20} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={{ color: '#EF4444', fontFamily: 'InterBold', fontSize: 13 }}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        ))
      ) : (
        <View className="items-center justify-center py-20 bg-white/40 rounded-[40px] border border-dashed border-slate-300">
          <Ionicons name="receipt-outline" size={48} color="#CBD5E1" className="mb-4" />
          <Text className="text-lg font-InterBold text-slate-400">No hay cuentas activas</Text>
          <Text className="text-sm font-InterMedium text-slate-300 mt-1">Presiona "Abrir Nueva Cuenta" para empezar</Text>
        </View>
      )}
    </View>
  );
};

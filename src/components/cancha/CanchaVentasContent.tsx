import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  return (
    <View className="px-6 mt-4">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center flex-1 mr-2">
          <Text 
            numberOfLines={1} 
            adjustsFontSizeToFit
            className="text-2xl font-InterBold text-lora-text mr-2"
          >
            Órdenes Activas
          </Text>
          {accounts.length > 0 && (
            <View className="bg-lora-primary px-2 py-1 rounded-full shadow-sm min-w-[24px] items-center">
              <Text className="text-[10px] text-white font-InterBold">{accounts.length}</Text>
            </View>
          )}
        </View>

        <Pressable 
          onPress={onOpenHistory}
          className={`flex-row items-center bg-white ${isSmallScreen ? 'p-3' : 'px-4 py-2.5'} rounded-2xl border border-lora-border/20 shadow-sm active:opacity-80`}
        >
          <Ionicons name="time" size={18} color={primaryColor} style={!isSmallScreen ? { marginRight: 8 } : {}} />
          {!isSmallScreen && (
            <Text className="font-InterBold text-sm text-lora-text">Ver Historial</Text>
          )}
        </Pressable>
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
            
            <View className="flex-row items-center gap-2 mt-4">
              <Pressable 
                onPress={() => onOpenDetails(acc)}
                className="flex-[1.5] bg-lora-primary py-3 rounded-2xl flex-row items-center justify-center shadow-sm active:opacity-80"
              >
                <Ionicons name="add-circle" size={18} color="white" style={{ marginRight: isSmallScreen ? 4 : 8 }} />
                <Text 
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  className="font-InterBold text-white"
                >
                  {isSmallScreen ? 'Detalles' : 'Detalles/Agregar'}
                </Text>
              </Pressable>
              <Pressable 
                onPress={() => onOpenCloseConfirm(acc)}
                style={{ backgroundColor: '#FEE2E2', paddingHorizontal: isSmallScreen ? 8 : 16, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 1, borderColor: '#FECACA' }}
                className="flex-1 active:opacity-80"
              >
                <Ionicons name="close-circle-outline" size={18} color="#EF4444" style={{ marginRight: isSmallScreen ? 4 : 6 }} />
                <Text 
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ color: '#EF4444', fontFamily: 'InterBold', fontSize: 13 }}
                >
                  Cerrar
                </Text>
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

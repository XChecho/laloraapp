import React from 'react';
import { View, Text } from 'react-native';

interface Closure {
  id: string;
  date: string;
  income: string;
  expenses: string;
  balance: string;
}

const mockClosures: Closure[] = [
  { id: '1', date: 'Lunes 14 Oct', income: '$1,450,000', expenses: '$320,000', balance: '$1,130,000' },
  { id: '2', date: 'Martes 15 Oct', income: '$980,000', expenses: '$150,000', balance: '$830,000' },
  { id: '3', date: 'Miércoles 16 Oct', income: '$1,200,000', expenses: '$200,000', balance: '$1,000,000' },
];

export const RecentClosuresSection = () => {
  return (
    <View className="bg-white rounded-[32px] p-6 mb-4 shadow-sm border border-lora-border/30">
      <Text className="text-xl font-InterBold text-lora-text mb-6">Cierres Contables Recientes</Text>
      
      {mockClosures.map((item) => (
        <View key={item.id} className="bg-lora-bg/40 border border-lora-border/50 rounded-[24px] p-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-InterBold text-lora-text">{item.date}</Text>
            <View className="bg-emerald-100 px-2 py-1 rounded-lg">
              <Text className="text-[10px] font-InterBold text-emerald-600 uppercase">Cerrado</Text>
            </View>
          </View>
          
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-xs font-InterMedium text-lora-text-muted">Total Ingresos:</Text>
              <Text className="text-xs font-InterBold text-lora-text">{item.income}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs font-InterMedium text-lora-text-muted">Total Gastos:</Text>
              <Text className="text-xs font-InterBold text-red-400">{item.expenses}</Text>
            </View>
            
            <View className="h-[1px] bg-lora-border/50 my-2" />
            
            <View className="flex-row justify-between">
              <Text className="text-sm font-InterBold text-lora-text">Balance:</Text>
              <Text className="text-sm font-InterBold text-emerald-600">{item.balance}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

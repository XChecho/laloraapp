import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

const ReportsScreen = () => {
  const router = useRouter();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseType, setExpenseType] = useState('materia_prima');
  const [amount, setAmount] = useState('');
  const [showByPercentage, setShowByPercentage] = useState(true);

  // Custom Label Component for X-axis
  const renderXAxisLabel = (label: string, date: string) => (
    <View className="items-center" style={{ width: 60, marginLeft: -10, marginTop: 12 }}>
      <Text className="text-[10px] font-InterBold text-lora-text">{label}</Text>
      <Text className="text-[8px] font-InterMedium text-lora-text-muted">{date}</Text>
    </View>
  );

  // Mock data for Charts
  const salesVsExpensesData = [
    { value: 1200000, labelComponent: () => renderXAxisLabel('L', '16-03'), dataPointText: '$1.2M' },
    { value: 1500000, labelComponent: () => renderXAxisLabel('M', '17-03'), dataPointText: '$1.5M' },
    { value: 1100000, labelComponent: () => renderXAxisLabel('M', '18-03'), dataPointText: '$1.1M' },
    { value: 1800000, labelComponent: () => renderXAxisLabel('J', '19-03'), dataPointText: '$1.8M' },
    { value: 2100000, labelComponent: () => renderXAxisLabel('V', '20-03'), dataPointText: '$2.1M' },
    { value: 3500000, labelComponent: () => renderXAxisLabel('S', '21-03'), dataPointText: '$3.5M' },
    { value: 2800000, labelComponent: () => renderXAxisLabel('D', '22-03'), dataPointText: '$2.8M' },
  ];

  const expenseCategories = [
    { value: 40, amount: 1248000, color: '#FB923C', label: 'Materias Primas', text: '40%' },
    { value: 25, amount: 780000, color: '#3B82F6', label: 'Nómina', text: '25%' },
    { value: 20, amount: 624000, color: '#F87171', label: 'Servicios', text: '20%' },
    { value: 15, amount: 468000, color: '#A855F7', label: 'Proveedores', text: '15%' },
  ];

  const lunchVsOthersData = [
    { value: 65, color: '#0A873A', label: 'Almuerzo del día', text: '65%' },
    { value: 35, color: '#D97706', label: 'Otros Platos / Carta', text: '35%' },
  ];

  const hourlyData = [
    { value: 10, label: '12pm' },
    { value: 45, label: '1pm' },
    { value: 85, label: '2pm' },
    { value: 30, label: '3pm' },
    { value: 20, label: '4pm' },
    { value: 60, label: '7pm' },
    { value: 90, label: '8pm' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <SafeAreaView className="flex-1 bg-lora-bg" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-row items-center">
              <Pressable onPress={() => router.back()} className="mr-4">
                <Ionicons name="arrow-back" size={24} color="#1B2332" />
              </Pressable>
              <Text className="text-2xl font-InterBold text-lora-text">Reporte de Caja</Text>
            </View>
            <Pressable 
              onPress={() => setShowExpenseModal(true)}
              className="bg-white border border-lora-border p-2 rounded-xl shadow-sm items-center justify-center"
            >
              <Ionicons name="receipt-outline" size={22} color="#F87171" />
              <Text className="text-[9px] font-InterBold text-red-500 mt-0.5">GASTO</Text>
            </Pressable>
          </View>

          {/* KPI Summary */}
          <View className="flex-row justify-between mb-8">
            <View className="bg-white p-5 rounded-3xl border border-lora-border/30 flex-1 mr-3 shadow-sm">
              <Text className="text-xs font-InterBold text-lora-text-muted mb-1">VENTAS MES</Text>
              <Text className="text-xl font-InterBold text-emerald-600">$12,450,000</Text>
            </View>
            <View className="bg-white p-5 rounded-3xl border border-lora-border/30 flex-1 shadow-sm">
              <Text className="text-xs font-InterBold text-lora-text-muted mb-1">GASTOS MES</Text>
              <Text className="text-xl font-InterBold text-red-500">$3,120,000</Text>
            </View>
          </View>

          {/* Chart 1: Sales vs Expenses */}
          <View className="bg-white p-6 rounded-[32px] border border-lora-border/30 mb-8 shadow-sm">
            <Text className="text-lg font-InterBold text-lora-text mb-6">Ventas Semanales (COP)</Text>
            <LineChart
              data={salesVsExpensesData}
              height={220}
              width={width - 120}
              initialSpacing={30}
              spacing={45}
              color="#0A873A"
              thickness={4}
              startFillColor="rgba(10, 135, 58, 0.3)"
              endFillColor="rgba(10, 135, 58, 0.01)"
              startOpacity={0.9}
              endOpacity={0.2}
              noOfSections={4}
              maxValue={4000000}
              stepValue={1000000}
              yAxisLabelPrefix="$"
              yAxisLabelContainerStyle={{ width: 60 }}
              yAxisTextStyle={{ fontSize: 9, color: '#94A3B8', fontWeight: 'bold' }}
              xAxisLabelTextStyle={{ fontSize: 10, color: '#1B2332', fontWeight: 'bold' }}
              yAxisColor="transparent"
              xAxisColor="#E0E6ED"
              pointerConfig={{
                pointerColor: '#0A873A',
                radius: 6,
                pointerLabelComponent: (items: any) => (
                    <View className="bg-lora-dark p-2 rounded-lg">
                        <Text className="text-white font-InterBold text-xs">{items[0].dataPointText}</Text>
                    </View>
                )
              }}
            />
          </View>

          {/* Chart 2: Expenses by Category */}
          <View className="bg-white p-6 rounded-[32px] border border-lora-border/30 mb-8 shadow-sm">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-lg font-InterBold text-lora-text">Distribución de Gastos</Text>
                <Pressable 
                    onPress={() => setShowByPercentage(!showByPercentage)}
                    className="bg-lora-bg px-3 py-1.5 rounded-lg border border-lora-border/50"
                >
                    <Text className="text-[10px] font-InterBold text-lora-primary uppercase">
                        {showByPercentage ? 'Ver Valores' : 'Ver %'}
                    </Text>
                </Pressable>
            </View>
            <View className="flex-row items-center">
                <PieChart
                    data={expenseCategories}
                    donut
                    radius={80}
                    innerRadius={60}
                    innerCircleColor={'#ffffff'}
                    centerLabelComponent={() => (
                        <View className="items-center">
                            <Text className="text-xs font-InterBold text-lora-text-muted">TOTAL</Text>
                            <Text className="text-sm font-InterBold text-lora-text">$3.1M</Text>
                        </View>
                    )}
                />
                <View className="ml-6 space-y-3 flex-1">
                    {expenseCategories.map(cat => (
                        <View key={cat.label} className="flex-row items-center mb-2">
                            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
                            <View className="flex-1">
                                <Text className="text-[11px] font-InterBold text-lora-text" numberOfLines={1}>{cat.label}</Text>
                                <Text className="text-[10px] font-InterMedium text-lora-text-muted">
                                    {showByPercentage ? cat.text : formatCurrency(cat.amount)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
          </View>

          {/* New Chart: Lunch vs Others */}
          <View className="bg-white p-6 rounded-[32px] border border-lora-border/30 mb-8 shadow-sm">
             <Text className="text-lg font-InterBold text-lora-text mb-6">Almuerzo del día vs Otros</Text>
             <View className="flex-row items-center">
                <PieChart
                    data={lunchVsOthersData}
                    radius={70}
                    innerRadius={40}
                    innerCircleColor="white"
                    showText
                    textColor="white"
                    fontWeight="bold"
                    textSize={10}
                />
                <View className="ml-8 space-y-4 flex-1">
                    {lunchVsOthersData.map(item => (
                        <View key={item.label} className="flex-row items-center">
                            <View className="w-4 h-4 rounded-md mr-3" style={{ backgroundColor: item.color }} />
                            <View>
                                <Text className="text-xs font-InterBold text-lora-text">{item.label}</Text>
                                <Text className="text-[10px] font-InterMedium text-lora-text-muted">{item.text} de ventas totales</Text>
                            </View>
                        </View>
                    ))}
                </View>
             </View>
          </View>

          {/* Chart 3: Hourly Behavior */}
          <View className="bg-white p-6 rounded-[32px] border border-lora-border/30 mb-8 shadow-sm">
            <Text className="text-lg font-InterBold text-lora-text mb-1">Comportamiento por Horas</Text>
            <Text className="text-xs font-InterMedium text-lora-text-muted mb-6">Flujo de pedidos durante el día</Text>
            <BarChart
              data={hourlyData}
              barWidth={22}
              noOfSections={3}
              barBorderRadius={4}
              frontColor="#0A873A"
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="#E0E6ED"
              height={180}
              width={width - 120}
              initialSpacing={10}
            />
          </View>

          {/* Takeout vs Eat-in */}
          <View className="bg-white p-6 rounded-[32px] border border-lora-border/30 mb-10 shadow-sm">
             <Text className="text-lg font-InterBold text-lora-text mb-4">Pedidos: Local vs Llevar</Text>
             <View className="flex-row items-center h-4 rounded-full bg-orange-100 overflow-hidden mb-6">
                <View className="h-full bg-lora-primary" style={{ width: '70%' }} />
                <View className="h-full bg-orange-400" style={{ width: '30%' }} />
             </View>
             <View className="flex-row justify-between">
                <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-lora-primary mr-2" />
                    <Text className="text-xs font-InterBold text-lora-text">Para el Local (70%)</Text>
                </View>
                <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-orange-400 mr-2" />
                    <Text className="text-xs font-InterBold text-lora-text">Para Llevar (30%)</Text>
                </View>
             </View>
          </View>
        </View>
      </ScrollView>

      {/* Expense Modal */}
      <Modal visible={showExpenseModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
           <View className="bg-white rounded-t-[40px] p-8 pb-12">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-8" />
              <Text className="text-2xl font-InterBold text-lora-text mb-8">Registrar Gasto</Text>
              
              <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-3">Tipo de Gasto</Text>
              <View className="flex-row flex-wrap gap-2 mb-8">
                {['Materia Prima', 'Nómina', 'Servicios', 'Proveedores'].map(type => (
                    <Pressable 
                        key={type}
                        onPress={() => setExpenseType(type.toLowerCase())}
                        className={`px-4 py-2.5 rounded-2xl border ${expenseType === type.toLowerCase() ? 'bg-lora-primary border-lora-primary' : 'border-lora-border'}`}
                    >
                        <Text className={`text-xs font-InterBold ${expenseType === type.toLowerCase() ? 'text-white' : 'text-slate-500'}`}>{type}</Text>
                    </Pressable>
                ))}
              </View>

              <Text className="text-xs font-InterBold text-lora-text-muted uppercase mb-3">Monto del Gasto</Text>
              <View className="flex-row items-center bg-lora-bg rounded-2xl p-4 mb-8">
                <Text className="text-2xl font-InterBold text-lora-text mr-2">$</Text>
                <TextInput 
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    keyboardType="numeric"
                    className="flex-1 text-2xl font-InterBold text-lora-text"
                />
              </View>

              <View className="flex-row gap-4">
                  <Pressable 
                    onPress={() => setShowExpenseModal(false)}
                    className="flex-1 py-4 bg-slate-100 rounded-2xl items-center"
                  >
                      <Text className="font-InterBold text-slate-500">Cancelar</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => setShowExpenseModal(false)}
                    className="flex-[2] py-4 bg-lora-primary rounded-2xl items-center shadow-lg"
                  >
                      <Text className="font-InterBold text-white">Registrar Gasto Silencioso</Text>
                  </Pressable>
              </View>
           </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReportsScreen;

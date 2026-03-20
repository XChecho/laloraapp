import { MOCK_DB, Table } from '@core/database/mockDb';
import { formatCOP } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useModalStore } from '@store/useModalStore';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@store/admin/useAdminStore';
import React, { useRef, useState, useMemo } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@src/components/ui/ScreenHeader';

const TableCard = ({ table }: { table: Table }) => {
  const isOccupied = table.status === 'OCUPADA';
  const router = useRouter();
  const openModal = useModalStore(state => state.openModal);

  const handleCloseTable = () => {
    openModal('CONFIRMATION', {
      title: 'Cerrar Mesa',
      message: `¿Estás seguro de que deseas cerrar la cuenta de la ${table.name} por un valor de ${formatCOP(table.total)}?`,
      onConfirm: () => Alert.alert("Éxito", "Mesa cerrada correctamente.")
    });
  };

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
            <Pressable
              className="flex-1 bg-lora-primary py-3 rounded-xl items-center justify-center active:opacity-70"
              onPress={handleCloseTable}
            >
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

const CashierScreen = () => {
  const { zones, tables: adminTables } = useAdminStore();
  const [activeZoneId, setActiveZoneId] = useState<string>(zones[0]?.id || '1');
  const [isExpanded, setIsExpanded] = useState(true);
  const openModal = useModalStore(state => state.openModal);

  // Animation values
  const buttonsHeight = useSharedValue(1); // 1 = expanded, 0 = collapsed
  const scrollOffset = useRef(0);

  const animatedButtonsStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(buttonsHeight.value * 55, { duration: 300 }), // Reduced from 70
      opacity: withTiming(buttonsHeight.value, { duration: 250 }),
      overflow: 'hidden',
      marginTop: withTiming(buttonsHeight.value * 12, { duration: 300 }),
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(buttonsHeight.value === 1 ? '0deg' : '180deg', { duration: 300 }) }],
    };
  });

  const toggleExpand = () => {
    const newValue = buttonsHeight.value === 1 ? 0 : 1;
    buttonsHeight.value = newValue;
    setIsExpanded(newValue === 1);
  };

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > scrollOffset.current ? 'down' : 'up';

    // Auto-collapse only on scroll down
    if (direction === 'down' && currentOffset > 50 && buttonsHeight.value === 1) {
      buttonsHeight.value = 0;
      setIsExpanded(false);
    }
    // We don't auto-expand on scroll up, per request
    scrollOffset.current = currentOffset;
  };

  const filteredTables = useMemo(() => {
    const activeZone = zones.find(z => z.id === activeZoneId);
    if (!activeZone) return [];
    
    return MOCK_DB.tables.filter(t => t.zone === activeZone.dbKey);
  }, [activeZoneId, zones]);

  const totalSales = MOCK_DB.tables.reduce((acc, t) => acc + t.total, 0);
  const occupiedCount = MOCK_DB.tables.filter(t => t.status === 'OCUPADA').length;
  const freeCount = MOCK_DB.tables.filter(t => t.status === 'LIBRE').length;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-gray-100">
      <ScreenHeader 
        title="Gestión de Caja" 
        subtitle="Turno Tarde • Juan Pérez" 
      />
      {/* Zone Tabs */}
      <View className="bg-white px-5 flex-row border-b border-gray-200">
        {zones.map((zone) => (
          <Pressable
            key={zone.id}
            onPress={() => setActiveZoneId(zone.id)}
            className={`py-3 mr-6 border-b-4 ${activeZoneId === zone.id ? 'border-lora-primary' : 'border-transparent'}`}
          >
            <Text className={`font-InterBold ${activeZoneId === zone.id ? 'text-lora-primary' : 'text-gray-400'}`}>
              {zone.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Table Grid */}
      <FlatList
        data={filteredTables}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TableCard table={item} />}
        contentContainerStyle={{ 
          paddingHorizontal: 16, 
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 150 : 80 
        }}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Footer Info Fixed with collapsible buttons */}
      <View className={`bg-white border-t border-gray-200 p-4 absolute bottom-0 left-0 right-0 ${Platform.OS === 'ios' ? 'pb-28' : 'pb-4'}`}>
        <View className="flex-row justify-between items-center">
          <View className="flex-column gap-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <Text className="text-xs font-InterBold text-gray-600">{occupiedCount} <Text className="hidden sm:inline">Ocupadas</Text></Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-teal-500 mr-2" />
              <Text className="text-xs font-InterBold text-gray-600">{freeCount} <Text className="hidden sm:inline">Libres</Text></Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="bg-lora-primary/5 px-4 py-2 rounded-full items-end">
              <Text className="text-[9px] font-InterBold text-gray-400 uppercase leading-tight">Venta del día</Text>
              <Text className="text-lg font-InterBold text-lora-primary leading-tight">{formatCOP(totalSales)}</Text>
            </View>

            <Pressable
              onPress={toggleExpand}
              className="bg-gray-100 p-2 rounded-full border border-gray-200"
            >
              <Animated.View style={animatedIconStyle}>
                <Ionicons name="chevron-down" size={20} color="#64748b" />
              </Animated.View>
            </Pressable>
          </View>
        </View>

        <Animated.View style={animatedButtonsStyle} className="flex-row gap-3">
          <Pressable
            onPress={() => openModal('CASHIER', { type: 'ABRIR' })}
            className="flex-1 bg-white border border-lora-primary py-2 rounded-xl items-center justify-center active:opacity-70"
          >
            <Text className={`text-lora-primary font-InterBold ${Platform.OS === 'ios' ? 'text-base' : 'text-sm'}`}>Abrir Caja</Text>
          </Pressable>
          <Pressable
            onPress={() => openModal('CASHIER', { type: 'CERRAR' })}
            className="flex-1 bg-lora-primary py-2 rounded-xl items-center justify-center active:opacity-70"
          >
            <Text className={`text-white font-InterBold ${Platform.OS === 'ios' ? 'text-base' : 'text-sm'}`}>Cerrar Caja</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default CashierScreen;

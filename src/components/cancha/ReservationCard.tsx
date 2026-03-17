import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReservationStatus } from '@core/database/mockDb';

interface ReservationCardProps {
  id: string;
  customerName: string;
  startTime: string;
  endTime: string;
  phone?: string;
  initialStatus: ReservationStatus;
  canStart?: boolean;
  onStatusChange?: (id: string, newStatus: ReservationStatus) => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onNewReservationRequested?: (slot: string) => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  id,
  customerName,
  startTime,
  endTime,
  phone = '3001234567',
  initialStatus,
  canStart = true,
  onStatusChange,
  onEdit,
  onCancel,
  onNewReservationRequested,
}) => {
  const isAvailable = customerName === 'Espacio Disponible';
  const [status, setStatus] = useState<ReservationStatus>(initialStatus);
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  useEffect(() => {
    let interval: any;
    if (status === 'EN CURSO' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  const formatTimeLeft = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const formatToAMPM = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getStatusColor = () => {
    if (isAvailable) return { bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-dashed border-slate-200' };
    switch (status) {
      case 'PENDIENTE': return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' };
      case 'CONFIRMADA': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
      case 'CANCELADA': return { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100' };
      case 'EN CURSO': return { bg: 'bg-lora-primary/10', text: 'text-lora-primary', border: 'border-lora-primary/20' };
      case 'FINALIZADA': return { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
    }
  };

  const statusStyle = getStatusColor();

  const handleMainAction = () => {
    if (status === 'PENDIENTE') {
      setStatus('CONFIRMADA');
      onStatusChange?.(id, 'CONFIRMADA');
    } else if (status === 'CONFIRMADA') {
      if (!canStart) {
        Alert.alert('No se puede iniciar', 'Aun hay una reserva en curso o debes finalizar la anterior.');
        return;
      }
      setStatus('EN CURSO');
      onStatusChange?.(id, 'EN CURSO');
    }
  };

  const handleFinish = () => {
    setFinishModalVisible(false);
    setStatus('FINALIZADA');
    onStatusChange?.(id, 'FINALIZADA');
  };

  const handleConfirmCancel = () => {
    setCancelModalVisible(false);
    setStatus('CANCELADA');
    onStatusChange?.(id, 'CANCELADA');
    onCancel?.();
    
    // Ask for new reservation
    setTimeout(() => {
      Alert.alert(
        'Reserva Cancelada',
        '¿Deseas generar una nueva reserva en esta misma franja horaria?',
        [
          { text: 'No, gracias', style: 'cancel' },
          { text: 'Sí, crear', onPress: () => onNewReservationRequested?.(`${startTime} - ${endTime}`) }
        ]
      );
    }, 500);
  };

  const handleCall = () => {
    if (isAvailable) return;
    const url = `tel:${phone}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Tu dispositivo no soporta llamadas telefónicas.');
      }
    });
  };

  return (
    <View className={`bg-white rounded-[28px] p-5 mb-4 border ${statusStyle.border} shadow-sm ${isAvailable ? 'bg-slate-50/30' : ''}`}>
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl bg-lora-bg items-center justify-center mr-3">
            <Ionicons name="calendar-outline" size={20} color={isAvailable ? "#CBD5E1" : "#0A873A"} />
          </View>
          <View className="flex-1">
            <Text className={`text-lg font-InterBold ${isAvailable ? 'text-slate-400' : 'text-lora-text'}`} numberOfLines={1}>{customerName}</Text>
            <Text className="text-xs font-InterMedium text-lora-text-muted">
              {formatToAMPM(startTime)} - {formatToAMPM(endTime)}
            </Text>
          </View>
        </View>
        {!isAvailable && (
          <View className={`${statusStyle.bg} px-3 py-1 rounded-full`}>
            <Text className={`text-[10px] font-InterExtraBold ${statusStyle.text} uppercase`}>
              {status}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center gap-2">
        {status === 'EN CURSO' ? (
          <Pressable 
            onPress={() => setFinishModalVisible(true)}
            className="flex-1 bg-lora-primary py-3 rounded-2xl items-center flex-row justify-center"
          >
            <Ionicons name="timer-outline" size={18} color="white" className="mr-2" />
            <Text className="text-sm font-InterBold text-white">Quedan: {formatTimeLeft(timeLeft)}</Text>
          </Pressable>
        ) : (
          <Pressable 
            onPress={isAvailable ? () => onNewReservationRequested?.(`${startTime} - ${endTime}`) : handleMainAction}
            className={`flex-1 py-3 rounded-2xl items-center justify-center ${
              (status === 'CANCELADA' || status === 'FINALIZADA') ? 'bg-slate-100 opacity-50' : 'bg-lora-primary/10'
            } ${isAvailable ? 'bg-emerald-50' : ''}`}
            disabled={status === 'CANCELADA' || status === 'FINALIZADA'}
          >
            <Text className={`font-InterBold ${(status === 'CANCELADA' || status === 'FINALIZADA') ? 'text-slate-400' : 'text-lora-primary'} ${isAvailable ? 'text-emerald-600' : ''}`}>
              {isAvailable ? 'Reservar Espacio' : status === 'PENDIENTE' ? 'Verificar' : status === 'FINALIZADA' ? 'Finalizada' : 'Check-in'}
            </Text>
          </Pressable>
        )}

        {!isAvailable && (
          <Pressable 
            onPress={handleCall}
            className="w-11 h-11 bg-emerald-50 rounded-2xl items-center justify-center border border-emerald-100/30"
          >
            <Ionicons name="call-outline" size={18} color="#059669" />
          </Pressable>
        )}

        <Pressable 
          onPress={onEdit}
          className="w-11 h-11 bg-slate-50 rounded-2xl items-center justify-center border border-lora-border/10"
          disabled={status === 'CANCELADA' || status === 'FINALIZADA' || isAvailable}
        >
          <Ionicons name="pencil-outline" size={18} color={isAvailable ? "#CBD5E1" : "#64748B"} />
        </Pressable>

        <Pressable 
          onPress={() => status !== 'CANCELADA' && status !== 'FINALIZADA' && setCancelModalVisible(true)}
          className={`w-11 h-11 rounded-2xl items-center justify-center border ${
            (status === 'CANCELADA' || status === 'FINALIZADA' || isAvailable) ? 'bg-slate-100 border-slate-200' : 'bg-red-50 border-red-50'
          }`}
          disabled={status === 'CANCELADA' || status === 'FINALIZADA' || isAvailable}
        >
          <Ionicons name="close-outline" size={20} color={(status === 'CANCELADA' || status === 'FINALIZADA' || isAvailable) ? "#CBD5E1" : "#EF4444"} />
        </Pressable>
      </View>

      {/* MODAL TERMINAR */}
      <Modal visible={finishModalVisible} transparent animationType="fade" onRequestClose={() => setFinishModalVisible(false)}>
        <Pressable className="flex-1 bg-black/40 justify-center items-center px-10" onPress={() => setFinishModalVisible(false)}>
          <Pressable className="bg-white rounded-[32px] p-8 w-full shadow-2xl" onPress={(e) => e.stopPropagation()}>
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-lora-bg rounded-full items-center justify-center mb-4">
                <Ionicons name="flag-outline" size={32} color="#0A873A" />
              </View>
              <Text className="text-xl font-InterBold text-lora-text text-center">¿Terminar reserva?</Text>
              <Text className="text-sm font-InterMedium text-lora-text-muted text-center mt-2">
                ¿Estás seguro que deseas finalizar el tiempo de juego de {customerName}?
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Pressable onPress={() => setFinishModalVisible(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl items-center">
                <Text className="font-InterBold text-slate-500">Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleFinish} className="flex-1 py-4 bg-lora-primary rounded-2xl items-center shadow-sm">
                <Text className="font-InterBold text-white">Aceptar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODAL CANCELAR */}
      <Modal visible={cancelModalVisible} transparent animationType="fade" onRequestClose={() => setCancelModalVisible(false)}>
        <Pressable className="flex-1 bg-black/40 justify-center items-center px-10" onPress={() => setCancelModalVisible(false)}>
          <Pressable className="bg-white rounded-[32px] p-8 w-full shadow-2xl" onPress={(e) => e.stopPropagation()}>
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="close-circle-outline" size={32} color="#EF4444" />
              </View>
              <Text className="text-xl font-InterBold text-lora-text text-center">¿Cancelar reserva?</Text>
              <Text className="text-sm font-InterMedium text-lora-text-muted text-center mt-2">
                Esta acción no se puede deshacer. Se liberará el espacio de {formatToAMPM(startTime)}.
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Pressable onPress={() => setCancelModalVisible(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl items-center">
                <Text className="font-InterBold text-slate-500">Volver</Text>
              </Pressable>
              <Pressable onPress={handleConfirmCancel} className="flex-1 py-4 bg-red-500 rounded-2xl items-center shadow-sm">
                <Text className="font-InterBold text-white">Cancelar Reserva</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMainStore, Product, MeatDoneness, meatDonenessOptions } from '@/store/useMainStore';

interface WizardData {
  sopa?: Product;
  protein?: Product;
  bebida?: Product;
}

export default function WizardScreen() {
  const router = useRouter();
  const { products, addItemToOrder, currentTable } = useMainStore();
  
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [showDonenessModal, setShowDonenessModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedDoneness, setSelectedDoneness] = useState<MeatDoneness>('medium');
  const [pendingProtein, setPendingProtein] = useState<Product | null>(null);

  const sopas = products.filter(p => p.categoryId === 'almuerzo' && p.name.toLowerCase().includes('sancocho'));
  const proteins = products.filter(p => ['res', 'pollo', 'cerdo', 'pescados'].includes(p.categoryId));
  const bebidas = products.filter(p => p.categoryId === 'bebidas');

  const handleSopaSelect = (product: Product) => {
    setWizardData({ ...wizardData, sopa: product });
    setStep(2);
  };

  const handleProteinSelect = (product: Product) => {
    if (product.requiresMeatDoneness || product.protein === 'res') {
      setPendingProtein(product);
      setShowDonenessModal(true);
    } else {
      setWizardData({ ...wizardData, protein: product });
      setStep(3);
    }
  };

  const handleDonenessConfirm = () => {
    setShowDonenessModal(false);
    if (pendingProtein) {
      setWizardData({ 
        ...wizardData, 
        protein: { 
          ...pendingProtein, 
          requiresMeatDoneness: true 
        } as Product 
      });
      setStep(3);
    }
  };

  const handleBebidaSelect = (product: Product) => {
    setWizardData({ ...wizardData, bebida: product });
    setShowNotesModal(true);
  };

  const handleFinishOrder = () => {
    if (!wizardData.sopa || !wizardData.protein || !wizardData.bebida) return;

    const almuerzoProduct = products.find(p => p.categoryId === 'almuerzo');
    
    if (almuerzoProduct) {
      const notesText = `Sopa: ${wizardData.sopa.name}, Proteína: ${wizardData.protein.name}${wizardData.protein.requiresMeatDoneness ? ` (${meatDonenessOptions.find(d => d.value === selectedDoneness)?.label})` : ''}, Bebida: ${wizardData.bebida.name}${notes ? ` - Nota: ${notes}` : ''}`;
      
      addItemToOrder(
        almuerzoProduct,
        1,
        notesText,
        wizardData.protein.requiresMeatDoneness ? selectedDoneness : undefined
      );
    }

    setShowNotesModal(false);
    setNotes('');
    router.push('/waiter/current');
  };

  const steps = [
    { num: 1, label: 'Sopa' },
    { num: 2, label: 'Proteína' },
    { num: 3, label: 'Bebida' },
  ];

  const renderStepIndicator = () => (
    <View className="flex-row justify-center items-center mb-6 px-4">
      {steps.map((s, index) => (
        <React.Fragment key={s.num}>
          <View className="items-center">
            <View className={`w-10 h-10 rounded-full items-center justify-center ${
              step >= s.num ? 'bg-[#059432]' : 'bg-gray-300'
            }`}>
              <Text className={`text-lg font-bold ${step >= s.num ? 'text-white' : 'text-gray-600'}`}>
                {s.num}
              </Text>
            </View>
            <Text className={`text-sm mt-1 ${step >= s.num ? 'text-[#059432] font-semibold' : 'text-gray-500'}`}>
              {s.label}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View className={`h-1 w-12 mx-2 ${step > s.num ? 'bg-[#059432]' : 'bg-gray-300'}`} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text className="text-xl font-bold text-gray-800 mb-4">Selecciona la sopa</Text>
            <TouchableOpacity
              onPress={() => handleSopaSelect({ id: 'sopa1', name: 'Sopa del día', price: 0, categoryId: 'almuerzo', available: true } as Product)}
              className="bg-white rounded-xl p-4 mb-3 shadow"
            >
              <Text className="text-lg font-semibold">Sopa del día</Text>
              <Text className="text-[#059432]">Incluida</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <Text className="text-xl font-bold text-gray-800 mb-4">Selecciona la proteína</Text>
            {proteins.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => handleProteinSelect(product)}
                className="bg-white rounded-xl p-4 mb-3 shadow"
              >
                <Text className="text-lg font-semibold">{product.name}</Text>
                <Text className="text-[#059432] font-bold">
                  ${product.price.toLocaleString('es-CO')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 3:
        return (
          <View>
            <Text className="text-xl font-bold text-gray-800 mb-4">Selecciona la bebida</Text>
            {bebidas.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => handleBebidaSelect(product)}
                className="bg-white rounded-xl p-4 mb-3 shadow"
              >
                <Text className="text-lg font-semibold">{product.name}</Text>
                <Text className="text-[#059432] font-bold">
                  ${product.price.toLocaleString('es-CO')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#059432] px-4 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-2">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Almuerzo</Text>
        <Text className="text-white/80">Configura tu almuerzo</Text>
      </View>

      {renderStepIndicator()}

      <ScrollView className="flex-1 p-4">
        {renderStepContent()}
      </ScrollView>

      <Modal
        visible={showDonenessModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDonenessModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Punto de carne
              </Text>
              <TouchableOpacity onPress={() => setShowDonenessModal(false)}>
                <MaterialIcons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="text-lg font-semibold text-gray-700 mb-4">
              Selecciona cómo quieres la carne
            </Text>

            <View className="space-y-3 mb-6">
              {meatDonenessOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedDoneness(option.value)}
                  className={`p-4 rounded-xl border-2 ${
                    selectedDoneness === option.value
                      ? 'border-[#059432] bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Text className={`text-lg font-semibold ${
                    selectedDoneness === option.value ? 'text-[#059432]' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleDonenessConfirm}
              className="bg-[#059432] py-4 rounded-xl"
            >
              <Text className="text-white text-xl font-bold text-center">
                Continuar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNotesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Resumen del almuerzo
              </Text>
              <TouchableOpacity onPress={() => setShowNotesModal(false)}>
                <MaterialIcons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <View className="bg-gray-100 rounded-xl p-4 mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Sopa:</Text>
                <Text className="font-semibold">{wizardData.sopa?.name}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Proteína:</Text>
                <Text className="font-semibold">
                  {wizardData.protein?.name}
                  {wizardData.protein?.requiresMeatDoneness && ` (${meatDonenessOptions.find(d => d.value === selectedDoneness)?.label})`}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Bebida:</Text>
                <Text className="font-semibold">{wizardData.bebida?.name}</Text>
              </View>
              <View className="border-t border-gray-300 mt-2 pt-2 flex-row justify-between">
                <Text className="text-gray-600 font-bold">Total:</Text>
                <Text className="font-bold text-[#059432]">
                  ${wizardData.protein?.price.toLocaleString('es-CO')}
                </Text>
              </View>
            </View>

            <Text className="text-lg font-semibold text-gray-700 mb-3">
              Notas especiales (opcional)
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Ej: Sin cebolla, extra salsa, etc."
              multiline
              numberOfLines={3}
              className="bg-gray-100 p-4 rounded-xl text-lg mb-6"
            />

            <TouchableOpacity
              onPress={handleFinishOrder}
              className="bg-[#059432] py-4 rounded-xl"
            >
              <Text className="text-white text-xl font-bold text-center">
                Agregar al pedido
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

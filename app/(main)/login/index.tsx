import { isValidEmail } from '@core/helper/validators';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import logoLoraApp from '@assets/images/logo/logoLoraApp.png';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = isValidEmail(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/private/tabs/waitres' as any);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-lora-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        {/* Header / Logo Area */}
        <View className="items-center mb-8">
          <View className="w-28 h-28 rounded-full items-center justify-center mb-4 shadow-lg overflow-hidden">
            <Image
              source={logoLoraApp}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
          <Text className="text-2xl font-InterBold text-lora-text mb-1">La Lora POS</Text>
          <Text className="text-sm font-InterMedium text-lora-primary">Gestión de Cancha y Restaurante</Text>
        </View>

        {/* Login Card */}
        <View className="bg-white rounded-[32px] p-8 pb-10 shadow-sm border border-lora-border/50">
          <Text className="text-3xl font-InterBold text-center text-lora-text mb-8">Iniciar Sesión</Text>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-xs font-InterBold text-lora-text tracking-wider mb-2 uppercase">Usuario o Correo</Text>
            <View className={`flex-row items-center border rounded-2xl px-4 h-14 bg-white ${email.length > 0 && !isEmailValid ? 'border-red-500' : 'border-lora-border focus:border-lora-primary'}`}>
              <Ionicons name="person" size={20} color={email.length > 0 && !isEmailValid ? "#EF4444" : "#94A3B8"} className="mr-3" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="nombre@lalora.com"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 font-InterMedium text-lora-text text-base"
              />
            </View>
            {email.length > 0 && !isEmailValid && (
              <Text className="text-red-500 text-xs mt-1 ml-1 font-InterMedium">
                El correo ingresado no es válido
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-xs font-InterBold text-lora-text tracking-wider mb-2 uppercase">Contraseña</Text>
            <View className="flex-row items-center border border-lora-border rounded-2xl px-4 h-14 bg-white focus:border-lora-primary">
              <Ionicons name="lock-closed" size={20} color="#94A3B8" className="mr-3" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                className="flex-1 font-InterMedium text-lora-text text-lg tracking-widest"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2 active:opacity-70">
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#94A3B8" />
              </Pressable>
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            className={`h-14 rounded-2xl items-center justify-center shadow-sm active:opacity-70 ${!isFormValid || isLoading ? 'bg-gray-400' : 'bg-lora-primary'}`}
            disabled={!isFormValid || isLoading}
            onPress={handleLogin}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text className="text-white text-lg font-InterBold">Ingresar</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-lora-border" />
            <Text className="mx-4 text-xs font-InterMedium text-lora-text-muted">O continuar con</Text>
            <View className="flex-1 h-[1px] bg-lora-border" />
          </View>

          {/* Social Logins */}
          <View className="flex-row space-x-4 mb-2">
            <Pressable className="flex-1 flex-row items-center justify-center h-14 rounded-2xl border border-lora-border bg-white active:opacity-70">
              <Ionicons name="logo-google" size={20} color="#DB4437" className="mr-2" />
              <Text className="font-InterBold text-lora-text">Google</Text>
            </Pressable>

            <Pressable className="flex-1 ml-4 flex-row items-center justify-center h-14 rounded-2xl border border-lora-border bg-[#0A66C2] active:opacity-70">
              <Ionicons name="logo-linkedin" size={20} color="#ffffff" className="mr-2" />
              <Text className="font-InterBold text-white">LinkedIn</Text>
            </Pressable>
          </View>
        </View>

        {/* Help Link */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-lora-text-muted font-InterMedium">¿Problemas para acceder? </Text>
          <Pressable onPress={() => alert('Contactando...')}>
            <Text className="text-lora-primary font-InterBold">Contacta al Administrador</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View className="items-center pb-8 pt-4">
        <Text className="text-xs text-lora-text-muted font-InterRegular mb-2 text-center">
          © 2024 La Lora Software. Todos los derechos reservados.
        </Text>
        <View className="flex-row">
          <Pressable><Text className="text-xs text-lora-text-muted/80 font-InterMedium">Términos</Text></Pressable>
          <Text className="text-xs text-lora-text-muted/80 mx-2">•</Text>
          <Pressable><Text className="text-xs text-lora-text-muted/80 font-InterMedium">Privacidad</Text></Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
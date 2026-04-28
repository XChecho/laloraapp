import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@src/store/useAuthStore";
import { View, ActivityIndicator } from "react-native";
import { SecureStorageAdapter } from "@core/adapters/secure-storage.adapter";
import { refreshTokenAction } from "@core/actions/auth/refreshToken.action";

const App = () => {
  const { isLoggedIn, isHydrated, checkAuthStatus } = useAuthStore();
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkAuthStatus();
      const token = await SecureStorageAdapter.getItem('token');
      const storedRefreshToken = await SecureStorageAdapter.getItem('refreshToken');

      if (token && storedRefreshToken) {
        try {
          const result = await refreshTokenAction(storedRefreshToken);
          if (result) {
            await SecureStorageAdapter.setItem('token', result.access_token);
            await SecureStorageAdapter.setItem('refreshToken', result.refresh_token);
            useAuthStore.getState().updateProfile({
              token: result.access_token,
              refreshToken: result.refresh_token,
            });
          }
        } catch {
          // Token inválido, el usuario será redirigido a login
        }
      }
      setRefreshing(false);
    };
    init();
  }, [checkAuthStatus]);

  if (!isHydrated || refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/(main)/private/tabs/waitres" />;
  }

  return <Redirect href="/(main)/login" />
};

export default App;

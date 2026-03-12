import { Redirect } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@src/store/useAuthStore";
import { View, ActivityIndicator } from "react-native";

const App = () => {
  const { isLoggedIn, isHydrated, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (!isHydrated) {
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

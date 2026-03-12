import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Icon, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';

const TabsLayout = () => {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="waitres" options={{ title: "Mesas" }}>
        <Icon src={<VectorIcon family={Ionicons} name="grid-outline" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cashier/index" options={{ title: "Caja" }}>
        <Icon src={<VectorIcon family={Ionicons} name="cash-outline" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="kitchen/index" options={{ title: "Cocina" }}>
        <Icon src={<VectorIcon family={Ionicons} name="flame-outline" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="admin/index" options={{ title: "Admin" }}>
        <Icon src={<VectorIcon family={Ionicons} name="settings-outline" />} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;

import React from 'react';
import { Text } from 'react-native';

/**
 * Mock de @expo/vector-icons para pruebas.
 *
 * Las fuentes de iconos nativas no están disponibles en Jest.
 * Reemplazamos cada componente de icono con un <Text> simple
 * que renderiza "Icon". Esto evita crashes y nos permite
 * verificar que los iconos se renderizaron (aunque no visualmente).
 */
const MockIcon = (props: any) => <Text testID={props.testID || 'mock-icon'}>Icon</Text>;

export const Ionicons = MockIcon;
export const MaterialIcons = MockIcon;
export const FontAwesome = MockIcon;
export const FontAwesome5 = MockIcon;
export const MaterialCommunityIcons = MockIcon;
export const Entypo = MockIcon;
export const Feather = MockIcon;
export const AntDesign = MockIcon;
export const SimpleLineIcons = MockIcon;
export const Octicons = MockIcon;

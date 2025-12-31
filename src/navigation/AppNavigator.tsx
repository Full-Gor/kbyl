import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import TranslateScreen from '../screens/TranslateScreen';
import DictionaryScreen from '../screens/DictionaryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AlphabetScreen from '../screens/AlphabetScreen';

const Tab = createBottomTabNavigator();

// Inline styles for the tab bar matching glassmorphism design
const inlineStyles = {
  tabBar: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopWidth: 0,
    height: 80,
    paddingTop: 8,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabIconContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabIconFocused: {
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500' as const,
  },
  tabLabelFocused: {
    color: '#FFC107',
    fontWeight: '600' as const,
  },
  activeIndicator: {
    position: 'absolute' as const,
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFC107',
  },
};

interface TabIconProps {
  focused: boolean;
  icon: string;
  label: string;
}

function TabIcon({ focused, icon, label }: TabIconProps) {
  return (
    <View style={inlineStyles.tabIconContainer}>
      <Text style={[
        inlineStyles.tabIcon,
        focused && inlineStyles.tabIconFocused
      ]}>
        {icon}
      </Text>
      <Text style={[
        inlineStyles.tabLabel,
        focused && inlineStyles.tabLabelFocused
      ]}>
        {label}
      </Text>
      {focused && <View style={inlineStyles.activeIndicator} />}
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: inlineStyles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Translate"
        component={TranslateScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🔄" label="Traduire" />
          ),
        }}
      />
      <Tab.Screen
        name="Dictionary"
        component={DictionaryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📖" label="Amawal" />
          ),
        }}
      />
      <Tab.Screen
        name="Alphabet"
        component={AlphabetScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="ⵣ" label="Tifinagh" />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="⭐" label="Favoris" />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📜" label="Historique" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

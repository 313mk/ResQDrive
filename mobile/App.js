/**
 * @file mobile/App.js
 * @responsibility Single Responsibility: React Native root entry point mounting NavigationContainer,
 * bottom tab bars, and active modal overlays for collision countdown and emergency dispatch.
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screen Components
import DriverHomeScreen from './src/screens/DriverHomeScreen';
import CrashCountdownScreen from './src/screens/CrashCountdownScreen';
import DamageAssessmentScreen from './src/screens/DamageAssessmentScreen';
import EmergencyContactsScreen from './src/screens/EmergencyContactsScreen';
import MechanicJobsScreen from './src/screens/MechanicJobsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DriverTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0B0F17' },
        headerTintColor: '#FFFFFF',
        tabBarStyle: { backgroundColor: '#0B0F17', borderTopColor: '#1E293B' },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
      }}
    >
      <Tab.Screen name="DriveHUD" component={DriverHomeScreen} options={{ title: 'Drive HUD' }} />
      <Tab.Screen name="DamageAI" component={DamageAssessmentScreen} options={{ title: 'Damage AI' }} />
      <Tab.Screen name="Contacts" component={EmergencyContactsScreen} options={{ title: 'Contacts (5)' }} />
      <Tab.Screen name="Mechanic" component={MechanicJobsScreen} options={{ title: 'Mechanic' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F17" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={DriverTabNavigator} />
        <Stack.Screen
          name="CrashCountdown"
          component={CrashCountdownScreen}
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F17',
  },
});

/**
 * @file mobile/App.js
 * @responsibility Single Responsibility: React Native root entry point mounting NavigationContainer,
 * authentication/role routing (Driver vs Mechanic), bottom tab bars, and CrashCountdown modal overlay.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screens
import AuthScreen from './src/screens/AuthScreen';
import DriverHomeScreen from './src/screens/DriverHomeScreen';
import CrashCountdownScreen from './src/screens/CrashCountdownScreen';
import DamageAssessmentScreen from './src/screens/DamageAssessmentScreen';
import EmergencyContactsScreen from './src/screens/EmergencyContactsScreen';
import MechanicJobsScreen from './src/screens/MechanicJobsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Driver Tabs (Drive HUD, Damage AI, Emergency Contacts, Profile)
function DriverTabNavigator({ user, onLogout }) {
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
      <Tab.Screen
        name="DriveHUD"
        component={DriverHomeScreen}
        options={{ title: '🚗 Drive HUD' }}
      />
      <Tab.Screen
        name="DamageAI"
        component={DamageAssessmentScreen}
        options={{ title: '📸 Damage AI' }}
      />
      <Tab.Screen
        name="Contacts"
        component={EmergencyContactsScreen}
        options={{ title: '📞 Contacts (5)' }}
      />
      <Tab.Screen
        name="Profile"
        options={{ title: '👤 Vehicle & Profile' }}
      >
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// 2. Mechanic Tabs (Recovery Jobs, Damage AI Quotes, Profile)
function MechanicTabNavigator({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0B0F17' },
        headerTintColor: '#FFFFFF',
        tabBarStyle: { backgroundColor: '#0B0F17', borderTopColor: '#1E293B' },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#94A3B8',
      }}
    >
      <Tab.Screen
        name="MechanicJobs"
        component={MechanicJobsScreen}
        options={{ title: '🔧 Recovery Jobs' }}
      />
      <Tab.Screen
        name="DamageAI"
        component={DamageAssessmentScreen}
        options={{ title: '📸 Damage AI' }}
      />
      <Tab.Screen
        name="Profile"
        options={{ title: '🏢 Workshop Profile' }}
      >
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-kamran-au',
    name: 'Muhammad Kamran',
    email: 'kamran@students.au.edu.pk',
    role: 'driver',
    phone: '03001234567',
  });

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F17" />
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F17" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentUser.role === 'mechanic' ? (
          <Stack.Screen name="MechanicTabs">
            {() => <MechanicTabNavigator user={currentUser} onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="DriverTabs">
            {() => <DriverTabNavigator user={currentUser} onLogout={handleLogout} />}
          </Stack.Screen>
        )}

        {/* Global Collision Countdown Fullscreen Overlay */}
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
/**
 * @file mobile/App.js
 * @responsibility Single Responsibility: React Native root entry point mounting NavigationContainer,
 * authentication/role routing (Driver vs Mechanic), bottom tab bars with native vector icons (no emojis),
 * and CrashCountdown modal overlay.
 */

import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screens & Components
import AuthScreen from './src/screens/AuthScreen';
import DriverHomeScreen from './src/screens/DriverHomeScreen';
import CrashCountdownScreen from './src/screens/CrashCountdownScreen';
import DamageAssessmentScreen from './src/screens/DamageAssessmentScreen';
import EmergencyContactsScreen from './src/screens/EmergencyContactsScreen';
import MechanicJobsScreen from './src/screens/MechanicJobsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TabIcon from './src/components/TabIcon';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const commonTabOptions = {
  headerStyle: { backgroundColor: '#0B0F17' },
  headerTitleStyle: { fontWeight: '700', fontSize: 17 },
  headerTintColor: '#FFFFFF',
  tabBarStyle: {
    backgroundColor: '#0B0F17',
    borderTopColor: '#1E293B',
    height: 64,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600',
  },
};

// 1. Driver Tabs (Drive HUD, Damage AI, Emergency Contacts, Profile)
function DriverTabNavigator({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        ...commonTabOptions,
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tab.Screen
        name="DriveHUD"
        component={DriverHomeScreen}
        options={{
          title: 'Drive HUD',
          tabBarLabel: 'HUD',
          tabBarIcon: ({ focused, color }) => <TabIcon name="hud" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="DamageAI"
        component={DamageAssessmentScreen}
        options={{
          title: 'Damage AI Assessment',
          tabBarLabel: 'Damage AI',
          tabBarIcon: ({ focused, color }) => <TabIcon name="damage" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={EmergencyContactsScreen}
        options={{
          title: 'Emergency Contacts',
          tabBarLabel: 'Contacts',
          tabBarIcon: ({ focused, color }) => <TabIcon name="contacts" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          title: 'Vehicle & Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => <TabIcon name="profile" focused={focused} color={color} />,
        }}
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
        ...commonTabOptions,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tab.Screen
        name="MechanicJobs"
        component={MechanicJobsScreen}
        options={{
          title: 'Recovery & Tow Dispatch',
          tabBarLabel: 'Recovery',
          tabBarIcon: ({ focused, color }) => <TabIcon name="mechanic" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="DamageAI"
        component={DamageAssessmentScreen}
        options={{
          title: 'Parts & Claim Valuation',
          tabBarLabel: 'Quotes',
          tabBarIcon: ({ focused, color }) => <TabIcon name="damage" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          title: 'Workshop Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => <TabIcon name="profile" focused={focused} color={color} />,
        }}
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
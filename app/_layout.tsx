import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '@/ctx/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
    <Stack> 
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

    </Stack>
    </AuthProvider>
  )
};
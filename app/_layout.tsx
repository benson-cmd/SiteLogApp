import { Stack } from 'expo-router';
import { UserProvider } from '../context/UserContext';

// 簡化版 Layout，將跳轉控制權交給各個頁面，避免邏輯衝突
export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="projects" />
        <Stack.Screen name="sop" />
        <Stack.Screen name="personnel" />
        <Stack.Screen name="register" options={{ presentation: 'modal' }} />
      </Stack>
    </UserProvider>
  );
}
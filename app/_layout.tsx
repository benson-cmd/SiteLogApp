import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, Alert, Image, Text, StatusBar } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import { ProjectProvider } from '../context/ProjectContext';
import { LogProvider } from '../context/LogContext';
import { UserProvider, useUser } from '../context/UserContext';
import { AnnouncementProvider } from '../context/AnnouncementContext';
import { SOPProvider } from '../context/SOPContext'; 

const THEME = {
  background: '#002147', 
  text: '#ffffff',       
  active: '#C69C6D',     
  danger: '#ff4444'      
};

function CustomDrawerContent(props: any) {
  const { logout } = useUser();
  const handleLogout = () => {
    // 這裡保留 Alert，因為 drawer 是通用的，我們也可以像 profile 一樣改寫
    // 但因為這是 Sidebar，我們稍後一併處理
    if (typeof window !== 'undefined' && window.confirm) {
        if (window.confirm('確定要登出系統嗎？')) {
            logout();
        }
    } else {
        Alert.alert('登出', '確定要登出系統嗎？', [
        { text: '取消', style: 'cancel' },
        { text: '確定登出', style: 'destructive', onPress: () => logout() },
        ]);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: THEME.background }}>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>
      <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingBottom: 20 }}>
        <DrawerItem
          label="登出系統"
          labelStyle={{ color: THEME.danger, fontWeight: 'bold' }}
          icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={THEME.danger} />}
          onPress={handleLogout}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

function AppNavigator() {
  const { currentUser, isLoading } = useUser();

  const LogoTitle = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={require('../assets/logo.png')}
        resizeMode="contain"
        style={{ width: 140, height: 35 }}
      />
      <Text style={{ color: THEME.text, fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>
        DW工程日誌系統
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.background }}>
        <ActivityIndicator size="large" color={THEME.active} />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: THEME.background }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { 
            backgroundColor: THEME.background,
            shadowColor: 'transparent',
            elevation: 0, 
          },
          headerTintColor: THEME.text,
          headerTitle: (props) => <LogoTitle />, 
          headerTitleAlign: 'left',
          drawerStyle: { 
            backgroundColor: THEME.background,
            width: 280,
          },
          drawerActiveTintColor: THEME.active,
          drawerInactiveTintColor: THEME.text,
          drawerActiveBackgroundColor: 'rgba(198, 156, 109, 0.15)',
          sceneContainerStyle: { backgroundColor: THEME.background }
        }}
      >
        <Drawer.Screen name="index" options={{ drawerLabel: '首頁', drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="projects" options={{ drawerLabel: '專案列表', drawerIcon: ({ color, size }) => <Ionicons name="folder-open-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="logs/index" options={{ drawerLabel: '施工紀錄', drawerIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="personnel/index" options={{ drawerLabel: '人員管理', drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="sop/index" options={{ drawerLabel: 'SOP資料庫', drawerIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="calendar/index" options={{ drawerLabel: '行事曆', drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="profile/index" options={{ drawerLabel: '我的檔案', drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} /> }} />

        {/* 隱藏頁面 */}
        <Drawer.Screen name="login" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
        <Drawer.Screen name="register" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
        <Drawer.Screen name="forgot-password" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
        <Drawer.Screen name="projects/new" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="projects/[id]" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="logs/new" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="logs/[id]" options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ProjectProvider>
          <LogProvider>
            <SOPProvider>
              <AnnouncementProvider>
                <AppNavigator />
              </AnnouncementProvider>
            </SOPProvider>
          </LogProvider>
        </ProjectProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
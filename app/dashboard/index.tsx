import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const nav = (path: any) => { setMenuVisible(false); router.push(path); };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{backgroundColor: '#002147'}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}><Ionicons name="menu" size={32} color="#fff" /></TouchableOpacity>
          <Text style={styles.headerTitle}>DW工程日誌系統</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{padding: 20}}>
        <Text style={styles.welcome}>👋 您好, <Text style={{fontWeight:'bold'}}>吳資彬</Text>! 這是最新公告，請您務必留意！</Text>
        <View style={styles.announceCard}>
          <Text style={{fontSize: 18, fontWeight:'bold', color:'#002147'}}>系統復原公告</Text>
          <Text style={{marginVertical: 10, color: '#555'}}>登入與路徑導向功能已全數修復。歡迎使用！</Text>
          <Text style={{color: '#999', fontSize: 12}}>2026/01/14 | 管理員</Text>
        </View>
      </ScrollView>

      {/* 側邊選單 */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={styles.sideMenu}>
            <SafeAreaView>
              <Text style={styles.menuTitle}>功能選單</Text>
              <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}><Ionicons name="home" size={24} color="#C69C6D" /><Text style={[styles.menuText, {color:'#C69C6D'}]}>首頁</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => nav('/personnel')}><Ionicons name="people" size={24} color="#fff" /><Text style={styles.menuText}>人員管理</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => nav('/logs')}><Ionicons name="clipboard" size={24} color="#fff" /><Text style={styles.menuText}>施工紀錄</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => nav('/sop')}><Ionicons name="library" size={24} color="#fff" /><Text style={styles.menuText}>SOP資料庫</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => nav('/profile')}><Ionicons name="person-circle" size={24} color="#fff" /><Text style={styles.menuText}>我的檔案</Text></TouchableOpacity>
              <TouchableOpacity style={{marginTop: 50}} onPress={() => {setMenuVisible(false); logout(); router.replace('/');}}><Text style={{color: '#FF6B6B', fontSize: 18, marginLeft: 20}}>登出系統</Text></TouchableOpacity>
            </SafeAreaView>
          </View>
          <TouchableOpacity style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)'}} onPress={() => setMenuVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  welcome: { fontSize: 20, color: '#333', marginBottom: 30 },
  announceCard: { padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff', elevation: 3 },
  sideMenu: { width: 280, backgroundColor: '#002147', height: '100%', padding: 20 },
  menuTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuText: { color: '#fff', fontSize: 18, marginLeft: 15 }
});
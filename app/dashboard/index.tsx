import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function DashboardScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{backgroundColor: '#002147'}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}><Ionicons name="menu" size={32} color="#fff" /></TouchableOpacity>
          <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 15}}>DW工程日誌系統</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{padding: 20}}>
        <Text style={{fontSize: 22, color: '#333'}}>👋 您好, <Text style={{fontWeight:'bold'}}>吳資彬</Text>!</Text>
        <Text style={{fontSize: 16, color: '#666', marginBottom: 30}}>這是最新公告，請您務必留意！</Text>
        <View style={styles.announceCard}>
          <Text style={{fontSize: 18, fontWeight:'bold'}}>系統修復公告</Text>
          <Text style={{marginVertical: 10, color: '#555'}}>所有頁面路徑與內容錯置問題已全數修正完畢。</Text>
        </View>
      </ScrollView>

      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={styles.sideMenu}>
            <SafeAreaView>
              <Text style={styles.menuTitle}>功能選單</Text>
              <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuVisible(false); router.push('/dashboard')}}><Ionicons name="home" size={24} color="#C69C6D" /><Text style={[styles.menuText, {color:'#C69C6D'}]}>首頁</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuVisible(false); router.push('/logs')}}><Ionicons name="clipboard" size={24} color="#fff" /><Text style={styles.menuText}>施工紀錄</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuVisible(false); router.push('/personnel')}}><Ionicons name="people" size={24} color="#fff" /><Text style={styles.menuText}>人員管理</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuVisible(false); router.push('/sop')}}><Ionicons name="library" size={24} color="#fff" /><Text style={styles.menuText}>SOP資料庫</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuVisible(false); router.push('/profile')}}><Ionicons name="person-circle" size={24} color="#fff" /><Text style={styles.menuText}>我的檔案</Text></TouchableOpacity>
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
  announceCard: { padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  sideMenu: { width: 280, backgroundColor: '#002147', height: '100%', padding: 20 },
  menuTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuText: { color: '#fff', fontSize: 18, marginLeft: 15 }
});
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';

export default function DashboardScreen() {
  const router = useRouter();
  const { logout } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const navTo = (path: string) => { setMenuVisible(false); router.push(path); };

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
        <Text style={styles.welcome}>👋 您好, <Text style={{fontWeight:'bold'}}>吳資彬</Text>! 歡迎登入系統。</Text>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>公告欄</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('管理權限', '開啟新增公告頁面')}>
            <Text style={{fontWeight:'bold', color: '#002147'}}>+ 新增公告</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.announceCard}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
            <Text style={{fontSize:18, fontWeight:'bold', color: '#002147'}}>系統上線通知</Text>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={() => Alert.alert('管理', '編輯公告')}><Ionicons name="pencil" size={20} color="#C69C6D" /></TouchableOpacity>
              <TouchableOpacity onPress={() => Alert.alert('管理', '刪除公告')} style={{marginLeft: 15}}><Ionicons name="trash" size={20} color="#FF6B6B" /></TouchableOpacity>
            </View>
          </View>
          <Text style={{marginVertical: 10, color: '#555'}}>歡迎使用全新版本，功能選單與頁面路徑已全數修復。</Text>
          <Text style={{color: '#999', fontSize: 12}}>2026/01/15 | 管理員</Text>
        </View>
      </ScrollView>

      {/* 側邊選單 */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={styles.sideMenu}>
            <SafeAreaView style={{flex:1}}>
              <Text style={styles.menuTitle}>功能選單</Text>
              <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}><Ionicons name="home" size={24} color="#C69C6D" /><Text style={[styles.menuText, {color:'#C69C6D'}]}>首頁</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navTo('/projects')}><Ionicons name="folder-open" size={24} color="#fff" /><Text style={styles.menuText}>專案列表</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navTo('/logs')}><Ionicons name="clipboard" size={24} color="#fff" /><Text style={styles.menuText}>施工紀錄</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navTo('/sop')}><Ionicons name="library" size={24} color="#fff" /><Text style={styles.menuText}>SOP資料庫</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navTo('/personnel')}><Ionicons name="people" size={24} color="#fff" /><Text style={styles.menuText}>人員管理</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navTo('/profile')}><Ionicons name="person-circle" size={24} color="#fff" /><Text style={styles.menuText}>我的檔案</Text></TouchableOpacity>
              <View style={{flex:1}} />
              <TouchableOpacity style={styles.menuItem} onPress={() => {logout(); router.replace('/')}}><Ionicons name="log-out" size={24} color="#FF6B6B" /><Text style={[styles.menuText, {color:'#FF6B6B'}]}>登出系統</Text></TouchableOpacity>
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
  welcome: { fontSize: 18, color: '#333', marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 26, fontWeight: 'bold', color: '#002147' },
  addBtn: { backgroundColor: '#F0F0F0', padding: 10, borderRadius: 8 },
  announceCard: { padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff', elevation: 3 },
  sideMenu: { width: 280, backgroundColor: '#002147', height: '100%', padding: 20 },
  menuTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuText: { color: '#fff', fontSize: 18, marginLeft: 15 }
});
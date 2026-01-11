import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar, Modal, Image, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';

const THEME = { primary: '#C69C6D', background: '#F5F7FA', card: '#ffffff', headerBg: '#002147', text: '#333333' };

const MOCK_PEOPLE = [
  { id: '1', name: '吳資彬', role: '副總', phone: '0988-967-900', email: 'wu@dwcc.com.tw' },
  { id: '2', name: '陳大文', role: '工地主任', phone: '0912-345-678', email: 'chen@dwcc.com.tw' },
];

export default function PersonnelScreen() {
  const router = useRouter();
  const { logout } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <View style={styles.avatar}><Text style={{fontSize:20, color:'#fff'}}>{item.name[0]}</Text></View>
        <View style={{flex:1}}>
          <Text style={styles.name}>{item.name} <Text style={styles.role}>{item.role}</Text></Text>
          <Text style={styles.info}>{item.email}</Text>
          <Text style={styles.info}>{item.phone}</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('編輯', `編輯 ${item.name} 的資料`)}>
          <Ionicons name="create-outline" size={24} color={THEME.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const MenuItem = ({ icon, label, onPress, isLogout = false, isActive = false }: any) => (
    <TouchableOpacity style={[styles.menuItem, isActive && styles.menuItemActive]} onPress={onPress}>
      <Ionicons name={icon} size={24} color={isLogout ? '#FF6B6B' : '#fff'} />
      <Text style={[styles.menuItemText, isLogout && { color: '#FF6B6B' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.customHeaderSafeArea}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />
        <View style={styles.customHeaderContent}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}><Ionicons name="menu" size={32} color="#fff" /></TouchableOpacity>
          <View style={styles.brandContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
            <Text style={styles.brandText}>DW工程日誌系統</Text>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>人員管理</Text>
        <FlatList data={MOCK_PEOPLE} keyExtractor={item => item.id} renderItem={renderItem} contentContainerStyle={styles.listContent} />
        <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('新增人員', '開啟新增人員表單')}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} animationType="fade" transparent={true} onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sideMenu}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.menuHeader}><Ionicons name="people" size={24} color="#fff" /><Text style={styles.menuTitle}>人員管理</Text><TouchableOpacity onPress={() => setMenuVisible(false)} style={{marginLeft:'auto'}}><Ionicons name="close" size={28} color="#fff" /></TouchableOpacity></View>
              <View style={styles.menuDivider} />
              <MenuItem icon="home-outline" label="首頁" onPress={() => { setMenuVisible(false); router.push('/dashboard'); }} />
              <MenuItem icon="folder-outline" label="專案列表" onPress={() => { setMenuVisible(false); router.push('/projects'); }} />
              <MenuItem icon="clipboard-outline" label="施工紀錄" onPress={() => { setMenuVisible(false); router.push('/logs'); }} />
              <MenuItem icon="people" label="人員管理" isActive={true} onPress={() => setMenuVisible(false)} />
              <MenuItem icon="library-outline" label="SOP資料庫" onPress={() => { setMenuVisible(false); router.push('/sop'); }} />
              <MenuItem icon="calendar-outline" label="行事曆" onPress={() => { setMenuVisible(false); router.push('/calendar'); }} />
              <MenuItem icon="person-circle-outline" label="我的檔案" onPress={() => { setMenuVisible(false); router.push('/profile'); }} />
              <View style={{ flex: 1 }} /><View style={styles.menuDivider} />
              <MenuItem icon="log-out-outline" label="登出系統" isLogout onPress={() => { setMenuVisible(false); logout(); router.replace('/'); }} />
            </SafeAreaView>
          </View>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setMenuVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: THEME.background },
  customHeaderSafeArea: { backgroundColor: THEME.headerBg, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  customHeaderContent: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  menuButton: { marginRight: 15 },
  brandContainer: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 35, height: 35, marginRight: 10 },
  brandText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  contentContainer: { flex: 1 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.headerBg, margin: 20 },
  listContent: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#C69C6D', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  role: { fontSize: 14, color: '#C69C6D', fontWeight: 'normal' },
  info: { color: '#666', fontSize: 13, marginTop: 2 },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sideMenu: { width: 280, backgroundColor: '#002147', height: '100%', padding: 20, paddingTop: 60 },
  menuHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  menuTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginLeft: 15 },
  menuDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderRadius: 8, paddingHorizontal: 10 },
  menuItemActive: { backgroundColor: 'rgba(198, 156, 109, 0.2)' },
  menuItemText: { fontSize: 18, marginLeft: 15, color: '#fff', fontWeight: '500' }
});
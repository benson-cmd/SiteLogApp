import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar, Modal, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';

const THEME = {
  primary: '#C69C6D',
  background: '#F5F7FA',
  card: '#ffffff',
  headerBg: '#002147',
  text: '#333333'
};

type Project = { id: string; name: string; address: string; manager: string; progress: number; };
const MOCK_PROJECTS: Project[] = [];

export default function ProjectsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [menuVisible, setMenuVisible] = useState(false); // ⭐️ 關鍵：控制選單

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.customHeaderSafeArea}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />
        <View style={styles.customHeaderContent}>
          <View style={styles.headerLeftContainer}>
            {/* 點擊開啟 Modal */}
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
              <Ionicons name="menu" size={32} color="#fff" />
            </TouchableOpacity>
            <View style={styles.brandContainer}>
              <Image source={require('../../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
              <Text style={styles.brandText}>DW工程日誌系統</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>專案列表</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>搜尋專案...</Text>
        </View>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={() => <View />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>目前沒有專案</Text>
            </View>
          }
        />
        {user && (
          <TouchableOpacity style={styles.fab} onPress={() => router.push('/projects/new')}>
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* ⭐️ 側邊選單 Modal (這就是您要的選單) */}
      <Modal visible={menuVisible} animationType="fade" transparent={true} onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setMenuVisible(false)} activeOpacity={1} />
          <View style={styles.sideMenu}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.menuHeader}>
                <Image source={require('../../assets/logo.png')} style={{ width: 40, height: 40 }} resizeMode="contain" />
                <TouchableOpacity onPress={() => setMenuVisible(false)}>
                  <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
              </View>
              <Text style={styles.menuSectionTitle}>系統選單</Text>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/projects'); }}>
                <Ionicons name="list" size={22} color="#555" /><Text style={styles.menuItemText}>專案列表</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/personnel'); }}>
                <Ionicons name="people" size={22} color="#555" /><Text style={styles.menuItemText}>人員管理</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/sop'); }}>
                <Ionicons name="document-text" size={22} color="#555" /><Text style={styles.menuItemText}>SOP 標準作業</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
                <Ionicons name="log-out-outline" size={22} color="#d32f2f" /><Text style={[styles.menuItemText, { color: '#d32f2f' }]}>登出系統</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: THEME.background },
  customHeaderSafeArea: { backgroundColor: THEME.headerBg, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  customHeaderContent: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  headerLeftContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1 },
  menuButton: { padding: 5, marginRight: 15 },
  brandContainer: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 35, height: 35, marginRight: 10 },
  brandText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  contentContainer: { flex: 1 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.headerBg, marginHorizontal: 15, marginTop: 20, marginBottom: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 15, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  searchIcon: { marginRight: 10 },
  searchPlaceholder: { color: '#999' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#999', fontSize: 16 },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, zIndex: 999 },
  // Menu Styles
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sideMenu: { width: '75%', backgroundColor: '#fff', height: '100%', padding: 20 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  menuSectionTitle: { fontSize: 14, color: '#999', fontWeight: 'bold', marginBottom: 10, marginLeft: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10 },
  menuItemText: { fontSize: 16, marginLeft: 15, color: '#333', fontWeight: '500' },
  menuDivider: { height: 1, backgroundColor: '#eee', marginVertical: 10 }
});
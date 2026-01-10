import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';

const THEME = {
  primary: '#C69C6D',       // 金色
  background: '#F5F7FA',    // 淺灰底
  card: '#ffffff',
  headerBg: '#002147',      // 深藍色背景
  text: '#333333'
};

// 定義資料格式
type Project = {
  id: string;
  name: string;
  address: string;
  manager: string;
  progress: number;
};

// 假資料
const MOCK_PROJECTS: Project[] = [
  // 您可以在這裡加一筆測試資料
];

export default function ProjectsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  // 點擊選單按鈕的動作
  const handleMenuPress = () => {
    // 因為目前還沒設定側邊欄 (Drawer)，暫時先跳出提示
    // 下一階段若要實作「滑出選單」，需要改動 _layout.tsx 結構
    alert('開啟側邊選單功能 (需設定 Drawer)');
  };

  const renderItem = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/projects/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.projectTitle}>{item.name}</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
      <Text style={styles.projectInfo}>📍 {item.address}</Text>
      <Text style={styles.projectInfo}>👷 主任：{item.manager}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
      </View>
      <Text style={styles.progressText}>進度 {item.progress}%</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      {/* 1. 隱藏系統預設的 Header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 2. 自製客製化 Header (深藍色區域) */}
      <SafeAreaView style={styles.customHeaderSafeArea}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />
        
        <View style={styles.customHeaderContent}>
          {/* 左側：漢堡選單圖示 */}
          <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>

          {/* 中間：Logo + 標題 */}
          <View style={styles.brandContainer}>
            {/* 這裡用 Icon 暫代 Logo，您之後可以用 <Image> 替換 */}
            <Ionicons name="business" size={24} color={THEME.primary} style={{ marginRight: 8 }} />
            <Text style={styles.brandText}>DW工程日誌系統</Text>
          </View>
          
          {/* 右側：用一個空 View 佔位，讓中間標題置中，或者放通知鈴鐺 */}
          <View style={{ width: 28 }} /> 
        </View>
      </SafeAreaView>

      {/* 3. 內容區域 */}
      <View style={styles.contentContainer}>
        
        {/* 副標題：專案列表 */}
        <Text style={styles.pageTitle}>專案列表</Text>

        {/* 搜尋框 */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>搜尋專案名稱、地點或主任...</Text>
        </View>

        {/* 列表 */}
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>目前沒有專案</Text>
            </View>
          }
        />

        {/* 新增按鈕 (FAB) */}
        {user && (
          <TouchableOpacity 
            style={styles.fab} 
            onPress={() => router.push('/projects/new')}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: THEME.background },
  
  // --- 自訂 Header 樣式區 ---
  customHeaderSafeArea: {
    backgroundColor: THEME.headerBg,
    paddingTop: Platform.OS === 'android' ? 30 : 0, // Android 需要避開狀態列
  },
  customHeaderContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  menuButton: {
    padding: 5,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // -----------------------

  contentContainer: { flex: 1 },
  
  // 副標題樣式
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.headerBg, // 使用深藍色
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  searchIcon: { marginRight: 10 },
  searchPlaceholder: { color: '#999' },
  listContent: { padding: 15, paddingTop: 0 },
  card: {
    backgroundColor: THEME.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  projectTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.headerBg },
  projectInfo: { color: '#666', marginBottom: 5 },
  progressContainer: { height: 6, backgroundColor: '#eee', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: THEME.primary },
  progressText: { fontSize: 12, color: THEME.primary, marginTop: 5, textAlign: 'right', fontWeight: 'bold' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#999', fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 999
  }
});
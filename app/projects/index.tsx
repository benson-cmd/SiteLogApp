import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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

// 1. 定義資料格式 (解決 implicit any 問題)
type Project = {
  id: string;
  name: string;
  address: string;
  manager: string;
  progress: number;
};

// 2. 加上型別註解
const MOCK_PROJECTS: Project[] = [
  // 您可以在這裡加一筆測試資料，例如：
  // { id: '1', name: '台中七期商辦', address: '台中市西屯區', manager: '王大明', progress: 30 }
];

export default function ProjectsScreen() {
  const router = useRouter();
  const { user } = useUser(); // 現在 UserContext 已經有 user 了，這裡不會報錯了
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

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
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: '專案列表',
          headerStyle: { backgroundColor: THEME.headerBg },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,
        }} 
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>搜尋專案名稱、地點或主任...</Text>
      </View>

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

      {/* user 存在時才顯示新增按鈕 */}
      {user && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => router.push('/projects/new')}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
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
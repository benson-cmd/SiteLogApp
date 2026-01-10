import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useProject, Project, ProjectStatus } from '../../context/ProjectContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';

const THEME = {
  background: '#ffffff',
  text: '#002147',
  textSec: '#555555',
  cardBg: '#ffffff',
  accent: '#C69C6D',
  border: '#E0E0E0',
  inputBg: '#F5F5F5'
};

const STATUS_MAP: Record<ProjectStatus, string> = {
  'not_started': '未開工',
  'started_offsite': '已開工未進場',
  'ongoing': '施工中',
  'completed_pending': '完工待驗收',
  'inspecting': '驗收中',
  'closed': '結案'
};

const STATUS_COLORS: Record<ProjectStatus, string> = {
  'not_started': '#9E9E9E',
  'started_offsite': '#795548',
  'ongoing': '#2196F3',
  'completed_pending': '#FF9800',
  'inspecting': '#9C27B0',
  'closed': '#4CAF50'
};

// 務必確認這裡是 ProjectsScreen (列表)，而不是 NewProjectScreen
export default function ProjectsScreen() {
  const { searchProjects } = useProject();
  const { isAdmin } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = searchProjects(searchQuery);

  const renderItem = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/projects/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.projectTitle} numberOfLines={1}>{item.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}> 
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
            {STATUS_MAP[item.status]}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={14} color={THEME.textSec} />
        <Text style={styles.projectInfo}>{item.location}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={14} color={THEME.textSec} />
        <Text style={styles.projectInfo}>{item.manager || '未指定主任'}</Text>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.dateText}>📅 開工: {item.startDate}</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.dateText}>⏳ 工期: {item.contractDuration} 天</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{item.progress}%</Text>
      </View>

      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>專案列表</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput 
            style={styles.input} 
            placeholder="搜尋專案名稱、地點或主任..." 
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList 
        data={filteredData} 
        renderItem={renderItem} 
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color="#ddd" />
            <Text style={styles.emptyText}>目前沒有專案</Text>
            {isAdmin && <Text style={styles.emptySubText}>請點擊右下角按鈕新增</Text>}
          </View>
        }
      />

      {isAdmin && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/projects/new')}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  headerContainer: { padding: 20, paddingBottom: 10, backgroundColor: '#fff' },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: THEME.text, marginBottom: 15 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.inputBg, padding: 12, borderRadius: 10 },
  input: { marginLeft: 10, flex: 1, fontSize: 16, color: '#000' },
  card: { backgroundColor: THEME.cardBg, padding: 16, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 2, position: 'relative' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  titleRow: { flex: 1, marginRight: 10 },
  projectTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  projectInfo: { color: THEME.textSec, fontSize: 14, marginLeft: 6 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  dateText: { fontSize: 13, color: '#666', fontWeight: '500' },
  separator: { marginHorizontal: 8, color: '#ddd' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  progressBarBg: { flex: 1, height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden', marginRight: 8 },
  progressBarFill: { height: '100%', backgroundColor: THEME.accent },
  progressLabel: { fontSize: 12, fontWeight: 'bold', color: THEME.accent },
  arrowContainer: { position: 'absolute', right: 15, top: '55%' },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: THEME.accent, justifyContent: 'center', alignItems: 'center', shadowColor: '#C69C6D', shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#999', fontSize: 18, marginTop: 10, fontWeight: 'bold' },
  emptySubText: { color: '#bbb', fontSize: 14, marginTop: 5 }
});
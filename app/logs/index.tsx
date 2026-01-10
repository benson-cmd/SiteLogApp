import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useLog, ConstructionLog } from '../../context/LogContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// 強制明亮配色
const THEME = {
  background: '#ffffff', 
  text: '#002147',
  textSec: '#555555',
  cardBg: '#ffffff',
  accent: '#C69C6D',
  border: '#E0E0E0'
};

export default function LogsScreen() {
  const { logs, searchLogs } = useLog();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredLogs = searchLogs(query);

  const renderItem = ({ item }: { item: ConstructionLog }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/logs/${item.id}`)}>
      <View style={styles.dateBox}>
        <Text style={styles.dayText}>{item.date.split('-')[2]}</Text>
        <Text style={styles.ymText}>{item.date.slice(0, 7)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.logTitle}>工項：{item.workItems}</Text>
        <Text style={styles.logProject}>專案：{item.projectId}</Text>
        <Text style={styles.logWeather}>天氣：{item.weather}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 這裡加入了左上角標題 */}
      <Text style={styles.pageTitle}>施工紀錄</Text>
      
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput 
          style={styles.input} 
          placeholder="搜尋日誌..." 
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList 
        data={filteredLogs} 
        renderItem={renderItem} 
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/logs/new')}>
        <Ionicons name="add" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.text, marginBottom: 15 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 10, borderRadius: 8, marginBottom: 20 },
  input: { marginLeft: 10, flex: 1, fontSize: 16, color: '#000' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.cardBg, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  dateBox: { alignItems: 'center', marginRight: 15, paddingRight: 15, borderRightWidth: 1, borderRightColor: '#eee' },
  dayText: { fontSize: 24, fontWeight: 'bold', color: THEME.text },
  ymText: { fontSize: 12, color: THEME.textSec },
  logTitle: { fontSize: 16, fontWeight: 'bold', color: THEME.text, marginBottom: 4 },
  logProject: { fontSize: 13, color: THEME.textSec },
  logWeather: { fontSize: 13, color: THEME.accent, marginTop: 2 },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: THEME.accent, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 }
});
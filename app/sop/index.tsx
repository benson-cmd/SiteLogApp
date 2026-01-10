import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';

const THEME = { primary: '#C69C6D', background: '#F5F7FA', card: '#ffffff', headerBg: '#002147', text: '#333333' };

// 1. 定義型別，防止 Vercel 報錯
type SOPItem = { id: string; title: string; category: string; date: string; };

const MOCK_SOP: SOPItem[] = [
  { id: '1', title: '模板支撐作業標準', category: '結構工程', date: '2023-10-01' },
];

export default function SOPScreen() {
  const router = useRouter();
  const { user } = useUser();
  
  // 2. 這裡一定要用 user?.role，用 isAdmin 會導致整個網站更新失敗
  const isAdmin = user?.role === 'admin';
  const [sops, setSops] = useState<SOPItem[]>(MOCK_SOP);

  const renderItem = ({ item }: { item: SOPItem }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconContainer}><Ionicons name="document-text-outline" size={24} color={THEME.primary} /></View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subInfo}>{item.category} • {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'SOP', headerStyle: { backgroundColor: THEME.headerBg }, headerTintColor: '#fff' }} />
      <FlatList data={sops} keyExtractor={item => item.id} renderItem={renderItem} contentContainerStyle={styles.listContent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  listContent: { padding: 15 },
  card: { backgroundColor: THEME.card, padding: 15, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF9F0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  infoContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  subInfo: { fontSize: 12, color: '#999' }
});
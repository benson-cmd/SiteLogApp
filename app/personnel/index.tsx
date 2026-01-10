import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { useUser, User } from '../../context/UserContext'; // 確保引用正確
import { Ionicons } from '@expo/vector-icons';

const THEME = {
  background: '#ffffff',
  text: '#002147',
  textSec: '#555555',
  cardBg: '#ffffff',
  accent: '#C69C6D',
  border: '#E0E0E0',
  danger: '#ff4444',
  success: '#00C851'
};

export default function PersonnelScreen() {
  const { allUsers, approveUser, deleteUser, isAdmin } = useUser();

  // 安全過濾 (避免 allUsers 為空時崩潰)
  const pendingUsers = allUsers ? allUsers.filter(u => u.status === 'pending') : [];
  const approvedUsers = allUsers ? allUsers.filter(u => u.status !== 'pending') : [];

  const handleApprove = (id: string) => {
    Alert.alert('審核', '確定核准此帳號？', [
      { text: '取消', style: 'cancel' },
      { text: '核准', onPress: () => approveUser(id) }
    ]);
  };

  const handleDelete = (id: string) => {
    Alert.alert('刪除', '確定刪除此帳號？', [
      { text: '取消', style: 'cancel' },
      { text: '刪除', style: 'destructive', onPress: () => deleteUser(id) }
    ]);
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{item.name[0]}</Text></View>
        <View>
          <Text style={styles.userName}>{item.name} {item.role === 'admin' && '(管理員)'}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userTitle}>{item.title || '一般人員'}</Text>
        </View>
      </View>
      
      {isAdmin && item.role !== 'admin' && (
        <View style={styles.actions}>
          {item.status === 'pending' && (
            <TouchableOpacity onPress={() => handleApprove(item.id)} style={styles.actionBtn}>
              <Ionicons name="checkmark-circle" size={28} color={THEME.success} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <Ionicons name="trash" size={24} color={THEME.danger} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>人員管理</Text>
      
      {isAdmin && pendingUsers.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>待審核人員 ({pendingUsers.length})</Text>
          <FlatList data={pendingUsers} renderItem={renderUser} keyExtractor={item => item.id} scrollEnabled={false} />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>正式員工名單</Text>
        <FlatList data={approvedUsers} renderItem={renderUser} keyExtractor={item => item.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, padding: 20 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: THEME.text, marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.accent, marginBottom: 10 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: THEME.cardBg, padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.text, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  userName: { fontSize: 16, fontWeight: 'bold', color: THEME.text },
  userEmail: { fontSize: 12, color: THEME.textSec },
  userTitle: { fontSize: 12, color: THEME.accent },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  actionBtn: { padding: 5 }
});
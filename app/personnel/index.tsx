import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function PersonnelScreen() {
  const [people] = useState([
    { id: '1', name: '吳資彬', title: '副總', phone: '0988967900', email: 'wu@dwcc.com.tw', startDate: '2017-07-17', education: '碩士', experience: '20年', licenses: '工地主任證照' }
  ]);

  const calculateTenure = (date: string) => {
    const start = new Date(date);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    return `${years} 年 ${months} 個月`;
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F5F7FA'}}>
      <Stack.Screen options={{ title: '人員管理', headerStyle: { backgroundColor: '#002147' }, headerTintColor: '#fff', headerShown: true }} />
      <FlatList 
        data={people}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.avatar}><Text style={{color:'#fff', fontSize:24}}>{item.name[0]}</Text></View>
                <View style={{flex:1, marginLeft: 15}}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.title}>{item.title}</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('編輯', '開啟編輯視窗')}><Ionicons name="create-outline" size={28} color="#C69C6D" /></TouchableOpacity>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>📧 {item.email} | 📞 {item.phone}</Text>
                <View style={styles.tenureBadge}><Text style={{color:'#002147', fontWeight:'bold'}}>服務年資：{calculateTenure(item.startDate)}</Text></View>
                <View style={styles.divider} />
                <Text style={styles.subTitle}>🎓 學歷：{item.education}</Text>
                <Text style={styles.subTitle}>🏗️ 經歷：{item.experience}</Text>
                <Text style={styles.subTitle}>📜 證照：{item.licenses}</Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('新增', '開啟新增人員頁面')}><Ionicons name="add" size={30} color="#fff" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', margin: 15, borderRadius: 15, padding: 20, elevation: 3 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#C69C6D', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 20, fontWeight: 'bold' },
  title: { color: '#C69C6D', fontWeight: 'bold' },
  infoBox: { marginTop: 15 },
  infoText: { color: '#666', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  tenureBadge: { backgroundColor: '#E3F2FD', padding: 8, borderRadius: 10, alignSelf: 'flex-start' },
  subTitle: { fontSize: 14, color: '#444', marginBottom: 5 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#C69C6D', justifyContent: 'center', alignItems: 'center', elevation: 5 }
});
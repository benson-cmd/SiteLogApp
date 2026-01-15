import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const profile = { name: '吳資彬', title: '副總', email: 'wu@dwcc.com.tw', phone: '0988967900', start: '2017-07-17' };

  const calculateTenure = (date: string) => {
    const start = new Date(date);
    const diff = new Date().getTime() - start.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    return `${years} 年 ${months} 個月`;
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F5F7FA'}}>
      <Stack.Screen options={{ title: '我的檔案', headerShown: true, headerStyle: { backgroundColor: '#002147' }, headerTintColor: '#fff' }} />
      <ScrollView contentContainerStyle={{padding: 20}}>
        <View style={styles.card}>
          <View style={styles.avatarBox}><Text style={{fontSize: 40, color: '#fff'}}>吳</Text></View>
          <Text style={{fontSize: 24, fontWeight: 'bold', color: '#002147'}}>{profile.name}</Text>
          <Text style={{color: '#C69C6D', fontWeight: 'bold', marginTop: 5}}>{profile.title}</Text>
          
          <View style={styles.tenureBadge}><Text style={{color:'#002147', fontWeight:'bold'}}>服務年資：{calculateTenure(profile.start)}</Text></View>
          
          <View style={styles.divider} />
          <View style={styles.infoRow}><Ionicons name="mail" size={20} color="#666" /><Text style={styles.infoText}>{profile.email}</Text></View>
          <View style={styles.infoRow}><Ionicons name="call" size={20} color="#666" /><Text style={styles.infoText}>{profile.phone}</Text></View>
          
          <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('編輯', '開啟資料修改視窗')}>
            <Text style={{color:'#fff', fontWeight:'bold'}}>編輯個人詳細資料</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 3 },
  avatarBox: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#C69C6D', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  tenureBadge: { backgroundColor: '#E3F2FD', padding: 10, borderRadius: 12, marginTop: 15 },
  divider: { width: '100%', height: 1, backgroundColor: '#eee', marginVertical: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoText: { marginLeft: 10, color: '#444', fontSize: 16 },
  editBtn: { backgroundColor:'#002147', padding: 15, borderRadius: 10, width:'100%', alignItems:'center', marginTop:20 }
});
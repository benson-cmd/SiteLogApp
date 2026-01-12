import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={{flex: 1, backgroundColor: '#F5F7FA'}}>
      <Stack.Screen options={{ title: '我的檔案', headerStyle: { backgroundColor: '#002147' }, headerTintColor: '#fff', headerShown: true }} />
      <ScrollView contentContainerStyle={{padding: 20}}>
        <View style={styles.profileBox}>
          <View style={styles.avatarLarge}><Text style={{fontSize: 40, color: '#fff'}}>吳</Text></View>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>吳資彬</Text>
          <Text style={{color: '#C69C6D', marginTop: 5, fontWeight:'bold'}}>副總</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('編輯資料')}>
            <Text style={{color:'#fff', fontWeight:'bold'}}>編輯個人詳細資料</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  profileBox: { backgroundColor: '#fff', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 3 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#C69C6D', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  editBtn: { backgroundColor:'#002147', padding: 15, borderRadius: 10, width:'100%', alignItems:'center', marginTop:20 }
});
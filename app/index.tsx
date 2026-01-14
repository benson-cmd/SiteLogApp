import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUser } from '../context/UserContext'; 

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { alert('請輸入帳號與密碼'); return; }
    const success = await login(email, password);
    if (success) {
      router.replace('/dashboard'); // ⭐️ 確保絕對導向至首頁
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 30}}>
      <Image source={require('../assets/logo.png')} style={{width: 150, height: 150}} resizeMode="contain" />
      <Text style={{fontSize: 26, fontWeight: 'bold', color: '#002147', marginVertical: 20}}>DW工程日誌系統</Text>
      <View style={{width: '100%', padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 4}}>
        <TextInput style={styles.input} placeholder="帳號" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="密碼" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: 'bold'}}>登入系統</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#C69C6D', padding: 15, borderRadius: 8, alignItems: 'center' }
});
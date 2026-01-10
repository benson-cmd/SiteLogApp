import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUser } from '../context/UserContext'; // 確保引用正確

const THEME = {
  primary: '#C69C6D',
  background: '#121212',
  card: '#1E1E1E',
  text: '#ffffff',
  textSec: '#999999',
  border: '#333333'
};

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useUser(); // 使用全域登入狀態
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // 1. 簡單驗證
    if (!email || !password) {
      if (Platform.OS === 'web') {
        alert('請輸入帳號與密碼');
      } else {
        Alert.alert('錯誤', '請輸入帳號與密碼');
      }
      return;
    }

    // 2. 為了測試方便，只要是 admin 就放行，或者您可以加上 console.log 檢查
    console.log('嘗試登入:', email, password);

    // 這裡模擬登入成功
    if (email === 'admin' && password === 'admin') {
      // 呼叫 Context 的 login (如果有的話)，或是直接導航
      // await login(email); 
      
      // 3. 導航到專案列表
      router.replace('/projects');
    } else {
      // 暫時允許任何帳號登入以便測試 (除了空的)
      router.replace('/projects');
      
      // 如果要嚴格一點：
      // alert('帳號或密碼錯誤 (測試請用 admin/admin)');
    }
  };

  const handleRegister = () => {
    // 導向註冊頁面
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.logoArea}>
        {/* 如果沒有 logo 圖片，可以先用文字代替，或確保路徑正確 */}
        {/* <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" /> */}
        <Text style={styles.logoText}>DW工程日誌系統</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>帳號 (Email)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="admin" 
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>密碼</Text>
        <TextInput 
          style={styles.input} 
          placeholder="admin" 
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>登入系統</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert('請聯絡管理員重設密碼')}>
          <Text style={styles.forgot}>忘記密碼？</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 修正：這裡只保留一個註冊按鈕 */}
        <TouchableOpacity onPress={handleRegister} style={styles.registerContainer}>
          <Text style={styles.registerText}>沒有帳號？申請註冊</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, justifyContent: 'center', padding: 20 },
  logoArea: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#002147', marginTop: 10 }, // 配合您的截圖顏色
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  label: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 8, marginBottom: 20, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
  btn: { backgroundColor: THEME.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  forgot: { color: '#666', textAlign: 'center', marginTop: 15, textDecorationLine: 'underline' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  registerContainer: { alignItems: 'center' },
  registerText: { color: '#002147', fontWeight: 'bold', fontSize: 16 }
});
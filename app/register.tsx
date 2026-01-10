import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useUser();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // 驗證必填欄位
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('錯誤', '請填寫所有欄位');
      return;
    }

    // 驗證 Email 格式（簡單驗證）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('錯誤', '請輸入有效的 Email 格式');
      return;
    }

    // 驗證密碼長度
    if (password.length < 6) {
      Alert.alert('錯誤', '密碼長度至少需要 6 個字元');
      return;
    }

    // 驗證密碼與確認密碼是否一致
    if (password !== confirmPassword) {
      Alert.alert('錯誤', '密碼與確認密碼不一致');
      return;
    }

    setIsLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      // 註冊成功，顯示 Alert
      Alert.alert(
        '申請已送出',
        '申請已送出，請等待管理員核准',
        [
          {
            text: '確定',
            onPress: () => {
              // 跳轉回登入頁
              router.replace('/login');
            },
          },
        ]
      );
    } catch (error: any) {
      // 註冊失敗，顯示錯誤訊息
      Alert.alert('註冊失敗', error.message || '註冊時發生錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* 大標題 */}
          <Text style={styles.title}>員工註冊申請</Text>

          {/* 姓名輸入框 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="姓名"
              placeholderTextColor="#999999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Email 輸入框 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* 密碼輸入框 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="密碼"
              placeholderTextColor="#999999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* 確認密碼輸入框 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="確認密碼"
              placeholderTextColor="#999999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* 送出按鈕 */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? '送出中...' : '送出'}
            </Text>
          </TouchableOpacity>

          {/* 返回登入連結 */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.replace('/login')}
            disabled={isLoading}
          >
            <Text style={styles.loginLinkText}>已有帳號？返回登入</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002147',
    marginBottom: 48,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#C69C6D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  loginLink: {
    marginTop: 8,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#002147',
    textDecorationLine: 'underline',
  },
});

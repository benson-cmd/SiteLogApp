import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const THEME = {
  background: '#ffffff',
  textPrimary: '#002147',
  textSecondary: '#666666',
  accent: '#C69C6D',
  inputBg: '#F5F5F5',
  inputBorder: '#E0E0E0',
  placeholder: '#999999'
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    if (!email) {
      Alert.alert('錯誤', '請輸入您的 Email');
      return;
    }

    setIsLoading(true);

    // 模擬寄送重設信的延遲
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        '已發送重設信',
        `系統已發送密碼重設連結至 ${email}，請前往收信並設定新密碼。`,
        [
          { text: '好的，回登入頁', onPress: () => router.back() }
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ title: '重設密碼', headerTintColor: THEME.textPrimary }} />
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>忘記密碼？</Text>
          <Text style={styles.subtitle}>請輸入您註冊時的 Email，我們將寄送重設連結給您。</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>帳號 (Email)</Text>
            <TextInput
              style={styles.input}
              placeholder="example@dwcc.com.tw"
              placeholderTextColor={THEME.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleReset}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? '發送中...' : '發送重設連結'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => router.back()}>
            <Text style={styles.linkText}>想起密碼了？返回登入</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  formContainer: { width: '100%', maxWidth: 400, alignSelf: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: THEME.textPrimary, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: THEME.textSecondary, marginBottom: 30, textAlign: 'center', lineHeight: 24 },
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { color: '#333333', marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: THEME.inputBg, borderWidth: 1, borderColor: THEME.inputBorder, borderRadius: 8, padding: 15, fontSize: 16, color: '#000000' },
  button: { width: '100%', backgroundColor: THEME.accent, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, shadowColor: '#C69C6D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  linkButton: { marginTop: 20, padding: 10 },
  linkText: { color: THEME.textPrimary, fontSize: 16, textAlign: 'center' }
});
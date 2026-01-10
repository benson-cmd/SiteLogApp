import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
// 正確引用 Context Hook
import { useLog } from '../../context/LogContext';
import { useProject } from '../../context/ProjectContext';

const THEME = {
  background: '#ffffff',
  text: '#002147',
  textSec: '#555555',
  cardBg: '#ffffff',
  accent: '#C69C6D',
  inputBg: '#F5F5F5',
  border: '#E0E0E0'
};

const WEATHER_OPTIONS = ['晴', '陰', '雨'];

export default function NewLogScreen() {
  const router = useRouter();
  const { addLog } = useLog();
  const { projects } = useProject(); // 取得專案列表供選擇

  // 表單狀態
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState('晴');
  const [projectId, setProjectId] = useState('');
  const [workItems, setWorkItems] = useState('');
  const [workers, setWorkers] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    // 1. 驗證必填
    if (!projectId) {
      Alert.alert('錯誤', '請選擇所屬專案');
      return;
    }
    if (!workItems || !workers) {
      Alert.alert('錯誤', '請填寫施工項目與出工人數');
      return;
    }

    try {
      // 2. 呼叫 Context 新增功能 (注意欄位要對應 LogContext 定義)
      await addLog({
        date,
        weather,
        projectId, // 這裡存專案名稱或ID
        workItems,
        workers: parseInt(workers) || 0, // 轉成數字
        notes
      });

      Alert.alert('成功', '施工日誌已儲存', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e) {
      Alert.alert('錯誤', '儲存失敗，請稍後再試');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={THEME.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>新增今日日誌</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>日期</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>天氣</Text>
          <View style={styles.weatherContainer}>
            {WEATHER_OPTIONS.map(w => (
              <TouchableOpacity
                key={w}
                style={[styles.weatherBtn, weather === w && styles.weatherBtnActive]}
                onPress={() => setWeather(w)}
              >
                <Text style={[styles.weatherText, weather === w && styles.weatherTextActive]}>{w}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>所屬專案</Text>
          {projects.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectScroll}>
              {projects.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.projectChip, projectId === p.name && styles.projectChipActive]}
                  onPress={() => setProjectId(p.name)}
                >
                  <Text style={[styles.projectText, projectId === p.name && styles.projectTextActive]}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={{ color: '#999', padding: 10 }}>目前無進行中專案，請先至專案列表新增。</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>施工項目摘要</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={workItems}
            onChangeText={setWorkItems}
            placeholder="例如：1F 牆面粉刷、B1 綁紮鋼筋..."
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>出工人數 (人)</Text>
          <TextInput
            style={styles.input}
            value={workers}
            onChangeText={setWorkers}
            placeholder="請輸入數字"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>備註 (選填)</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder="例如：下午三點雷陣雨，暫停戶外作業"
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>儲存日誌</Text>
        </TouchableOpacity>
        
        <View style={{height: 50}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.text },
  
  formGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: THEME.text, marginBottom: 8 },
  input: { backgroundColor: THEME.inputBg, padding: 15, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: THEME.border },
  
  weatherContainer: { flexDirection: 'row', gap: 10 },
  weatherBtn: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: THEME.inputBg, alignItems: 'center', borderWidth: 1, borderColor: THEME.border },
  weatherBtnActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  weatherText: { color: THEME.textSec },
  weatherTextActive: { color: '#000', fontWeight: 'bold' },

  projectScroll: { flexDirection: 'row' },
  projectChip: { paddingHorizontal: 15, paddingVertical: 10, backgroundColor: THEME.inputBg, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: THEME.border },
  projectChipActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  projectText: { color: THEME.textSec },
  projectTextActive: { color: '#000', fontWeight: 'bold' },

  submitBtn: { backgroundColor: THEME.accent, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18 }
});
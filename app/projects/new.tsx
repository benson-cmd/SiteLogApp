import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useState } from 'react';

const THEME = {
  primary: '#C69C6D',
  background: '#F5F7FA',
  headerBg: '#002147',
  sectionBg: '#FFF5E6', // 淺橘色標題底
  card: '#ffffff',
  text: '#333',
  border: '#E0E0E0'
};

export default function NewProjectScreen() {
  const router = useRouter();

  // 表單狀態
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [manager, setManager] = useState(''); // 工地主任
  const [status, setStatus] = useState('未開工');
  const [progress, setProgress] = useState('0');
  
  // 日期欄位 (暫時用文字輸入，避免 DatePicker 套件相容性問題)
  const [startDate, setStartDate] = useState('');
  const [contractDays, setContractDays] = useState('');
  const [type, setType] = useState('日曆天'); // 工期類型

  // 預設選項
  const managers = ['吳資彬', '現場工程師'];
  const statusOptions = ['未開工', '已開工未進場', '施工中', '完工待驗收', '驗收中', '結案'];
  const typeOptions = ['日曆天', '工作天'];

  const handleSave = () => {
    if (!name || !manager) {
      alert('請填寫專案名稱與工地主任');
      return;
    }
    // 這裡未來會連接資料庫
    router.back();
  };

  // 渲染分區標題
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: '新增專案',
          headerStyle: { backgroundColor: THEME.headerBg },
          headerTintColor: '#fff',
          headerShown: true
        }} 
      />

      <ScrollView contentContainerStyle={styles.form}>
        
        {/* 基本資料 */}
        <View style={styles.card}>
          <SectionHeader title="基本資料" />
          
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>專案名稱 *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="例如：台中七期商辦大樓" 
              value={name} onChangeText={setName} 
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>工地地址</Text>
            <TextInput 
              style={styles.input} 
              placeholder="例如：台中市西屯區..." 
              value={address} onChangeText={setAddress} 
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>工地主任 *</Text>
            <View style={styles.chipContainer}>
              {managers.map((m) => (
                <TouchableOpacity 
                  key={m} 
                  style={[styles.chip, manager === m && styles.chipSelected]}
                  onPress={() => setManager(m)}
                >
                  <Text style={[styles.chipText, manager === m && styles.chipTextSelected]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 狀態與進度 */}
        <View style={styles.card}>
          <SectionHeader title="狀態與進度" />
          
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>施工狀態</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {statusOptions.map((s) => (
                <TouchableOpacity 
                  key={s} 
                  style={[styles.chip, status === s && styles.chipSelected]}
                  onPress={() => setStatus(s)}
                >
                  <Text style={[styles.chipText, status === s && styles.chipTextSelected]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>目前進度 (%)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              value={progress} onChangeText={setProgress} 
            />
          </View>
        </View>

        {/* 契約與工期 */}
        <View style={styles.card}>
          <SectionHeader title="契約與工期" />
          
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>決標日期</Text>
              <TextInput style={styles.input} placeholder="年/月/日" />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>開工日期 *</Text>
              <TextInput 
                style={styles.input} placeholder="年/月/日"
                value={startDate} onChangeText={setStartDate}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>契約工期 (天) *</Text>
              <TextInput 
                style={styles.input} placeholder="天數"
                value={contractDays} onChangeText={setContractDays}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>工期類型</Text>
              <View style={styles.chipContainer}>
                {typeOptions.map((t) => (
                  <TouchableOpacity 
                    key={t} 
                    style={[styles.chip, type === t && styles.chipSelected]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.chipText, type === t && styles.chipTextSelected]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 驗收結束 (選填) */}
        <View style={styles.card}>
          <SectionHeader title="驗收結束 (選填)" />
          
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>實際竣工日</Text>
              <TextInput style={styles.input} placeholder="年/月/日" />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>驗收日期</Text>
              <TextInput style={styles.input} placeholder="年/月/日" />
            </View>
          </View>
        </View>

        {/* 送出按鈕 */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitBtnText}>確認新增</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  form: { padding: 15, paddingBottom: 50 },
  card: {
    backgroundColor: THEME.card,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1, borderColor: '#eee'
  },
  sectionHeader: {
    backgroundColor: THEME.sectionBg,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10
  },
  sectionTitle: {
    color: THEME.primary,
    fontWeight: 'bold',
    fontSize: 16
  },
  fieldGroup: { paddingHorizontal: 15, marginBottom: 15 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1, borderColor: THEME.border, borderRadius: 6,
    padding: 12, fontSize: 16, color: '#333'
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 15 },
  halfField: { width: '48%' },
  
  // Chip 樣式
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  horizontalScroll: { flexDirection: 'row' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#ddd',
    backgroundColor: '#fff', marginRight: 8, marginBottom: 5
  },
  chipSelected: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary
  },
  chipText: { color: '#666' },
  chipTextSelected: { color: '#fff', fontWeight: 'bold' },

  // 送出按鈕
  submitBtn: {
    backgroundColor: THEME.primary,
    padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10
  },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
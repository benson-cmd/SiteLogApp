import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const THEME = {
  primary: '#C69C6D',
  background: '#F5F7FA',
  headerBg: '#002147',
  sectionBg: '#FFF5E6',
  card: '#ffffff',
  text: '#333',
  border: '#E0E0E0'
};

// 1. 模擬人員管理資料庫 (之後可從 Context 讀取)
const PERSONNEL_DB = [
  { id: '1', name: '吳資彬' },
  { id: '2', name: '現場工程師' },
  { id: '3', name: '陳大文' }, // 新增模擬人員
];

export default function NewProjectScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [manager, setManager] = useState('');
  const [status, setStatus] = useState('未開工');
  const [progress, setProgress] = useState('0');
  
  // 日期欄位
  const [startDate, setStartDate] = useState('');
  const [contractDays, setContractDays] = useState('');
  const [type, setType] = useState('日曆天');
  
  // 新增的欄位
  const [actualEndDate, setActualEndDate] = useState('');
  const [inspectDate, setInspectDate] = useState('');
  const [reInspectDate, setReInspectDate] = useState(''); // 複驗日期
  const [qualifiedDate, setQualifiedDate] = useState(''); // 驗收合格日

  // 月曆 Modal 控制
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(''); // 紀錄現在正在選哪個欄位

  const statusOptions = ['未開工', '已開工未進場', '施工中', '完工待驗收', '驗收中', '結案'];
  const typeOptions = ['日曆天', '工作天'];

  const handleSave = () => {
    if (!name || !manager) {
      alert('請填寫專案名稱與工地主任');
      return;
    }
    router.back();
  };

  // 開啟月曆
  const openCalendar = (fieldSetterName: string) => {
    setCurrentDateField(fieldSetterName);
    setCalendarVisible(true);
  };

  // 處理日期選擇
  const handleDateSelect = (day: number) => {
    const formattedDate = `2026/01/${day < 10 ? '0' + day : day}`; // 簡易模擬
    
    if (currentDateField === 'startDate') setStartDate(formattedDate);
    if (currentDateField === 'actualEndDate') setActualEndDate(formattedDate);
    if (currentDateField === 'inspectDate') setInspectDate(formattedDate);
    if (currentDateField === 'reInspectDate') setReInspectDate(formattedDate);
    if (currentDateField === 'qualifiedDate') setQualifiedDate(formattedDate);

    setCalendarVisible(false);
  };

  // 自製簡易日期選擇器 (Date Input Component)
  const DateInput = ({ label, value, fieldName, required = false }: any) => (
    <View style={styles.halfField}>
      <Text style={styles.label}>{label} {required && '*'}</Text>
      <TouchableOpacity style={styles.dateInputBtn} onPress={() => openCalendar(fieldName)}>
        <Text style={[styles.dateText, !value && { color: '#999' }]}>{value || '請選擇日期'}</Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '新增專案', headerStyle: { backgroundColor: THEME.headerBg }, headerTintColor: '#fff', headerShown: true }} />

      <ScrollView contentContainerStyle={styles.form}>
        
        {/* 基本資料 */}
        <View style={styles.card}>
          <SectionHeader title="基本資料" />
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>專案名稱 *</Text>
            <TextInput style={styles.input} placeholder="例如：台中七期商辦大樓" value={name} onChangeText={setName} />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>工地地址</Text>
            <TextInput style={styles.input} placeholder="例如：台中市西屯區..." value={address} onChangeText={setAddress} />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>工地主任 * (已連動人員名單)</Text>
            <View style={styles.chipContainer}>
              {/* 2. 這裡改成從 PERSONNEL_DB 讀取資料 */}
              {PERSONNEL_DB.map((p) => (
                <TouchableOpacity 
                  key={p.id} 
                  style={[styles.chip, manager === p.name && styles.chipSelected]}
                  onPress={() => setManager(p.name)}
                >
                  <Text style={[styles.chipText, manager === p.name && styles.chipTextSelected]}>{p.name}</Text>
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
                <TouchableOpacity key={s} style={[styles.chip, status === s && styles.chipSelected]} onPress={() => setStatus(s)}>
                  <Text style={[styles.chipText, status === s && styles.chipTextSelected]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>目前進度 (%)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={progress} onChangeText={setProgress} />
          </View>
        </View>

        {/* 契約與工期 */}
        <View style={styles.card}>
          <SectionHeader title="契約與工期" />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>決標日期</Text>
              <TextInput style={styles.input} placeholder="文字輸入" />
            </View>
            <DateInput label="開工日期" value={startDate} fieldName="startDate" required />
          </View>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>契約工期 (天) *</Text>
              <TextInput style={styles.input} placeholder="天數" value={contractDays} onChangeText={setContractDays} keyboardType="numeric" />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>工期類型</Text>
              <View style={styles.chipContainer}>
                {typeOptions.map((t) => (
                  <TouchableOpacity key={t} style={[styles.chip, type === t && styles.chipSelected]} onPress={() => setType(t)}>
                    <Text style={[styles.chipText, type === t && styles.chipTextSelected]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 驗收結束 (補齊欄位) */}
        <View style={styles.card}>
          <SectionHeader title="驗收結束 (選填)" />
          <View style={styles.row}>
            <DateInput label="實際竣工日" value={actualEndDate} fieldName="actualEndDate" />
            <DateInput label="驗收日期" value={inspectDate} fieldName="inspectDate" />
          </View>
          <View style={styles.row}>
            <DateInput label="複驗日期" value={reInspectDate} fieldName="reInspectDate" />
            <DateInput label="驗收合格日" value={qualifiedDate} fieldName="qualifiedDate" />
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitBtnText}>確認新增</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- 簡易月曆 Modal --- */}
      <Modal visible={calendarVisible} transparent animationType="fade">
        <View style={styles.modalCenter}>
          <View style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>選擇日期 (2026/01)</Text>
            <View style={styles.calendarGrid}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <TouchableOpacity key={day} style={styles.dayCell} onPress={() => handleDateSelect(day)}>
                  <Text style={styles.dayText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCalendarVisible(false)}>
              <Text style={styles.closeText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  form: { padding: 15, paddingBottom: 50 },
  card: { backgroundColor: THEME.card, borderRadius: 8, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  sectionHeader: { backgroundColor: THEME.sectionBg, paddingVertical: 10, paddingHorizontal: 15, marginBottom: 10 },
  sectionTitle: { color: THEME.primary, fontWeight: 'bold', fontSize: 16 },
  fieldGroup: { paddingHorizontal: 15, marginBottom: 15 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: THEME.border, borderRadius: 6, padding: 12, fontSize: 16, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 15, gap: 10 },
  halfField: { flex: 1 },
  dateInputBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: THEME.border, borderRadius: 6, padding: 12 },
  dateText: { fontSize: 16, color: '#333' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  horizontalScroll: { flexDirection: 'row' },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff', marginRight: 8, marginBottom: 5 },
  chipSelected: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  chipText: { color: '#666' },
  chipTextSelected: { color: '#fff', fontWeight: 'bold' },
  submitBtn: { backgroundColor: THEME.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  // Calendar Styles
  modalCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  calendarCard: { width: '85%', backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  calendarTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: THEME.headerBg },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  dayCell: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 20 },
  dayText: { fontSize: 16 },
  closeBtn: { marginTop: 20, padding: 10, alignItems: 'center' },
  closeText: { color: 'red', fontSize: 16 }
});
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, createElement } from 'react'; // 加入 createElement
import { Ionicons } from '@expo/vector-icons';
import { useProject, ProjectStatus, Extension } from '../../context/ProjectContext';
import { useUser } from '../../context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const THEME = {
  background: '#ffffff',
  text: '#002147',
  textSec: '#555555',
  cardBg: '#ffffff',
  accent: '#C69C6D',
  inputBg: '#F5F5F5',
  border: '#E0E0E0'
};

const STATUS_OPTIONS: { label: string; value: ProjectStatus }[] = [
  { label: '未開工', value: 'not_started' },
  { label: '已開工未進場', value: 'started_offsite' },
  { label: '施工中', value: 'ongoing' },
  { label: '完工待驗收', value: 'completed_pending' },
  { label: '驗收中', value: 'inspecting' },
  { label: '結案', value: 'closed' }
];

export default function NewProjectScreen() {
  const router = useRouter();
  const { addProject } = useProject();
  const { allUsers } = useUser();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState(''); 
  const [status, setStatus] = useState<ProjectStatus>('not_started');
  const [progress, setProgress] = useState('0');
  
  const [awardDate, setAwardDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [contractDuration, setContractDuration] = useState('');
  const [durationType, setDurationType] = useState<'calendar' | 'working'>('calendar');

  const [actualCompletionDate, setActualCompletionDate] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [reinspectionDate, setReinspectionDate] = useState('');
  const [inspectionPassedDate, setInspectionPassedDate] = useState('');

  const [extensions, setExtensions] = useState<Extension[]>([]);

  const handleSubmit = async () => {
    if (!name || !startDate || !contractDuration) {
      Alert.alert('錯誤', '請填寫專案名稱、開工日期與契約工期');
      return;
    }

    try {
      await addProject({
        name,
        location,
        manager,
        status,
        progress: parseInt(progress) || 0,
        awardDate,
        startDate,
        contractDuration,
        durationType,
        actualCompletionDate,
        inspectionDate,
        reinspectionDate,
        inspectionPassedDate,
        extensions
      });

      Alert.alert('成功', '專案已建立', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) {
      Alert.alert('錯誤', '建立失敗');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: THEME.background }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={THEME.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>新增專案</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.sectionHeader}>基本資訊</Text>
          <InputGroup label="專案名稱 *" value={name} onChange={setName} placeholder="輸入專案名稱" />
          <InputGroup label="工程地點" value={location} onChange={setLocation} placeholder="輸入地點" />
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>工地主任</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {allUsers.map(user => (
                <TouchableOpacity
                  key={user.id}
                  style={[styles.chip, manager === user.name && styles.chipActive]}
                  onPress={() => setManager(user.name)}
                >
                  <Text style={[styles.chipText, manager === user.name && styles.chipTextActive]}>{user.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.sectionHeader}>狀態與進度</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>施工狀態</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {STATUS_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, status === opt.value && styles.chipActive]}
                  onPress={() => setStatus(opt.value)}
                >
                  <Text style={[styles.chipText, status === opt.value && styles.chipTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <InputGroup label="目前進度 (%)" value={progress} onChange={setProgress} keyboardType="numeric" placeholder="0" />

          <Text style={styles.sectionHeader}>契約與工期</Text>
          <View style={styles.row}>
            <DateInput label="決標日期" value={awardDate} onChange={setAwardDate} style={{flex:1, marginRight:10}} />
            <DateInput label="開工日期 *" value={startDate} onChange={setStartDate} style={{flex:1}} />
          </View>
          
          <View style={styles.row}>
            <InputGroup label="契約工期 (天) *" value={contractDuration} onChange={setContractDuration} keyboardType="numeric" style={{flex:1, marginRight:10}} />
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>工期類型</Text>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <TouchableOpacity style={[styles.chip, durationType === 'calendar' && styles.chipActive]} onPress={() => setDurationType('calendar')}>
                  <Text style={[styles.chipText, durationType === 'calendar' && styles.chipTextActive]}>日曆天</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.chip, durationType === 'working' && styles.chipActive]} onPress={() => setDurationType('working')}>
                  <Text style={[styles.chipText, durationType === 'working' && styles.chipTextActive]}>工作天</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.sectionHeader}>驗收結案 (選填)</Text>
          <View style={styles.row}>
            <DateInput label="實際竣工日" value={actualCompletionDate} onChange={setActualCompletionDate} style={{flex:1, marginRight:10}} />
            <DateInput label="驗收日期" value={inspectionDate} onChange={setInspectionDate} style={{flex:1}} />
          </View>
          <View style={styles.row}>
            <DateInput label="複驗日期" value={reinspectionDate} onChange={setReinspectionDate} style={{flex:1, marginRight:10}} />
            <DateInput label="驗收合格日" value={inspectionPassedDate} onChange={setInspectionPassedDate} style={{flex:1}} />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>建立專案</Text>
          </TouchableOpacity>
          <View style={{ height: 50 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// 輔助元件
const InputGroup = ({ label, value, onChange, placeholder, keyboardType, style }: any) => (
  <View style={[styles.formGroup, style]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput 
      style={styles.input} 
      value={value} 
      onChangeText={onChange} 
      placeholder={placeholder} 
      placeholderTextColor="#999"
      keyboardType={keyboardType} 
    />
  </View>
);

// --- 📅 終極修復的日曆元件 ---
const DateInput = ({ label, value, onChange, style }: any) => {
  const [show, setShow] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      onChange(dateString);
    }
  };

  // 1. Web 版：直接使用原生 HTML input，保證彈出日曆
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.formGroup, style]}>
        <Text style={styles.label}>{label}</Text>
        {createElement('input', {
          type: 'date',
          value: value,
          onChange: (e: any) => onChange(e.target.value),
          style: {
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: THEME.border,
            borderStyle: 'solid',
            backgroundColor: THEME.inputBg,
            fontSize: 16,
            color: '#000',
            width: '100%',
            height: 45,
            boxSizing: 'border-box',
            fontFamily: 'System'
          }
        })}
      </View>
    );
  }

  // 2. App 版：使用原生彈窗
  return (
    <View style={[styles.formGroup, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={() => setShow(true)} style={styles.dateButton}>
        <Text style={[styles.dateText, !value && { color: '#999' }]}>
          {value || '選擇日期'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>
      
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.text },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: THEME.accent, marginTop: 10, marginBottom: 10, backgroundColor: '#F9F9F9', padding: 8, borderRadius: 4 },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: THEME.text, marginBottom: 6 },
  input: { backgroundColor: THEME.inputBg, padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: THEME.border, color: '#000' },
  row: { flexDirection: 'row' },
  chip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: THEME.inputBg, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: THEME.border },
  chipActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  chipText: { color: THEME.textSec, fontSize: 13 },
  chipTextActive: { color: '#000', fontWeight: 'bold' },
  submitBtn: { backgroundColor: THEME.accent, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  dateButton: { backgroundColor: THEME.inputBg, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: THEME.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 45 },
  dateText: { fontSize: 16, color: '#000' }
});
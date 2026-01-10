import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Modal, TextInput, KeyboardAvoidingView, StyleProp, ViewStyle } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProject, Project, ProjectStatus, Extension } from '../../context/ProjectContext';
import { useUser } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useState, createElement } from 'react'; // 加入 createElement
import DateTimePicker from '@react-native-community/datetimepicker';

const THEME = {
  background: '#ffffff',
  text: '#002147',
  textSec: '#555555',
  cardBg: '#ffffff',
  accent: '#C69C6D',
  border: '#E0E0E0',
  danger: '#ff4444',
  inputBg: '#F5F5F5'
};

const STATUS_MAP: Record<ProjectStatus, string> = {
  'not_started': '未開工',
  'started_offsite': '已開工未進場',
  'ongoing': '施工中',
  'completed_pending': '完工待驗收',
  'inspecting': '驗收中',
  'closed': '結案'
};

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { projects, deleteProject, updateProject } = useProject();
  const { isAdmin, allUsers } = useUser();
  const router = useRouter();

  const project = projects.find(p => p.id === id);
  
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editData, setEditData] = useState<Partial<Project>>({});
  
  const [newExt, setNewExt] = useState<Partial<Extension>>({ letterDate: '', letterNumber: '', reason: '', days: 0 });
  const [showExtForm, setShowExtForm] = useState(false);

  if (!project) return null;

  const calculateTotalExtension = (exts: Extension[] = []) => {
    return exts.reduce((sum, e) => sum + (Number(e.days) || 0), 0);
  };

  const calculateEndDate = (start: string, duration: string, extDays: number) => {
    if (!start || !duration) return '資料不全';
    try {
      const startDate = new Date(start);
      const totalDays = parseInt(duration) + extDays - 1; 
      startDate.setDate(startDate.getDate() + totalDays);
      return startDate.toISOString().split('T')[0];
    } catch (e) {
      return '計算錯誤';
    }
  };

  const displayExtDays = calculateTotalExtension(project.extensions);
  const displayEndDate = calculateEndDate(project.startDate, project.contractDuration, displayExtDays);

  const editExtDays = calculateTotalExtension(editData.extensions);
  const editEndDate = calculateEndDate(editData.startDate || '', editData.contractDuration || '0', editExtDays);

  const handleDelete = () => {
    const action = async () => { await deleteProject(project.id); router.back(); };
    if (Platform.OS === 'web') { if(confirm('確定刪除？')) action(); }
    else { Alert.alert('刪除確認', '確定刪除？', [{text:'取消'}, {text:'刪除', style:'destructive', onPress:action}]); }
  };

  const openEdit = () => {
    setEditData(JSON.parse(JSON.stringify(project)));
    setIsEditVisible(true);
  };

  const handleSaveEdit = async () => {
    await updateProject(project.id, editData);
    setIsEditVisible(false);
    Alert.alert('成功', '專案資料已更新');
  };

  const addExtension = () => {
    if (!newExt.days || !newExt.reason) {
      Alert.alert('錯誤', '請填寫天數與理由');
      return;
    }
    const extension: Extension = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      days: Number(newExt.days),
      reason: newExt.reason || '',
      letterDate: newExt.letterDate || '',
      letterNumber: newExt.letterNumber || ''
    };
    setEditData(prev => ({ ...prev, extensions: [...(prev.extensions || []), extension] }));
    setNewExt({ letterDate: '', letterNumber: '', reason: '', days: 0 });
    setShowExtForm(false);
  };

  const removeExtension = (extId: string) => {
    setEditData(prev => ({ ...prev, extensions: prev.extensions?.filter(e => e.id !== extId) }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{project.name}</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{STATUS_MAP[project.status]}</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本資訊</Text>
        <InfoRow label="工程地點" value={project.location} />
        <InfoRow label="工地主任" value={project.manager} />
        <InfoRow label="決標日期" value={project.awardDate} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>工期與進度</Text>
        <InfoRow label="開工日期" value={project.startDate} />
        <InfoRow label="契約工期" value={`${project.contractDuration} 天 (${project.durationType === 'calendar'?'日曆天':'工作天'})`} />
        <InfoRow label="展延工期" value={`${displayExtDays} 天`} />
        <InfoRow label="預定竣工" value={displayEndDate} highlight />
        <View style={styles.divider} />
        <InfoRow label="實際竣工" value={project.actualCompletionDate} />
        <InfoRow label="驗收日期" value={project.inspectionDate} />
        <InfoRow label="複驗日期" value={project.reinspectionDate} />
        <InfoRow label="驗收合格" value={project.inspectionPassedDate} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>展延紀錄 ({project.extensions?.length || 0}筆)</Text>
        {project.extensions && project.extensions.length > 0 ? (
          project.extensions.map((ext, idx) => (
            <View key={idx} style={styles.extCard}>
              <View style={styles.extHeader}>
                <Text style={styles.extReason}>{ext.reason}</Text>
                <Text style={styles.extDays}>+{ext.days}天</Text>
              </View>
              <Text style={styles.extMeta}>函文：{ext.letterDate} {ext.letterNumber}</Text>
            </View>
          ))
        ) : <Text style={styles.noData}>無展延紀錄</Text>}
      </View>

      {isAdmin && (
        <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
          <Text style={styles.btnText}>編輯專案與工期</Text>
        </TouchableOpacity>
      )}
      <View style={{height: 50}} />

      {/* --- 編輯 Modal --- */}
      <Modal visible={isEditVisible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>編輯專案</Text>
              <TouchableOpacity onPress={() => setIsEditVisible(false)}><Ionicons name="close" size={28} /></TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={{padding: 20}}>
              {/* 基本設定 */}
              <Text style={styles.groupTitle}>基本設定</Text>
              <Input label="專案名稱" value={editData.name} onChange={t => setEditData({...editData, name: t})} />
              <Input label="工程地點" value={editData.location} onChange={t => setEditData({...editData, location: t})} />
              
              <View style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5, color: '#666', fontWeight: 'bold', fontSize: 13 }}>工地主任</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {allUsers.map(user => (
                    <TouchableOpacity 
                      key={user.id} 
                      onPress={() => setEditData({...editData, manager: user.name})} 
                      style={[styles.chip, editData.manager === user.name && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, editData.manager === user.name && styles.chipTextActive]}>{user.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Input label="施工狀態" value={editData.status} options={STATUS_MAP} onSelect={(k) => setEditData({...editData, status: k as ProjectStatus})} isSelect />
              <Input label="目前進度 (%)" value={String(editData.progress)} onChange={t => setEditData({...editData, progress: parseInt(t)||0})} keyboardType="numeric" />

              {/* 關鍵日期 */}
              <Text style={styles.groupTitle}>關鍵日期</Text>
              <View style={styles.row}>
                <DateInput label="決標日期" value={editData.awardDate} onChange={t => setEditData({...editData, awardDate: t})} style={{flex:1, marginRight:10}} />
                <DateInput label="開工日期" value={editData.startDate} onChange={t => setEditData({...editData, startDate: t})} style={{flex:1}} />
              </View>
              <View style={styles.row}>
                <Input label="契約工期(天)" value={editData.contractDuration} onChange={t => setEditData({...editData, contractDuration: t})} keyboardType="numeric" style={{flex:1, marginRight:10}} />
                
                {/* 工期類型 (修復按鈕點選) */}
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>工期類型</Text>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    <TouchableOpacity 
                      style={[styles.chip, (editData.durationType || 'calendar') === 'calendar' && styles.chipActive]} 
                      onPress={() => setEditData({...editData, durationType: 'calendar'})}
                    >
                      <Text style={[styles.chipText, (editData.durationType || 'calendar') === 'calendar' && styles.chipTextActive]}>日曆天</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.chip, editData.durationType === 'working' && styles.chipActive]} 
                      onPress={() => setEditData({...editData, durationType: 'working'})}
                    >
                      <Text style={[styles.chipText, editData.durationType === 'working' && styles.chipTextActive]}>工作天</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* 展延管理 */}
              <View style={styles.extSection}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                  <Text style={styles.groupTitle}>展延工期管理</Text>
                  <TouchableOpacity onPress={() => setShowExtForm(!showExtForm)}>
                    <Text style={{color:THEME.accent, fontWeight:'bold'}}>{showExtForm ? '取消新增' : '+ 新增紀錄'}</Text>
                  </TouchableOpacity>
                </View>

                {showExtForm && (
                  <View style={styles.addExtForm}>
                    <DateInput label="函文日期" value={newExt.letterDate} onChange={t => setNewExt({...newExt, letterDate: t})} />
                    <Input label="函文文號" value={newExt.letterNumber} onChange={t => setNewExt({...newExt, letterNumber: t})} />
                    <Input label="展延理由" value={newExt.reason} onChange={t => setNewExt({...newExt, reason: t})} />
                    <Input label="展延天數" value={String(newExt.days)} onChange={t => setNewExt({...newExt, days: Number(t)})} keyboardType="numeric" />
                    <TouchableOpacity style={styles.addBtn} onPress={addExtension}><Text style={styles.addBtnText}>加入列表</Text></TouchableOpacity>
                  </View>
                )}

                {editData.extensions?.map((ext, i) => (
                  <View key={i} style={styles.extEditRow}>
                    <View style={{flex:1}}>
                      <Text style={{fontWeight:'bold'}}>{ext.reason} (+{ext.days}天)</Text>
                      <Text style={{fontSize:12, color:'#666'}}>{ext.letterDate} | {ext.letterNumber}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeExtension(ext.id)}><Ionicons name="trash" size={20} color={THEME.danger} /></TouchableOpacity>
                  </View>
                ))}
                <Text style={styles.calcResult}>目前累計展延：{editExtDays} 天</Text>
              </View>

              <View style={styles.calcBox}>
                <Text style={styles.calcLabel}>系統自動推算</Text>
                <Text style={styles.calcValue}>預定竣工日：{editEndDate}</Text>
              </View>

              {/* 驗收結案 */}
              <Text style={styles.groupTitle}>驗收結案</Text>
              <DateInput label="實際竣工日" value={editData.actualCompletionDate} onChange={t => setEditData({...editData, actualCompletionDate: t})} />
              <DateInput label="驗收日期" value={editData.inspectionDate} onChange={t => setEditData({...editData, inspectionDate: t})} />
              <DateInput label="複驗日期" value={editData.reinspectionDate} onChange={t => setEditData({...editData, reinspectionDate: t})} />
              <DateInput label="驗收合格日" value={editData.inspectionPassedDate} onChange={t => setEditData({...editData, inspectionPassedDate: t})} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                <Text style={styles.saveBtnText}>儲存所有變更</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.deleteLink} onPress={handleDelete}>
                <Text style={{color: THEME.danger}}>刪除此專案</Text>
              </TouchableOpacity>
              
              <View style={{height: 50}} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

// 輔助元件
interface InfoRowProps {
  label: string;
  value?: string | number;
  highlight?: boolean;
}

const InfoRow = ({ label, value, highlight }: InfoRowProps) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
    <Text style={{ color: '#666' }}>{label}</Text>
    <Text style={{ color: highlight ? '#C69C6D' : '#002147', fontWeight: highlight ? 'bold' : 'normal' }}>{value || '-'}</Text>
  </View>
);

interface InputProps {
  label: string;
  value?: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  style?: StyleProp<ViewStyle>;
  isSelect?: boolean;
  options?: Record<string, string>;
  onSelect?: (key: string) => void;
}

const Input = ({ label, value, onChange, placeholder, keyboardType, style, isSelect, options, onSelect }: InputProps) => (
  <View style={[{ marginBottom: 15 }, style]}>
    <Text style={{ marginBottom: 5, color: '#666', fontWeight: 'bold', fontSize: 13 }}>{label}</Text>
    {isSelect && options && onSelect ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.entries(options).map(([k, v]) => (
          <TouchableOpacity key={k} onPress={() => onSelect(k)} style={[styles.chip, value === k && styles.chipActive]}>
            <Text style={[styles.chipText, value === k && styles.chipTextActive]}>{v}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ) : (
      <TextInput 
        style={styles.input} 
        value={value} 
        onChangeText={onChange} 
        placeholder={placeholder} 
        keyboardType={keyboardType} 
      />
    )}
  </View>
);

// --- 📅 終極修復的日曆元件 ---
interface DateInputProps {
  label: string;
  value?: string;
  onChange: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

const DateInput = ({ label, value, onChange, style }: DateInputProps) => {
  const [show, setShow] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      onChange(dateString);
    }
  };

  // 1. Web 版：使用原生 HTML input，保證彈出日曆
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
  container: { flex: 1, backgroundColor: THEME.background, padding: 20 },
  header: { marginBottom: 20, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: THEME.text, flex: 1 },
  badge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  badgeText: { color: THEME.text, fontWeight: 'bold', fontSize: 12 },
  section: { marginBottom: 15, backgroundColor: THEME.cardBg, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: THEME.border },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: THEME.accent, marginBottom: 12 },
  label: { marginBottom: 5, color: '#666', fontWeight: 'bold', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  noData: { color: '#999', fontStyle: 'italic', fontSize: 13 },
  extCard: { backgroundColor: '#F9F9F9', padding: 10, borderRadius: 8, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: THEME.accent },
  extHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  extReason: { fontWeight: 'bold', color: THEME.text },
  extDays: { color: THEME.accent, fontWeight: 'bold' },
  extMeta: { fontSize: 12, color: '#666' },
  editBtn: { backgroundColor: THEME.text, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalContent: { flex: 1, backgroundColor: '#fff', marginTop: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  groupTitle: { fontSize: 16, fontWeight: 'bold', color: THEME.text, marginTop: 10, marginBottom: 15, backgroundColor: '#F0F0F0', padding: 8, borderRadius: 4 },
  input: { backgroundColor: THEME.inputBg, padding: 12, borderRadius: 8, fontSize: 16 },
  row: { flexDirection: 'row' },
  chip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: THEME.inputBg, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: THEME.border },
  chipActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  chipText: { color: '#666' },
  chipTextActive: { color: '#000', fontWeight: 'bold' },
  extSection: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
  addExtForm: { backgroundColor: '#FAFAFA', padding: 10, borderRadius: 8, marginBottom: 10, marginTop: 10 },
  addBtn: { backgroundColor: THEME.accent, padding: 10, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#000', fontWeight: 'bold' },
  extEditRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  calcResult: { textAlign: 'right', marginTop: 10, color: THEME.accent, fontWeight: 'bold' },
  calcBox: { backgroundColor: '#E3F2FD', padding: 15, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
  calcLabel: { fontSize: 12, color: '#555', marginBottom: 4 },
  calcValue: { fontSize: 18, fontWeight: 'bold', color: '#002147' },
  saveBtn: { backgroundColor: THEME.accent, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  deleteLink: { alignItems: 'center', marginTop: 20, padding: 10 },
  dateButton: { backgroundColor: THEME.inputBg, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: THEME.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 45 },
  dateText: { fontSize: 16, color: '#000' },
  formGroup: { marginBottom: 15 }
});
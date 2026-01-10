import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useUser } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

const THEME = {
  background: '#ffffff',
  textPrimary: '#002147',
  textSecondary: '#666666',
  accent: '#C69C6D',
  inputBg: '#F5F5F5',
  border: '#E0E0E0',
  disabled: '#EBEBEB'
};

export default function ProfileScreen() {
  const { currentUser, logout, changePassword, updateProfile, isAdmin } = useUser();
  
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // --- 編輯表單狀態 ---
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  
  // 多筆資料陣列
  const [editEducation, setEditEducation] = useState<string[]>([]);
  const [editExperience, setEditExperience] = useState<string[]>([]);
  const [editLicenses, setEditLicenses] = useState<string[]>([]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- 計算年資 ---
  const calculateTenure = (startDate?: string) => {
    if (!startDate) return '未設定';
    try {
      const start = new Date(startDate);
      const now = new Date();
      if (isNaN(start.getTime())) return '日期格式錯誤';

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      
      if (months < 0) {
        years--;
        months += 12;
      }
      return `${years} 年 ${months} 個月`;
    } catch (e) {
      return '計算錯誤';
    }
  };

  // --- 上傳頭像 ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setEditAvatar(result.assets[0].uri);
    }
  };

  // --- 初始化編輯資料 ---
  const openEditProfile = () => {
    setEditName(currentUser?.name || '');
    setEditTitle(currentUser?.title || '');
    setEditPhone(currentUser?.phone || '');
    setEditStartDate(currentUser?.startDate || '');
    setEditAvatar(currentUser?.avatar || '');
    // 確保是陣列，如果是舊資料(字串)則轉為陣列
    setEditEducation(Array.isArray(currentUser?.education) ? currentUser.education : []);
    setEditExperience(Array.isArray(currentUser?.experience) ? currentUser.experience : []);
    setEditLicenses(Array.isArray(currentUser?.licenses) ? currentUser.licenses : []);
    setProfileModalVisible(true);
  };

  // --- 儲存個人資料 ---
  const handleUpdateProfile = async () => {
    // 過濾掉空行
    const cleanEdu = editEducation.filter(t => t.trim() !== '');
    const cleanExp = editExperience.filter(t => t.trim() !== '');
    const cleanLic = editLicenses.filter(t => t.trim() !== '');

    const success = await updateProfile({
      name: editName,
      title: editTitle,
      phone: editPhone,
      startDate: editStartDate,
      avatar: editAvatar,
      education: cleanEdu,
      experience: cleanExp,
      licenses: cleanLic
    });

    if (success) {
      const msg = '個人資料更新成功！';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('成功', msg);
      setProfileModalVisible(false);
    } else {
      Alert.alert('失敗', '更新失敗');
    }
  };

  // --- 修改密碼 ---
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('錯誤', '兩次密碼不一致');
      return;
    }
    const success = await changePassword(newPassword);
    if (success) {
      const msg = '密碼修改成功！';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('成功', msg);
      setPwdModalVisible(false);
      setNewPassword(''); setConfirmPassword('');
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('確定要登出嗎？')) logout();
    } else {
      Alert.alert('登出', '確定要登出嗎？', [{ text: '取消', style: 'cancel' }, { text: '登出', style: 'destructive', onPress: logout }]);
    }
  };

  // --- 多筆輸入框元件 ---
  const DynamicListInput = ({ title, data, setData }: { title: string, data: string[], setData: (d: string[]) => void }) => (
    <View style={{ marginBottom: 15 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <Text style={styles.label}>{title}</Text>
        <TouchableOpacity onPress={() => setData([...data, ''])} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="add-circle" size={20} color={THEME.accent} />
          <Text style={{ color: THEME.accent, fontWeight: 'bold', marginLeft: 4 }}>新增</Text>
        </TouchableOpacity>
      </View>
      {data.map((item, index) => (
        <View key={index} style={{ flexDirection: 'row', marginBottom: 8 }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={item}
            onChangeText={(text) => {
              const newData = [...data];
              newData[index] = text;
              setData(newData);
            }}
            placeholder={`請輸入${title}...`}
          />
          <TouchableOpacity onPress={() => setData(data.filter((_, i) => i !== index))} style={{ justifyContent: 'center', paddingLeft: 10 }}>
            <Ionicons name="trash-outline" size={20} color="#FF4444" />
          </TouchableOpacity>
        </View>
      ))}
      {data.length === 0 && <Text style={{ color: '#999', fontSize: 12, fontStyle: 'italic' }}>尚無資料，請點擊新增</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 1. 基本資訊卡片 */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          {currentUser?.avatar ? (
            <Image source={{ uri: currentUser.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{currentUser?.name?.[0] || 'U'}</Text>
          )}
        </View>
        <Text style={styles.userName}>{currentUser?.name}</Text>
        <Text style={styles.userRole}>{currentUser?.title || '職稱未設定'}</Text>
        
        <View style={styles.metaRow}>
          <Text style={styles.userEmail}>{currentUser?.email}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.userPhone}>{currentUser?.phone || '未設定電話'}</Text>
        </View>

        <View style={styles.tenureBadge}>
          <Text style={styles.tenureText}>服務年資：{calculateTenure(currentUser?.startDate)}</Text>
        </View>

        <TouchableOpacity style={styles.editProfileBtn} onPress={openEditProfile}>
          <Ionicons name="pencil" size={16} color="#fff" />
          <Text style={{color:'#fff', fontWeight:'bold', marginLeft:5}}>編輯詳細資料</Text>
        </TouchableOpacity>
      </View>

      {/* 2. 詳細資料區塊 (唯讀顯示) */}
      <View style={styles.infoSection}>
        <View style={styles.infoGroup}>
          <Text style={styles.sectionHeader}>🎓 學歷</Text>
          {currentUser?.education && currentUser.education.length > 0 ? (
            currentUser.education.map((edu, i) => <Text key={i} style={styles.listItem}>• {edu}</Text>)
          ) : <Text style={styles.emptyText}>未填寫</Text>}
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.sectionHeader}>🏗️ 工作經歷</Text>
          {currentUser?.experience && currentUser.experience.length > 0 ? (
            currentUser.experience.map((exp, i) => <Text key={i} style={styles.listItem}>• {exp}</Text>)
          ) : <Text style={styles.emptyText}>未填寫</Text>}
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.sectionHeader}>📜 專業證照</Text>
          {currentUser?.licenses && currentUser.licenses.length > 0 ? (
            currentUser.licenses.map((lic, i) => <Text key={i} style={styles.listItem}>• {lic}</Text>)
          ) : <Text style={styles.emptyText}>未填寫</Text>}
        </View>
      </View>

      {/* 3. 帳號設定 */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>帳號安全</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => setPwdModalVisible(true)}>
          <Ionicons name="key-outline" size={20} color={THEME.textPrimary} />
          <Text style={styles.menuText}>修改登入密碼</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF4444" />
          <Text style={[styles.menuText, { color: '#FF4444' }]}>登出系統</Text>
        </TouchableOpacity>
      </View>

      {/* 4. 編輯資料 Modal (全新設計) */}
      <Modal visible={profileModalVisible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
          <View style={styles.modalContentFullScreen}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>編輯個人資料</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{padding: 20}}>
              {/* 頭像更換 */}
              <View style={{alignItems: 'center', marginBottom: 20}}>
                <TouchableOpacity onPress={pickImage} style={styles.avatarEdit}>
                  {editAvatar ? (
                    <Image source={{ uri: editAvatar }} style={styles.avatarImageLarge} />
                  ) : (
                    <View style={[styles.avatarImageLarge, {backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'}]}>
                      <Ionicons name="camera" size={40} color="#fff" />
                    </View>
                  )}
                  <View style={styles.cameraIconBadge}>
                    <Ionicons name="camera" size={14} color="#fff" />
                  </View>
                </TouchableOpacity>
                <Text style={{color: '#666', marginTop: 8, fontSize: 12}}>點擊更換頭像</Text>
              </View>

              <Text style={styles.label}>姓名</Text>
              <TextInput style={styles.input} value={editName} onChangeText={setEditName} />
              
              <Text style={styles.label}>職稱 {isAdmin ? '' : '(僅管理員可修改)'}</Text>
              <TextInput 
                style={[styles.input, !isAdmin && styles.inputDisabled]} 
                value={editTitle} 
                onChangeText={setEditTitle} 
                editable={isAdmin} 
              />
              
              <Text style={styles.label}>聯絡電話</Text>
              <TextInput style={styles.input} value={editPhone} onChangeText={setEditPhone} keyboardType="phone-pad" />

              <Text style={styles.label}>到職日期 (YYYY-MM-DD) {isAdmin ? '' : '(僅管理員可修改)'}</Text>
              <TextInput 
                style={[styles.input, !isAdmin && styles.inputDisabled]} 
                value={editStartDate} 
                onChangeText={setEditStartDate} 
                placeholder="2023-01-01" 
                editable={isAdmin}
              />

              <View style={styles.divider} />

              {/* 動態列表 */}
              <DynamicListInput title="學歷" data={editEducation} setData={setEditEducation} />
              <DynamicListInput title="工作經歷" data={editExperience} setData={setEditExperience} />
              <DynamicListInput title="專業證照" data={editLicenses} setData={setEditLicenses} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile}>
                <Text style={styles.saveBtnText}>儲存變更</Text>
              </TouchableOpacity>
              <View style={{height: 100}} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 修改密碼 Modal (保持不變) */}
      <Modal visible={pwdModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>修改密碼</Text>
              <TouchableOpacity onPress={() => setPwdModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>新密碼</Text>
            <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            <Text style={styles.label}>確認新密碼</Text>
            <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
              <Text style={styles.saveBtnText}>確認修改</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  headerCard: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: THEME.border },
  avatarContainer: { marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  avatarContainerPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: THEME.textPrimary, justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: 24, fontWeight: 'bold', color: THEME.textPrimary },
  userRole: { fontSize: 16, color: THEME.accent, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  userEmail: { fontSize: 13, color: '#666' },
  separator: { marginHorizontal: 8, color: '#ddd' },
  userPhone: { fontSize: 13, color: '#666' },
  tenureBadge: { backgroundColor: '#F0F8FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 15 },
  tenureText: { color: '#002147', fontSize: 12, fontWeight: 'bold' },
  editProfileBtn: { flexDirection: 'row', backgroundColor: THEME.textPrimary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, alignItems: 'center' },
  
  infoSection: { padding: 20, backgroundColor: '#fff', marginBottom: 10, borderBottomWidth: 1, borderColor: '#eee' },
  infoGroup: { marginBottom: 20 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: THEME.textPrimary, marginBottom: 8 },
  listItem: { fontSize: 15, color: '#333', marginBottom: 4, lineHeight: 22, paddingLeft: 10 },
  emptyText: { color: '#999', fontStyle: 'italic', fontSize: 13, paddingLeft: 10 },

  menuContainer: { padding: 20 },
  sectionTitle: { fontSize: 14, color: '#999', marginBottom: 10, marginLeft: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: THEME.border, gap: 15 },
  menuText: { flex: 1, fontSize: 16, color: '#333' },

  // Modal Full Screen Styles
  modalContentFullScreen: { flex: 1, backgroundColor: '#fff', marginTop: 50, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.textPrimary },
  
  avatarEdit: { position: 'relative' },
  avatarImageLarge: { width: 100, height: 100, borderRadius: 50 },
  cameraIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: THEME.accent, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },

  label: { color: '#666', marginBottom: 5, marginTop: 15, fontWeight: '600' },
  input: { backgroundColor: THEME.inputBg, padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: 'transparent' },
  inputDisabled: { backgroundColor: THEME.disabled, color: '#999' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  saveBtn: { backgroundColor: THEME.accent, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },

  // Password Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
});
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, Alert, Platform, KeyboardAvoidingView, Linking } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSOP, SOP, SOP_CATEGORIES, SOPFile } from '../../context/SOPContext';
import { useUser } from '../../context/UserContext';
import * as DocumentPicker from 'expo-document-picker'; // 引入檔案選擇器

const THEME = {
  background: '#ffffff',
  text: '#002147',
  textSec: '#555555',
  cardBg: '#ffffff',
  accent: '#C69C6D',
  border: '#E0E0E0',
  danger: '#ff4444',
  inputBg: '#F5F5F5',
  fileBg: '#E3F2FD'
};

export default function SOPScreen() {
  const { categories, searchSOP, addSOP, updateSOP, deleteSOP } = useSOP();
  const { isAdmin } = useUser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  
  // 表單資料
  const [currentId, setCurrentId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(SOP_CATEGORIES[1]);
  const [version, setVersion] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<SOPFile | null>(null); // 檔案狀態

  const filteredSOPs = searchSOP(searchQuery, selectedCategory);

  // --- 檔案選擇邏輯 ---
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'], // 限制 PDF 或 圖片
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFile({
          name: asset.name,
          uri: asset.uri,
          mimeType: asset.mimeType,
        });
      }
    } catch (err) {
      console.log('User cancelled or error', err);
    }
  };

  // --- 開啟檔案 ---
  const handleOpenFile = () => {
    if (file?.uri) {
      Linking.openURL(file.uri).catch(err => Alert.alert('錯誤', '無法開啟此檔案'));
    }
  };

  const openAdd = () => {
    setTitle('');
    setCategory(SOP_CATEGORIES[1]);
    setVersion('V1.0');
    setDate(new Date().toISOString().split('T')[0]);
    setContent('');
    setFile(null);
    setIsEditing(false);
    setViewMode(false);
    setModalVisible(true);
  };

  const openDetail = (item: SOP) => {
    setCurrentId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setVersion(item.version);
    setDate(item.date);
    setContent(item.content || '');
    setFile(item.file || null);
    
    setViewMode(true);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title || !version) {
      Alert.alert('錯誤', '請填寫標題與版本號');
      return;
    }

    const sopData = { title, category, version, date, content, file };

    if (isEditing && !viewMode) {
      await updateSOP(currentId, sopData);
      Alert.alert('成功', 'SOP 已更新');
    } else {
      await addSOP(sopData);
      Alert.alert('成功', 'SOP 已新增');
    }
    setModalVisible(false);
  };

  const handleDelete = () => {
    const action = async () => {
      await deleteSOP(currentId);
      setModalVisible(false);
    };
    if (Platform.OS === 'web') {
      if (confirm('確定要刪除此文件嗎？')) action();
    } else {
      Alert.alert('刪除確認', '確定要刪除此文件嗎？', [{ text: '取消' }, { text: '刪除', style: 'destructive', onPress: action }]);
    }
  };

  const renderItem = ({ item }: { item: SOP }) => (
    <TouchableOpacity style={styles.card} onPress={() => openDetail(item)}>
      <View style={styles.iconBox}>
        <Ionicons name="document-text" size={24} color={THEME.accent} />
      </View>
      <View style={{flex:1}}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.categoryLabel}>{item.category}</Text>
          <Text style={styles.versionLabel}>{item.version}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date} {item.file ? '📎' : ''}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>SOP 資料庫</Text>
      
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput style={styles.searchInput} placeholder="搜尋文件..." placeholderTextColor="#999" value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      <View style={{height: 50, marginBottom: 10}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: 'center'}}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat} style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]} onPress={() => setSelectedCategory(cat)}>
              <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList 
        data={filteredSOPs} 
        renderItem={renderItem} 
        keyExtractor={item => item.id} 
        contentContainerStyle={{paddingBottom: 80}}
        ListEmptyComponent={<Text style={styles.emptyText}>無符合資料</Text>}
      />

      {isAdmin && (
        <TouchableOpacity style={styles.fab} onPress={openAdd}>
          <Ionicons name="add" size={30} color="#000" />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{viewMode ? '文件詳情' : (isEditing ? '編輯 SOP' : '新增 SOP')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{padding: 20}}>
              {viewMode && isAdmin && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtnEdit} onPress={() => setViewMode(false)}>
                    <Ionicons name="pencil" size={18} color="#fff" />
                    <Text style={{color:'#fff', fontWeight:'bold', marginLeft:5}}>編輯資料</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnDelete} onPress={handleDelete}>
                    <Ionicons name="trash" size={18} color="#fff" />
                    <Text style={{color:'#fff', fontWeight:'bold', marginLeft:5}}>刪除</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>文件標題</Text>
                {viewMode ? <Text style={styles.viewText}>{title}</Text> : <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="輸入標題" />}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>文件分類</Text>
                {viewMode ? <Text style={styles.viewText}>{category}</Text> : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {SOP_CATEGORIES.filter(c => c !== '全部').map(c => (
                      <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
                        <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* 檔案上傳/預覽區塊 */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>相關檔案 (PDF/JPG)</Text>
                {viewMode ? (
                  // 檢視模式：顯示檔案連結
                  file ? (
                    <TouchableOpacity style={styles.fileViewBtn} onPress={handleOpenFile}>
                      <Ionicons name="document-attach" size={20} color={THEME.text} />
                      <Text style={styles.fileViewText}>{file.name}</Text>
                      <Ionicons name="open-outline" size={18} color="#666" />
                    </TouchableOpacity>
                  ) : <Text style={styles.viewText}>無附件</Text>
                ) : (
                  // 編輯模式：上傳按鈕
                  <View>
                    {file ? (
                      <View style={styles.fileEditBox}>
                        <View style={{flexDirection:'row', alignItems:'center', flex:1}}>
                          <Ionicons name="document" size={20} color={THEME.accent} />
                          <Text style={styles.fileNameText} numberOfLines={1}>{file.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setFile(null)}>
                          <Ionicons name="trash-outline" size={20} color={THEME.danger} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
                        <Ionicons name="cloud-upload-outline" size={24} color="#666" />
                        <Text style={styles.uploadText}>點擊選擇檔案 (PDF/圖片)</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, {flex:1, marginRight:10}]}>
                  <Text style={styles.label}>版本號</Text>
                  {viewMode ? <Text style={styles.viewText}>{version}</Text> : <TextInput style={styles.input} value={version} onChangeText={setVersion} placeholder="例如: V1.0" />}
                </View>
                <View style={[styles.formGroup, {flex:1}]}>
                  <Text style={styles.label}>日期</Text>
                  {viewMode ? <Text style={styles.viewText}>{date}</Text> : <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>內容/備註</Text>
                {viewMode ? <Text style={styles.viewText}>{content || '無內容'}</Text> : <TextInput style={[styles.input, {height: 100, textAlignVertical:'top'}]} value={content} onChangeText={setContent} multiline placeholder="輸入備註..." />}
              </View>

              {!viewMode && (
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>儲存</Text>
                </TouchableOpacity>
              )}
              
              <View style={{height: 50}} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, padding: 20 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: THEME.text, marginBottom: 15 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 12, height: 45, marginBottom: 15 },
  searchInput: { flex: 1, color: '#000', fontSize: 16 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5', marginRight: 10, borderWidth: 1, borderColor: '#eee', height: 36 },
  filterChipActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  filterText: { color: '#666', fontSize: 13 },
  filterTextActive: { color: '#000', fontWeight: 'bold' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.cardBg, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#FFF5E5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  categoryLabel: { color: THEME.accent, fontSize: 12, marginBottom: 2, fontWeight:'bold' },
  versionLabel: { backgroundColor:'#eee', paddingHorizontal:6, borderRadius:4, fontSize:10, overflow:'hidden', color:'#555' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: THEME.text, marginBottom: 4 },
  cardDate: { fontSize: 12, color: THEME.textSec },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30 },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: THEME.accent, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  
  modalContent: { flex: 1, backgroundColor: '#fff', marginTop: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.text },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionBtnEdit: { flex:1, flexDirection:'row', backgroundColor: THEME.accent, padding: 10, borderRadius: 8, justifyContent:'center', alignItems:'center' },
  actionBtnDelete: { flex:1, flexDirection:'row', backgroundColor: THEME.danger, padding: 10, borderRadius: 8, justifyContent:'center', alignItems:'center' },
  formGroup: { marginBottom: 20 },
  label: { marginBottom: 8, color: '#666', fontWeight: 'bold', fontSize: 14 },
  input: { backgroundColor: THEME.inputBg, padding: 12, borderRadius: 8, fontSize: 16, borderWidth:1, borderColor:'transparent' },
  viewText: { fontSize: 16, color: '#333', lineHeight: 24, paddingVertical: 5 },
  row: { flexDirection: 'row' },
  chip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: THEME.inputBg, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: THEME.border },
  chipActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  chipText: { color: '#666' },
  chipTextActive: { color: '#000', fontWeight: 'bold' },
  saveBtn: { backgroundColor: THEME.accent, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },

  // 檔案相關樣式
  uploadBtn: { backgroundColor: THEME.inputBg, borderStyle: 'dashed', borderWidth: 1, borderColor: '#999', borderRadius: 8, height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
  uploadText: { color: '#666', fontSize: 14 },
  fileEditBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.fileBg, padding: 12, borderRadius: 8, justifyContent: 'space-between' },
  fileNameText: { marginLeft: 10, color: '#000', fontSize: 14, flex: 1 },
  fileViewBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.fileBg, padding: 12, borderRadius: 8, gap: 10 },
  fileViewText: { flex: 1, color: THEME.text, fontSize: 15, textDecorationLine: 'underline' }
});
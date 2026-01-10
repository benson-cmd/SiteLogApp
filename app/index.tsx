import { View, Text, StyleSheet, ScrollView, Modal, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { useAnnouncement } from '@/context/AnnouncementContext';

export default function HomeScreen() {
  // 1. 引入與準備
  // 引入 useUser (UserContext) 和 useAnnouncement (AnnouncementContext)
  const { currentUser, isAdmin, logout, isLoading } = useUser();
  const { announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement } = useAnnouncement();

  // 檢查登入狀態：如果載入完成且沒有登入，則重定向到登入頁
  if (!isLoading && !currentUser) {
    return <Redirect href="/login" />;
  }

  // 建立 State 控制新增公告視窗的開關
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 建立 State 暫存新公告標題
  const [newTitle, setNewTitle] = useState('');
  // 建立 State 暫存新公告內容
  const [newContent, setNewContent] = useState('');
  // 建立 State 判斷目前是新增模式 (null) 還是編輯模式 (有 id)
  const [editingId, setEditingId] = useState<string | null>(null);

  // 格式化日期：從 YYYY-MM-DD 轉為 YYYY/MM/DD
  const formatDate = (dateString: string): string => {
    return dateString.replace(/-/g, '/');
  };

  // 處理點擊 + 號新增
  const handleAddNew = () => {
    setEditingId(null);
    setNewTitle('');
    setNewContent('');
    setIsModalVisible(true);
  };

  // 處理點擊編輯筆
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewContent(item.content);
    setIsModalVisible(true);
  };

  // 處理發布按鈕（新增或編輯）
  const handleSubmit = () => {
    if (newTitle.trim() === '') {
      Alert.alert('錯誤', '請輸入公告標題');
      return;
    }
    if (editingId) {
      // 編輯模式：呼叫 updateAnnouncement
      updateAnnouncement(editingId, newTitle.trim(), newContent.trim(), currentUser?.name || '系統管理員');
    } else {
      // 新增模式：呼叫 addAnnouncement
      addAnnouncement(newTitle.trim(), newContent.trim(), currentUser?.name || '系統管理員');
    }
    // 關閉 Modal 並清空欄位
    setNewTitle('');
    setNewContent('');
    setEditingId(null);
    setIsModalVisible(false);
  };

  // 處理刪除公告
  const handleDeleteAnnouncement = (id: string) => {
    Alert.alert(
      '確認刪除',
      '確定要刪除此公告嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '刪除',
          style: 'destructive',
          onPress: () => deleteAnnouncement(id),
        },
      ]
    );
  };

  // 渲染公告卡片
  const renderAnnouncementCard = ({ item }: { item: any }) => (
    <View style={styles.announcementCard}>
      <View style={styles.announcementContent}>
        {/* 標題 (粗體) */}
        <Text style={styles.announcementCardTitle}>{item.title}</Text>
        {/* 內容 (一般文字) */}
        {item.content && (
          <Text style={styles.announcementCardContent}>{item.content}</Text>
        )}
        {/* 發布日期 | 發布人 (灰色小字) */}
        <Text style={styles.announcementMeta}>
          {formatDate(item.date)} | {item.author}
        </Text>
      </View>
      {/* 右側：編輯和刪除按鈕 (僅限 isAdmin 為 true 時顯示) */}
      {isAdmin && (
        <View style={styles.actionButtons}>
          {/* 編輯按鈕 */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="pencil-outline" size={20} color="#2196F3" />
          </TouchableOpacity>
          {/* 刪除按鈕 */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteAnnouncement(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* A. 歡迎區塊 (Welcome) */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeMessage}>
            👋 您好, <Text style={styles.welcomeName}>{currentUser?.name || '訪客'}</Text>! 這是最新公告,請您務必留意!
          </Text>
        </View>

        {/* B. 公告欄標題區 */}
        <View style={styles.announcementSection}>
          <View style={styles.announcementHeader}>
            {/* 左側顯示「公告欄」 */}
            <Text style={styles.announcementTitle}>公告欄</Text>
            {/* 右側顯示「+ 新增」按鈕 (僅限 isAdmin 為 true 時顯示) */}
            {isAdmin && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddNew}
              >
                <Ionicons name="add" size={20} color="#111827" />
                <Text style={styles.addButtonText}>新增</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* C. 公告列表區 */}
          {announcements.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>目前尚無公告</Text>
            </View>
          ) : (
            <FlatList
              data={announcements}
              renderItem={renderAnnouncementCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* D. 新增公告彈窗 (Modal) */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? '編輯公告' : '新增公告'}</Text>
            
            {/* 標題輸入框 (TextInput) */}
            <TextInput
              style={styles.input}
              placeholder="請輸入公告標題"
              value={newTitle}
              onChangeText={setNewTitle}
              multiline={false}
              autoFocus={true}
            />

            {/* 內容輸入框 (TextInput - 多行) */}
            <TextInput
              style={styles.contentInput}
              placeholder="請輸入公告內容"
              value={newContent}
              onChangeText={setNewContent}
              multiline={true}
            />

            <View style={styles.modalButtons}>
              {/* 取消按鈕 */}
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewTitle('');
                  setNewContent('');
                  setEditingId(null);
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              {/* 確認發布按鈕 */}
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.confirmButtonText}>發布</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // A. 歡迎區塊樣式
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  welcomeName: {
    fontWeight: 'bold',
    color: '#111827',
  },
  // B. 公告欄標題區樣式
  announcementSection: {
    marginBottom: 32,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  announcementTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 4,
  },
  // C. 公告列表區樣式
  announcementCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  announcementContent: {
    flex: 1,
    marginRight: 12,
  },
  announcementCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  announcementCardContent: {
    fontSize: 14,
    color: '#111827',
    marginTop: 4,
    lineHeight: 20,
  },
  announcementMeta: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  // D. 新增公告彈窗樣式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  confirmButton: {
    backgroundColor: '#111827',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const THEME = { primary: '#C69C6D', background: '#F5F7FA', headerBg: '#002147', sectionBg: '#FFF5E6', card: '#ffffff', border: '#E0E0E0' };
const PERSONNEL_DB = [{ id: '1', name: '吳資彬' }, { id: '2', name: '現場工程師' }, { id: '3', name: '陳大文' }];

export default function NewProjectScreen() {
  const router = useRouter();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [displayDate, setDisplayDate] = useState(new Date()); 
  
  // 這裡省略其他狀態，重點是下方的樣式...
  
  const renderCalendarDays = () => {
    const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<View key={`empty-${i}`} style={styles.dayCellEmpty} />);
    for (let i = 1; i <= daysInMonth; i++) days.push(
      <TouchableOpacity key={i} style={styles.dayCell} onPress={() => setCalendarVisible(false)}>
        <Text style={styles.dayText}>{i}</Text>
      </TouchableOpacity>
    );
    return days;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '新增專案', headerStyle: { backgroundColor: THEME.headerBg }, headerTintColor: '#fff' }} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={{margin:20, fontSize:16, fontWeight:'bold'}}>請點擊下方測試日曆：</Text>
        <TouchableOpacity style={styles.dateInputBtn} onPress={() => setCalendarVisible(true)}>
          <Text>選擇日期</Text>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>
      </ScrollView>

      {/* 小日曆 Modal */}
      <Modal visible={calendarVisible} transparent animationType="fade" onRequestClose={() => setCalendarVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.monthTitle}>{displayDate.getFullYear()}年 {displayDate.getMonth() + 1}月</Text>
            </View>
            <View style={styles.daysGrid}>{renderCalendarDays()}</View>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setCalendarVisible(false)}>
              <Text>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  form: { padding: 20 },
  dateInputBtn: { padding: 15, backgroundColor: '#fff', borderRadius: 8, borderWidth:1, borderColor:'#ddd', flexDirection:'row', justifyContent:'space-between' },
  
  // ⭐️ 關鍵：強制日曆寬度 320，絕對不會變大
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  calendarContainer: { width: 320, backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 5 },
  calendarHeader: { alignItems: 'center', marginBottom: 15 },
  monthTitle: { fontSize: 18, fontWeight: 'bold' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  dayCellEmpty: { width: 40, height: 40 },
  dayText: { fontSize: 16 },
  cancelBtn: { marginTop: 15, alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#eee' }
});
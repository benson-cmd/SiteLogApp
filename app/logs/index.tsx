import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function LogsScreen() {
  const logs = [{ id: '1', date: '2026/01/14', project: '台中七期商辦', content: '1. 材料驗收\n2. 進度巡檢' }];
  return (
    <View style={{flex: 1, backgroundColor: '#F5F7FA'}}>
      <Stack.Screen options={{ title: '施工紀錄', headerStyle: { backgroundColor: '#002147' }, headerTintColor: '#fff', headerShown: true }} />
      <FlatList data={logs} renderItem={({item}) => (
        <View style={{backgroundColor:'#fff', padding:20, margin:15, borderRadius:12, elevation:2}}>
          <Text style={{fontWeight:'bold', color:'#666'}}>{item.date}</Text>
          <Text style={{fontSize:18, fontWeight:'bold', color:'#002147', marginVertical:8}}>{item.project}</Text>
          <Text style={{color:'#444'}}>{item.content}</Text>
        </View>
      )} />
    </View>
  );
}
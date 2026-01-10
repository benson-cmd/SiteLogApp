import { Stack } from 'expo-router';

export default function ProjectsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '專案列表',
          headerBackTitle: '首頁',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: '新增專案',
          headerBackTitle: '專案列表',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: '專案詳情',
          headerBackTitle: '專案列表',
        }}
      />
    </Stack>
  );
}


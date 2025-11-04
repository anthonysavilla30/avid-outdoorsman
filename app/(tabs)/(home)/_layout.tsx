
import { Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: Platform.OS === 'ios', // Show header on iOS with NativeTabs, hide on Android/Web
          title: 'Home'
        }}
      />
      <Stack.Screen
        name="post-detail"
        options={{
          headerShown: true,
          title: 'Post',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="create-post"
        options={{
          headerShown: true,
          title: 'Create Post',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

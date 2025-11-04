
import { Stack } from 'expo-router';

export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Messages',
        }}
      />
      <Stack.Screen
        name="compose"
        options={{
          title: 'New Message',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="conversation"
        options={{
          title: 'Conversation',
        }}
      />
    </Stack>
  );
}

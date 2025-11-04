
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface Message {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    user: {
      name: 'Jake Morrison',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    lastMessage: 'That fishing spot was incredible! Thanks for the tip.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    unread: true,
  },
  {
    id: '2',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    lastMessage: 'Are you planning to hit the trail this weekend?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: true,
  },
  {
    id: '3',
    user: {
      name: 'Mike Thompson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    },
    lastMessage: 'The creek is running high right now, be careful.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unread: false,
  },
  {
    id: '4',
    user: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
    lastMessage: 'Got some great photos of the deer this morning!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: false,
  },
];

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function MessagesScreen() {
  const router = useRouter();

  const handleComposeMessage = () => {
    console.log('Compose new message');
    router.push('/(tabs)/messages/compose');
  };

  const handleMessagePress = (message: Message) => {
    router.push({
      pathname: '/(tabs)/messages/conversation',
      params: {
        name: message.user.name,
        avatar: message.user.avatar,
      },
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Pressable style={styles.messageCard} onPress={() => handleMessagePress(item)}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{getTimeAgo(item.timestamp)}</Text>
        </View>
        <Text style={[styles.lastMessage, item.unread && styles.unreadMessage]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread && <View style={styles.unreadBadge} />}
    </Pressable>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Pressable style={styles.composeButton} onPress={handleComposeMessage}>
        <IconSymbol name="square.and.pencil" color="#ffffff" size={20} />
        <Text style={styles.composeButtonText}>Compose Message</Text>
      </Pressable>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Messages',
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={mockMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  headerContent: {
    marginBottom: 16,
  },
  composeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  composeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  messageCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  unreadMessage: {
    fontWeight: '600',
    color: colors.text,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
});

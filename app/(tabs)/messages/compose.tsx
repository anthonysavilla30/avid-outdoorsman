
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface User {
  id: string;
  name: string;
  avatar: string;
  username: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jake Morrison',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    username: '@jake_outdoors',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    username: '@sarah_hikes',
  },
  {
    id: '3',
    name: 'Mike Thompson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    username: '@mike_fisher',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    username: '@emily_camps',
  },
  {
    id: '5',
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    username: '@david_trails',
  },
];

export default function ComposeMessageScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a recipient');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    console.log('Sending message to:', selectedUser.name);
    console.log('Message:', message);
    
    Alert.alert(
      'Message Sent',
      `Your message has been sent to ${selectedUser.name}!`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchQuery('');
  };

  const handleRemoveRecipient = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Compose Message',
          headerShown: true,
          headerBackVisible: true,
          presentation: 'modal',
        }}
      />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Recipient Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>To:</Text>
            {selectedUser ? (
              <View style={styles.selectedUserContainer}>
                <View style={styles.selectedUserChip}>
                  <Image source={{ uri: selectedUser.avatar }} style={styles.chipAvatar} />
                  <Text style={styles.chipName}>{selectedUser.name}</Text>
                  <Pressable onPress={handleRemoveRecipient}>
                    <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
                  </Pressable>
                </View>
              </View>
            ) : (
              <>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search users..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <View style={styles.userList}>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <Pressable
                          key={user.id}
                          style={styles.userItem}
                          onPress={() => handleSelectUser(user)}
                        >
                          <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                          <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userUsername}>{user.username}</Text>
                          </View>
                          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
                        </Pressable>
                      ))
                    ) : (
                      <View style={styles.emptyState}>
                        <IconSymbol name="person.crop.circle.badge.xmark" size={48} color={colors.textSecondary} />
                        <Text style={styles.emptyStateText}>No users found</Text>
                      </View>
                    )}
                  </View>
                )}
              </>
            )}
          </View>

          {/* Message Input */}
          {selectedUser && (
            <View style={styles.section}>
              <Text style={styles.label}>Message:</Text>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message here..."
                placeholderTextColor={colors.textSecondary}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Quick Message Templates */}
          {selectedUser && (
            <View style={styles.section}>
              <Text style={styles.label}>Quick Messages:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.quickMessages}>
                  <Pressable
                    style={styles.quickMessageButton}
                    onPress={() => setMessage('Hey! Want to hit the trails this weekend?')}
                  >
                    <IconSymbol name="figure.hiking" size={20} color={colors.primary} />
                    <Text style={styles.quickMessageText}>Trail Plans</Text>
                  </Pressable>
                  <Pressable
                    style={styles.quickMessageButton}
                    onPress={() => setMessage('What are the conditions like out there?')}
                  >
                    <IconSymbol name="cloud.sun.fill" size={20} color={colors.primary} />
                    <Text style={styles.quickMessageText}>Conditions</Text>
                  </Pressable>
                  <Pressable
                    style={styles.quickMessageButton}
                    onPress={() => setMessage('Thanks for sharing that spot!')}
                  >
                    <IconSymbol name="hand.thumbsup.fill" size={20} color={colors.primary} />
                    <Text style={styles.quickMessageText}>Thanks</Text>
                  </Pressable>
                  <Pressable
                    style={styles.quickMessageButton}
                    onPress={() => setMessage('Can you share the coordinates?')}
                  >
                    <IconSymbol name="location.fill" size={20} color={colors.primary} />
                    <Text style={styles.quickMessageText}>Location</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* Send Button */}
        {selectedUser && (
          <View style={styles.footer}>
            <Pressable
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <IconSymbol name="paperplane.fill" size={20} color="#ffffff" />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedUserContainer: {
    marginTop: 8,
  },
  selectedUserChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chipAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  chipName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  userList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  messageInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    minHeight: 150,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickMessages: {
    flexDirection: 'row',
    gap: 12,
  },
  quickMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickMessageText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    boxShadow: `0px -2px 8px ${colors.shadow}`,
    elevation: 5,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});


import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

const mockConversation: Message[] = [
  {
    id: '1',
    text: 'Hey! Are you planning to hit the trail this weekend?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isOwn: false,
  },
  {
    id: '2',
    text: 'Yeah! I was thinking about Eagle Peak. Have you been there recently?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    isOwn: true,
  },
  {
    id: '3',
    text: 'I was there last week. Trail conditions are perfect right now!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
    isOwn: false,
  },
  {
    id: '4',
    text: 'That&apos;s great to hear! What time did you start?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isOwn: true,
  },
  {
    id: '5',
    text: 'Around 7am. Beat the crowds and the heat. Highly recommend!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isOwn: false,
  },
];

export default function ConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userName = params.name as string || 'User';
  const userAvatar = params.avatar as string || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop';

  const [messages, setMessages] = useState<Message[]>(mockConversation);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        timestamp: new Date(),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      console.log('Message sent:', inputText);
    }
  };

  const getTimeString = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isOwn && styles.ownMessageContainer]}>
      {!item.isOwn && (
        <Image source={{ uri: userAvatar }} style={styles.messageAvatar} />
      )}
      <View style={[styles.messageBubble, item.isOwn && styles.ownMessageBubble]}>
        <Text style={[styles.messageText, item.isOwn && styles.ownMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.messageTime, item.isOwn && styles.ownMessageTime]}>
          {getTimeString(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: userName,
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.inputContainer}>
          <Pressable style={styles.attachButton}>
            <IconSymbol name="plus.circle" size={28} color={colors.primary} />
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <IconSymbol
              name="arrow.up.circle.fill"
              size={32}
              color={inputText.trim() ? colors.primary : colors.textSecondary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '75%',
  },
  ownMessageBubble: {
    backgroundColor: colors.primary,
  },
  messageText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  ownMessageText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  attachButton: {
    padding: 4,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

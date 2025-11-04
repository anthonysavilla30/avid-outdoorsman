
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockPosts } from '@/data/mockPosts';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Jake Morrison',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: 'Great spot! I was there last week and had similar luck.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    likes: 5,
  },
  {
    id: '2',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    content: 'What time of day did you go? Morning or evening?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    likes: 2,
  },
  {
    id: '3',
    author: {
      name: 'Mike Thompson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    content: 'Thanks for sharing! Heading there this weekend.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    likes: 3,
  },
];

export default function PostDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const postId = params.id as string;

  const post = mockPosts.find((p) => p.id === postId);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    console.log('Post liked:', !isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    console.log('Post saved:', !isSaved);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        },
        content: commentText,
        timestamp: new Date(),
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      console.log('Comment added:', commentText);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getActivityColor = (activity: string): string => {
    switch (activity) {
      case 'hunting': return colors.secondary;
      case 'fishing': return colors.primary;
      case 'hiking': return colors.highlight;
      case 'camping': return colors.accent;
      default: return colors.textSecondary;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Post',
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <View style={styles.metaRow}>
                <IconSymbol name="location.fill" size={12} color={colors.textSecondary} />
                <Text style={styles.metaText}>{post.location}</Text>
                <Text style={styles.metaText}>•</Text>
                <Text style={styles.metaText}>{post.author.distance} mi away</Text>
                <Text style={styles.metaText}>•</Text>
                <Text style={styles.metaText}>{getTimeAgo(post.timestamp)}</Text>
              </View>
            </View>
            <View style={[styles.activityBadge, { backgroundColor: getActivityColor(post.activity) }]}>
              <Text style={styles.activityText}>{post.activity}</Text>
            </View>
          </View>

          {/* Post Content */}
          <Text style={styles.content}>{post.content}</Text>

          {/* Post Image */}
          {post.images.length > 0 && (
            <Image source={{ uri: post.images[0] }} style={styles.postImage} />
          )}

          {/* Conditions */}
          {post.conditions && (
            <View style={styles.conditions}>
              {post.conditions.weather && (
                <View style={styles.conditionItem}>
                  <IconSymbol name="cloud.sun" size={16} color={colors.textSecondary} />
                  <Text style={styles.conditionText}>{post.conditions.weather}</Text>
                </View>
              )}
              {post.conditions.difficulty && (
                <View style={styles.conditionItem}>
                  <IconSymbol name="chart.bar" size={16} color={colors.textSecondary} />
                  <Text style={styles.conditionText}>{post.conditions.difficulty}</Text>
                </View>
              )}
              {post.conditions.crowded !== undefined && (
                <View style={styles.conditionItem}>
                  <IconSymbol name="person.2" size={16} color={colors.textSecondary} />
                  <Text style={styles.conditionText}>
                    {post.conditions.crowded ? 'Crowded' : 'Not Crowded'}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <View style={styles.tags}>
              {post.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable style={styles.actionButton} onPress={handleLike}>
              <IconSymbol
                name={isLiked ? 'heart.fill' : 'heart'}
                size={24}
                color={isLiked ? colors.secondary : colors.text}
              />
              <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
                {post.likes + (isLiked ? 1 : 0)}
              </Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <IconSymbol name="bubble.left" size={24} color={colors.text} />
              <Text style={styles.actionText}>{comments.length}</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleSave}>
              <IconSymbol
                name={isSaved ? 'bookmark.fill' : 'bookmark'}
                size={24}
                color={isSaved ? colors.accent : colors.text}
              />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <IconSymbol name="square.and.arrow.up" size={24} color={colors.text} />
            </Pressable>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <Image source={{ uri: comment.author.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.author.name}</Text>
                    <Text style={styles.commentTime}>{getTimeAgo(comment.timestamp)}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.content}</Text>
                  <Pressable style={styles.commentLike}>
                    <IconSymbol name="heart" size={14} color={colors.textSecondary} />
                    <Text style={styles.commentLikeText}>{comment.likes}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textSecondary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <Pressable
            style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
            onPress={handleAddComment}
            disabled={!commentText.trim()}
          >
            <IconSymbol
              name="arrow.up.circle.fill"
              size={32}
              color={commentText.trim() ? colors.primary : colors.textSecondary}
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
  scrollView: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 50,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: colors.card,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    padding: 16,
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.card,
  },
  conditions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  conditionText: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  actionTextActive: {
    color: colors.secondary,
  },
  commentsSection: {
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  commentCard: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  commentTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  commentInput: {
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

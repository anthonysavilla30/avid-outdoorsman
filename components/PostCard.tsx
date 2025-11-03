
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Post } from '@/types/Post';
import { IconSymbol } from './IconSymbol';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const timeAgo = getTimeAgo(post.timestamp);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <View style={styles.metaRow}>
            <IconSymbol name="location.fill" size={12} color={colors.textSecondary} />
            <Text style={styles.metaText}>{post.location}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>{post.author.distance} mi away</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>{timeAgo}</Text>
          </View>
        </View>
        <View style={[styles.activityBadge, { backgroundColor: getActivityColor(post.activity) }]}>
          <Text style={styles.activityText}>{post.activity}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Image */}
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

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.footerButton}>
          <IconSymbol name="heart" size={20} color={colors.text} />
          <Text style={styles.footerText}>{post.likes}</Text>
        </Pressable>
        <Pressable style={styles.footerButton}>
          <IconSymbol name="bubble.left" size={20} color={colors.text} />
          <Text style={styles.footerText}>{post.comments}</Text>
        </Pressable>
        <Pressable style={styles.footerButton}>
          <IconSymbol name="square.and.arrow.up" size={20} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getActivityColor(activity: string): string {
  switch (activity) {
    case 'hunting': return colors.secondary;
    case 'fishing': return colors.primary;
    case 'hiking': return colors.highlight;
    case 'camping': return colors.accent;
    default: return colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  conditions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
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
    marginBottom: 12,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});

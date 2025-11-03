
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Avid Outdoorsman Color Palette - Dark Theme
export const colors = {
  background: '#000000',        // Black background
  text: '#ffffff',              // White text for readability on black
  textSecondary: '#a0a0a0',     // Light gray for secondary text
  primary: '#3498db',           // Blue, for main interactive elements
  secondary: '#e74c3c',         // Red, for alerts or secondary actions
  accent: '#f39c12',            // Orange, for highlights and points of interest
  card: '#1a1a1a',              // Dark gray for content containers
  highlight: '#2ecc71',         // Green, for positive confirmations or highlights
  border: '#333333',            // Dark border color
  shadow: 'rgba(0, 0, 0, 0.5)', // Shadow color
};

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

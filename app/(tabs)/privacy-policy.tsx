
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconSymbol name="lock.shield" size={48} color={colors.primary} />
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
          <View style={styles.disclaimer}>
            <IconSymbol name="exclamationmark.triangle" size={20} color={colors.warning} />
            <Text style={styles.disclaimerText}>
              This is a template. Please have this reviewed and customized by a legal professional before deployment.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to Avid Outdoorsman (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
          <Text style={styles.paragraph}>
            By using Avid Outdoorsman, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          
          <Text style={styles.subsectionTitle}>2.1 Personal Information</Text>
          <Text style={styles.paragraph}>
            We may collect personally identifiable information that you voluntarily provide to us when you:
          </Text>
          <Text style={styles.bulletPoint}>• Register for an account</Text>
          <Text style={styles.bulletPoint}>• Create a user profile</Text>
          <Text style={styles.bulletPoint}>• Post content or reviews</Text>
          <Text style={styles.bulletPoint}>• Send messages to other users</Text>
          <Text style={styles.bulletPoint}>• Contact us for support</Text>
          <Text style={styles.paragraph}>
            This information may include: name, email address, username, profile photo, and any other information you choose to provide.
          </Text>

          <Text style={styles.subsectionTitle}>2.2 Location Data</Text>
          <Text style={styles.paragraph}>
            With your permission, we collect and process information about your actual location. We use various technologies to determine location, including GPS, IP address, and other sensors. Location data is used to:
          </Text>
          <Text style={styles.bulletPoint}>• Show nearby outdoor locations and users</Text>
          <Text style={styles.bulletPoint}>• Provide location-based recommendations</Text>
          <Text style={styles.bulletPoint}>• Display weather information for your area</Text>
          <Text style={styles.bulletPoint}>• Enable map features and trail tracking</Text>
          <Text style={styles.paragraph}>
            You can disable location services at any time through your device settings, though this may limit certain app features.
          </Text>

          <Text style={styles.subsectionTitle}>2.3 Usage Data</Text>
          <Text style={styles.paragraph}>
            We automatically collect information about how you interact with our app, including:
          </Text>
          <Text style={styles.bulletPoint}>• Device information (model, operating system, unique identifiers)</Text>
          <Text style={styles.bulletPoint}>• App usage statistics and features accessed</Text>
          <Text style={styles.bulletPoint}>• Crash reports and performance data</Text>
          <Text style={styles.bulletPoint}>• Search queries and filter preferences</Text>

          <Text style={styles.subsectionTitle}>2.4 User-Generated Content</Text>
          <Text style={styles.paragraph}>
            When you post content on Avid Outdoorsman, including photos, reviews, comments, and location pins, this information becomes part of our database and may be visible to other users based on your privacy settings.
          </Text>

          <Text style={styles.subsectionTitle}>2.5 Health and Fitness Data</Text>
          <Text style={styles.paragraph}>
            If you choose to connect wearable devices or use our activity tracking features, we may collect health and fitness data such as steps, distance traveled, elevation gain, and workout sessions. This data is stored securely and used only to provide you with personalized fitness insights.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect for the following purposes:
          </Text>
          <Text style={styles.bulletPoint}>• To provide, maintain, and improve our services</Text>
          <Text style={styles.bulletPoint}>• To create and manage your account</Text>
          <Text style={styles.bulletPoint}>• To personalize your experience and provide relevant content</Text>
          <Text style={styles.bulletPoint}>• To enable communication between users</Text>
          <Text style={styles.bulletPoint}>• To send you notifications about app updates and features</Text>
          <Text style={styles.bulletPoint}>• To respond to your inquiries and provide customer support</Text>
          <Text style={styles.bulletPoint}>• To monitor and analyze usage patterns and trends</Text>
          <Text style={styles.bulletPoint}>• To detect, prevent, and address technical issues or fraudulent activity</Text>
          <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Sharing and Disclosure</Text>
          
          <Text style={styles.subsectionTitle}>4.1 Public Information</Text>
          <Text style={styles.paragraph}>
            Certain information you provide may be publicly visible to other users, including:
          </Text>
          <Text style={styles.bulletPoint}>• Your username and profile photo</Text>
          <Text style={styles.bulletPoint}>• Posts, reviews, and comments you create</Text>
          <Text style={styles.bulletPoint}>• General location information (not exact coordinates unless you choose to share them)</Text>

          <Text style={styles.subsectionTitle}>4.2 Service Providers</Text>
          <Text style={styles.paragraph}>
            We may share your information with third-party service providers who perform services on our behalf, such as:
          </Text>
          <Text style={styles.bulletPoint}>• Cloud hosting and storage providers</Text>
          <Text style={styles.bulletPoint}>• Analytics services</Text>
          <Text style={styles.bulletPoint}>• Customer support tools</Text>
          <Text style={styles.bulletPoint}>• Payment processors (if applicable)</Text>
          <Text style={styles.paragraph}>
            These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
          </Text>

          <Text style={styles.subsectionTitle}>4.3 Legal Requirements</Text>
          <Text style={styles.paragraph}>
            We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
          </Text>

          <Text style={styles.subsectionTitle}>4.4 Business Transfers</Text>
          <Text style={styles.paragraph}>
            If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.
          </Text>

          <Text style={styles.subsectionTitle}>4.5 With Your Consent</Text>
          <Text style={styles.paragraph}>
            We may share your information for any other purpose with your explicit consent.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </Text>
          <Text style={styles.bulletPoint}>• Encryption of data in transit and at rest</Text>
          <Text style={styles.bulletPoint}>• Regular security assessments and updates</Text>
          <Text style={styles.bulletPoint}>• Access controls and authentication requirements</Text>
          <Text style={styles.bulletPoint}>• Secure data storage with reputable cloud providers</Text>
          <Text style={styles.paragraph}>
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Privacy Rights</Text>
          <Text style={styles.paragraph}>
            Depending on your location, you may have the following rights regarding your personal information:
          </Text>
          <Text style={styles.bulletPoint}>• Access: Request a copy of the personal information we hold about you</Text>
          <Text style={styles.bulletPoint}>• Correction: Request correction of inaccurate or incomplete information</Text>
          <Text style={styles.bulletPoint}>• Deletion: Request deletion of your personal information</Text>
          <Text style={styles.bulletPoint}>• Portability: Request transfer of your data to another service</Text>
          <Text style={styles.bulletPoint}>• Objection: Object to processing of your personal information</Text>
          <Text style={styles.bulletPoint}>• Restriction: Request restriction of processing your information</Text>
          <Text style={styles.bulletPoint}>• Withdraw Consent: Withdraw consent for data processing at any time</Text>
          <Text style={styles.paragraph}>
            To exercise these rights, please contact us using the information provided in Section 12.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal, regulatory, or security purposes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children&apos;s Privacy</Text>
          <Text style={styles.paragraph}>
            Our app is not intended for children under the age of 13 (or 16 in the European Economic Area). We do not knowingly collect personal information from children under these ages. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our app, you consent to the transfer of your information to our facilities and to the third parties with whom we share it as described in this policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Third-Party Links and Services</Text>
          <Text style={styles.paragraph}>
            Our app may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </Text>
          <Text style={styles.paragraph}>
            For material changes, we will provide more prominent notice, such as an in-app notification or email.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: privacy@avidoutdoorsman.com</Text>
          <Text style={styles.contactInfo}>Address: [Your Company Address]</Text>
          <Text style={styles.contactInfo}>Phone: [Your Contact Number]</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. California Privacy Rights</Text>
          <Text style={styles.paragraph}>
            If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA), including:
          </Text>
          <Text style={styles.bulletPoint}>• The right to know what personal information is collected</Text>
          <Text style={styles.bulletPoint}>• The right to know whether personal information is sold or disclosed</Text>
          <Text style={styles.bulletPoint}>• The right to say no to the sale of personal information</Text>
          <Text style={styles.bulletPoint}>• The right to access your personal information</Text>
          <Text style={styles.bulletPoint}>• The right to equal service and price</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information to third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. European Privacy Rights (GDPR)</Text>
          <Text style={styles.paragraph}>
            If you are located in the European Economic Area (EEA), you have certain rights under the General Data Protection Regulation (GDPR), including the rights described in Section 6. Our legal basis for processing your personal information includes:
          </Text>
          <Text style={styles.bulletPoint}>• Consent: You have given clear consent for us to process your personal information</Text>
          <Text style={styles.bulletPoint}>• Contract: Processing is necessary for a contract we have with you</Text>
          <Text style={styles.bulletPoint}>• Legal obligation: Processing is necessary to comply with the law</Text>
          <Text style={styles.bulletPoint}>• Legitimate interests: Processing is necessary for our legitimate interests</Text>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.acknowledgment}>
            By using Avid Outdoorsman, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight || '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: colors.warning,
    marginLeft: 8,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 6,
    paddingLeft: 8,
  },
  contactInfo: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.primary,
    marginBottom: 6,
    fontWeight: '500',
  },
  acknowledgment: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
});

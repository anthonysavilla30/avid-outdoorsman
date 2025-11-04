
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

export default function TermsConditionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Terms & Conditions',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconSymbol name="doc.text" size={48} color={colors.primary} />
          <Text style={styles.title}>Terms and Conditions</Text>
          <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
          <View style={styles.disclaimer}>
            <IconSymbol name="exclamationmark.triangle" size={20} color={colors.warning} />
            <Text style={styles.disclaimerText}>
              This is a template. Please have this reviewed and customized by a legal professional before deployment.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            Welcome to Avid Outdoorsman. By accessing or using our mobile application (&quot;App&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the App.
          </Text>
          <Text style={styles.paragraph}>
            These Terms constitute a legally binding agreement between you and Avid Outdoorsman (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We reserve the right to modify these Terms at any time, and your continued use of the App after such modifications constitutes your acceptance of the updated Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            Avid Outdoorsman is a mobile application designed to connect outdoor enthusiasts, including hunters, anglers, hikers, and campers. The App provides:
          </Text>
          <Text style={styles.bulletPoint}>• Real-time updates on trail conditions, weather, and outdoor locations</Text>
          <Text style={styles.bulletPoint}>• Interactive maps with topographic features and property boundaries</Text>
          <Text style={styles.bulletPoint}>• Social networking features to connect with other outdoor enthusiasts</Text>
          <Text style={styles.bulletPoint}>• Location discovery and review capabilities</Text>
          <Text style={styles.bulletPoint}>• Hunting and fishing regulations database</Text>
          <Text style={styles.bulletPoint}>• Activity tracking and health integration</Text>
          <Text style={styles.bulletPoint}>• Weather forecasts and outdoor planning tools</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          
          <Text style={styles.subsectionTitle}>3.1 Account Creation</Text>
          <Text style={styles.paragraph}>
            To access certain features of the App, you must create an account. You agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide accurate, current, and complete information</Text>
          <Text style={styles.bulletPoint}>• Maintain and promptly update your account information</Text>
          <Text style={styles.bulletPoint}>• Maintain the security of your account credentials</Text>
          <Text style={styles.bulletPoint}>• Accept responsibility for all activities under your account</Text>
          <Text style={styles.bulletPoint}>• Notify us immediately of any unauthorized use</Text>

          <Text style={styles.subsectionTitle}>3.2 Account Eligibility</Text>
          <Text style={styles.paragraph}>
            You must be at least 13 years old (or 16 in the European Economic Area) to create an account. By creating an account, you represent that you meet this age requirement and have the legal capacity to enter into these Terms.
          </Text>

          <Text style={styles.subsectionTitle}>3.3 Account Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, including violation of these Terms. You may delete your account at any time through the App settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Content and Conduct</Text>
          
          <Text style={styles.subsectionTitle}>4.1 User-Generated Content</Text>
          <Text style={styles.paragraph}>
            You may post, upload, or share content through the App, including text, photos, reviews, comments, and location information (&quot;User Content&quot;). You retain ownership of your User Content, but by posting it, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display your User Content in connection with operating and promoting the App.
          </Text>

          <Text style={styles.subsectionTitle}>4.2 Content Standards</Text>
          <Text style={styles.paragraph}>
            You agree that your User Content will not:
          </Text>
          <Text style={styles.bulletPoint}>• Violate any laws or regulations</Text>
          <Text style={styles.bulletPoint}>• Infringe on intellectual property rights of others</Text>
          <Text style={styles.bulletPoint}>• Contain hate speech, harassment, or discriminatory content</Text>
          <Text style={styles.bulletPoint}>• Include explicit, violent, or disturbing material</Text>
          <Text style={styles.bulletPoint}>• Promote illegal activities or dangerous behavior</Text>
          <Text style={styles.bulletPoint}>• Contain spam, advertising, or commercial solicitation</Text>
          <Text style={styles.bulletPoint}>• Include false, misleading, or deceptive information</Text>
          <Text style={styles.bulletPoint}>• Reveal exact locations of private property without permission</Text>
          <Text style={styles.bulletPoint}>• Disclose sensitive wildlife locations that could lead to poaching</Text>

          <Text style={styles.subsectionTitle}>4.3 Prohibited Conduct</Text>
          <Text style={styles.paragraph}>
            You agree not to:
          </Text>
          <Text style={styles.bulletPoint}>• Use the App for any illegal purpose</Text>
          <Text style={styles.bulletPoint}>• Harass, threaten, or intimidate other users</Text>
          <Text style={styles.bulletPoint}>• Impersonate any person or entity</Text>
          <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to the App or other accounts</Text>
          <Text style={styles.bulletPoint}>• Interfere with or disrupt the App&apos;s operation</Text>
          <Text style={styles.bulletPoint}>• Use automated systems (bots, scrapers) without permission</Text>
          <Text style={styles.bulletPoint}>• Collect or harvest user information without consent</Text>
          <Text style={styles.bulletPoint}>• Reverse engineer or attempt to extract source code</Text>

          <Text style={styles.subsectionTitle}>4.4 Content Moderation</Text>
          <Text style={styles.paragraph}>
            We reserve the right, but are not obligated, to monitor, review, and remove User Content that violates these Terms or is otherwise objectionable. We may take action against users who violate these Terms, including warning, suspension, or permanent ban.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Intellectual Property Rights</Text>
          
          <Text style={styles.subsectionTitle}>5.1 Our Intellectual Property</Text>
          <Text style={styles.paragraph}>
            The App and its original content, features, and functionality are owned by Avid Outdoorsman and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our App or included software without our express written permission.
          </Text>

          <Text style={styles.subsectionTitle}>5.2 Trademarks</Text>
          <Text style={styles.paragraph}>
            &quot;Avid Outdoorsman&quot; and our logo are trademarks of our company. You may not use these trademarks without our prior written consent. Other trademarks, service marks, and logos used in the App are the property of their respective owners.
          </Text>

          <Text style={styles.subsectionTitle}>5.3 Third-Party Content</Text>
          <Text style={styles.paragraph}>
            The App may include content from third parties, including map data, weather information, and regulations. This content is the property of its respective owners and is used under license or fair use principles.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Privacy and Data Protection</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the App, you consent to our collection and use of your information as described in the Privacy Policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Location Services and Safety</Text>
          
          <Text style={styles.subsectionTitle}>7.1 Location Data</Text>
          <Text style={styles.paragraph}>
            The App uses location services to provide features such as nearby locations, weather information, and activity tracking. You can control location permissions through your device settings. Disabling location services may limit certain App features.
          </Text>

          <Text style={styles.subsectionTitle}>7.2 Safety Disclaimer</Text>
          <Text style={styles.paragraph}>
            The App is designed to enhance your outdoor experience, but it is not a substitute for proper planning, equipment, and safety precautions. You acknowledge that:
          </Text>
          <Text style={styles.bulletPoint}>• Outdoor activities carry inherent risks</Text>
          <Text style={styles.bulletPoint}>• You are responsible for your own safety</Text>
          <Text style={styles.bulletPoint}>• Information in the App may be outdated or inaccurate</Text>
          <Text style={styles.bulletPoint}>• You should verify critical information from official sources</Text>
          <Text style={styles.bulletPoint}>• Weather and trail conditions can change rapidly</Text>
          <Text style={styles.bulletPoint}>• You should follow all applicable laws and regulations</Text>

          <Text style={styles.subsectionTitle}>7.3 Property Rights and Trespassing</Text>
          <Text style={styles.paragraph}>
            The App provides information about public and private lands, but this information may not be complete or accurate. You are responsible for:
          </Text>
          <Text style={styles.bulletPoint}>• Verifying property boundaries and access rights</Text>
          <Text style={styles.bulletPoint}>• Obtaining necessary permissions before entering private property</Text>
          <Text style={styles.bulletPoint}>• Respecting property rights and posted signs</Text>
          <Text style={styles.bulletPoint}>• Following all local, state, and federal regulations</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Hunting and Fishing Regulations</Text>
          <Text style={styles.paragraph}>
            The App provides information about hunting and fishing regulations, but this information is for reference only and may not be current or complete. You are solely responsible for:
          </Text>
          <Text style={styles.bulletPoint}>• Obtaining proper licenses and permits</Text>
          <Text style={styles.bulletPoint}>• Verifying current regulations with official sources</Text>
          <Text style={styles.bulletPoint}>• Complying with all applicable laws and regulations</Text>
          <Text style={styles.bulletPoint}>• Understanding and following season dates, bag limits, and restrictions</Text>
          <Text style={styles.paragraph}>
            We are not responsible for any violations of hunting or fishing regulations resulting from use of the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Third-Party Services and Links</Text>
          <Text style={styles.paragraph}>
            The App may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by use of such content, goods, or services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            THE APP IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </Text>
          <Text style={styles.bulletPoint}>• Warranties of merchantability or fitness for a particular purpose</Text>
          <Text style={styles.bulletPoint}>• Warranties that the App will be uninterrupted or error-free</Text>
          <Text style={styles.bulletPoint}>• Warranties regarding the accuracy or reliability of information</Text>
          <Text style={styles.bulletPoint}>• Warranties that defects will be corrected</Text>
          <Text style={styles.paragraph}>
            We do not warrant that the App will meet your requirements or that any errors will be corrected. Your use of the App is at your sole risk.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL AVID OUTDOORSMAN, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
          </Text>
          <Text style={styles.bulletPoint}>• Loss of profits, data, or use</Text>
          <Text style={styles.bulletPoint}>• Personal injury or property damage</Text>
          <Text style={styles.bulletPoint}>• Business interruption</Text>
          <Text style={styles.bulletPoint}>• Loss of goodwill</Text>
          <Text style={styles.paragraph}>
            This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if we have been advised of the possibility of such damage.
          </Text>
          <Text style={styles.paragraph}>
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT YOU PAID TO US IN THE PAST TWELVE MONTHS, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to defend, indemnify, and hold harmless Avid Outdoorsman and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys&apos; fees, arising out of or in any way connected with:
          </Text>
          <Text style={styles.bulletPoint}>• Your access to or use of the App</Text>
          <Text style={styles.bulletPoint}>• Your violation of these Terms</Text>
          <Text style={styles.bulletPoint}>• Your violation of any third-party rights</Text>
          <Text style={styles.bulletPoint}>• Your User Content</Text>
          <Text style={styles.bulletPoint}>• Your outdoor activities undertaken using information from the App</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Governing Law and Dispute Resolution</Text>
          
          <Text style={styles.subsectionTitle}>13.1 Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
          </Text>

          <Text style={styles.subsectionTitle}>13.2 Dispute Resolution</Text>
          <Text style={styles.paragraph}>
            Any dispute arising from these Terms or your use of the App shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in [Your Location], and judgment on the award may be entered in any court having jurisdiction.
          </Text>

          <Text style={styles.subsectionTitle}>13.3 Class Action Waiver</Text>
          <Text style={styles.paragraph}>
            You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </Text>
          <Text style={styles.paragraph}>
            By continuing to access or use the App after revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you must stop using the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account and access to the App immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the App will immediately cease.
          </Text>
          <Text style={styles.paragraph}>
            All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Severability</Text>
          <Text style={styles.paragraph}>
            If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>17. Entire Agreement</Text>
          <Text style={styles.paragraph}>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and Avid Outdoorsman regarding the use of the App and supersede all prior agreements and understandings, whether written or oral.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>18. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: legal@avidoutdoorsman.com</Text>
          <Text style={styles.contactInfo}>Address: [Your Company Address]</Text>
          <Text style={styles.contactInfo}>Phone: [Your Contact Number]</Text>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.acknowledgment}>
            BY USING AVID OUTDOORSMAN, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM.
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
  },
});


# 🚀 Avid Outdoorsman - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Create a `.env` file from `.env.example`
- [ ] Add your Supabase credentials (if using backend features)
- [ ] Test the app with production environment variables

### 2. App Store Assets
- [ ] **App Icon**: Create a 1024x1024px icon (currently using placeholder)
- [ ] **Screenshots**: Prepare screenshots for all required device sizes
  - iPhone: 6.7", 6.5", 5.5"
  - iPad: 12.9", 11"
  - Android: Phone and Tablet
- [ ] **App Description**: Prepare store listing copy
- [ ] **Privacy Policy URL**: Required for App Store submission
- [ ] **Support URL**: Required for App Store submission

### 3. Testing
- [ ] Test all features on physical iOS device
- [ ] Test all features on physical Android device
- [ ] Test location tracking in background
- [ ] Test camera and photo permissions
- [ ] Test offline functionality
- [ ] Test with poor network conditions
- [ ] Verify all navigation flows work correctly

### 4. Legal & Compliance
- [ ] Create Privacy Policy (required for both stores)
- [ ] Create Terms of Service
- [ ] Ensure GDPR compliance if targeting EU users
- [ ] Review App Store Review Guidelines
- [ ] Review Google Play Store Policies

### 5. Apple Developer Account Setup
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Create App ID in Apple Developer Portal
- [ ] Create App Store Connect record
- [ ] Note your Apple ID, ASC App ID, and Team ID for `eas.json`

### 6. Google Play Console Setup
- [ ] Create Google Play Developer account ($25 one-time)
- [ ] Create app in Google Play Console
- [ ] Set up service account for automated submissions
- [ ] Download service account JSON key

---

## 🔨 Building Your App

### Install EAS CLI
```bash
npm install -g eas-cli
```

### Login to Expo
```bash
eas login
```

### Configure Your Project
```bash
eas build:configure
```

### Build for iOS (Production)
```bash
eas build --platform ios --profile production
```

### Build for Android (Production)
```bash
eas build --platform android --profile production
```

### Build for Both Platforms
```bash
eas build --platform all --profile production
```

---

## 📱 Testing Builds

### Preview Builds (Internal Testing)
```bash
# iOS (TestFlight-ready)
eas build --platform ios --profile preview

# Android (APK for direct install)
eas build --platform android --profile preview
```

### Install Preview Build
- **iOS**: Build will be uploaded to TestFlight automatically
- **Android**: Download APK from build page and install directly

---

## 🚀 Submitting to App Stores

### Update eas.json with Your Credentials

Before submitting, update the `submit.production` section in `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### Submit to Apple App Store
```bash
eas submit --platform ios --profile production
```

### Submit to Google Play Store
```bash
eas submit --platform android --profile production
```

---

## 🔄 Over-The-Air (OTA) Updates

After your app is published, you can push updates without rebuilding:

### Publish an Update
```bash
eas update --branch production --message "Bug fixes and improvements"
```

### Configure Update Channels
Add to `app.json`:
```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

---

## 📊 Post-Launch Monitoring

### Analytics & Crash Reporting
Consider integrating:
- **Sentry**: Error tracking
- **Firebase Analytics**: User behavior
- **Mixpanel**: Product analytics

### App Store Optimization (ASO)
- Monitor app store rankings
- Respond to user reviews
- Update screenshots based on new features
- A/B test app descriptions

---

## 🔐 Security Best Practices

### Before Launch:
- [ ] Remove all console.log statements with sensitive data
- [ ] Ensure API keys are in environment variables, not hardcoded
- [ ] Enable Supabase Row Level Security (RLS) policies
- [ ] Test authentication flows thoroughly
- [ ] Implement rate limiting on backend
- [ ] Set up proper CORS policies

---

## 📝 Version Management

### Incrementing Versions

**iOS** (in `app.json`):
```json
{
  "ios": {
    "buildNumber": "2"  // Increment for each build
  }
}
```

**Android** (in `app.json`):
```json
{
  "android": {
    "versionCode": 2  // Increment for each build
  }
}
```

**App Version** (in `app.json`):
```json
{
  "version": "1.0.1"  // Semantic versioning
}
```

---

## 🆘 Common Issues & Solutions

### Build Fails
- Check that all dependencies are compatible with Expo SDK 54
- Ensure native modules are properly configured
- Review build logs in EAS dashboard

### App Rejected by Apple
- Most common: Missing privacy policy
- Ensure all permission descriptions are clear
- Test on actual devices, not just simulator

### Location Not Working in Production
- Verify Info.plist permissions are set correctly
- Test background location on physical device
- Ensure location permissions are requested at appropriate times

### Supabase Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is not paused
- Ensure RLS policies allow necessary operations

---

## 📞 Support Resources

- **Expo Documentation**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/
- **Expo Forums**: https://forums.expo.dev
- **Apple Developer**: https://developer.apple.com
- **Google Play Console**: https://play.google.com/console

---

## 🎉 Launch Day Checklist

- [ ] Final build tested on physical devices
- [ ] App Store listings complete with screenshots
- [ ] Privacy policy and terms of service published
- [ ] Support email set up and monitored
- [ ] Social media accounts ready
- [ ] Press kit prepared (if applicable)
- [ ] Analytics and crash reporting configured
- [ ] Backend scaled for expected traffic
- [ ] Customer support plan in place

---

## 🔄 Post-Launch Updates

### Regular Maintenance
- Monitor crash reports daily
- Respond to user reviews within 24-48 hours
- Release bug fixes within 1-2 weeks
- Plan feature updates quarterly
- Keep dependencies up to date

### Marketing
- Encourage users to leave reviews
- Share updates on social media
- Create content showcasing features
- Engage with outdoor communities
- Consider influencer partnerships

---

Good luck with your launch! 🎊

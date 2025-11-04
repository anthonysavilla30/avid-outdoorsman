
# 🚀 Quick Start: Deploy Avid Outdoorsman

## Prerequisites

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Create Accounts**
   - Expo account (free): https://expo.dev/signup
   - Apple Developer ($99/year): https://developer.apple.com
   - Google Play Developer ($25 one-time): https://play.google.com/console

## Step-by-Step Deployment

### 1️⃣ Initial Setup (One-Time)

```bash
# Login to Expo
eas login

# Configure project
eas build:configure
```

### 2️⃣ Test Build (Preview)

Build a test version to share with testers:

```bash
# iOS (TestFlight)
npm run build:preview

# Or manually:
eas build --platform ios --profile preview
```

```bash
# Android (APK)
eas build --platform android --profile preview
```

### 3️⃣ Production Build

When ready for app stores:

```bash
# Build both platforms
npm run build:production

# Or build individually:
npm run build:ios
npm run build:android:prod
```

### 4️⃣ Submit to App Stores

**First, update `eas.json` with your credentials:**

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",
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

**Then submit:**

```bash
# iOS
npm run submit:ios

# Android
npm run submit:android
```

### 5️⃣ Over-The-Air Updates

After your app is live, push updates without rebuilding:

```bash
npm run update:production
```

## 📋 Before Building Checklist

- [ ] Update version in `app.json` (e.g., "1.0.0" → "1.0.1")
- [ ] Increment build numbers:
  - iOS: `buildNumber` in `app.json`
  - Android: `versionCode` in `app.json`
- [ ] Test on physical devices
- [ ] Configure environment variables (`.env` file)
- [ ] Prepare app store assets (icon, screenshots, description)
- [ ] Create privacy policy and terms of service

## 🎨 Required Assets

### App Icon
- **Size**: 1024x1024px
- **Format**: PNG (no transparency)
- **Location**: Update in `app.json` → `icon`

### Screenshots
Prepare for:
- iPhone 6.7" (Pro Max)
- iPhone 6.5" (Plus)
- iPhone 5.5"
- iPad 12.9"
- iPad 11"
- Android Phone
- Android Tablet

## 🔧 Common Commands

```bash
# Check build status
eas build:list

# View specific build
eas build:view [BUILD_ID]

# Cancel build
eas build:cancel [BUILD_ID]

# View project info
eas project:info

# Configure credentials
eas credentials
```

## 🆘 Troubleshooting

### Build Fails
1. Check build logs: `eas build:view [BUILD_ID]`
2. Verify all dependencies are compatible
3. Ensure native modules are configured correctly

### "Missing credentials"
```bash
eas credentials
```
Follow prompts to set up iOS/Android credentials.

### "Invalid bundle identifier"
Ensure `bundleIdentifier` (iOS) and `package` (Android) in `app.json` match your developer accounts.

### Location not working
- Test on physical device (not simulator)
- Verify permissions in `app.json`
- Check that user granted permissions

## 📱 Testing Your Build

### iOS (TestFlight)
1. Build completes → automatically uploaded to TestFlight
2. Add testers in App Store Connect
3. Testers receive email invitation
4. Install via TestFlight app

### Android (Internal Testing)
1. Build completes → download APK or AAB
2. Upload to Google Play Console
3. Add testers to internal testing track
4. Share testing link with testers

## 🎯 Next Steps After Deployment

1. **Monitor**: Check crash reports and analytics
2. **Respond**: Reply to user reviews within 24-48 hours
3. **Update**: Plan regular updates (bug fixes, features)
4. **Market**: Share on social media, outdoor forums
5. **Iterate**: Gather feedback and improve

## 📞 Need Help?

- **Expo Docs**: https://docs.expo.dev
- **Expo Forums**: https://forums.expo.dev
- **Discord**: https://chat.expo.dev

---

## 🎉 You're Ready!

Your app is configured and ready to deploy. Start with a preview build to test, then move to production when ready.

```bash
# Start here:
npm run build:preview
```

Good luck with your launch! 🚀

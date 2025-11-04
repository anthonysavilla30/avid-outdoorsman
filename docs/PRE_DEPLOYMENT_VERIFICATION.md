
# Pre-Deployment Verification Guide

Run through this checklist before building for production.

## 🔍 Code Verification

### 1. Check for Debug Code
Search your codebase for:
- `console.log` statements with sensitive data
- `TODO` or `FIXME` comments
- Hardcoded API keys or credentials
- Test/mock data that should be removed

### 2. Environment Variables
```bash
# Verify .env file exists and has correct values
cat .env

# Should contain:
# EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Dependencies
```bash
# Check for outdated or vulnerable packages
npm outdated
npm audit

# Update if needed
npm update
npm audit fix
```

## 📱 App Configuration

### app.json Verification

```json
{
  "expo": {
    "name": "Avid Outdoorsman",           // ✓ Set
    "slug": "avid-outdoorsman",           // ✓ Set
    "version": "1.0.0",                   // ✓ Update for each release
    "icon": "./assets/images/...",        // ⚠️ Replace placeholder
    "ios": {
      "bundleIdentifier": "com.avidoutdoorsman.app",  // ✓ Set
      "buildNumber": "1"                  // ✓ Increment for each build
    },
    "android": {
      "package": "com.avidoutdoorsman.app",  // ✓ Set
      "versionCode": 1                    // ✓ Increment for each build
    }
  }
}
```

### eas.json Verification

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID_HERE",        // ⚠️ Update
        "ascAppId": "YOUR_ASC_APP_ID_HERE",     // ⚠️ Update
        "appleTeamId": "YOUR_APPLE_TEAM_ID_HERE" // ⚠️ Update
      },
      "android": {
        "serviceAccountKeyPath": "./path/to/api-key.json",  // ⚠️ Update
        "track": "internal"
      }
    }
  }
}
```

## 🧪 Testing Checklist

### Core Features
- [ ] App launches successfully
- [ ] User can create account / login
- [ ] Location permissions work correctly
- [ ] Camera permissions work correctly
- [ ] Photo library permissions work correctly
- [ ] Posts can be created with photos
- [ ] Weather data loads correctly
- [ ] Map features display correctly
- [ ] Activity tracking works
- [ ] Regulations load and filter correctly
- [ ] Offline mode works (when no backend)

### Platform-Specific
- [ ] Test on iPhone (iOS 15+)
- [ ] Test on iPad
- [ ] Test on Android phone (Android 10+)
- [ ] Test on Android tablet
- [ ] Background location tracking works
- [ ] App works after backgrounding/foregrounding
- [ ] Deep links work (if implemented)
- [ ] Push notifications work (if implemented)

### Edge Cases
- [ ] Poor network connection
- [ ] No network connection
- [ ] Location services disabled
- [ ] Camera permission denied
- [ ] Photo library permission denied
- [ ] Low battery mode
- [ ] Low storage space
- [ ] App killed and restarted

## 🎨 Assets Checklist

### Required
- [ ] App icon (1024x1024px, PNG, no transparency)
- [ ] Splash screen image
- [ ] iPhone screenshots (6.7", 6.5", 5.5")
- [ ] iPad screenshots (12.9", 11")
- [ ] Android phone screenshots
- [ ] Android tablet screenshots

### Optional but Recommended
- [ ] App preview video (15-30 seconds)
- [ ] Feature graphic (Android)
- [ ] Promotional images

## 📄 Legal Documents

- [ ] Privacy Policy created and published
- [ ] Terms of Service created and published
- [ ] Support email set up
- [ ] Support URL ready
- [ ] Age rating determined

### Privacy Policy Must Include:
- What data you collect (location, photos, user profile)
- How you use the data
- How you store the data
- Third-party services (Supabase, etc.)
- User rights (access, deletion, etc.)
- Contact information

## 🔒 Security Checklist

- [ ] No API keys in source code
- [ ] Environment variables properly configured
- [ ] Supabase RLS policies enabled
- [ ] HTTPS only for all requests
- [ ] Input validation on all forms
- [ ] User data encrypted
- [ ] Secure authentication flow
- [ ] Password requirements enforced

## 🚀 Build Preparation

### Version Numbers
```json
// app.json
{
  "version": "1.0.0",        // Semantic versioning
  "ios": {
    "buildNumber": "1"       // Increment for each iOS build
  },
  "android": {
    "versionCode": 1         // Increment for each Android build
  }
}
```

### Version Increment Rules
- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features, backwards compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes

## 📊 Monitoring Setup

### Recommended Services
- [ ] Crash reporting (Sentry, Bugsnag)
- [ ] Analytics (Firebase, Mixpanel)
- [ ] Performance monitoring
- [ ] User feedback tool

## 🎯 App Store Optimization

### App Store Connect (iOS)
- [ ] App name (30 characters max)
- [ ] Subtitle (30 characters max)
- [ ] Description (4000 characters max)
- [ ] Keywords (100 characters max)
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Privacy Policy URL
- [ ] Category selected
- [ ] Age rating completed

### Google Play Console (Android)
- [ ] App name (50 characters max)
- [ ] Short description (80 characters max)
- [ ] Full description (4000 characters max)
- [ ] Category selected
- [ ] Content rating completed
- [ ] Privacy Policy URL
- [ ] Support email

## ✅ Final Verification

Run these commands before building:

```bash
# 1. Clean install dependencies
rm -rf node_modules
npm install

# 2. Run linter
npm run lint

# 3. Type check
npx tsc --noEmit

# 4. Test build locally
npm run dev

# 5. Test on physical devices
npm run ios    # Connect iPhone
npm run android # Connect Android device
```

## 🎬 Ready to Build?

If all checks pass:

```bash
# Preview build (for testing)
npm run build:preview

# Production build (for app stores)
npm run build:production
```

## 📝 Post-Build Checklist

After build completes:

- [ ] Download and test the build
- [ ] Verify app icon displays correctly
- [ ] Verify splash screen displays correctly
- [ ] Test all critical user flows
- [ ] Check app size (should be reasonable)
- [ ] Review build logs for warnings

## 🚨 Common Issues

### Build Fails
- Check build logs in EAS dashboard
- Verify all native dependencies are compatible
- Ensure credentials are configured correctly

### App Crashes on Launch
- Check for missing environment variables
- Verify all required permissions are in app.json
- Test on physical device, not just simulator

### Location Not Working
- Ensure permissions are in Info.plist (iOS) and AndroidManifest (Android)
- Test on physical device with location services enabled
- Check that permission descriptions are clear

### Images Not Loading
- Verify image paths are correct
- Check that images are optimized (not too large)
- Ensure network permissions are granted

---

## 🎉 All Set?

Once everything checks out, you're ready to deploy!

**Next Steps:**
1. Build preview version for testing
2. Share with beta testers
3. Gather feedback
4. Fix any issues
5. Build production version
6. Submit to app stores
7. 🚀 Launch!

Good luck! 🍀

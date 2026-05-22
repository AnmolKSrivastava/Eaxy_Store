# CI/CD Setup Guide for Firebase Deployment

This guide will help you set up automatic deployment from GitHub to Firebase Hosting.

## ✅ What's Already Done

1. **GitHub Actions Workflow Created** - `.github/workflows/firebase-deploy.yml`
2. **Firebase Configuration Ready** - `firebase.json` and `.firebaserc` are configured
3. **Build Directory Set** - Deploying from `build/` folder

## 🔧 Setup Instructions

### Step 1: Get Firebase Service Account Key

You have two options:

#### Option A: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `eaxy-store`
3. Click on **Settings** ⚙️ (top left, next to Project Overview)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. **⚠️ IMPORTANT**: Keep this file secure - it contains sensitive credentials

#### Option B: Using Firebase CLI (Alternative)

If you prefer CLI, you can generate a token:

```bash
# Install Firebase CLI globally if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Generate a CI token (deprecated but still works)
firebase login:ci
```

### Step 2: Add Secret to GitHub

1. Go to your GitHub repository: `https://github.com/AnmolKSrivastava/Eaxy_Store`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add the following secret:

   **Name:** `FIREBASE_SERVICE_ACCOUNT`
   
   **Value:** Paste the entire content of the JSON file from Step 1
   
   (The JSON should look like this:)
   ```json
   {
     "type": "service_account",
     "project_id": "eaxy-store",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "...",
     "client_id": "...",
     ...
   }
   ```

6. Click **Add secret**

### Step 3: Verify Workflow Triggers

The CI/CD pipeline will automatically trigger on:
- ✅ Every push to `main` branch
- ✅ Manual trigger via GitHub Actions tab

### Step 4: Test the Pipeline

1. Make a small change to any file
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "test: Trigger CI/CD pipeline"
   git push origin main
   ```

3. Go to your GitHub repository → **Actions** tab
4. You should see a new workflow run "Deploy to Firebase Hosting"
5. Click on it to watch the deployment progress

### Step 5: Monitor Deployment

The workflow includes these stages:
1. 🔄 Checkout Repository
2. 📦 Setup Node.js 18
3. ⬇️ Install Dependencies
4. 🏗️ Build React App
5. 🚀 Deploy to Firebase

Each step will show:
- ✅ Green checkmark = Success
- ❌ Red X = Failed (check logs for errors)

## 🎯 What Happens After Setup

Once configured, every time you push code to `main`:
1. GitHub Actions automatically starts
2. Installs dependencies with `npm ci`
3. Builds the production app with `npm run build`
4. Deploys to Firebase Hosting
5. Your live site updates automatically! 🎉

## 🔍 Troubleshooting

### Issue: "FIREBASE_SERVICE_ACCOUNT secret not found"
**Solution:** Make sure you've added the secret to GitHub (Step 2)

### Issue: "Firebase project not found"
**Solution:** Update `projectId` in `.github/workflows/firebase-deploy.yml` to match your Firebase project ID

### Issue: "Permission denied"
**Solution:** Ensure the service account has "Firebase Hosting Admin" role

### Issue: Build fails with npm errors
**Solution:** Make sure `package.json` and `package-lock.json` are committed

## 📊 Viewing Deployment History

- **GitHub Actions**: `https://github.com/AnmolKSrivastava/Eaxy_Store/actions`
- **Firebase Console**: `https://console.firebase.google.com/project/eaxy-store/hosting`

## 🔐 Security Best Practices

1. ✅ Never commit the service account JSON file
2. ✅ Never share the service account key
3. ✅ Use GitHub Secrets for sensitive data
4. ✅ Regenerate keys if accidentally exposed
5. ✅ Use different service accounts for dev/prod if needed

## 🚀 Next Steps

After setup is complete:
1. All future pushes to `main` will auto-deploy
2. You can manually trigger deployments from GitHub Actions
3. Monitor deployment status in real-time
4. Rollback to previous versions via Firebase Console if needed

---

**Need Help?** Check the GitHub Actions logs or Firebase Console for detailed error messages.

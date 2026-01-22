# 🚀 Render Backend Deployment - Quick Steps

## Step 1: Backend Web Service Setup

### 1.1 Connect GitHub Repository
You're on the "New Web Service" page. Follow these steps:

1. **Connect GitHub** (if not already):
   - Click "Connect account" 
   - Authorize Render to access your GitHub

2. **Select Repository:**
   - Find: `lokendrakkumar01/my-work-`
   - Click **"Connect"**

### 1.2 Configure Service

Fill in these EXACT values:

```
Name: creator-hub-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend
Runtime: Node (auto-detected)
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### 1.3 Add Environment Variables

**IMPORTANT:** Before clicking "Create Web Service", scroll down and add these environment variables:

Click **"Add Environment Variable"** for each:

```env
MONGODB_URI
mongodb+srv://zuno5259_db_user:qX8v2C7QWmwQ8LZ2@cluster0.rmxfxhj.mongodb.net/creator_hub?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
creator_hub_super_secret_jwt_key_2026_secure_minimum_32_chars

JWT_EXPIRES_IN
7d

SESSION_SECRET
creator_hub_session_secret_key_2026_secure_minimum_32_chars

EMAIL_SERVICE
gmail

EMAIL_USER
demo@example.com

EMAIL_PASSWORD
demo_password

EMAIL_FROM
Creator Control Hub <noreply@creatorhub.com>

GEMINI_API_KEY
AIzaSyCEMABdG8v3n7d_kpKcLQhPumDt36MzDsc

PORT
5000

NODE_ENV
production

RATE_LIMIT_WINDOW_MS
900000

RATE_LIMIT_MAX_REQUESTS
100

MAX_FILE_SIZE
52428800
```

**Note:** `FRONTEND_URL` and `CORS_ORIGINS` will be added AFTER frontend deployment.

### 1.4 Deploy!

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy the backend URL (will be like: `https://creator-hub-backend.onrender.com`)

---

## ✅ What Happens Next

- Render will build your backend
- Install all npm dependencies
- Start the server
- You'll get a live URL

Once backend is deployed, we'll deploy the frontend!

**Ready? Follow the steps above in your Render dashboard!** 🚀

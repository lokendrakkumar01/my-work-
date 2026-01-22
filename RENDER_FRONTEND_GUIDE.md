# 🎨 Frontend Deployment - Quick Guide

## ✅ Backend Already Deployed!
Backend URL: `https://creator-hub-backend.onrender.com`

---

## 📱 Frontend Deployment Steps

### Step 1: Create Static Site on Render

1. **Render Dashboard** pe jao: https://dashboard.render.com
2. **"New +"** button → **"Static Site"** select karo
3. **Same repository connect karo:** `lokendrakkumar01/my-work-`

### Step 2: Configure Settings

```
Name: creator-hub-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: out
```

### Step 3: Add Environment Variable

**Single environment variable:**

```
NAME: NEXT_PUBLIC_API_URL
VALUE: https://creator-hub-backend.onrender.com/api
```

### Step 4: Deploy!

Click **"Create Static Site"**

Deployment 5-10 minutes lagega.

---

## 🔄 Final Step: Update Backend CORS

Jab frontend deploy ho jaye aur URL mile (e.g., `https://creator-hub-frontend.onrender.com`), tab:

1. Backend service ke **Environment** tab mein jao
2. **2 new variables add karo:**

```
NAME: FRONTEND_URL
VALUE: https://creator-hub-frontend.onrender.com

NAME: CORS_ORIGINS  
VALUE: https://creator-hub-frontend.onrender.com
```

3. Save → Backend automatic redeploy hoga

---

## ✅ Testing

Frontend URL open karo:
- Registration test karo
- Login test karo
- Dashboard check karo

**Done! Platform LIVE! 🎉**

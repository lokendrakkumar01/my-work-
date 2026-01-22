# 🚀 Quick Start Guide - Creator Control Hub

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas account created
- [ ] Gmail account (for OTP emails)
- [ ] Google Gemini API key obtained

---

## Setup in 5 Minutes

### 1. MongoDB Atlas Setup (2 minutes)

1. Visit https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0)
3. Security → Database Access → Add New User:
   - Username: `creatorhub`
   - Password: (save this!)
4. Security → Network Access → Add IP: `0.0.0.0/0`
5. Get connection string: Databases → Connect → Drivers
   ```
   mongodb+srv://creatorhub:<password>@cluster0.xxxxx.mongodb.net/creator_hub
   ```

### 2. Get API Keys (1 minute)

**Gemini AI:**
1. Visit https://ai.google.dev/
2. Click "Get API key"
3. Create project and generate key

**Gmail App Password:**
1. Google Account → Security → 2-Step Verification
2. App passwords → Generate
3. Select "Mail" and your device
4. Copy the 16-character password

### 3. Configure Environment (1 minute)

Create `backend/.env` file:

```env
MONGODB_URI=mongodb+srv://creatorhub:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/creator_hub

JWT_SECRET=random_string_min_32_chars_use_password_generator
SESSION_SECRET=another_random_string_min_32_chars

EMAIL_SERVICE=gmail
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=Creator Hub <noreply@creatorhub.com>

GEMINI_API_KEY=your_gemini_api_key

PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

> Replace all placeholders with your actual values!

### 4. Install & Run (1 minute)

**Terminal 1 (Backend):**
```bash
cd "C:\Users\loken\Downloads\my work\backend"
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd "C:\Users\loken\Downloads\my work\frontend"
npm install
npm run dev
```

### 5. Access Platform

Open browser: **http://localhost:3000**

Click "Sign up" and create your account!

---

## Troubleshooting

### MongoDB connection fails
- Check password in connection string (no special characters need encoding)
- Verify IP whitelist includes `0.0.0.0/0`
- Ensure cluster is running (not paused)

### Email not sending
- Use Gmail App Password, not regular password
- Enable 2-Step Verification in Google Account
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`

### Port already in use
- Backend: Change `PORT=5000` to `PORT=5001` in `.env`
- Frontend: Run on different port: `npm run dev -- -p 3001`

### API calls failing
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Look for errors in backend terminal

---

## Test Your Setup

### 1. Test Backend API

Visit http://localhost:5000/health

Should see:
```json
{
  "status": "ok",
  "timestamp": "2026-01-22T...",
  "environment": "development"
}
```

### 2. Test Registration

1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill in form and submit
4. Check your email for welcome message
5. Should redirect to dashboard

### 3. Test AI Features

Once logged in, use the API to test AI:

```bash
# Get your token from browser localStorage
# Then test caption generation:

curl -X POST http://localhost:5000/api/ai/generate-caption \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"context":"Launched my new app","platform":"linkedin","language":"en"}'
```

---

## Next Steps

1. **Explore the dashboard** - Check out the analytics and quick actions
2. **Test API endpoints** - Use Postman or Thunder Client
3. **Add more features** - Build additional frontend pages
4. **Deploy** - Follow deployment guide in walkthrough.md

---

## Support

- Check **walkthrough.md** for detailed documentation
- Review **README.md** for complete features list
- Check **implementation_plan.md** for architecture details

**You're all set!** 🎉 Start building your creator empire!

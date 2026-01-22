<<<<<<< HEAD
# 🚀 Creator Control Hub

> **Enterprise-grade, AI-powered creator management platform** - Your complete command center for YouTube, social media, productivity, and project management.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

---

## 📋 Overview

**Creator Control Hub** is a unified, intelligent dashboard that centralizes:

- 📱 **Social Media Management** - LinkedIn, Twitter/X, Instagram, YouTube Community
- 🎬 **YouTube Studio** - Complete video workflow from idea to analytics
- ✅ **Productivity System** - Tasks, habits, Pomodoro, and performance tracking
- 📊 **Project Management** - Research, development, milestones, and documentation
- 🤖 **AI Copilot** - Smart content generation and productivity insights
- 📈 **Unified Analytics** - Real-time insights across all platforms
- 🗄️ **Knowledge Vault** - Secure file storage and intelligent search

---

## ✨ Key Features

### 🔐 Authentication & Security
- Email + OTP authentication
- JWT-based session management
- Two-factor authentication (2FA)
- Role-based access control (RBAC)
- Secure password hashing with bcrypt

### 📱 Social Media Command Center
- Multi-platform post composer (LinkedIn, Twitter, Instagram)
- AI-generated captions (English + Hindi)
- Advanced scheduling with calendar view
- Hashtag intelligence
- Best-time-to-post predictions
- A/B testing for captions
- Platform-wise analytics and growth tracking

### 🎬 YouTube Studio
- Video idea backlog management
- AI-powered script generation
- Chapter creation and hook optimization
- Thumbnail planning checklist
- Upload workflow tracker (idea → publish)
- SEO scoring and CTR optimization
- Retention analysis and revenue insights

### ✅ Daily Productivity Suite
- Smart to-do lists with priorities
- Pomodoro focus mode (25/5 intervals)
- Habit tracking with streaks
- Productivity scoring
- Burnout detection alerts
- Weekly/monthly/yearly performance reports

### 📊 Project & Research Hub
- Unlimited projects with tech stacks
- Milestone and sprint tracking
- Roadmap visualization
- File uploads and version control
- Progress analytics

### 🤖 AI Copilot
- Content idea generation
- Full YouTube script writing
- Social media post generation
- Productivity planning
- Proactive alerts and optimization tips

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **State Management**: Zustand
- **Data Fetching**: React Query

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **File Upload**: Multer
- **Scheduling**: Node-cron

### Security
- Helmet.js for security headers
- Rate limiting
- CORS configuration
- Input validation and sanitization

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email OTP (or other SMTP service)

### Step 1: Clone the Repository
```bash
cd "C:\Users\loken\Downloads\my work"
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 3: Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your values:
   - **MongoDB URI**: Get from MongoDB Atlas
   - **JWT Secrets**: Generate random strings (minimum 32 characters)
   - **Email credentials**: Gmail app-specific password
   - **AI API Keys**: Get from Google AI Studio or OpenAI

### Step 4: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and add to `.env`

### Step 5: Run the Application

**Development Mode:**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🗂️ Project Structure

```
creator-control-hub/
├── frontend/                  # Next.js application
│   ├── app/                  # App router pages
│   │   ├── (auth)/          # Authentication pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── social/          # Social media hub
│   │   ├── youtube/         # YouTube studio
│   │   ├── productivity/    # Tasks & habits
│   │   ├── projects/        # Project management
│   │   ├── analytics/       # Analytics cockpit
│   │   ├── vault/           # Knowledge vault
│   │   └── settings/        # User settings
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn components
│   │   ├── layout/         # Layout components
│   │   └── features/       # Feature components
│   ├── lib/                # Utilities
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   └── public/             # Static assets
├── backend/                 # Express server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, validation
│   ├── services/           # External services
│   ├── utils/              # Helper functions
│   ├── config/             # Configuration
│   └── server.js           # Entry point
├── .env.example            # Environment template
├── .gitignore             # Git ignore rules
└── README.md              # Documentation
```

---

## 🔑 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email + password |
| POST | `/api/auth/send-otp` | Send email OTP |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/enable-2fa` | Enable 2FA |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/reset-password` | Password recovery |

### Social Media Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/social/posts` | Get all posts |
| POST | `/api/social/posts` | Create new post |
| PUT | `/api/social/posts/:id` | Update post |
| DELETE | `/api/social/posts/:id` | Delete post |
| POST | `/api/social/schedule` | Schedule post |
| GET | `/api/social/analytics` | Get social analytics |

### YouTube Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/youtube/ideas` | Get idea backlog |
| POST | `/api/youtube/ideas` | Create video idea |
| POST | `/api/youtube/generate-script` | AI script generation |
| GET | `/api/youtube/analytics` | Get YouTube analytics |

### Productivity Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/habits` | Get habits |
| POST | `/api/habits` | Create habit |

### AI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-caption` | Generate AI caption |
| POST | `/api/ai/generate-script` | Generate YouTube script |
| POST | `/api/ai/suggest-ideas` | Content idea suggestions |

---

## 🎨 Features In Detail

### 1. Social Media Management
- **Multi-platform composer** with real-time previews
- **AI caption generation** in English and Hindi
- **Smart scheduling** based on audience activity patterns
- **Hashtag recommendations** using AI
- **Bulk upload** for content batching
- **Analytics dashboard** with engagement metrics

### 2. YouTube Studio
- **Idea backlog** with categorization
- **Script editor** with AI assistance
- **SEO optimizer** for titles and descriptions
- **Chapter generator** for better navigation
- **Thumbnail planner** with checklist
- **Performance tracking** (views, CTR, retention)

### 3. Productivity System
- **Kanban board** for task management
- **Pomodoro timer** with session tracking
- **Habit streaks** with visual progress
- **Daily reflection** for continuous improvement
- **Burnout alerts** based on workload patterns

### 4. AI Copilot
- Context-aware content suggestions
- Automatic caption generation
- Script writing with hooks and chapters
- Productivity recommendations
- Proactive notifications

---

## 🚀 Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
```bash
cd frontend
npm run build
# Deploy to Vercel via CLI or GitHub integration
```

**Backend (Railway):**
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Option 2: Render (Full Stack)

1. Create Web Service for backend
2. Create Static Site for frontend
3. Configure environment variables
4. Connect MongoDB Atlas

### Environment Variables for Production
Ensure all values from `.env.example` are set in your hosting platform.

---

## 🔒 Security Best Practices

- ✅ All secrets in environment variables
- ✅ JWT tokens with expiration
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Rate limiting on all endpoints
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Security headers with Helmet.js
- ✅ No credentials in code or version control

---

## 📱 Progressive Web App (PWA)

The platform is PWA-enabled for:
- Offline functionality
- Install on desktop/mobile
- Push notifications
- Fast loading with caching

---

## 🌐 Future Roadmap

- [ ] Multi-creator team support
- [ ] Advanced role permissions
- [ ] Monetization dashboard
- [ ] Brand deal tracking
- [ ] Course management module
- [ ] Native mobile apps (React Native)
- [ ] Advanced AI analytics
- [ ] Third-party integrations (Notion, Slack)

---

## 🤝 Contributing

This is a personal creator platform, but suggestions are welcome!

---

## 📄 License

MIT License - feel free to use and modify for your needs.

---

## 👨‍💻 Creator Information

**Platform built for:**
- YouTube: [@uaacademy9629](http://www.youtube.com/@uaacademy9629)
- LinkedIn: [Lokendra Kumar](https://www.linkedin.com/in/lokendrakumar13)
- Twitter/X: [@LokendraKu39266](https://twitter.com/LokendraKu39266)

---

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review the implementation plan
3. Contact the creator

---

**Built with ❤️ for creators, by a creator**
=======
# my-work-
>>>>>>> 370f7035c83864f0bc958c799ba89bcae61478d4

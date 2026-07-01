# AquaFlow - Quick Start Guide

Get AquaFlow running in minutes! Choose your setup path below.

## ⚡ 5-Minute Local Setup

### 1. Prerequisites
- Node.js 18+ installed
- A code editor (VS Code recommended)
- Git (optional, for cloning)

### 2. Clone & Install
```bash
# Navigate to your projects folder
cd ~/projects

# Clone the repository
git clone <repository-url> AquaFlow
cd AquaFlow

# Install dependencies
npm install
```

### 3. Setup Database (Quick - Using Neon)
```bash
# Create free Neon account at https://neon.tech
# Create a new project and database

# Copy the connection string and create .env.local
cp .env.example .env.local

# Edit .env.local and set:
# DATABASE_URL=postgresql://[your-neon-connection-string]
# NEXTAUTH_SECRET=random-32-chars (use: openssl rand -base64 32)
# NEXTAUTH_URL=http://localhost:3000
```

### 4. Initialize Database
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Login
Open http://localhost:3000 in your browser

**Test Accounts:**
- Email: `admin@aquaflow.com`
- Password: `password123`
- Role: Admin (or choose Coach, Accountant, Swimmer)

## 🌐 Deploy to Vercel (10 minutes)

### Prerequisites
- GitHub account with your code pushed
- Vercel account (free)

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial AquaFlow setup"
   git push origin main
   ```

2. **Create Vercel Project**
   - Visit https://vercel.com/new
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add:
     ```
     DATABASE_URL=postgresql://...  (from Neon)
     NEXTAUTH_URL=https://<your-project>.vercel.app
     NEXTAUTH_SECRET=<32-char-random-string>
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Visit your live site!

## 📚 Available Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Check code quality

npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio (database GUI)
npm run seed            # Populate database with sample data
```

## 🎯 What You Can Do

### As Admin
- ✅ View dashboard with statistics
- ✅ Manage all swimmers (add, edit, delete)
- ✅ Create and manage training sessions
- ✅ View attendance records
- ✅ Access financial reports
- ✅ Manage system settings

### As Coach
- ✅ View dashboard
- ✅ Manage training sessions
- ✅ Track swimmer performance
- ✅ View member profiles (read-only)
- ✅ Record attendance

### As Accountant
- ✅ View financial summaries
- ✅ Manage payments
- ✅ Generate financial reports
- ✅ View member directory

### As Swimmer
- ✅ View personal dashboard
- ✅ Check training schedule
- ✅ View performance history
- ✅ Track personal goals
- ✅ Edit profile

## 🗂️ Project Structure

```
AquaFlow/
├── app/                 # Next.js app directory
│   ├── (dashboard)/    # Protected dashboard pages
│   ├── api/            # API endpoints
│   ├── login/          # Login page
│   └── page.tsx        # Landing page
├── components/         # Reusable components
├── lib/                # Utilities (auth, database)
├── prisma/             # Database schema & migrations
├── public/             # Static files
└── README.md           # Full documentation
```

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### "Database connection failed"
- Check `DATABASE_URL` in `.env.local`
- Verify database is running (Neon/PostgreSQL)
- Ensure connection string is correct

### "Build fails with TypeScript errors"
```bash
# Clear build cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
# Then visit http://localhost:3001
```

## 📖 Learn More

- [Full README](./README.md) - Complete project documentation
- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Project Summary](./PROJECT_SUMMARY.md) - Full feature list
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🆘 Getting Help

1. Check error message carefully
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)
3. Check database connection
4. Verify environment variables: `cat .env.local`
5. Review Next.js build output

## 💡 Tips

- Use Prisma Studio to explore database: `npm run prisma:studio`
- Check network requests in browser DevTools
- Review logs in terminal where you ran `npm run dev`
- Use VS Code Extensions: ESLint, Prettier, Tailwind CSS IntelliSense

## 🚀 Next Steps

1. ✅ Get it running locally
2. ✅ Test with sample accounts
3. ✅ Deploy to Vercel
4. ✅ Customize colors and branding
5. ✅ Add your own swimmers and coaches
6. ✅ Connect your own domain to Vercel
7. ✅ Set up email notifications (future feature)
8. ✅ Add custom reports (future feature)

## 📞 Support

- 📧 Email: support@aquaflow.dev (future)
- 🐛 Issues: Create a GitHub issue
- 💬 Discussions: GitHub Discussions (future)

---

**Happy swimming! 🏊‍♂️**

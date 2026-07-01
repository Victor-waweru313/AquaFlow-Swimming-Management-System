# AquaFlow Swimming Management System - Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database (Vercel Postgres or Neon recommended)
- A Vercel account (for Vercel deployment)
- Git (for version control)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AquaFlow-Swimming-Management-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/aquaflow
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
```

### 4. Set Up Database

#### Option A: Local PostgreSQL

```bash
# Create database
psql -U postgres -c "CREATE DATABASE aquaflow;"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed with sample data
npm run seed
```

#### Option B: Neon (Recommended for Quick Setup)

1. Create a free account at https://neon.tech
2. Create a new project and database
3. Copy the connection string to `DATABASE_URL` in `.env.local`
4. Run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 in your browser.

### 6. Default Login Credentials

Use these credentials to test different roles:

- **Admin**: admin@aquaflow.com / password123
- **Coach**: coach@aquaflow.com / password123
- **Accountant**: accountant@aquaflow.com / password123
- **Swimmer**: swimmer@aquaflow.com / password123

## Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial AquaFlow project"
git push origin main
```

### 2. Create Vercel Project

1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Click "Import"

### 3. Configure Environment Variables in Vercel

In the Vercel dashboard, go to Settings > Environment Variables and add:

- `DATABASE_URL`: Connect to Vercel Postgres or Neon
- `NEXTAUTH_URL`: `https://<your-vercel-domain>.vercel.app`
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

### 4. Set Up Database

#### Using Vercel Postgres (Easiest)

1. In Vercel dashboard, go to Storage > Create Database > Postgres
2. Vercel will automatically add `DATABASE_URL` to environment variables
3. Run migrations:

```bash
vercel env pull
npm run prisma:migrate
npm run seed
```

#### Using Neon (Alternative)

1. Create database at https://neon.tech
2. Copy connection string
3. Add to Vercel environment variables as `DATABASE_URL`
4. Run migrations (same as above)

### 5. Deploy

```bash
git push origin main
```

Vercel will automatically detect the push and start building/deploying.

### 6. Post-Deployment Setup

After your first deployment, seed the production database:

```bash
vercel env pull
npx prisma db seed
```

## Database Schema

The application uses Prisma ORM with the following key models:

- **User**: Authentication and role management (ADMIN, COACH, ACCOUNTANT, SWIMMER)
- **Swimmer**: Member profiles with membership types (STANDARD, PREMIUM, ELITE)
- **Coach**: Coaching staff profiles
- **Pool**: Swimming pool locations with lanes
- **Session**: Training sessions with enrollment management
- **Attendance**: Check-in/check-out tracking
- **Performance**: Time records and rankings
- **Payment**: Membership and session fees
- **TrainingGoal**: Personal training objectives

View the complete schema in `prisma/schema.prisma`.

## Key Features

### Role-Based Access Control

- **Admin**: Full system access (dashboard, all management)
- **Coach**: Training schedule management, attendance, performance tracking
- **Accountant**: Financial management, reporting
- **Swimmer**: Personal performance, schedule, goals

### Core Pages

1. **Dashboard** (`/dashboard`): Overview with statistics and recent activity
2. **Members** (`/members`): Swimmer directory with management
3. **Training** (`/training`): Session schedule and lane management
4. **Performance** (`/performance`): Personal/overall performance metrics
5. **Attendance** (`/attendance`): Check-in management (coming soon)
6. **Finances** (`/finances`): Revenue and payment tracking (coming soon)
7. **Reports** (`/reports`): System reports (coming soon)

## API Routes

### Swimmers

- `GET /api/swimmers` - List all swimmers
- `POST /api/swimmers` - Create new swimmer
- `GET /api/swimmers/[id]` - Get swimmer details
- `PUT /api/swimmers/[id]` - Update swimmer

### Authentication

- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/session` - Get current session

## Build & Testing

### Development

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
```

### Prisma

```bash
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio GUI
npm run seed              # Seed with sample data
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correctly formatted
- Check database credentials
- Ensure database is running (for local PostgreSQL)
- For Vercel Postgres: verify connection string in Vercel dashboard

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is at least 32 characters
- Ensure `NEXTAUTH_URL` matches your deployment domain
- Check that user credentials exist in database (run seed script)

### Build Failures

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Verify TypeScript: `npx tsc --noEmit`

### Prisma Errors

- Generate Prisma client: `npm run prisma:generate`
- Check for pending migrations: `npm run prisma:migrate`
- Verify schema syntax: `npx prisma validate`

## Performance Optimization

- Database connection pooling via Vercel Postgres
- Next.js static generation for public pages
- Image optimization with Next.js Image component
- API route caching with appropriate headers

## Security Considerations

- All passwords hashed with bcrypt (10 rounds)
- NextAuth.js for secure session management
- CSRF protection via NextAuth
- SQL injection prevention via Prisma ORM
- Environment variables never exposed to client

## Monitoring & Logging

- Check Vercel Analytics in Vercel dashboard
- Database monitoring via Vercel Postgres dashboard
- Application logs in Vercel Deployments

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review error logs in Vercel dashboard
3. Check database connection in Vercel Storage dashboard
4. Verify environment variables are correctly configured

## Next Steps

- [ ] Customize branding/colors in Tailwind config
- [ ] Add custom domain to Vercel project
- [ ] Set up GitHub Actions for CI/CD
- [ ] Enable automatic deployments from specific branch
- [ ] Configure email notifications
- [ ] Set up monitoring/alerting
- [ ] Create backup strategy for database

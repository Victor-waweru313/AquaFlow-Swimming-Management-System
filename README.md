# AquaFlow - Swimming Management System

A modern, web-based swimming management platform built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL. Designed for swimming organizations to manage members, training sessions, attendance, performance metrics, and finances.

**Live Demo**: Coming soon (Vercel deployment)

## Features

### 🏊 Core Capabilities

- **Member Management**: Register and manage swimmers with membership tiers (Standard, Premium, Elite)
- **Training Schedules**: Create and manage pool sessions with lane assignments
- **Attendance Tracking**: Real-time check-in/check-out monitoring
- **Performance Analytics**: Track times, rankings, and personal records
- **Financial Management**: Invoicing, payment tracking, and revenue analytics
- **Role-Based Access**: Admin, Coach, Accountant, and Swimmer roles with custom permissions

### 🎨 User Interface

- Clean, professional "athletic-corporate" design
- Material Design icons throughout
- Responsive layouts for desktop, tablet, and mobile
- Real-time data visualization with charts
- Intuitive navigation and workflows

### 🔐 Security & Reliability

- Secure authentication with NextAuth.js
- Password hashing with bcrypt
- Database connection pooling via Vercel Postgres
- CSRF protection and session management
- Role-based access control (RBAC)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3
- **Database**: PostgreSQL (Vercel Postgres or Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Auth.js)
- **Charts**: Recharts
- **UI Components**: Custom-built with Tailwind CSS
- **Icons**: Material Symbols (Google Material Icons)
- **Deployment**: Vercel

## Project Structure

```
AquaFlow-Swimming-Management-System/
├── app/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── dashboard/page.tsx    # Admin dashboard
│   │   ├── members/              # Member management pages
│   │   ├── training/             # Training schedule pages
│   │   ├── performance/page.tsx  # Performance tracking
│   │   ├── attendance/page.tsx   # Attendance management
│   │   ├── finances/page.tsx     # Financial management
│   │   ├── reports/page.tsx      # Reporting
│   │   ├── settings/page.tsx     # System settings
│   │   └── help/page.tsx         # Help & support
│   ├── api/
│   │   ├── auth/                 # NextAuth routes
│   │   └── swimmers/             # Swimmer API endpoints
│   ├── login/page.tsx            # Login page
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global Tailwind styles
├── components/
│   ├── Sidebar.tsx               # Navigation sidebar
│   └── TopBar.tsx                # Top bar with search & user menu
├── lib/
│   ├── auth.ts                   # Password hashing utilities
│   ├── auth.config.ts            # NextAuth configuration
│   └── db.ts                     # Prisma client singleton
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Sample data seeding script
├── .env.example                  # Environment variables template
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── DEPLOYMENT.md                 # Deployment guide
└── README.md                     # This file
```

## Database Schema

### Users & Roles

- **User**: Email, password, name, role (ADMIN/COACH/ACCOUNTANT/SWIMMER)
- **Swimmer**: Code, name, DOB, membership type, status
- **Coach**: Name, specialty, contact information

### Operations

- **Pool**: Location information
- **Lane**: Pool lanes with focus areas and status
- **Session**: Training sessions with capacity and type
- **SessionEnrollment**: Many-to-many swimmer enrollments

### Tracking

- **Attendance**: Check-in/check-out records
- **PerformanceRecord**: Time trials and rankings
- **Payment**: Invoices and payment status
- **TrainingGoal**: Personal training objectives

## Getting Started

### Quick Start (5 minutes)

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd AquaFlow-Swimming-Management-System
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL and secrets
   ```

3. **Set Up Database** (using Neon for quick setup)
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Login** at http://localhost:3000
   - Email: `admin@aquaflow.com`
   - Password: `password123`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive setup and deployment instructions.

## Available Scripts

```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run pending migrations
npm run prisma:studio   # Open Prisma Studio GUI
npm run seed            # Seed database with sample data
```

## Color Palette

- **Primary Navy**: `#0B3D63` - Brand color for CTAs and headers
- **Accent Teal**: `#14B8A6` - Highlights and active states
- **Success Green**: `#10B981` - Positive indicators
- **Warning Yellow**: `#F59E0B` - Caution states
- **Neutral Gray**: `#6B7280` - Text and borders

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Current session

### Swimmers
- `GET /api/swimmers` - List all swimmers
- `POST /api/swimmers` - Create swimmer
- `GET /api/swimmers/[id]` - Get swimmer details
- `PUT /api/swimmers/[id]` - Update swimmer

## Role Permissions

| Feature | Admin | Coach | Accountant | Swimmer |
|---------|-------|-------|-----------|---------|
| Dashboard | ✓ | ✓ | ✓ | - |
| Members (full) | ✓ | ✓ (read-only) | ✓ | - |
| Members (own profile) | ✓ | ✓ | ✓ | ✓ |
| Training Schedule | ✓ | ✓ | ✓ | ✓ (read) |
| Attendance | ✓ | ✓ | ✓ | - |
| Performance | ✓ | ✓ | ✓ | ✓ (own) |
| Finances | ✓ | - | ✓ | - |
| Reports | ✓ | - | ✓ | - |

## Performance Optimization

- ✅ Static page generation for public pages
- ✅ Incremental Static Regeneration (ISR)
- ✅ Database connection pooling
- ✅ Image optimization
- ✅ Code splitting and lazy loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Features

- ✅ HTTPS/TLS encryption (Vercel)
- ✅ Password hashing (bcrypt)
- ✅ Session management (NextAuth)
- ✅ CSRF protection
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React)
- ✅ Environment variable isolation
- ✅ Role-based access control

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Create project on https://vercel.com/new
3. Configure environment variables
4. Connect Vercel Postgres or Neon
5. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Contributing

This is a demonstration project. To contribute:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced analytics dashboards
- [ ] Integration with wearables
- [ ] Video analysis tools
- [ ] AI-powered performance recommendations
- [ ] Multi-language support
- [ ] Custom reporting builder

## Known Limitations

- Currently supports single pool organization (multi-pool support planned)
- Basic financial features (advanced accounting features coming)
- Static seed data (dynamic data management for coaches/admins)
- Simplified performance metrics (advanced analytics coming)

## Support

For questions or issues:

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for setup help
2. Review error logs in your deployment platform
3. Check environment variables configuration
4. Verify database connection

## License

This project is provided as-is for educational and commercial use.

## Credits

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database via [Vercel Postgres](https://vercel.com/storage/postgres) or [Neon](https://neon.tech/)
- Authentication with [NextAuth.js](https://next-auth.js.org/)
- Icons from [Google Material Symbols](https://fonts.google.com/icons)

---

**Made with ❤️ for swimming organizations**
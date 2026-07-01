# AquaFlow Navigation Guide

## 🗺️ Complete Site Navigation Map

All pages in the AquaFlow system are now fully linked together with breadcrumb navigation and intuitive page flows.

## Public Pages

### Landing Page (`/`)
- **Path**: `app/page.tsx`
- **Navigation**:
  - Logo → Returns to Landing Page
  - "Login" link → `/login`
  - "Sign Up" link → `/register`
  - "Home" link (in login page nav) → `/`
- **Purpose**: Public homepage with platform overview and call-to-action

### Login Page (`/login`)
- **Path**: `app/login/page.tsx`
- **Navigation**:
  - Logo → Returns to Landing Page (`/`)
  - "Home" link → `/` (Landing Page)
  - "Create Account" link → `/register`
  - Form submission → Role-based redirect (on success):
    - ADMIN → `/dashboard`
    - COACH → `/training`
    - ACCOUNTANT → `/finances`
    - SWIMMER → `/performance`
- **Purpose**: Authentication entry point with role selection

### Register Page (`/register`)
- **Path**: `app/register/page.tsx`
- **Navigation**:
  - Logo → Returns to Landing Page (`/`)
  - "Home" link → `/` (Landing Page)
  - "Sign In" link → `/login`
  - Form submission → Auto-login then `/performance` (on success - SWIMMER only)
- **Purpose**: Self-service registration for swimmers
- **Features**:
  - Collects name, email, DOB, contact, password
  - Creates user account with SWIMMER role
  - Auto-creates swimmer profile with code (AF-1000 format)
  - Auto-logs in after registration
  - Redirects to performance page

## Protected Dashboard Pages

All dashboard pages require authentication and are protected by the `(dashboard)` layout at `app/(dashboard)/layout.tsx`.

### Dashboard Home (`/dashboard`)
- **Path**: `app/(dashboard)/dashboard/page.tsx`
- **Navigation**:
  - Sidebar: All main menu items
  - Breadcrumb: Dashboard (current page)
- **Role Access**: ADMIN, COACH, ACCOUNTANT
- **Redirect From**:
  - Login (ADMIN role)
  - Sidebar navigation
  - Member page (no direct link, but part of main navigation)
- **Links To**:
  - All sidebar pages via navigation
- **Purpose**: Admin dashboard with statistics, activity feed, and quick actions

### Members Management (`/members`)
- **Path**: `app/(dashboard)/members/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Members
  - "+ Add New Member" button → `/members/new`
  - Table action buttons → `/members/[id]` (edit specific member)
  - Sidebar: "Members" link
- **Role Access**: ADMIN, COACH, ACCOUNTANT, SWIMMER (read-only for swimmers)
- **Related Pages**:
  - Add Member: `/members/new`
  - Edit Member: `/members/[id]`
- **Purpose**: View all swimmers, search, filter, and manage profiles

### Add Member (`/members/new`)
- **Path**: `app/(dashboard)/members/new/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Members → Add New Member
  - Back button (implicit via breadcrumb): `/members`
  - "Cancel" button → `/members`
  - "Save" button (on success) → `/members`
- **Role Access**: ADMIN, COACH, ACCOUNTANT
- **Purpose**: Registration form for new swimmers

### Edit Member (`/members/[id]`)
- **Path**: `app/(dashboard)/members/[id]/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Members → Edit Member
  - Back button (implicit via breadcrumb): `/members`
  - "Cancel" button → `/members`
  - "Save Changes" button (on success) → `/members`
- **Role Access**: ADMIN, COACH, ACCOUNTANT
- **Purpose**: Update existing swimmer profile

### Training Schedule (`/training`)
- **Path**: `app/(dashboard)/training/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Training Schedule
  - Table action buttons → `/training/[id]` (view session details)
  - "+ New Training Session" button → Create flow (future)
  - Sidebar: "Training" link
- **Role Access**: ADMIN, COACH, ACCOUNTANT, SWIMMER
- **Related Pages**:
  - Session Details: `/training/[id]`
- **Purpose**: View all training sessions with coaches and enrollment info

### Session Details (`/training/[id]`)
- **Path**: `app/(dashboard)/training/[id]/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Training → Session Details
  - Back button (implicit via breadcrumb): `/training`
  - "Export List" button → Export CSV (future)
  - "Add Swimmers" button → Modal or new page (future)
- **Role Access**: ADMIN, COACH, ACCOUNTANT, SWIMMER
- **Purpose**: View session details, lane management, and swimmer roster

### Performance (`/performance`)
- **Path**: `app/(dashboard)/performance/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Performance
  - "Log Session" button (swimmer-only) → New performance log (future)
  - Sidebar: "Performance" link
- **Role Access**: ADMIN, COACH, ACCOUNTANT, SWIMMER
- **Purpose**: Swimmer performance tracking and goals

### Attendance (`/attendance`)
- **Path**: `app/(dashboard)/attendance/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Attendance
  - Sidebar: "Attendance" link
- **Role Access**: ADMIN, COACH, ACCOUNTANT
- **Purpose**: Attendance tracking and management

### Finances (`/finances`)
- **Path**: `app/(dashboard)/finances/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Finances
  - Sidebar: "Finances" link
- **Role Access**: ADMIN, ACCOUNTANT
- **Purpose**: Financial management and payment tracking

### Reports (`/reports`)
- **Path**: `app/(dashboard)/reports/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Reports
  - Sidebar: "Reports" link
- **Role Access**: ADMIN, ACCOUNTANT
- **Purpose**: System reports and analytics

### Settings (`/settings`)
- **Path**: `app/(dashboard)/settings/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Settings
  - Sidebar: "Settings" link
- **Role Access**: All authenticated users
- **Purpose**: System configuration and user preferences

### Help (`/help`)
- **Path**: `app/(dashboard)/help/page.tsx`
- **Navigation**:
  - Breadcrumb: Dashboard → Help
  - Sidebar: "Help" link
- **Role Access**: All authenticated users
- **Purpose**: Help documentation and support

## Navigation Components

### Sidebar (`components/Sidebar.tsx`)
- **Purpose**: Primary navigation for authenticated users
- **Features**:
  - Role-based menu filtering
  - Active page highlighting
  - Logo/branding area
  - Quick action button
  - Settings and Help links
- **Links**:
  - Dashboard → `/dashboard` (ADMIN, COACH, ACCOUNTANT)
  - Members → `/members` (all roles)
  - Training → `/training` (all roles)
  - Attendance → `/attendance` (ADMIN, COACH, ACCOUNTANT)
  - Performance → `/performance` (all roles)
  - Finances → `/finances` (ADMIN, ACCOUNTANT)
  - Reports → `/reports` (ADMIN, ACCOUNTANT)
  - Settings → `/settings` (all roles)
  - Help → `/help` (all roles)

### TopBar (`components/TopBar.tsx`)
- **Purpose**: Secondary navigation and user menu
- **Features**:
  - Page title
  - Search field (optional)
  - Notifications bell
  - Settings button
  - User profile dropdown
- **Links**:
  - User name/avatar → `/profile` (future)
  - "Profile Settings" → `/profile` (future)
  - "Sign Out" → Redirects to `/`

### Breadcrumb (`components/Breadcrumb.tsx`)
- **Purpose**: Hierarchical navigation and page context
- **Features**:
  - Shows current page location
  - Clickable links to parent pages
  - Visual separators between levels
- **Used On**: All dashboard pages and sub-pages

## Navigation Flow Diagrams

### Authentication Flow
```
/ (Landing)
  ├→ /login (existing user)
  │    ↓
  │  Select role → Submit form
  │    ↓
  │  ADMIN → /dashboard
  │  COACH → /training
  │  ACCOUNTANT → /finances
  │  SWIMMER → /performance
  │
  └→ /register (new swimmer)
       ↓
     Complete form → Create account
       ↓
     Auto-login → /performance
```

### Member Management Flow
```
/dashboard
  ↓
/members
  ├→ /members/new
  │    ↓
  │  (save) → /members
  │
  └→ /members/[id]
       ↓
     (save) → /members
```

### Training Management Flow
```
/dashboard
  ↓
/training
  ↓
/training/[id]
  ↓
(session details)
```

### Dashboard Navigation Hub
```
/dashboard (center)
  ├→ /members
  ├→ /training
  ├→ /attendance
  ├→ /performance
  ├→ /finances
  ├→ /reports
  ├→ /settings
  └→ /help
```

## Keyboard Navigation

### Supported Shortcuts (Future Enhancement)
- `Cmd/Ctrl + K` - Command palette to jump to any page
- `Cmd/Ctrl + /` - Open help
- `Esc` - Close modals and dropdowns

## Responsive Navigation

### Desktop
- Full sidebar with all navigation items
- Complete menu labels
- Hover effects and transitions

### Tablet
- Full sidebar with icons and labels
- Responsive grid layouts
- Touch-optimized buttons

### Mobile (Future Enhancement)
- Collapsed sidebar (hamburger menu)
- Bottom navigation bar
- Modal menu overlay

## URL Structure

```
Public:
  /                 - Landing page
  /login            - Login page (with role selection)
  /register         - Registration page (self-service for swimmers)

Protected:
  /dashboard                    - Main dashboard
  /members                      - Member directory
  /members/new                  - Add new member
  /members/[id]                 - Edit member
  /training                     - Training schedule
  /training/[id]                - Session details
  /attendance                   - Attendance tracking
  /performance                  - Performance dashboard
  /finances                     - Financial management
  /reports                      - System reports
  /settings                      - Settings
  /help                         - Help & support

API:
  /api/auth/[...nextauth]       - NextAuth endpoints (signin, signout, callback)
  /api/auth/register            - User registration endpoint (POST)
  /api/swimmers                 - Swimmers CRUD
  /api/swimmers/[id]            - Individual swimmer operations
```

## Link Types

### Navigation Links (Next.js Link)
- Used for all internal navigation
- Prevents full page reload
- Enables prefetching

### External Links
- Currently: None (all platform links are placeholders)
- Future: Third-party integrations

### Back Navigation
- Breadcrumbs provide explicit back links
- Browser back button supported

## Testing Navigation

### Manual Testing Checklist
- [ ] Landing page → Login page flow
- [ ] Login → Dashboard flow
- [ ] Sidebar navigation to all pages
- [ ] Breadcrumb navigation working
- [ ] Back buttons functional
- [ ] Logout flow (TopBar)
- [ ] Role-based page access
- [ ] Member CRUD pages
- [ ] Training pages
- [ ] Form submission redirects

### Automated Testing (Future)
- [ ] Navigation path tests
- [ ] Breadcrumb generation
- [ ] Role-based access control
- [ ] Link validity checks

## Future Navigation Enhancements

1. **Search/Command Palette**: Quick navigation via keyboard
2. **Mobile Navigation**: Hamburger menu with bottom navigation
3. **Favorites/Shortcuts**: User-customizable quick links
4. **Recent Pages**: Quick access to recently visited pages
5. **Nested Routes**: Better support for multi-level navigation
6. **Sticky Navigation**: Navigation visible while scrolling
7. **Breadcrumb History**: Navigate through recent pages
8. **Quick Links**: Context-specific action buttons

## Performance Optimizations

- ✅ Server components for core pages
- ✅ Client components only for interactive elements
- ✅ Link prefetching enabled
- ✅ Minimal JavaScript in navigation components
- ✅ CSS-only hover effects

## Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels on navigation elements
- ✅ Keyboard navigation support
- ✅ Focus indicators on links
- ✅ Breadcrumb navigation for context
- ✅ Alt text on icons/images

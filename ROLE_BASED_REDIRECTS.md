# Role-Based Redirect Implementation

## Overview

Users are now automatically redirected to the appropriate page based on their selected role after login or registration.

## Implementation Details

### Login Redirect (After Authentication)

**File**: `app/login/page.tsx`

Role-based redirect mapping:
```typescript
const redirectMap: { [key: string]: string } = {
  ADMIN: "/dashboard",
  COACH: "/training",
  ACCOUNTANT: "/finances",
  SWIMMER: "/performance",
};
```

**Flow**:
1. User enters email and password
2. User selects role from dropdown
3. Form submits to NextAuth with credentials
4. If authentication succeeds, user is redirected based on their selected role:
   - **ADMIN** → `/dashboard` (main admin dashboard)
   - **COACH** → `/training` (training schedule)
   - **ACCOUNTANT** → `/finances` (financial management)
   - **SWIMMER** → `/performance` (personal performance dashboard)

### Registration Redirect (After Account Creation)

**File**: `app/register/page.tsx` (NEW)

**Flow**:
1. Swimmer fills out registration form (name, email, DOB, password)
2. Form submits to `/api/auth/register` endpoint
3. API creates user account with SWIMMER role
4. API creates swimmer profile with unique code (AF-1000 format)
5. User is auto-logged in with credentials
6. User is redirected to `/performance` page

### Registration API Endpoint

**File**: `app/api/auth/register/route.ts` (NEW)

**Functionality**:
- Validates registration input
- Checks for duplicate email
- Hashes password with bcrypt
- Creates User account
- Creates Swimmer profile
- Returns success/error response

**Request Body**:
```json
{
  "name": "John Swimmer",
  "email": "swimmer@example.com",
  "password": "securepassword",
  "role": "SWIMMER",
  "dob": "2000-01-15",
  "contact": "+1 (555) 000-0000"
}
```

**Response (Success)**:
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "swimmer@example.com",
    "name": "John Swimmer",
    "role": "SWIMMER"
  }
}
```

## Page Changes

### Landing Page (`app/page.tsx`)
- ✅ Added "Sign Up" link to navigation (→ `/register`)
- ✅ Added "Sign Up" link to navbar

### Login Page (`app/login/page.tsx`)
- ✅ Changed "Request Access" link to "Create Account" (→ `/register`)
- ✅ Updated role-based redirect logic
- ✅ ADMIN → `/dashboard`
- ✅ COACH → `/training`
- ✅ ACCOUNTANT → `/finances`
- ✅ SWIMMER → `/performance`

### New Registration Page (`app/register/page.tsx`) - NEW
- ✅ Full-page registration form
- ✅ Split-screen layout (matching login page)
- ✅ Form validation
- ✅ Password confirmation
- ✅ Auto-login after registration
- ✅ Redirect to `/performance` for swimmers

## API Endpoints

### New: POST `/api/auth/register`
- Handles swimmer self-registration
- Validates email uniqueness
- Creates user and swimmer profile
- Returns user data on success

### Existing: POST `/api/auth/signin` (NextAuth)
- Validates credentials
- Checks role matches
- Returns JWT token
- Triggers redirect based on updated logic

## Role-Specific Landing Pages

After login/registration, users land on pages optimized for their role:

### ADMIN
- Destination: `/dashboard`
- View: Full system dashboard with statistics
- Menu: Full access to all admin features

### COACH
- Destination: `/training`
- View: Training schedule and session management
- Menu: Limited to coaching-related features

### ACCOUNTANT
- Destination: `/finances`
- View: Financial management and reports
- Menu: Limited to finance-related features

### SWIMMER
- Destination: `/performance`
- View: Personal performance tracking and goals
- Menu: Limited to swimmer-specific features

## Database Changes

### User Model
No changes - existing fields used

### Swimmer Model
Added optional `userId` field (if not already present):
- Allows linking swimmer profile to user account
- Enables efficient queries for swimmer data

### New Data on Registration
- User: Created with SWIMMER role
- Swimmer: Created with profile info
- Codes: Generated automatically (AF-1000+ format)

## Security Considerations

✅ **Password Security**
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Confirmed on registration

✅ **Email Validation**
- Email format validated on submission
- Duplicate email prevention
- Email uniqueness enforced in database

✅ **Role Validation**
- Role checked during login
- Only selected role can authenticate
- Role inconsistency returns error

✅ **Session Management**
- NextAuth manages session tokens
- CSRF protection enabled
- Secure cookie storage

✅ **Redirect Safety**
- Redirects only to internal pages
- No open redirect vulnerability
- Role validation before redirect

## Testing Scenarios

### Scenario 1: Admin Login
```
1. Go to / (landing)
2. Click "Login"
3. Enter: admin@aquaflow.com / password123
4. Select role: Admin
5. Click Login
6. ✅ Redirected to /dashboard
```

### Scenario 2: Coach Login
```
1. Go to / (landing)
2. Click "Login"
3. Enter: coach@aquaflow.com / password123
4. Select role: Coach
5. Click Login
6. ✅ Redirected to /training
```

### Scenario 3: Accountant Login
```
1. Go to / (landing)
2. Click "Login"
3. Enter: accountant@aquaflow.com / password123
4. Select role: Accountant
5. Click Login
6. ✅ Redirected to /finances
```

### Scenario 4: Swimmer Registration
```
1. Go to / (landing)
2. Click "Sign Up"
3. Enter registration info
4. Click "Create Account"
5. ✅ Account created
6. ✅ Auto-logged in
7. ✅ Redirected to /performance
```

### Scenario 5: Swimmer Login
```
1. Go to / (landing)
2. Click "Login"
3. Enter: swimmer@aquaflow.com / password123
4. Select role: Swimmer
5. Click Login
6. ✅ Redirected to /performance
```

## Future Enhancements

- [ ] Persistent "Remember Me" option
- [ ] Social login integration (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Password reset functionality
- [ ] Email verification for new registrations
- [ ] Admin registration of non-swimmer roles
- [ ] Role switching (for staff with multiple roles)
- [ ] Custom landing pages per organization

## Build Status

✅ **Build Successful**
- All 20 routes compiled (added `/register` + `/api/auth/register`)
- No TypeScript errors
- No ESLint warnings
- Production ready

## Summary

Users are now properly routed based on their role:

| Role | Login Route | Registration | Landing Page |
|------|------------|-------------|--------------|
| ADMIN | Manual login only | N/A | /dashboard |
| COACH | Manual login only | N/A | /training |
| ACCOUNTANT | Manual login only | N/A | /finances |
| SWIMMER | Manual login or self-register | ✅ Yes | /performance |

The system provides an intuitive user experience where each role immediately sees their most relevant page upon authentication.

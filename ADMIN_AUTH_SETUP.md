# Admin Authentication Setup Guide

This guide will help you set up database-backed admin authentication for the Fally Ipupa Setlist Voting app.

## Overview

The admin authentication system uses:
- **Supabase** for database storage
- **bcrypt** for password hashing
- **Server-side API routes** for authentication
- **Row Level Security (RLS)** to protect admin credentials

---

## Prerequisites

1. Completed the Supabase setup from `SUPABASE_SETUP.md`
2. Access to Supabase SQL Editor
3. Your Supabase **Service Role Key** (find it in Project Settings → API)

---

## Step 1: Add Environment Variables

Add these to your `.env.local` file:

```env
# Supabase credentials (already have these)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NEW: Add the service role key (required for admin auth)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NEW: Admin setup key (used to protect the user creation API)
ADMIN_SETUP_KEY=your-secret-setup-key-change-this-to-something-random
```

**Important:**
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS and should **NEVER** be exposed to the client
- Keep it only in `.env.local` (server-side)
- Change `ADMIN_SETUP_KEY` to a random, secure value

---

## Step 2: Create the Admin Users Table

1. Go to your Supabase Dashboard → SQL Editor
2. Run the SQL from the **updated** `supabase-schema.sql` file:

```sql
-- Create the admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable Row Level Security for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access admin_users (no public access)
CREATE POLICY "Service role can access admin_users" ON admin_users
  USING (false);

-- Add a comment to the table
COMMENT ON TABLE admin_users IS 'Stores admin user credentials with hashed passwords';
COMMENT ON COLUMN admin_users.password_hash IS 'bcrypt hashed password';
COMMENT ON COLUMN admin_users.is_active IS 'Whether the admin account is active';
```

3. Verify the table was created:

```sql
SELECT * FROM admin_users;
```

You should see an empty table with columns: `id`, `username`, `password_hash`, `email`, `full_name`, `is_active`, `created_at`, `updated_at`.

---

## Step 3: Create Your First Admin User

You can create admin users using the API endpoint. Use a tool like:
- **cURL** (command line)
- **Postman** (GUI)
- **Thunder Client** (VS Code extension)
- Your browser's **Developer Tools**

### Option A: Using cURL

```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "YourSecurePassword123!",
    "email": "admin@example.com",
    "full_name": "Admin User",
    "setup_key": "your-secret-setup-key-from-env"
  }'
```

### Option B: Using Browser Console

1. Open your app at `http://localhost:3000`
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Paste and run this code (replace values):

```javascript
fetch('/api/admin/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'YourSecurePassword123!',
    email: 'admin@example.com',
    full_name: 'Admin User',
    setup_key: 'your-secret-setup-key-from-env' // Must match ADMIN_SETUP_KEY in .env.local
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Successful Response

```json
{
  "success": true,
  "message": "Admin user created successfully",
  "user": {
    "id": "uuid-here",
    "username": "admin",
    "email": "admin@example.com",
    "full_name": "Admin User",
    "is_active": true,
    "created_at": "2025-01-13T..."
  }
}
```

---

## Step 4: Test the Login

1. Navigate to: `http://localhost:3000/admin/login`
2. Enter the credentials you just created
3. Click "Login"
4. You should be redirected to the admin dashboard

---

## Step 5: Add More Admin Users (Optional)

Repeat Step 3 with different usernames to add more admins:

```javascript
fetch('/api/admin/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'jonathan',
    password: 'SecurePassword456!',
    email: 'jonathan@example.com',
    full_name: 'Jonathan Ndinga',
    setup_key: 'your-secret-setup-key-from-env'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Step 6: List All Admin Users (Optional)

To see all admin users:

### Using cURL

```bash
curl "http://localhost:3000/api/admin/users?setup_key=your-secret-setup-key-from-env"
```

### Using Browser Console

```javascript
fetch('/api/admin/users?setup_key=your-secret-setup-key-from-env')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Security Best Practices

### For Development

✅ **DO:**
- Use strong passwords (min 8 characters, mix of letters/numbers/symbols)
- Keep `.env.local` out of version control (already in `.gitignore`)
- Change `ADMIN_SETUP_KEY` to something random

❌ **DON'T:**
- Share your `SUPABASE_SERVICE_ROLE_KEY`
- Commit `.env.local` to Git
- Use simple passwords like "password123"

### For Production

When deploying to production:

1. **Disable the User Creation API** after creating initial admins:
   - Comment out or delete `/app/api/admin/users/route.ts`
   - Or add IP whitelist/additional authentication

2. **Use Environment Variables** in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Add all three keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

3. **Enable HTTPS Only** (automatic on Vercel/Netlify)

4. **Set Strong ADMIN_SETUP_KEY**:
   ```bash
   # Generate a random key
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Consider adding**:
   - Rate limiting on login endpoint
   - Failed login attempt tracking
   - Email notifications for logins
   - Two-factor authentication (2FA)

---

## Troubleshooting

### Error: "Missing Supabase service role credentials"

**Solution:** Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`

Find it in: Supabase Dashboard → Project Settings → API → "service_role (secret)"

---

### Error: "Unauthorized: Invalid setup key"

**Solution:** Make sure the `setup_key` in your API request matches the `ADMIN_SETUP_KEY` in `.env.local`

---

### Error: "Username already exists"

**Solution:** Choose a different username, or delete the existing user:

```sql
DELETE FROM admin_users WHERE username = 'admin';
```

---

### Error: "Invalid username or password" when logging in

**Solutions:**
1. Double-check your username and password
2. Verify the user exists:
   ```sql
   SELECT username, is_active FROM admin_users;
   ```
3. Make sure `is_active` is `true`
4. Try creating a new user

---

### Login page says "Invalid username or password" but credentials are correct

**Solution:** Check browser console for errors:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for API errors
4. Common issues:
   - Service role key not set
   - Supabase connection error
   - API route not found (check `/api/admin/login` exists)

---

## Database Schema

### Table: `admin_users`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `username` | TEXT | Unique username for login |
| `password_hash` | TEXT | bcrypt hashed password (never store plain text!) |
| `email` | TEXT | Optional email address |
| `full_name` | TEXT | Optional full name |
| `is_active` | BOOLEAN | Whether the account is active (default: true) |
| `created_at` | TIMESTAMPTZ | When the account was created |
| `updated_at` | TIMESTAMPTZ | When the account was last updated |

### Security Features

- **Row Level Security (RLS)**: Enabled with policy that blocks all public access
- **Service Role Only**: Only server-side code with service role key can access this table
- **Password Hashing**: Passwords are hashed with bcrypt (salt rounds: 10)
- **Unique Usernames**: Database constraint prevents duplicate usernames
- **Active Status**: Can disable accounts without deleting them

---

## API Endpoints

### POST `/api/admin/login`

Authenticate an admin user.

**Request:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "full_name": "Admin User"
  }
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

### POST `/api/admin/users`

Create a new admin user (requires setup key).

**Request:**
```json
{
  "username": "newadmin",
  "password": "SecurePass123!",
  "email": "admin@example.com",
  "full_name": "New Admin",
  "setup_key": "your-secret-key"
}
```

---

### GET `/api/admin/users?setup_key=your-key`

List all admin users (requires setup key).

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "full_name": "Admin User",
      "is_active": true,
      "created_at": "2025-01-13T..."
    }
  ]
}
```

---

## Next Steps

Once setup is complete:
- ✅ Admin authentication is fully functional
- ✅ Login at `/admin/login`
- ✅ Access admin dashboard at `/admin`
- ✅ Logout button works
- ✅ Sessions persist for 24 hours
- ✅ Admin link only visible when logged in

You can now manage your concert voting data securely! 🎵
